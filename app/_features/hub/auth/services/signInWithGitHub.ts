export const signInWithGitHub = async () => {
  // Redirect to Convex Auth's GitHub OAuth flow
  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("Missing VITE_CONVEX_URL environment variable");
  }

  const redirectUrl = new URL(`${window.location.origin}/browser-auth-callback`);
  redirectUrl.searchParams.set("provider", "github");

  const authUrl = new URL(`${convexUrl}/api/auth/signin/github`);
  authUrl.searchParams.set("redirect", redirectUrl.toString());

  window.location.href = authUrl.toString();
};
