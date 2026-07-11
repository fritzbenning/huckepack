/// <reference types="vitest/config" />
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";
import svgr from "vite-plugin-svgr";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

const dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    wasm(),
    topLevelAwait(),
    electron([
      {
        entry: "electron/main.ts",
        vite: {
          build: {
            outDir: "dist/desktop-app",
          },
        },
      },
      {
        entry: "electron/preload.ts",
        vite: {
          build: {
            outDir: "dist/desktop-app",
          },
        },
        onstart(options) {
          options.reload();
        },
      },
    ]),
  ],
  define: {
    global: "globalThis",
    "process.env": {},
    "process.platform": JSON.stringify(process.platform),
    "process.version": JSON.stringify(process.version),
    "process.versions": JSON.stringify(process.versions),
    // Removed module and exports definitions to allow CommonJS modules to work properly
    // Vite will handle CommonJS to ESM transformation automatically
  },
  ssr: {
    noExternal: ["oxc-parser", "oxc-transform", "@swc/wasm"],
  },
  resolve: {
    alias: {
      "@application": path.resolve(__dirname, "./app/_features/application"),
      "@ast": path.resolve(__dirname, "./app/_features/ast"),
      "@assistent": path.resolve(__dirname, "./app/_features/assistent"),
      "@editor": path.resolve(__dirname, "./app/_features/editor"),
      "@hub": path.resolve(__dirname, "./app/_features/hub"),
      "@project": path.resolve(__dirname, "./app/_features/project"),
      "@sandpack": path.resolve(__dirname, "./app/_features/sandpack"),
      "@repo": path.resolve(__dirname, "./app/_features/repo"),
      "@keyboard-shortcuts": path.resolve(__dirname, "./app/_features/keyboard-shortcuts"),
      "@pages": path.resolve(__dirname, "./app/pages"),
      "@assets": path.resolve(__dirname, "./app/assets"),
      "@hooks": path.resolve(__dirname, "./app/hooks"),
      "@lib": path.resolve(__dirname, "./app/lib"),
      "@stores": path.resolve(__dirname, "./app/stores"),
      "@utils": path.resolve(__dirname, "./app/utils"),
      "@shared": path.resolve(__dirname, "./app/shared"),
      "@convex": path.resolve(__dirname, "./convex"),
      "@app-types": path.resolve(__dirname, "./app/types"),
    },
  },
  optimizeDeps: {
    exclude: [
      "electron",
      // OXC WASM bindings
      "oxc-parser",
      "oxc-transform",
      "@oxc-parser/binding-wasm32-wasi",
      "@oxc-transform/binding-wasm32-wasi",
      // SWC WASM modules
      "@swc/wasm",
      "@swc/wasm-web",
      // AssemblyScript WASM
      "@assemblyscript/loader",
    ],
    include: ["cookie"],
  },
  server: {
    port: 5173,
    fs: {
      allow: [".."],
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  assetsInclude: ["**/*.wasm"],
  build: {
    outDir: "dist/web",
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/, /cookie/],
      defaultIsModuleExports: "auto",
    },
    rollupOptions: {
      external: [],
      // Ensure WASM files are properly handled in production builds
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".wasm")) {
            return "wasm/[name]-[hash][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/.storybook/**", "**/dist/**", "**/dist-app/**", "**/*.stories.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    projects: [
      {
        test: {
          name: "unit",
          globals: true,
          environment: "node",
          include: ["**/*.{test,spec}.{ts,tsx}"],
          exclude: ["**/node_modules/**", "**/.storybook/**", "**/dist/**", "**/dist-app/**", "**/*.stories.{ts,tsx}"],
          setupFiles: ["./vitest.setup.ts"],
        },
        resolve: {
          alias: {
            "@application": path.resolve(__dirname, "./app/_features/application"),
            "@ast": path.resolve(__dirname, "./app/_features/ast"),
            "@assistent": path.resolve(__dirname, "./app/_features/assistent"),
            "@editor": path.resolve(__dirname, "./app/_features/editor"),
            "@hub": path.resolve(__dirname, "./app/_features/hub"),
            "@project": path.resolve(__dirname, "./app/_features/project"),
            "@sandpack": path.resolve(__dirname, "./app/_features/sandpack"),
            "@repo": path.resolve(__dirname, "./app/_features/repo"),
            "@keyboard-shortcuts": path.resolve(__dirname, "./app/_features/keyboard-shortcuts"),
            "@pages": path.resolve(__dirname, "./app/pages"),
            "@assets": path.resolve(__dirname, "./app/assets"),
            "@hooks": path.resolve(__dirname, "./app/hooks"),
            "@lib": path.resolve(__dirname, "./app/lib"),
            "@stores": path.resolve(__dirname, "./app/stores"),
            "@utils": path.resolve(__dirname, "./app/utils"),
            "@shared": path.resolve(__dirname, "./app/shared"),
            "@convex": path.resolve(__dirname, "./convex"),
            "@app-types": path.resolve(__dirname, "./app/types"),
          },
        },
      },
      {

        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
