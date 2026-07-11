export const handleElectronAuthCallback = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const code = parsedUrl.searchParams.get("code");

    if (code) {
      const redirectUri = "http://localhost:5173/auth-callback";
      const callbackUrl = `${redirectUri}?${parsedUrl.search}`;
      window.location.href = callbackUrl;
    } else {
      console.warn("No authorization code found in callback URL");
    }
  } catch (error) {
    console.error("Error parsing OAuth callback:", error);
  }
};
