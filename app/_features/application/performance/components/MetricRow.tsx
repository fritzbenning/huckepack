import { cn } from "@lib/utils";
import { formatDuration } from "../utils/formatDuration";

interface MetricRowProps {
  label: string;
  value: number | null;
  isHighlighted?: boolean;
  indentLevel?: number;
}

export function MetricRow({ label, value, isHighlighted = false, indentLevel = 0 }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={cn("text-left", indentLevel > 0 && "pl-2")}>{label}</span>
      <span className={isHighlighted ? "font-semibold" : ""}>{formatDuration(value)}</span>
    </div>
  );
}

