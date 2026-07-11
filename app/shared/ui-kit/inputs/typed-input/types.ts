export interface TypedInputType {
  kind: string;
  unionOptions?: (string | number)[] | null;
}

export interface TypedInputProps {
  type: TypedInputType;
  value: string | number | boolean | null;
  onChange: (value: string | number | boolean) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  dimension?: "small" | "medium" | "large";
  tone?: "subtle" | "emphasized";
  projectId?: string;
  fileId?: string;
}

