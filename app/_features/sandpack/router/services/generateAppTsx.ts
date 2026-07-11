import type { ThemeMode } from "@application/theme/types";
import type { ImportDefinition, RouteDefinition } from "../types";
import { getImportStatements } from "./getImportStatements";
import { getRouteDefinitions } from "./getRouteDefinitions";

export function generateAppTsx(
  imports: ImportDefinition[],
  routes: RouteDefinition[],
  tailwindTheme: string,
  themeMode: ThemeMode,
  viewportWidthMap: Record<string, number> = {},
  viewportBehaviorMap: Record<string, "auto" | "fixed"> = {}
): string {
  const importStatements = getImportStatements(imports);
  const routeDefinitions = getRouteDefinitions(routes, themeMode, viewportWidthMap, viewportBehaviorMap);

  const referenceRoutes = routeDefinitions.reference.join("\n            ");
  const previewRoutes = routeDefinitions.preview.join("\n            ");
  const editRoutes = routeDefinitions.edit.join("\n            ");

  const firstRoute = routes[0];
  const defaultViewportWidth = firstRoute?.fileId ? (viewportWidthMap[firstRoute.fileId] ?? 1000) : 1000;
  const defaultCanvasName = "canvas";

  return `
    ${importStatements.join("\n")}

    function AppContent() {
      const navigate = useNavigate();
      const location = useLocation();
      const rootRef = useRef<HTMLDivElement>(null);

      // Listen for messages from parent
      useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
          if (event.data?.source === "application") {
            if (event.data?.action === "navigate" && event.data?.data) {
              navigate(event.data.data);
            }
          }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
      }, [navigate]);

      useEffect(() => {
        const themeContent = \`${tailwindTheme.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`;
        
        // Remove existing theme style if it exists
        const existingStyle = document.querySelector('style[data-theme="tailwind"]');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        const style = document.createElement("style");
        style.setAttribute("type", "text/tailwindcss");
        style.setAttribute("data-theme", "tailwind");
        style.innerHTML = themeContent;

        document.head.appendChild(style);
      });

      useEffect(() => {
        // Inject color-scheme meta tag
        const existingMeta = document.querySelector('meta[name="color-scheme"]');
        if (!existingMeta) {
          const metaTag = document.createElement("meta");
          metaTag.setAttribute("name", "color-scheme");
          metaTag.setAttribute("content", "dark light");
          document.head.appendChild(metaTag);
          
          // Notify parent that meta tag was injected
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(
              {
                source: "sandpack",
                action: "sandpack-ready",
              },
              "*"
            );
          }
        }
      }, []);
      
      return (
        <div ref={rootRef} className="router-container">
          <Routes>
            ${referenceRoutes}
            ${previewRoutes}
            <Route path="/edit" element={
              <CanvasProvider width={20000} height={15000} canvasName="${defaultCanvasName}" viewportWidth={${defaultViewportWidth}}>
                <Outlet />
              </CanvasProvider>
            }>
            ${editRoutes}
            </Route>
          </Routes>
        </div>
      );
    }

    export default function App() {
      return (
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      );
    }
  `.trim();
}
