export interface Team {
  id: string;
  workspace_id: string;
  owner_id: string | null;
  name: string;
  created_at: string;
}

export interface TeamMember {
  team_id: string;
  user_id: string;
  role: string | null;
}

export interface TeamData {
  workspace_id: string;
  owner_id: string | null;
  name: string;
}

export interface TeamMemberData {
  team_id: string;
  user_id: string;
  role: string | null;
}
