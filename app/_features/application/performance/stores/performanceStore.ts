import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { DeepPartialPerformanceMetrics, PerformanceMetrics, PerformanceStore } from "../types";

const initialMetrics: PerformanceMetrics = {
  total: null,
  manipulationPhase: {
    codeToAST: null,
    manipulation: null,
    astToCode: null,
  },
  parsingPhase: {
    parseAST: null,
    parseASTSteps: {
      astTraversal: null,
      imports: null,
      exports: null,
      properties: null,
      returnStatement: null,
    },
  },
  savingPhase: {
    astToCode: {
      transformation: null,
      formatting: null,
    },
    indexedDBSave: null,
    sandpackUpdate: null,
    databaseSave: null,
  },
};

export function calculatePerformanceTotal(metrics: PerformanceMetrics): number | null {
  const manipulationTotal =
    (metrics.manipulationPhase.codeToAST ?? 0) +
    (metrics.manipulationPhase.manipulation ?? 0) +
    (metrics.manipulationPhase.astToCode ?? 0);

  const parsingTotal = metrics.parsingPhase.parseAST ?? 0;

  const savingTotal =
    (metrics.savingPhase.astToCode.transformation ?? 0) +
    (metrics.savingPhase.astToCode.formatting ?? 0) +
    (metrics.savingPhase.indexedDBSave ?? 0) +
    (metrics.savingPhase.sandpackUpdate ?? 0) +
    (metrics.savingPhase.databaseSave ?? 0);

  const total = manipulationTotal + parsingTotal + savingTotal;

  return total > 0 ? total : null;
}

export const usePerformanceStore = create<PerformanceStore>()(
  devtools(
    (set) => ({
      metrics: initialMetrics,
      setMetrics: (newMetrics) =>
        set((state) => {
          const mergedMetrics: PerformanceMetrics = {
            ...state.metrics,
            ...newMetrics,
            total: state.metrics.total,
            manipulationPhase: {
              ...state.metrics.manipulationPhase,
              ...(newMetrics.manipulationPhase || {}),
            },
            parsingPhase: {
              ...state.metrics.parsingPhase,
              ...(newMetrics.parsingPhase || {}),
              parseASTSteps: {
                ...state.metrics.parsingPhase.parseASTSteps,
                ...(newMetrics.parsingPhase?.parseASTSteps || {}),
              },
            },
            savingPhase: {
              ...state.metrics.savingPhase,
              ...(newMetrics.savingPhase || {}),
              astToCode: {
                ...state.metrics.savingPhase.astToCode,
                ...(newMetrics.savingPhase?.astToCode || {}),
              },
            },
          };

          return { metrics: { ...mergedMetrics, total: calculatePerformanceTotal(mergedMetrics) } };
        }),
      resetMetrics: () => set({ metrics: initialMetrics }),
    }),
    { name: "PerformanceStore" }
  )
);

export const setPerformanceMetrics = (metrics: DeepPartialPerformanceMetrics) => {
  usePerformanceStore.getState().setMetrics(metrics);
};
