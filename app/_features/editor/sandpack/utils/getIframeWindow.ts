import type { SandpackPreviewRef } from "@codesandbox/sandpack-react";
import type { RefObject } from "react";

export const getIframeWindow = (
  iframe: RefObject<SandpackPreviewRef | null> | HTMLIFrameElement
): Window | null => {
  if (iframe instanceof HTMLIFrameElement) {
    return iframe.contentWindow;
  } else {
    const ref = iframe as RefObject<SandpackPreviewRef | null>;
    return ref.current?.getClient()?.iframe?.contentWindow ?? null;
  }
};

