// Global type declarations for Electron API
export interface ElectronAPI {
  platform: string;
  versions: NodeJS.ProcessVersions;
  auth: {
    openExternal: (url: string) => Promise<void>;
    onAuthCallback: (callback: (url: string) => void) => void;
    removeAuthCallback: () => void;
    onSetAuthToken: (callback: (token: string) => void) => void;
    removeSetAuthTokenListener: () => void;
  };
  windowControls: {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
    isMaximized: () => Promise<boolean>;
  };
  blurControl: {
    setVibrancy: (vibrancy: string) => Promise<{ success: boolean; vibrancy?: string; error?: string }>;
    getVibrancy: () => Promise<{ success: boolean; vibrancy?: string; error?: string }>;
    setOpacity: (opacity: number) => Promise<{ success: boolean; opacity?: number; error?: string }>;
    getOpacity: () => Promise<{ success: boolean; opacity?: number; error?: string }>;
  };
  theme: {
    getSystemTheme: () => Promise<"light" | "dark">;
    getTheme: () => Promise<"light" | "dark" | "system">;
    setTheme: (theme: "light" | "dark" | "system") => Promise<"light" | "dark" | "system">;
    getEffectiveTheme: () => Promise<"light" | "dark">;
    onSystemThemeChanged: (callback: (data: { themeSource: string; effectiveTheme: string }) => void) => void;
    removeSystemThemeListener: () => void;
    // Window vibrancy controls
    setWindowVibrancy: (theme: "light" | "dark") => Promise<{ success: boolean; theme?: string; error?: string }>;
    getWindowVibrancy: () => Promise<{ success: boolean; theme?: string; error?: string }>;
  };
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}
