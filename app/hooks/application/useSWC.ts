import initSwc from "@swc/wasm-web";
import { useEffect, useState } from "react";
import { initDprint } from "./useDprint";

let swcInitialized = false;
let swcInitPromise: Promise<void> | null = null;

export async function initSWC() {
  if (!swcInitialized) {
    if (!swcInitPromise) {
      swcInitPromise = initSwc().then(() => {
        swcInitialized = true;
      });
    }
    await swcInitPromise;
  }
}

export function isSWCInitialized(): boolean {
  return swcInitialized;
}

export async function preloadWASM() {
  await Promise.all([initSWC(), initDprint()]);
}

export const useSWC = () => {
  const [isReady, setIsReady] = useState(swcInitialized);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!swcInitialized) {
      initSWC()
        .then(() => {
          setIsReady(true);
        })
        .catch((err) => {
          setError(err);
          console.error("Failed to initialize SWC:", err);
        });
    }
  }, []);

  return { isReady, error };
};
