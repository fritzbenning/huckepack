export const signInWithGoogle = async () => {
  // Redirect to Convex Auth's Google OAuth flow
  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("Missing VITE_CONVEX_URL environment variable");
  }

  const redirectUrl = new URL(`${window.location.origin}/browser-auth-callback`);
  redirectUrl.searchParams.set("provider", "google");

  const authUrl = new URL(`${convexUrl}/api/auth/signin/google`);
  authUrl.searchParams.set("redirect", redirectUrl.toString());

  window.location.href = authUrl.toString();
};
