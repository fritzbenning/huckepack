import { useEffect, useState } from "react";

const SESSION_STORAGE_KEY = "component-editor-session-id";

// Generate a unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Function to get session ID from localStorage
const getSessionIdFromStorage = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_STORAGE_KEY);
};

export const useSessionId = () => {
  const [sessionId, setSessionId] = useState<string>("");

  // Initialize persistent session ID
  useEffect(() => {
    const storedSessionId = getSessionIdFromStorage();
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = generateSessionId();
      localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
      setSessionId(newSessionId);
    }
  }, []);

  return {
    sessionId,
    getSessionIdFromStorage,
  };
};
