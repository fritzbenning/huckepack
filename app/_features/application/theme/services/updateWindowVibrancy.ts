export const updateWindowVibrancy = async (theme: "light" | "dark") => {
  if (!window.electron?.theme?.setWindowVibrancy) {
    return { success: false, error: "Not running in Electron or vibrancy not available" };
  }

  try {
    const result = await window.electron.theme.setWindowVibrancy(theme);
    return result;
  } catch (error) {
    console.error("Failed to set window vibrancy:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};
