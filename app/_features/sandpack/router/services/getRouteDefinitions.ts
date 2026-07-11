import type { ThemeMode } from "@application/theme/types";
import type { RouteDefinition } from "../types";

export const getRouteDefinitions = (
  routes: RouteDefinition[],
  _themeMode: ThemeMode,
  viewportWidthMap: Record<string, number> = {},
  _viewportBehaviorMap: Record<string, "auto" | "fixed"> = {}
) => {
  const reference: string[] = [];
  const preview: string[] = [];
  const edit: string[] = [];

  routes.forEach(({ path, component, fileId }) => {
    const normalizedPath = path.replace(/^\/+/, "");
    const viewportWidth = fileId ? (viewportWidthMap[fileId] ?? 390) : 390;

    reference.push(`<Route path="${normalizedPath}" element={<${component} />} />`);
    preview.push(
      `<Route path="/preview/${normalizedPath}" element={<Viewport width={${viewportWidth}} name="${component}" exported><${component} /></Viewport>} />`
    );
    edit.push(
      `<Route path="/edit/${normalizedPath}" element={<Viewport width={${viewportWidth}} name="${component}" exported><${component} /></Viewport>} />`
    );
  });

  return {
    reference,
    preview,
    edit,
  };
};
