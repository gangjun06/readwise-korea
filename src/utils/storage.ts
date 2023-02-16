type IStorage = {
  count: number;
};

const defaultStorage: IStorage = {
  count: 0,
};

export const storage = {
  get: (): Promise<IStorage> =>
    chrome.storage.sync.get(defaultStorage) as Promise<IStorage>,
  set: (value: IStorage): Promise<void> => chrome.storage.sync.set(value),
};

type ILocalStorage = {};

const defaultLocalStorage: ILocalStorage = {};

export const chromeLocalStorage = {
  get: (): Promise<ILocalStorage> =>
    chrome.storage.local.get(defaultLocalStorage) as Promise<ILocalStorage>,
  set: (value: ILocalStorage): Promise<void> => chrome.storage.local.set(value),
};
