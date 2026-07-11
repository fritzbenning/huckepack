export interface DesignPropertyComponentProps {
  projectId: string;
  fileId: string;
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  astPosition: number | null;
}
