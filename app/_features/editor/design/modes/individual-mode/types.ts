export interface IndividualModeConfig {
  unified: string;
  individual: string[];
  axis?: string[];
  compressPriority?: string[];
  extractSuffix?: (className: string, prefix: string) => string | null;
  applySuffix?: (prefix: string, suffix: string | null) => string;
}
