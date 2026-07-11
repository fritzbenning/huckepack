import { useMemo } from "react";
import { externalResources } from "../../../sandpack/router/constants";

export function useExternalResources() {
  return useMemo(() => externalResources, []);
}

export default useExternalResources;
