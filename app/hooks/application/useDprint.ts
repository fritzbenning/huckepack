import { createStreaming, type Formatter } from "@dprint/formatter";
import { useEffect, useState } from "react";

let dprintInitialized = false;
let dprintInitPromise: Promise<Formatter> | null = null;
let dprintFormatter: Formatter | null = null;

export async function initDprint(): Promise<Formatter> {
  if (!dprintInitialized) {
    if (!dprintInitPromise) {
      dprintInitPromise = createStreaming(fetch("https://plugins.dprint.dev/typescript-0.57.0.wasm")).then(
        (formatter) => {
          dprintFormatter = formatter;
          dprintInitialized = true;
          return formatter;
        }
      );
    }
    return dprintInitPromise;
  }
  return dprintFormatter!;
}

export function isDprintInitialized(): boolean {
  return dprintInitialized;
}

export function getDprintFormatter(): Formatter | null {
  return dprintFormatter;
}

export const useDprint = () => {
  const [isReady, setIsReady] = useState(dprintInitialized);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!dprintInitialized) {
      initDprint()
        .then(() => {
          setIsReady(true);
        })
        .catch((err) => {
          setError(err);
          console.error("Failed to initialize dprint:", err);
        });
    }
  }, []);

  return { isReady, error };
};

