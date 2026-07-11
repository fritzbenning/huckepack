export interface SignOutResult {
  success: boolean;
  sessionWasInvalid: boolean;
}

export const signOut = async (signOutFn?: () => Promise<void>): Promise<SignOutResult> => {
  try {
    if (signOutFn) {
      await signOutFn();
      return { success: true, sessionWasInvalid: false };
    }

    // Fallback: Call Convex Auth sign out endpoint directly
    const convexUrl = import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("Missing VITE_CONVEX_URL environment variable");
    }

    const baseUrl = convexUrl.replace(/\.cloud$/, "").replace(/\/$/, "");
    
    // Call Convex Auth sign out endpoint
    const response = await fetch(`${baseUrl}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      // If sign out fails, it might be because session is already invalid
      return { success: true, sessionWasInvalid: true };
    }

    return { success: true, sessionWasInvalid: false };
  } catch (error) {
    console.error("Sign out failed:", error);
    // Even if there's an error, clear local state
    return { success: true, sessionWasInvalid: false };
  }
};
