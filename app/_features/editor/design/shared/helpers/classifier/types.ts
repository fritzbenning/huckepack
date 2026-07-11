export interface ClassificationRule {
  name: string;
  property: string;
  matches: (className: string) => boolean;
}

export interface ClassClassifier {
  prefix: string;
  rules: ClassificationRule[];
  classify(className: string): string | null;
  belongsTo(className: string, property: string): boolean;
}
