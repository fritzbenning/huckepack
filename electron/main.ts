import path from "node:path";
import { fileURLToPath } from "node:url";
import electron, { type BrowserWindow as BrowserWindowType, ipcMain, nativeTheme, shell } from "electron";
import serve from "electron-serve";

const { app, BrowserWindow, protocol } = electron;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProd = process.env.ELECTRON_PROD === "true" || process.env.NODE_ENV === "production" || !process.defaultApp;

if (isProd) {
  serve({ directory: "dist/web" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

let mainWindow: BrowserWindowType;

function createWindow(): void {
  const preloadPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "preload.js");

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false, // Frameless window
    titleBarStyle: "hiddenInset", // Show native controls (macOS) without title bar
    transparent: true, // Required for vibrancy
    vibrancy: "titlebar", // Native macOS vibrancy effect
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: preloadPath,
    },
    title: "Huckepack - Component Editor",
    minWidth: 800,
    minHeight: 600,
  });

  if (isProd) {
    console.info(`Loading URL: app://./index.html`);
    mainWindow.loadURL("app://./index.html");
  } else {
    // Get URL from environment or construct with default port 5173
    const viteUrl = process.env.VITE_URL;
    const port = process.env.PORT || process.env.VITE_PORT || 5173;
    const devUrl = viteUrl || `http://localhost:${port}`;

    console.info(`Attempting to connect to Vite dev server`);
    console.info(`Loading URL: ${devUrl}`);
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools(); // Enable dev tools to debug connection issues
  }

  // Show window buttons for better UX
  mainWindow.webContents.once("did-finish-load", () => {
    mainWindow.setWindowButtonVisibility(true);
  });
}

// Register custom protocol for OAuth callbacks
app.whenReady().then(() => {
  // Register huckepack:// protocol for OAuth callbacks
  protocol.registerHttpProtocol("huckepack", (request, callback) => {
    const url = request.url;

    if (url.includes("app-auth-callback")) {
      const parsedUrl = new URL(url);
      const token = parsedUrl.searchParams.get("token");

      if (mainWindow && !mainWindow.isDestroyed()) {
        if (token) {
          // Wait for webContents to be ready, then send token
          const sendToken = () => {
            if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
              // Also navigate to a URL with the token so the fallback mechanism can work
              const isProd =
                process.env.ELECTRON_PROD === "true" || process.env.NODE_ENV === "production" || !process.defaultApp;
              let tokenUrl: string;

              if (isProd) {
                tokenUrl = `app://./index.html?token=${encodeURIComponent(token)}`;
              } else {
                const port = process.env.PORT || process.env.VITE_PORT || 5173;
                tokenUrl = `http://localhost:${port}/?token=${encodeURIComponent(token)}`;
              }

              // Navigate to URL with token (fallback mechanism)
              mainWindow.loadURL(tokenUrl);

              // Also send via IPC (primary mechanism)
              setTimeout(() => {
                if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
                  mainWindow.webContents.send("set-auth-token", token);

                  // Retry after delays
                  setTimeout(() => {
                    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
                      mainWindow.webContents.send("set-auth-token", token);
                    }
                  }, 500);
                }
              }, 300);
            } else {
            }
          };

          // Check if webContents is ready, if not wait a bit
          if (mainWindow.webContents.isLoading()) {
            mainWindow.webContents.once("did-finish-load", () => {
              setTimeout(sendToken, 200);
            });
          } else {
            setTimeout(sendToken, 200);
          }
        } else {
          // Fallback to old behavior if no token
          const searchParams = parsedUrl.searchParams.toString();
          const isProd =
            process.env.ELECTRON_PROD === "true" || process.env.NODE_ENV === "production" || !process.defaultApp;
          let callbackUrl: string;

          if (isProd) {
            callbackUrl = `app://./app-auth-callback${searchParams ? `?${searchParams}` : ""}`;
          } else {
            const port = process.env.PORT || process.env.VITE_PORT || 5173;
            callbackUrl = `http://localhost:${port}/app-auth-callback${searchParams ? `?${searchParams}` : ""}`;
          }

          mainWindow.loadURL(callbackUrl);
        }
      }

      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
        mainWindow.show();
      }
    } else if (url.includes("auth-callback")) {
      const parsedUrl = new URL(url);
      const searchParams = parsedUrl.searchParams.toString();

      const isProd =
        process.env.ELECTRON_PROD === "true" || process.env.NODE_ENV === "production" || !process.defaultApp;
      let callbackUrl: string;

      if (isProd) {
        callbackUrl = `app://./auth-callback${searchParams ? `?${searchParams}` : ""}`;
      } else {
        const port = process.env.PORT || process.env.VITE_PORT || 5173;
        callbackUrl = `http://localhost:${port}/auth-callback${searchParams ? `?${searchParams}` : ""}`;
      }

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.loadURL(callbackUrl);
      }

      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
        mainWindow.show();
      }
    } else {
      // Send the callback URL to the renderer process for other huckepack:// URLs
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("auth-callback", url);
      }

      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
        mainWindow.show();
      }
    }

    // Return empty response for protocol handler
    callback({ data: "", mimeType: "text/html" });
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC handlers for renderer process
ipcMain.handle("open-external", async (_, url: string) => {
  await shell.openExternal(url);
});

// Theme-related IPC handlers
ipcMain.handle("get-system-theme", () => {
  return nativeTheme.shouldUseDarkColors ? "dark" : "light";
});

ipcMain.handle("get-theme", () => {
  return nativeTheme.themeSource;
});

ipcMain.handle("set-theme", (_, theme: "light" | "dark" | "system") => {
  nativeTheme.themeSource = theme;

  // Update window vibrancy based on the new theme
  const effectiveTheme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
  updateWindowVibrancy(effectiveTheme);

  return nativeTheme.themeSource;
});

ipcMain.handle("get-effective-theme", () => {
  return nativeTheme.shouldUseDarkColors ? "dark" : "light";
});

// Listen for system theme changes and notify renderer
nativeTheme.on("updated", () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const effectiveTheme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
    mainWindow.webContents.send("system-theme-changed", {
      themeSource: nativeTheme.themeSource,
      effectiveTheme: effectiveTheme,
    });

    // Update window vibrancy based on theme
    updateWindowVibrancy(effectiveTheme);
  }
});

// Function to update window vibrancy based on theme
let lastVibrancyTheme: string | null = null;

function updateWindowVibrancy(theme: "light" | "dark") {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  try {
    // Different vibrancy effects for light and dark themes
    const vibrancyEffect = theme === "dark" ? "dark" : "light";

    // Only update if the vibrancy actually changed to prevent unnecessary updates
    if (lastVibrancyTheme !== vibrancyEffect) {
      lastVibrancyTheme = vibrancyEffect;
      mainWindow.setVibrancy(vibrancyEffect as any);
    }
  } catch (error) {
    console.error("Failed to update window vibrancy:", error);
  }
}

// IPC handler to manually set window vibrancy
ipcMain.handle("set-window-vibrancy", (_, theme: "light" | "dark") => {
  updateWindowVibrancy(theme);
  return { success: true, theme };
});

// IPC handler to get current vibrancy
ipcMain.handle("get-window-vibrancy", () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return { success: false, error: "Window not available" };
  }

  try {
    // Note: There's no direct way to get current vibrancy, so we'll return the effective theme
    const effectiveTheme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
    return { success: true, theme: effectiveTheme };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
});

ipcMain.handle("window-minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle("window-maximize", () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle("window-close", () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle("window-is-maximized", () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Security: Allow GitHub OAuth and Convex URLs
app.on("web-contents-created", (_, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    // Allow GitHub OAuth URLs and Convex
    if (
      parsedUrl.hostname === "github.com" ||
      parsedUrl.hostname === "api.github.com" ||
      parsedUrl.hostname === "accounts.google.com" ||
      parsedUrl.hostname.endsWith(".convex.cloud") ||
      parsedUrl.protocol === "huckepack:"
    ) {
      return; // Allow these URLs
    }

    // Allow localhost on common development ports and app protocol
    if (!parsedUrl.origin.startsWith("http://localhost:") && parsedUrl.origin !== "app://") {
      event.preventDefault();
    }
  });
});

// Handle OAuth callback URLs when app is already running (macOS)
app.on("open-url", (event, url) => {
  event.preventDefault();

  if (url.includes("app-auth-callback")) {
    const parsedUrl = new URL(url);
    const token = parsedUrl.searchParams.get("token");

    if (mainWindow && !mainWindow.isDestroyed()) {
      if (token) {
        // Navigate to URL with token (fallback mechanism)
        const isProd =
          process.env.ELECTRON_PROD === "true" || process.env.NODE_ENV === "production" || !process.defaultApp;
        let tokenUrl: string;

        if (isProd) {
          tokenUrl = `app://./index.html?token=${encodeURIComponent(token)}`;
        } else {
          const port = process.env.PORT || process.env.VITE_PORT || 5173;
          tokenUrl = `http://localhost:${port}/?token=${encodeURIComponent(token)}`;
        }

        mainWindow.loadURL(tokenUrl);

        // Also send via IPC (primary mechanism)
        setTimeout(() => {
          if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send("set-auth-token", token);

            // Retry after delay
            setTimeout(() => {
              if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
                mainWindow.webContents.send("set-auth-token", token);
              }
            }, 500);
          }
        }, 300);
      } else {
        // Fallback to old behavior
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("auth-callback", url);
        }
      }
    }

    // Focus the main window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.show();
    }
  } else {
    // Handle other URLs
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("auth-callback", url);
    }

    // Focus the main window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  }
});

// Monitor browser navigation to capture OAuth callbacks
app.on("web-contents-created", (_event, contents) => {
  contents.on("will-navigate", (_event, navigationUrl) => {
    // Check if this is an OAuth callback URL (Convex Auth uses code parameter)
    if (
      navigationUrl.includes("localhost:5173") &&
      (navigationUrl.includes("code=") || navigationUrl.includes("auth-callback"))
    ) {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("auth-callback", navigationUrl);
      }

      // Focus the main window
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    }
  });
});

// Set as default protocol client for huckepack:// URLs
if (!app.isDefaultProtocolClient("huckepack")) {
  app.setAsDefaultProtocolClient("huckepack");
}

