export const getBackendUrl = (): string => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }

  if (import.meta.env.PROD) {
    return window.location.origin;
  }

  return "http://localhost:3001";
};
