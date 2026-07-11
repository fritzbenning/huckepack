const { contextBridge, ipcRenderer } = require("electron");

console.info("=== PRELOAD SCRIPT EXECUTING ===");
console.info("contextBridge available:", !!contextBridge);

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  versions: process.versions,
  // OAuth and external URL handling
  auth: {
    openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
    onAuthCallback: (callback: (url: string) => void) => {
      ipcRenderer.on("auth-callback", (_: any, url: string) => callback(url));
    },
    removeAuthCallback: () => {
      ipcRenderer.removeAllListeners("auth-callback");
    },
    onSetAuthToken: (callback: (token: string) => void) => {
      ipcRenderer.on("set-auth-token", (_: any, token: string) => callback(token));
    },
    removeSetAuthTokenListener: () => {
      ipcRenderer.removeAllListeners("set-auth-token");
    },
  },
  // Window controls
  windowControls: {
    minimize: () => ipcRenderer.invoke("window-minimize"),
    maximize: () => ipcRenderer.invoke("window-maximize"),
    close: () => ipcRenderer.invoke("window-close"),
    isMaximized: () => ipcRenderer.invoke("window-is-maximized"),
  },
  // Theme controls
  theme: {
    getSystemTheme: () => ipcRenderer.invoke("get-system-theme"),
    getTheme: () => ipcRenderer.invoke("get-theme"),
    setTheme: (theme: "light" | "dark" | "system") => ipcRenderer.invoke("set-theme", theme),
    getEffectiveTheme: () => ipcRenderer.invoke("get-effective-theme"),
    onSystemThemeChanged: (callback: (data: { themeSource: string; effectiveTheme: string }) => void) => {
      ipcRenderer.on("system-theme-changed", (_: any, data: { themeSource: string; effectiveTheme: string }) =>
        callback(data)
      );
    },
    removeSystemThemeListener: () => {
      ipcRenderer.removeAllListeners("system-theme-changed");
    },
    // Window vibrancy controls
    setWindowVibrancy: (theme: "light" | "dark") => ipcRenderer.invoke("set-window-vibrancy", theme),
    getWindowVibrancy: () => ipcRenderer.invoke("get-window-vibrancy"),
  },
});

console.info("=== PRELOAD SCRIPT COMPLETED - electron API exposed ===");
