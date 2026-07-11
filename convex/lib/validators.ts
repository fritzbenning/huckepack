import { v } from "convex/values";

export const workspaceRoleValidator = v.union(
  v.literal("owner"),
  v.literal("admin"),
  v.literal("member")
);

export const teamRoleValidator = v.union(
  v.literal("owner"),
  v.literal("admin"),
  v.literal("editor"),
  v.literal("member")
);

export const entityTypeValidator = v.union(
  v.literal("project"),
  v.literal("file"),
  v.literal("workspace"),
  v.literal("team")
);

