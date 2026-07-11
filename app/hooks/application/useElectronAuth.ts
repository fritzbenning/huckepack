import { convex } from "@lib/convex";
import { useConvexAuth } from "convex/react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useElectron } from "./useElectron";

export function useElectronAuth() {
  const isElectron = useElectron();
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const tokenSetRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 20;

  useEffect(() => {
    if (!isElectron || !window.electron) {
      return;
    }

    // Check if the method exists before using it
    if (!window.electron.auth.onSetAuthToken) {
      console.warn("[useElectronAuth] onSetAuthToken method not available. Preload script may need to be rebuilt.");
      return;
    }

    const handleSetAuthToken = (token: string) => {
      if (tokenSetRef.current) {
        return;
      }

      if (!token) {
        console.error("[useElectronAuth] Token is null or undefined!");
        return;
      }

      try {
        tokenSetRef.current = true;

        // Set auth on the shared Convex client with an async function
        convex.setAuth(async () => token);

        // Reset retry count to start checking authentication status
        retryCountRef.current = 0;
      } catch (error) {
        console.error("[useElectronAuth] Error setting auth token:", error);
        tokenSetRef.current = false;
      }
    };

    window.electron.auth.onSetAuthToken(handleSetAuthToken);

    // Also check URL params as fallback (in case IPC doesn't work)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      handleSetAuthToken(tokenFromUrl);
    }

    return () => {
      if (window.electron?.auth.removeSetAuthTokenListener) {
        window.electron.auth.removeSetAuthTokenListener();
      }
    };
  }, [isElectron, navigate]);

  // Wait for authentication to complete after token is set
  useEffect(() => {
    if (!tokenSetRef.current) return;

    const checkAuth = () => {
      if (isLoading) {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          setTimeout(checkAuth, 500);
        } else {
          console.warn("[useElectronAuth] Max retries reached, authentication may have failed");
        }
        return;
      }

      if (isAuthenticated) {
        navigate("/dashboard");
        tokenSetRef.current = false;
        retryCountRef.current = 0;
      } else {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          setTimeout(checkAuth, 500);
        } else {
          console.error("[useElectronAuth] Authentication failed after max retries");
          tokenSetRef.current = false;
          retryCountRef.current = 0;
        }
      }
    };

    // Start checking after a short delay to let Convex process the token
    const timeoutId = setTimeout(checkAuth, 500);
    return () => clearTimeout(timeoutId);
  }, [isLoading, isAuthenticated, navigate]);
}
