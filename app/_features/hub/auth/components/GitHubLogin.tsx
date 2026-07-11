import Button from "@shared/ui-kit/ui/Button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useElectron } from "@hooks/application/useElectron";
import { GithubLogo } from "@phosphor-icons/react";

export function GitHubLogin() {
  const { signIn } = useAuthActions();
  const isElectron = useElectron();

  const handleSignIn = async () => {
    if (isElectron && window.electron) {
      const convexUrl = import.meta.env.VITE_CONVEX_URL;
      if (!convexUrl) {
        throw new Error("Missing VITE_CONVEX_URL environment variable");
      }

      const redirectUrl = new URL(`${window.location.origin}/browser-auth-callback`);
      redirectUrl.searchParams.set("provider", "github");

      const authUrl = new URL(`${convexUrl}/api/auth/signin/github`);
      authUrl.searchParams.set("redirect", redirectUrl.toString());

      await window.electron.auth.openExternal(authUrl.toString());
    } else {
      await signIn("github");
    }
  };

  return (
    <Button onClick={() => void handleSignIn()} className="flex items-center gap-2" size="hero">
      <GithubLogo className="size-4" weight="duotone" />
      Sign in with GitHub
    </Button>
  );
}
