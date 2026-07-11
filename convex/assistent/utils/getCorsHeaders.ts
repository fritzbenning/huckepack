export const getCorsHeaders = (origin: string | null) => {
  const allowedOrigins = ["http://localhost:5173", "http://localhost:3000", process.env.CLIENT_ORIGIN].filter(Boolean);

  const isAllowed = origin && allowedOrigins.some((allowed) => origin === allowed || allowed === "*");

  return new Headers({
    "Access-Control-Allow-Origin": isAllowed ? origin! : allowedOrigins[0] || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "origin",
  });
};
