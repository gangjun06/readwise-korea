import { readwiseService } from "src/utils/readwise";
import { chromeLocalStorage } from "src/utils/storage";

export type RidiBookList = {
  pages: number;
  result: {
    bookId: string;
    highlightCount: number;
    memoCount: number;
    title: string;
    author: string;
    image: string;
  }[];
};

type RidiAPIShelfRes = {
  total_count: number;
  result: {
    book_id: string;
    highlighter_count: number;
    memo_count: number;
  }[];
};

type RidiAPIBookDetailRes = Array<{
  id: string;
  title: {
    main: string;
    prefix: string;
  };
  thumbnail: {
    small: string;
    large: string;
    xxlarge: string;
  };
  categories: Array<{
    id: number;
    name: string;
    genre: string;
    sub_genre: string;
    is_series_category: boolean;
    ancestor_ids: Array<number>;
  }>;
  price_info: any;
  series: any;
  authors: Array<{
    name: string;
    id: number;
    role: string;
  }>;
  file: {
    size: number;
    format: string;
    is_drm_free: boolean;
    is_comic: boolean;
    is_webtoon: boolean;
    is_manga: boolean;
    is_comic_hd: boolean;
    variants: Array<{
      quality: string;
      size: number;
    }>;
    character_count: number;
  };
  property: {
    is_novel: boolean;
    is_magazine: boolean;
    is_adult_only: boolean;
    is_new_book: boolean;
    is_open: boolean;
    is_somedeal: boolean;
    is_trial: boolean;
    use_free_serial_schedule: boolean;
    review_display_id: string;
    preview_rate: number;
    preview_max_characters?: number;
  };
  support: {
    android: boolean;
    ios: boolean;
    mac: boolean;
    paper: boolean;
    windows: boolean;
    web_viewer: boolean;
  };
  publish: {
    ridibooks_register: string;
    ebook_publish: string;
    ridibooks_publish: string;
  };
  publisher: {
    id: number;
    name: string;
    cp_name: string;
  };
}>;

export type RidiAPIHighlightRes = {
  annotations: Array<{
    id: number;
    format: string;
    selected_text_range: string;
    location: string;
    type: string;
    selected_text: string;
    memo: string | null;
    style: any;
    is_deleted: false;
    created_at: string;
  }>;
};

const BOOK_LIST_ITEM_LIMIT = 5;

export const ridiService = {
  getRidiCookies: async (): Promise<chrome.cookies.Cookie[]> => {
    const cookies: chrome.cookies.Cookie[] = await new Promise((resolve) => {
      chrome.cookies.getAll(
        {
          domain: ".ridibooks.com",
        },
        async (cookies) => {
          resolve(cookies);
        }
      );
    });
    return cookies;
  },
  getRidiCookiesStr: async (): Promise<string> => {
    const cookies = await ridiService.getRidiCookies();

    const requireCookieList = [
      "ruid",
      "ch-veil-id",
      "ridi-al",
      "PHPSESSID",
      "ridi-at",
      "ridi-rt",
      "pvid",
    ];

    const cookiesStr = cookies
      .filter((item) => requireCookieList.includes(item.name))
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");
    return cookiesStr;
  },
  bookList: async (page: number): Promise<RidiBookList> => {
    const cookiesStr = await ridiService.getRidiCookiesStr();

    const bookList = await fetch(
      `https://reading-data-api.ridibooks.com/annotations/shelf?offset=${
        page === 1 ? 0 : (page - 1) * BOOK_LIST_ITEM_LIMIT
      }&limit=${BOOK_LIST_ITEM_LIMIT}`,
      {
        method: "GET",
        headers: {
          Authority: "reading-data-api.ridibooks.com",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          Cookie: `${cookiesStr}; user_device_type=PC;`,
          Origin: "https://ridibooks.com",
          Referer: "https://ridibooks.com/",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          "Accept-Encoding": "gzip",
        },
      }
    );
    const shelfJson: RidiAPIShelfRes = await bookList.json();
    const bookIds = shelfJson.result.map((item) => item.book_id);
    const bookDetails = await ridiService.bookDetails(bookIds);

    const result = shelfJson.result.map(
      ({ book_id, highlighter_count, memo_count }) => {
        const bookDetail = bookDetails.find((item) => item.id === book_id);
        return {
          bookId: book_id,
          memoCount: memo_count,
          highlightCount: highlighter_count,
          title: bookDetail?.title.main,
          author: bookDetail?.authors[0].name,
          image: bookDetail?.thumbnail.xxlarge,
        } as RidiBookList["result"][0];
      }
    );

    return {
      pages: Math.ceil(shelfJson.total_count / BOOK_LIST_ITEM_LIMIT),
      result,
    };
  },
  highlightList: async ({
    bookId,
    limit,
    offset,
  }: {
    bookId: string;
    limit: number;
    offset: number;
  }): Promise<RidiAPIHighlightRes> => {
    const cookiesStr = await ridiService.getRidiCookiesStr();

    const highlightList = await fetch(
      `https://reading-data-api.ridibooks.com/annotations/books/${bookId}?order_by=timestamp&offset=${offset}&limit=${limit}&type=highlight`,
      {
        method: "GET",
        headers: {
          Authority: "reading-data-api.ridibooks.com",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          Cookie: cookiesStr,
          Origin: "https://ridibooks.com",
          Referer: "https://ridibooks.com/",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",
          "Accept-Encoding": "gzip",
        },
      }
    );

    const highlightListJson: RidiAPIHighlightRes = await highlightList.json();
    return highlightListJson;
  },
  createHighlights: async ({
    bookId,
    count,
  }: {
    bookId: string;
    count: number;
  }) => {
    const bookDetail = await ridiService.bookDetails([bookId]);
    const highlights: RidiAPIHighlightRes["annotations"] = [];
    for (let i = 0; i < Math.ceil(count / 20); i++) {
      const list = await ridiService.highlightList({
        bookId,
        limit: 20,
        offset: i * 20,
      });
      highlights.push(...list.annotations);
    }

    await readwiseService.createHighlight(
      highlights.map(({ selected_text, memo, created_at }) => {
        return {
          text: selected_text,
          note: memo,
          author: bookDetail[0].authors[0].name,
          category: "books",
          image_url: bookDetail[0].thumbnail.xxlarge,
          source_url: `https://ridibooks.com/books/${bookId}`,
          highlighted_at: created_at,
        };
      })
    );
  },
  bookDetails: async (bookIds: string[]): Promise<RidiAPIBookDetailRes> => {
    if (bookIds.length < 1) return [];
    const book = await fetch(
      `https://book-api.ridibooks.com/books?b_ids=${bookIds.join(",")}`,
      {
        method: "GET",
      }
    );
    const bookJson: RidiAPIBookDetailRes = await book.json();
    return bookJson;
  },
};
