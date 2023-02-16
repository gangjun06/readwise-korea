import type { RidiAPIHighlightRes, RidiBookList } from "src/background/ridi";

export const chromeTabActions = {
  status: {
    type: "background/ridiCookies",
    createAction: {},
    responseAction: {} as {
      [serviceName: string]: { ready: boolean; message: string };
    },
  },
  "ridi/books": {
    type: "background/books",
    createAction: {} as { page: number },
    responseAction: {} as RidiBookList,
  },
  "ridi/highlight-preview": {
    type: "background/highlight-preview",
    createAction: {} as { bookId: string },
    responseAction: {} as RidiAPIHighlightRes,
  },
  "ridi/create": {
    type: "ridi/create",
    createAction: {} as { bookId: string; count: number },
    responseAction: {},
  },
};

type chromeTabActionTypes = keyof typeof chromeTabActions;

const getCurrentTab = () =>
  new Promise<number | null>((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) =>
      resolve((tabs[0].id as number) ?? null)
    );
  });

export const chromeSendMessage = async <T extends chromeTabActionTypes>(
  tabId: number | "current",
  type: chromeTabActionTypes,
  payload: typeof chromeTabActions[T]["createAction"]
) => {
  let currentTab: number | null = null;
  if (tabId === "current") {
    currentTab = await getCurrentTab();
    if (!currentTab) return;
  }

  await chrome.tabs.sendMessage(currentTab ?? (tabId as number), {
    type,
    ...payload,
  });
};

export const chromeSendBackgroundMessage = <T extends chromeTabActionTypes>(
  type: T,
  payload: typeof chromeTabActions[T]["createAction"]
): Promise<typeof chromeTabActions[T]["responseAction"]> =>
  new Promise((resolve, reject) => {
    // console.log("SEND!", type, payload);
    // if (chromeTabActions[type].background !== true) {
    //   return reject(new Error(`${type} is not background action`));
    // }

    chrome.runtime.sendMessage(
      {
        type,
        ...payload,
      },
      (response) => {
        resolve(response);
      }
    );
  });

export const watchChromeMessageEvents = () => {
  const watchTypes: Partial<{ [key in chromeTabActionTypes]: any }> = {};
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    if (typeof watchTypes[obj.type] === "function") {
      console.log(`execute[${obj.type}]`);
      watchTypes[obj.type](obj)
        .then((result: any) => {
          console.log(`resose[${obj.type}]:`, result);
          response(result);
        })
        .catch((e: any) => {
          response({ error: e.message });
        });
      if (chromeTabActions[obj.type]["responseAction"]) return true;
    }
  });
  const returnFunctions = {
    watch: <T extends chromeTabActionTypes>(
      type: T,
      handler: (
        obj: typeof chromeTabActions[T]["createAction"]
      ) =>
        | typeof chromeTabActions[T]["responseAction"]
        | Promise<typeof chromeTabActions[T]["responseAction"]>
    ) => {
      watchTypes[type] = handler;
      return returnFunctions;
    },
  };
  return returnFunctions;
};
