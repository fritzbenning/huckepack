import type { ImportDefinition } from "./types";

export const defaultImports: ImportDefinition[] = [
  { from: "react", default: "React", what: ["useRef", "useEffect"] },
  { from: "react-router-dom", what: ["BrowserRouter", "Routes", "Route", "useNavigate", "useLocation", "Outlet"] },
  { from: "./toolkit/PreviewContainer", default: "PreviewContainer" },
  { from: "@markup-canvas/react", what: ["MarkupCanvas", "useMarkupCanvas"] },
  { from: "@markup-canvas/core", what: ["EDITOR_PRESET"] },
  { from: "./toolkit/styles.css" },
  { from: "@node-edit-utils/react", what: ["CanvasProvider", "Viewport"] },
  { from: "@node-edit-utils/core/styles.css" },
];

export const externalResources: string[] = [
  "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Instrument+Serif:ital@0;1&display=swap",
];
