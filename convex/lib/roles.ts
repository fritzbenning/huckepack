export type WorkspaceRole = "owner" | "admin" | "member";
export type TeamRole = "owner" | "admin" | "editor" | "member";

const WORKSPACE_ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  owner: 3,
  admin: 2,
  member: 1,
};

const TEAM_ROLE_HIERARCHY: Record<TeamRole, number> = {
  owner: 4,
  admin: 3,
  editor: 2,
  member: 1,
};

export function hasWorkspaceRole(
  userRole: WorkspaceRole | null,
  minRole: WorkspaceRole
): boolean {
  if (!userRole) return false;
  return WORKSPACE_ROLE_HIERARCHY[userRole] >= WORKSPACE_ROLE_HIERARCHY[minRole];
}

export function hasTeamRole(
  userRole: TeamRole | null,
  minRole: TeamRole
): boolean {
  if (!userRole) return false;
  return TEAM_ROLE_HIERARCHY[userRole] >= TEAM_ROLE_HIERARCHY[minRole];
}

export function isWorkspaceOwner(role: WorkspaceRole | null): boolean {
  return role === "owner";
}

export function isTeamOwner(role: TeamRole | null): boolean {
  return role === "owner";
}

