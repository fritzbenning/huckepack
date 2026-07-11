import { type AuthTokens, PROTOCOL_URL, TOKEN_EXPIRY_DEFAULT, TOKEN_TYPE_DEFAULT } from "@hub/auth";

export const extractTokensFromUrl = (): AuthTokens => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  return {
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
    expires_in: params.get("expires_in"),
    token_type: params.get("token_type"),
  };
};

export const createProtocolUrl = (tokens: AuthTokens): string => {
  if (!tokens.access_token) {
    throw new Error("No valid authentication tokens found.");
  }

  return (
    `${PROTOCOL_URL}?` +
    new URLSearchParams({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || "",
      expires_in: tokens.expires_in || TOKEN_EXPIRY_DEFAULT,
      token_type: tokens.token_type || TOKEN_TYPE_DEFAULT,
    }).toString()
  );
};
