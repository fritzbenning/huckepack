import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  users: defineTable({
    // Convex Auth required fields
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),

    // Custom fields for your app
    githubId: v.optional(v.number()),
    googleId: v.optional(v.string()),
    githubAppId: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    lastSignInAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("by_github_id", ["githubId"])
    .index("by_google_id", ["googleId"])
    .index("by_github_app_id", ["githubAppId"]),

  workspaces: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    createdAt: v.number(),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_name", ["name"]),

  workspaceMembers: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: v.string(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_user_id", ["userId"])
    .index("by_workspace_and_user", ["workspaceId", "userId"]),

  teams: defineTable({
    workspaceId: v.id("workspaces"),
    ownerId: v.id("users"),
    name: v.string(),
    createdAt: v.number(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_owner_id", ["ownerId"])
    .index("by_name", ["name"]),

  teamMembers: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
    role: v.string(),
  })
    .index("by_team_id", ["teamId"])
    .index("by_user_id", ["userId"])
    .index("by_team_and_user", ["teamId", "userId"]),

  projectMembers: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    role: v.string(),
  })
    .index("by_project_id", ["projectId"])
    .index("by_user_id", ["userId"])
    .index("by_project_and_user", ["projectId", "userId"]),

  projects: defineTable({
    teamId: v.id("teams"),
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    sandpackTemplate: v.optional(v.string()),
    tsconfig: v.optional(v.any()),
    tailwindTheme: v.optional(v.id("themes")),
  })
    .index("by_team_id", ["teamId"])
    .index("by_name", ["name"]),

  files: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    type: v.string(),
    extension: v.string(),
    currentVersion: v.number(),
    code: v.string(),
    updatedAt: v.number(),
    lastEditor: v.optional(v.id("users")),
    draft: v.boolean(),
    ownerId: v.optional(v.id("users")),
    tags: v.optional(v.array(v.string())),
    viewportWidth: v.optional(v.number()),
    viewportBehavior: v.optional(v.union(v.literal("auto"), v.literal("fixed"))),
    history: v.optional(
      v.array(
        v.object({
          diff: v.string(),
          timestamp: v.number(),
          userId: v.id("users"),
        })
      )
    ),
    historyPointer: v.optional(v.number()),
    diffCount: v.optional(v.number()),
  })
    .index("by_project_id", ["projectId"])
    .index("by_owner_id", ["ownerId"])
    .index("by_last_editor", ["lastEditor"])
    .index("by_type", ["type"])
    .searchIndex("search_by_name", {
      searchField: "name",
      filterFields: ["projectId"],
    }),

  fileVersions: defineTable({
    fileId: v.id("files"),
    version: v.number(),
    code: v.string(),
    extension: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    userId: v.optional(v.id("users")),
  })
    .index("by_file_id", ["fileId"])
    .index("by_file_and_version", ["fileId", "version"]),

  themes: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    repositoryPath: v.optional(v.string()),
    currentVersion: v.number(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_project_id", ["projectId"])
    .index("by_name", ["name"])
    .index("by_project_and_name", ["projectId", "name"]),

  themeVersions: defineTable({
    themeId: v.id("themes"),
    version: v.number(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_theme_id", ["themeId"])
    .index("by_theme_and_version", ["themeId", "version"]),

  pinnedItems: defineTable({
    userId: v.id("users"),
    entityType: v.union(v.literal("project"), v.literal("file"), v.literal("workspace"), v.literal("team")),
    entityId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_entity", ["entityType", "entityId"])
    .index("by_user_and_entity", ["userId", "entityType", "entityId"]),

  githubInstallations: defineTable({
    githubAppId: v.number(),
    createdAt: v.number(),
  }).index("by_github_app_id", ["githubAppId"]),

  presence: defineTable({
    projectId: v.id("projects"),
    userId: v.id("users"),
    sessionId: v.string(),
    username: v.string(),
    lastSeen: v.number(),
  })
    .index("by_project_id", ["projectId"])
    .index("by_user_id", ["userId"])
    .index("by_session_id", ["sessionId"])
    .index("by_project_and_session", ["projectId", "sessionId"]),

  chatContext: defineTable({
    sessionId: v.string(),
    selectedNode: v.union(v.string(), v.null()),
    tailwindTheme: v.string(),
    componentCode: v.string(),
    componentName: v.string(),
    componentFramework: v.union(v.literal("react"), v.literal("vue")),
    lastUpdated: v.number(),
  }).index("by_session_id", ["sessionId"]),
});
