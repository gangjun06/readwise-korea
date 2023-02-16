type Highlight = {
  text: string;
  title?: string;
  author?: string;
  note?: string;
  image_url?: string;
  source_url?: string;
  source_type?: string;
  category?: "books" | "articles" | "tweets" | "podcats";
  location?: number;
  location_type?: "page" | "order" | "time_offset";
  highlighted_at?: string;
  highlight_url?: string;
};

export const readwiseService = {
  getAccessToken: async (): Promise<chrome.cookies.Cookie | null> => {
    const readwiseToken = await new Promise((resolve) => {
      fetch("https://readwise.io/welcome/sync").then((res) => {
        console.log(res);
        chrome.cookies.get(
          {
            url: "https://readwise.io",
            name: "accessToken",
          },
          async (cookies) => {
            resolve(cookies);
          }
        );
      });
    });
    if (!readwiseToken) return null;
    return readwiseToken as chrome.cookies.Cookie;
  },
  createHighlight: async (highlights: Highlight[]) => {
    const token = await readwiseService.getAccessToken();

    await fetch("https://readwise.io/api/v2/highlights/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token.value}`,
      },
      body: JSON.stringify({
        highlights: highlights,
      }),
    });
  },
};
