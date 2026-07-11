// OAuth callback tokens
export interface AuthTokens {
  access_token: string | null;
  refresh_token: string | null;
  expires_in: string | null;
  token_type: string | null;
}

// Auth callback status
export type AuthCallbackStatus = "loading" | "success" | "error";

// Auth guard props
export interface AuthGuardProps {
  children: React.ReactNode;
}

// User profile data
export interface UserProfileData {
  image?: string;
  name?: string;
  email?: string;
}

// Repository type for GitHub integration
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  clone_url: string;
  default_branch: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

export interface UserData {
  name?: string | null;
  email?: string | null;
  github_id?: number | null;
  image?: string | null;
  github_app_id?: number | null;
  google_id?: string | null;
}

export interface User extends UserData {
  id: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string | null;
}
