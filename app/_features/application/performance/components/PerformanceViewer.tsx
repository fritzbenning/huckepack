import { useState } from "react";
import { usePerformanceStore } from "../stores/performanceStore";
import { formatDuration } from "../utils/formatDuration";
import { ExpandableHeader } from "./ExpandableHeader";
import { MetricsPanel } from "./MetricsPanel";

export function PerformanceViewer() {
  const metrics = usePerformanceStore((state) => state.metrics);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMetrics = metrics.total !== null;

  if (!hasMetrics) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 z-50">
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white/95 shadow-lg backdrop-blur-sm dark:border-neutral-750 dark:bg-neutral-850/95">
        <ExpandableHeader isExpanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {formatDuration(metrics.total)}
        </ExpandableHeader>
        {isExpanded && <MetricsPanel metrics={metrics} />}
      </div>
    </div>
  );
}
