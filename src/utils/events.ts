export const windowActions = {
  RIDI_CLICK: {
    type: "RIDI_CLICK",
    createAction: ({}: {}) => ({}),
  },
};

type windowActionTypes = keyof typeof windowActions;

export const windowSendMessage = async <T extends windowActionTypes>(
  type: windowActionTypes,
  payload: Parameters<typeof windowActions[T]["createAction"]>[0]
) => {
  window.postMessage({ type, ...payload }, "*");
};

export const windowMessageHandler = <T extends windowActionTypes>(
  event: MessageEvent,
  type: T,
  handler: (obj: ReturnType<typeof windowActions[T]["createAction"]>) => void
) => {
  if (event.source !== window || event.data.type !== type) {
    return;
  }
  handler(event.data);
  return this;
};

// export class WindowMessageHandler {
//   private watchTypes: Partial<{ [key in windowActionTypes]: any }> = {};
//   constructor(addEventListener?: boolean) {
//     if (addEventListener) {
//       window.addEventListener("message", this.onMessage);
//     }
//   }

//   watch<T extends windowActionTypes>(
//     type: T,
//     handler: (obj: ReturnType<typeof windowActions[T]["createAction"]>) => void
//   ) {
//     this.watchTypes[type] = handler;
//     return this;
//   }

//   onMessage(event: MessageEvent) {
//     console.log("new event", event);
//     if (event.source !== window) {
//       return;
//     }
//     if (typeof this.watchTypes[event.data.type] === "function") {
//       this.watchTypes[event.data.type](event.data);
//     }
//   }
// }
