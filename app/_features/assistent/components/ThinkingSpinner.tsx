import { DotsSpinner } from "@shared/ui-kit/ui/spinners/DotsSpinner";
import type React from "react";

export const ThinkingSpinner: React.FC = () => (
  <div className="mb-4 flex justify-start">
    <div className="flex items-center gap-2">
      <DotsSpinner size="sm" />
      {/* <Orb size="xs" /> */}
      {/* <span className="text-xs text-neutral-500 dark:text-neutral-300">Thinking...</span> */}
    </div>
  </div>
);
