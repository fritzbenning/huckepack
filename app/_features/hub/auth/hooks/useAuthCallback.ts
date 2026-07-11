import { type AuthCallbackStatus, type AuthTokens, createProtocolUrl, extractTokensFromUrl } from "@hub/auth";
import { useEffect, useState } from "react";

export const useAuthCallback = () => {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [status, setStatus] = useState<AuthCallbackStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const extractedTokens = extractTokensFromUrl();

    if (extractedTokens.access_token) {
      setTokens(extractedTokens);
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage("No authentication tokens found. Please try signing in again.");
    }
  }, []);

  const handleOpenInApp = () => {
    if (!tokens?.access_token) {
      setStatus("error");
      setErrorMessage("No valid authentication tokens found.");
      return;
    }

    try {
      const protocolUrl = createProtocolUrl(tokens);
      window.location.href = protocolUrl;
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return {
    tokens,
    status,
    errorMessage,
    handleOpenInApp,
  };
};
