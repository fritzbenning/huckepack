import type { PerformanceMetrics } from "../types";
import { MetricGroup } from "./MetricGroup";
import { MetricRow } from "./MetricRow";

interface MetricsPanelProps {
  metrics: PerformanceMetrics;
}

const manipulationPhaseLabelMap: Record<string, string> = {
  codeToAST: "Code → AST",
  manipulation: "Manipulation",
  astToCode: "AST → Code",
};

const parseASTStepsLabelMap: Record<string, string> = {
  astTraversal: "AST Traversal",
  imports: "Imports",
  exports: "Exports",
  properties: "Properties",
  returnStatement: "Return Statement",
};

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <div className="border-neutral-200 border-t p-3 dark:border-neutral-750">
      <div className="space-y-2 text-xs">
        <div className="font-semibold text-neutral-750 dark:text-neutral-300">Performance Metrics</div>
        <div className="space-y-1.5 font-mono text-neutral-600 dark:text-neutral-400">
          <MetricRow label="Total" value={metrics.total} isHighlighted />
          <div className="space-y-1 border-neutral-200 border-l-2 pl-2 dark:border-neutral-750">
            <div className="pt-1 font-semibold text-neutral-750 dark:text-neutral-300">Manipulation Phase</div>
            <MetricGroup metrics={metrics.manipulationPhase} labelMap={manipulationPhaseLabelMap} />
          </div>
          <div className="space-y-1 border-neutral-200 border-l-2 pl-2 dark:border-neutral-750">
            <div className="pt-1 font-semibold text-neutral-750 dark:text-neutral-300">Parsing Phase</div>
            <MetricRow label="Parse AST" value={metrics.parsingPhase.parseAST} />
            <MetricGroup metrics={metrics.parsingPhase.parseASTSteps} labelMap={parseASTStepsLabelMap} />
          </div>
          <div className="space-y-1 border-neutral-200 border-l-2 pl-2 dark:border-neutral-750">
            <div className="pt-1 font-semibold text-neutral-750 dark:text-neutral-300">Saving Phase</div>
            <div className="space-y-1">
              <div className="space-y-1 border-neutral-200 border-l-2 pl-2 dark:border-neutral-750">
                <MetricRow
                  label="Transformation"
                  value={metrics.savingPhase.astToCode.transformation}
                  indentLevel={1}
                />
                <MetricRow label="Formatting" value={metrics.savingPhase.astToCode.formatting} indentLevel={1} />
                <MetricRow label="IndexedDB Save" value={metrics.savingPhase.indexedDBSave} indentLevel={1} />
                <MetricRow label="Sandpack Update" value={metrics.savingPhase.sandpackUpdate} indentLevel={1} />
                <MetricRow label="Database Save" value={metrics.savingPhase.databaseSave} indentLevel={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
