import { MetricRow } from "./MetricRow";

interface MetricGroupProps {
  metrics: Record<string, number | null>;
  labelMap?: Record<string, string>;
}

function formatLabel(key: string, labelMap?: Record<string, string>): string {
  if (labelMap && labelMap[key]) return labelMap[key];
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function MetricGroup({ metrics, labelMap }: MetricGroupProps) {
  return (
    <div className="space-y-1 border-neutral-200 border-l-2 pl-2 dark:border-neutral-750">
      {Object.entries(metrics).map(([key, value]) => (
        <MetricRow key={key} label={formatLabel(key, labelMap)} value={value} indentLevel={1} />
      ))}
    </div>
  );
}
