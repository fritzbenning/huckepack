/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.tsx?raw" {
  const content: string;
  export default content;
}

declare module "*.ts?raw" {
  const content: string;
  export default content;
}

declare module "*.html?raw" {
  const content: string;
  export default content;
}

declare module "*.css?raw" {
  const content: string;
  export default content;
}

declare module "*.svg?react" {
  import React from "react";
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// Polyfill declarations for Node.js globals in browser
declare const global: typeof globalThis;
declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}
