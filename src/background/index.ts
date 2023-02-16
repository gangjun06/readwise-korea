import {
  chromeTabActions,
  watchChromeMessageEvents,
} from "src/utils/events-chrome";
import { chromeLocalStorage, storage } from "../utils/storage";
import { ridiService } from "./ridi";

console.info("Readwise Korea extension has been loaded");

chrome.runtime.onInstalled.addListener(() => {
  // storage.get().then(console.log);
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("src/contents/page.html") });
});

watchChromeMessageEvents()
  .watch("status", async () => {
    const result: typeof chromeTabActions["status"]["responseAction"] = {};

    // console.log(readwiseToken);
    // result["readwise"] = {
    //   ready: !!readwiseToken,
    //   message: !readwiseToken ? "로그인 필요" : "",
    // };
    // return result;
    return {
      readwise: {
        ready: true,
        message: "",
      },
      ridibooks: {
        ready: true,
        message: "",
      },
    };
  })
  .watch("ridi/books", async ({ page }) => {
    return await ridiService.bookList(page);
  })
  .watch("ridi/highlight-preview", async ({ bookId }) => {
    return await ridiService.highlightList({ bookId, offset: 0, limit: 10 });
  })
  .watch("ridi/create", async ({ bookId, count }) => {
    return await ridiService.createHighlights({ bookId, count });
  });
