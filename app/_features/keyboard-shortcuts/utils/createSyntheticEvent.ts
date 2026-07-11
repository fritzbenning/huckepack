import type { KeyboardShortcutData, SyntheticKeyboardEvent } from "../types";

export const createSyntheticEvent = (data: KeyboardShortcutData): SyntheticKeyboardEvent => {
  const syntheticEvent = {
    key: data.key,
    code: data.code,
    ctrlKey: data.ctrlKey,
    metaKey: data.metaKey,
    shiftKey: data.shiftKey,
    altKey: data.altKey,
    synthetic: true as const,
    originalData: data,
    // Required KeyboardEvent properties
    preventDefault: () => {},
    stopPropagation: () => {},
    stopImmediatePropagation: () => {},
    bubbles: false,
    cancelable: true,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    timeStamp: Date.now(),
    type: "keydown",
    target: null,
    currentTarget: null,
  } as SyntheticKeyboardEvent;

  return syntheticEvent;
};

