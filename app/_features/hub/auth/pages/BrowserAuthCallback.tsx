import { useAuthActions, useAuthToken } from "@convex-dev/auth/react";
import { GithubLogo } from "@phosphor-icons/react";
import Logo from "@shared/ui-kit/layout/Logo";
import Button from "@shared/ui-kit/ui/Button";
import { Jumbotron } from "@shared/ui-kit/ui/Jumbotron";
import { Spinner } from "@shared/ui-kit/ui/Spinner";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const getProviderDisplayName = (provider: string | null): string => {
  if (!provider) return "Provider";
  return provider.charAt(0).toUpperCase() + provider.slice(1);
};

const getProviderIcon = (provider: string | null) => {
  if (provider === "github") {
    return <GithubLogo className="size-4" weight="duotone" />;
  }
  return null;
};

export default function BrowserAuthCallback() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuthActions();
  const [searchParams] = useSearchParams();
  const provider = searchParams.get("provider");

  const token = useAuthToken();

  const handleSignIn = async () => {
    if (!provider) {
      setStatus("error");
      setErrorMessage("No provider specified.");
      return;
    }

    setStatus("loading");

    try {
      await signIn(provider);
      setStatus("success");
    } catch (error) {
      console.error("Failed to complete sign-in:", error);
      setStatus("error");
      setErrorMessage("Failed to complete sign-in. Please try again.");
    }
  };

  useEffect(() => {
    if (token && status === "success") {
      const currentUrl = window.location.href;
      const searchParams = new URLSearchParams(new URL(currentUrl).searchParams);
      searchParams.set("token", token);
      const callbackUrl = `huckepack://app-auth-callback?${searchParams.toString()}`;

      // Try multiple methods to ensure the redirect works
      try {
        // Method 1: Direct location change
        window.location.href = callbackUrl;

        // Method 2: Fallback - try using window.open after a delay
        setTimeout(() => {
          const opened = window.open(callbackUrl, "_blank");
          if (!opened) {
            console.warn("[BrowserAuthCallback] window.open was blocked, user may need to allow popups");
          }
        }, 1000);
      } catch (error) {
        console.error("[BrowserAuthCallback] Error redirecting:", error);
        setStatus("error");
        setErrorMessage("Failed to open Electron app. Please make sure Electron is running.");
      }
    }
  }, [token, status]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-50 bg-no-repeat dark:bg-neutral-950">
        <header>
          <Logo size="large" className="text-black dark:text-white" />
        </header>
        <Jumbotron
          variant="default"
          border
          maxWidth="narrow"
          padding={null}
          className="mx-auto flex min-w-96 flex-col rounded-xl border-neutral-100 bg-white text-center dark:border-neutral-850 dark:bg-neutral-900"
        >
          <div className="flex flex-col items-center justify-center gap-8 p-12">
            <Spinner size="lg" />
            <div className="flex flex-col items-center gap-3">
              <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Opening application...</h1>
              <p className="text-base text-neutral-600 dark:text-neutral-400">
                Please wait while we open the app with your authentication.
              </p>
            </div>
          </div>
        </Jumbotron>
      </main>
    );
  }

  if (status === "idle" && provider) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-50 bg-no-repeat dark:bg-neutral-950">
        <header>
          <Logo size="large" className="text-black dark:text-white" />
        </header>
        <Jumbotron
          variant="default"
          border
          maxWidth="narrow"
          padding={null}
          className="mx-auto flex min-w-96 flex-col rounded-xl border-neutral-100 bg-white text-center dark:border-neutral-850 dark:bg-neutral-900"
        >
          <div className="flex flex-col items-center justify-center gap-8 p-12">
            <div className="flex flex-col items-center gap-3">
              <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Sign In</h1>
              <p className="text-base text-neutral-600 dark:text-neutral-400">
                Sign in here and we'll redirect you to the app.
              </p>
            </div>
            <Button
              onClick={() => void handleSignIn()}
              size="hero"
              className="flex w-full items-center justify-center gap-2"
            >
              {getProviderIcon(provider)}
              Sign in with {getProviderDisplayName(provider)}
            </Button>
          </div>
        </Jumbotron>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-50 bg-no-repeat dark:bg-neutral-950">
      <header>
        <Logo size="large" className="text-black dark:text-white" />
      </header>
      <Jumbotron
        variant="default"
        border
        maxWidth="narrow"
        padding={null}
        className="mx-auto flex min-w-96 flex-col rounded-xl border-neutral-100 bg-white text-center dark:border-neutral-850 dark:bg-neutral-900"
      >
        <div className="flex flex-col items-center justify-center gap-8 p-12">
          <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Authentication Error</h1>
          <div className="flex flex-col items-center gap-1 space-y-4">
            <p className="text-md text-red-600 leading-snug dark:text-red-400">
              {errorMessage || "No provider specified."}
            </p>
            <Button onClick={() => navigate("/")} size="hero" className="w-full">
              Go to Sign In
            </Button>
          </div>
        </div>
      </Jumbotron>
    </main>
  );
}
