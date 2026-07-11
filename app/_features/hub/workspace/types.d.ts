export interface Workspace {
  id: string;
  name: string;
  owner_id: string | null;
  created_at: string;
}
export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: string;
  created_at: string;
}
export interface WorkspaceData {
  name: string;
  owner_id?: string | null;
}

export interface WorkspaceMemberData {
  workspace_id: string;
  user_id: string;
  role?: string | null;
}

export interface WorkspaceMember extends WorkspaceMemberData {}
