import { useSandpack } from "@codesandbox/sandpack-react";
import { FadeIn } from "@shared/ui-kit/animations/FadeIn";
import { Spinner } from "@shared/ui-kit/ui/Spinner";
import { AnimatePresence } from "motion/react";
import { useEffect, useEffectEvent, useRef, useState } from "react";

interface FilePreviewProps {
  fileId: string;
  filePath: string;
}

export function FilePreview({ fileId, filePath }: FilePreviewProps) {
  const { sandpack, listen } = useSandpack();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const registerClients = useEffectEvent(() => {
    const clientId = `preview-${fileId}`;

    if (!iframeRef.current) return;

    const normalizedPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
    const startRoute = `/preview/${normalizedPath}`;

    sandpack.registerBundler(iframeRef.current, clientId, {
      startRoute,
    });

    const unsubscribe = listen((message) => {
      if (message.type === "done") {
        setIsLoading(false);
      }
    }, clientId);

    return () => {
      unsubscribe();
      sandpack.unregisterBundler(clientId);
    };
  });

  useEffect(() => {
    if (isRunning) return;

    if (sandpack.status === "initial") {
      return;
    }

    if (sandpack.status === "idle") {
      sandpack.runSandpack();
      return;
    }

    if (sandpack.status === "running") {
      setIsRunning(true);
      registerClients();

      return;
    }
  }, [sandpack.status]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <iframe
        ref={iframeRef}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "0",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.2s 0.2s ease-in-out",
        }}
        title={`Preview for ${filePath}`}
        key={fileId}
      />
      <AnimatePresence>
        {isLoading && (
          <FadeIn className="absolute inset-0 flex items-center justify-center">
            <Spinner />
          </FadeIn>
        )}
      </AnimatePresence>
    </div>
  );
}
