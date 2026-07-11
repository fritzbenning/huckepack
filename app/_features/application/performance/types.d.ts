export interface PerformanceMetrics {
  total: number | null;
  manipulationPhase: {
    codeToAST: number | null;
    manipulation: number | null;
    astToCode: number | null;
  };
  parsingPhase: {
    parseAST: number | null;
    parseASTSteps: {
      astTraversal: number | null;
      imports: number | null;
      exports: number | null;
      properties: number | null;
      returnStatement: number | null;
    };
  };
  savingPhase: {
    astToCode: {
      transformation: number | null;
      formatting: number | null;
    };
    indexedDBSave: number | null;
    sandpackUpdate: number | null;
    databaseSave: number | null;
  };
}

export interface PerformanceStore {
  metrics: PerformanceMetrics;
  setMetrics: (metrics: Partial<PerformanceMetrics>) => void;
  resetMetrics: () => void;
}
