import { convex } from "@lib/convex";
import Logo from "@shared/ui-kit/layout/Logo";
import Button from "@shared/ui-kit/ui/Button";
import { Jumbotron } from "@shared/ui-kit/ui/Jumbotron";
import { Spinner } from "@shared/ui-kit/ui/Spinner";
import { useConvexAuth } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AppAuthCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useConvexAuth();

  const retryCountRef = useRef(0);
  const maxRetries = 15;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      convex.setAuth(async () => token);
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionToken = urlParams.get("session_token");
    const code = urlParams.get("code");
    const token = urlParams.get("token");

    if (sessionToken) {
      try {
        convex.setAuth(async () => sessionToken);
      } catch (error) {
        console.error("Failed to set auth token:", error);
        setStatus("error");
        setErrorMessage("Failed to authenticate. Please try signing in again.");
        return;
      }
    } else if (!code) {
      setStatus("error");
      setErrorMessage("No authentication token found in callback URL.");
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    retryCountRef.current = 0;

    const checkAuth = () => {
      if (isLoading) {
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          timeoutRef.current = setTimeout(checkAuth, 500);
        }
        return;
      }

      if (isAuthenticated) {
        setStatus("success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
        return;
      }

      const currentParams = new URLSearchParams(window.location.search);
      const hasCallbackParams =
        currentParams.has("code") || currentParams.has("session_token") || currentParams.has("redirect");

      if (hasCallbackParams && retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        timeoutRef.current = setTimeout(checkAuth, 1000);
      } else {
        setStatus("error");
        setErrorMessage("Authentication failed. Please try signing in again.");
      }
    };

    timeoutRef.current = setTimeout(checkAuth, 1000);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, isAuthenticated, navigate]);

  if (status === "loading" || isLoading) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-50 bg-no-repeat dark:bg-neutral-950"
        style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
      >
        <Spinner size="lg" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-50 bg-no-repeat dark:bg-neutral-950">
      <header style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
        <Logo size="large" className="text-black dark:text-white" />
      </header>
      <Jumbotron
        variant="default"
        border
        maxWidth="narrow"
        padding={null}
        className="mx-auto flex min-w-96 flex-col rounded-xl border-neutral-100 bg-white text-center dark:border-neutral-850 dark:bg-neutral-900"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <div className="flex flex-col items-center justify-center gap-8 p-12">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-3">
              <h1 className="font-bold text-2xl text-gray-900 dark:text-white">You are signed in!</h1>
              <p className="text-base text-neutral-600 dark:text-neutral-400">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Authentication Error</h1>
              <div className="flex flex-col items-center gap-1 space-y-4">
                <p className="text-md text-red-600 leading-snug dark:text-red-400">{errorMessage}</p>
                <Button onClick={() => navigate("/")} size="hero" className="w-full">
                  Go to Sign In
                </Button>
              </div>
            </>
          )}
        </div>
      </Jumbotron>
    </main>
  );
}
