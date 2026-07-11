import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../app/shared/ui-kit/**/*.stories.@(ts|tsx)"],
  addons: ["@chromatic-com/storybook", "@storybook/addon-vitest", "@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@application": path.resolve(__dirname, "../app/_features/application"),
      "@ast": path.resolve(__dirname, "../app/_features/ast"),
      "@assistent": path.resolve(__dirname, "../app/_features/assistent"),
      "@editor": path.resolve(__dirname, "../app/_features/editor"),
      "@hub": path.resolve(__dirname, "../app/_features/hub"),
      "@project": path.resolve(__dirname, "../app/_features/project"),
      "@sandpack": path.resolve(__dirname, "../app/_features/sandpack"),
      "@repo": path.resolve(__dirname, "../app/_features/repo"),
      "@keyboard-shortcuts": path.resolve(__dirname, "../app/_features/keyboard-shortcuts"),
      "@pages": path.resolve(__dirname, "../app/pages"),
      "@assets": path.resolve(__dirname, "../app/assets"),
      "@hooks": path.resolve(__dirname, "../app/hooks"),
      "@lib": path.resolve(__dirname, "../app/lib"),
      "@stores": path.resolve(__dirname, "../app/stores"),
      "@utils": path.resolve(__dirname, "../app/utils"),
      "@shared": path.resolve(__dirname, "../app/shared"),
      "@styles": path.resolve(__dirname, "../app/shared/styles"),
      "@convex": path.resolve(__dirname, "../convex"),
      "@app-types": path.resolve(__dirname, "../app/types"),
      "@shread/ui-kit": path.resolve(__dirname, "../app/shared/ui-kit"),
    };
    return config;
  },
};

export default config;
