export interface ThemeData {
  name: string;
  project_id?: string | null;
  repository_path?: string | null;
  current_version_id?: string | null;
}

export interface Theme extends ThemeData {
  id: string;
  created_at: string;
}

export interface ThemeVersionData {
  version: number;
  theme_id?: string | null;
  content: string;
}

export interface ThemeVersion extends ThemeVersionData {
  id: string;
  created_at: string;
}

export interface ThemeWithVersion extends Theme {
  current_version?: {
    id: number;
    content: string;
  } | null;
}
