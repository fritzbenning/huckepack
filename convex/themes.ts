import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { requireProjectAccess } from "./lib/access";
import { getUserIdOrThrow } from "./lib/auth";

const DEFAULT_TAILWIND_THEME = `@import "tailwindcss";

/* Custom Theme */
@theme {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  --color-primary-950: #172554;

  --color-secondary: #8b5cf6;
  --color-secondary-50: #faf5ff;
  --color-secondary-100: #f3e8ff;
  --color-secondary-200: #e9d5ff;
  --color-secondary-300: #d8b4fe;
  --color-secondary-400: #c084fc;
  --color-secondary-500: #a855f7;
  --color-secondary-600: #9333ea;
  --color-secondary-700: #7e22ce;
  --color-secondary-800: #6b21a8;
  --color-secondary-900: #581c87;
  --color-secondary-950: #3b0764;

  /* Spacing - Tailwind defaults */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-0_5: 0.125rem;
  --spacing-1: 0.25rem;
  --spacing-1_5: 0.375rem;
  --spacing-2: 0.5rem;
  --spacing-2_5: 0.625rem;
  --spacing-3: 0.75rem;
  --spacing-3_5: 0.875rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-7: 1.75rem;
  --spacing-8: 2rem;
  --spacing-9: 2.25rem;
  --spacing-10: 2.5rem;
  --spacing-11: 2.75rem;
  --spacing-12: 3rem;
  --spacing-14: 3.5rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;
  --spacing-28: 7rem;
  --spacing-32: 8rem;
  --spacing-36: 9rem;
  --spacing-40: 10rem;
  --spacing-44: 11rem;
  --spacing-48: 12rem;
  --spacing-52: 13rem;
  --spacing-56: 14rem;
  --spacing-60: 15rem;
  --spacing-64: 16rem;
  --spacing-72: 18rem;
  --spacing-80: 20rem;
  --spacing-96: 24rem;

  /* Font sizes - Tailwind defaults */
  --font-size-xs: 0.75rem;
  --font-size-xs--line-height: 1rem;
  --font-size-sm: 0.875rem;
  --font-size-sm--line-height: 1.25rem;
  --font-size-base: 1rem;
  --font-size-base--line-height: 1.5rem;
  --font-size-lg: 1.125rem;
  --font-size-lg--line-height: 1.75rem;
  --font-size-xl: 1.25rem;
  --font-size-xl--line-height: 1.75rem;
  --font-size-2xl: 1.5rem;
  --font-size-2xl--line-height: 2rem;
  --font-size-3xl: 1.875rem;
  --font-size-3xl--line-height: 2.25rem;
  --font-size-4xl: 2.25rem;
  --font-size-4xl--line-height: 2.5rem;
  --font-size-5xl: 3rem;
  --font-size-5xl--line-height: 1;
  --font-size-6xl: 3.75rem;
  --font-size-6xl--line-height: 1;
  --font-size-7xl: 4.5rem;
  --font-size-7xl--line-height: 1;
  --font-size-8xl: 6rem;
  --font-size-8xl--line-height: 1;
  --font-size-9xl: 8rem;
  --font-size-9xl--line-height: 1;

  /* Border radius - Tailwind defaults */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-DEFAULT: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* Font weights - Tailwind defaults */
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;

  /* Line heights - Tailwind defaults */
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  /* Letter spacing - Tailwind defaults */
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
}`;

export const list = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId);

    return await ctx.db
      .query("themes")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const get = query({
  args: { themeId: v.id("themes") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    const theme = await ctx.db.get(args.themeId);
    if (!theme) {
      return null;
    }

    await requireProjectAccess(ctx, theme.projectId, userId);
    return theme;
  },
});

export const getWithVersion = query({
  args: { themeId: v.id("themes") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    const theme = await ctx.db.get(args.themeId);
    if (!theme) {
      return null;
    }

    await requireProjectAccess(ctx, theme.projectId, userId);

    return {
      ...theme,
      currentContent: theme.content,
    };
  },
});

export const getTailwindThemeForProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return null;
    }

    if (!project.tailwindTheme) {
      return null;
    }

    const theme = await ctx.db.get(project.tailwindTheme);
    if (!theme) {
      return null;
    }

    return {
      ...theme,
      currentContent: theme.content,
    };
  },
});

export const getTailwindThemeForProjectInternal = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      return null;
    }

    if (!project.tailwindTheme) {
      return null;
    }

    const theme = await ctx.db.get(project.tailwindTheme);
    if (!theme) {
      return null;
    }

    return {
      ...theme,
      currentContent: theme.content,
    };
  },
});

export const getTailwindThemeVersionForProject = query({
  args: {
    projectId: v.id("projects"),
    version: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId);

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      return null;
    }

    if (!project.tailwindTheme) {
      return null;
    }

    const theme = await ctx.db.get(project.tailwindTheme);
    if (!theme) {
      return null;
    }

    const requestedVersion = args.version ?? 1;

    if (requestedVersion === theme.currentVersion) {
      return {
        ...theme,
        currentContent: theme.content,
        version: theme.currentVersion,
      };
    }

    const themeVersion = await ctx.db
      .query("themeVersions")
      .withIndex("by_theme_and_version", (q) => q.eq("themeId", project.tailwindTheme!).eq("version", requestedVersion))
      .first();

    if (!themeVersion) {
      return null;
    }

    return {
      ...theme,
      currentContent: themeVersion.content,
      version: themeVersion.version,
    };
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    repositoryPath: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId, "editor");

    const now = Date.now();

    const themeId = await ctx.db.insert("themes", {
      projectId: args.projectId,
      name: args.name,
      repositoryPath: args.repositoryPath,
      currentVersion: 1,
      content: args.content,
      createdAt: now,
    });

    await ctx.db.insert("themeVersions", {
      themeId,
      version: 1,
      content: args.content,
      createdAt: now,
    });

    return themeId;
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("themes")),
    data: v.object({
      projectId: v.id("projects"),
      name: v.string(),
      repositoryPath: v.optional(v.string()),
      content: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.data.projectId, userId, "editor");

    const now = Date.now();

    if (args.id) {
      const existing = await ctx.db.get(args.id);
      if (!existing) {
        throw new Error("Theme not found");
      }

      await requireProjectAccess(ctx, existing.projectId, userId, "editor");

      await ctx.db.replace(args.id, {
        projectId: existing.projectId,
        name: args.data.name,
        repositoryPath: args.data.repositoryPath ?? undefined,
        currentVersion: existing.currentVersion,
        content: args.data.content,
        createdAt: existing.createdAt,
      });

      return args.id;
    }

    const themeId = await ctx.db.insert("themes", {
      projectId: args.data.projectId,
      name: args.data.name,
      repositoryPath: args.data.repositoryPath,
      currentVersion: 1,
      content: args.data.content,
      createdAt: now,
    });

    await ctx.db.insert("themeVersions", {
      themeId,
      version: 1,
      content: args.data.content,
      createdAt: now,
    });

    return themeId;
  },
});

export const update = mutation({
  args: {
    id: v.id("themes"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    const theme = await ctx.db.get(args.id);
    if (!theme) {
      throw new Error("Theme not found");
    }

    await requireProjectAccess(ctx, theme.projectId, userId, "editor");

    await ctx.db.replace(args.id, {
      projectId: theme.projectId,
      name: theme.name,
      repositoryPath: theme.repositoryPath ?? undefined,
      currentVersion: theme.currentVersion,
      content: args.content,
      createdAt: theme.createdAt,
    });
  },
});

export const delete_ = mutation({
  args: {
    id: v.id("themes"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    const theme = await ctx.db.get(args.id);
    if (!theme) {
      throw new Error("Theme not found");
    }

    await requireProjectAccess(ctx, theme.projectId, userId, "admin");

    // Delete all theme versions first
    const themeVersions = await ctx.db
      .query("themeVersions")
      .withIndex("by_theme_id", (q) => q.eq("themeId", args.id))
      .collect();

    for (const version of themeVersions) {
      await ctx.db.delete(version._id);
    }

    // Delete the theme
    await ctx.db.delete(args.id);
  },
});

export const cleanupProjectThemes = internalMutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    // Get all themes for this project
    const themes = await ctx.db
      .query("themes")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Delete all theme versions and themes
    for (const theme of themes) {
      // Delete all versions for this theme
      const themeVersions = await ctx.db
        .query("themeVersions")
        .withIndex("by_theme_id", (q) => q.eq("themeId", theme._id))
        .collect();

      for (const version of themeVersions) {
        await ctx.db.delete(version._id);
      }

      // Delete the theme
      await ctx.db.delete(theme._id);
    }
  },
});

export const ensureTailwindThemeExists = internalMutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const existingThemes = await ctx.db
      .query("themes")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .collect();

    const defaultTheme = existingThemes.find((theme) => theme.name === "default");

    if (defaultTheme) {
      return defaultTheme._id;
    }

    const now = Date.now();

    const themeId = await ctx.db.insert("themes", {
      projectId: args.projectId,
      name: "default",
      repositoryPath: "src/theme.css",
      currentVersion: 1,
      content: DEFAULT_TAILWIND_THEME,
      createdAt: now,
    });

    await ctx.db.insert("themeVersions", {
      themeId,
      version: 1,
      content: DEFAULT_TAILWIND_THEME,
      createdAt: now,
    });

    return themeId;
  },
});

export const updateTailwindThemeForProjectInternal = internalMutation({
  args: {
    projectId: v.id("projects"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    let themeId = project.tailwindTheme;

    if (!themeId) {
      themeId = await ctx.runMutation(internal.themes.ensureTailwindThemeExists, {
        projectId: args.projectId,
      });

      await ctx.db.patch(args.projectId, {
        tailwindTheme: themeId,
      });
    }

    if (!themeId) {
      throw new Error("Theme not found");
    }

    const theme = await ctx.db.get(themeId);
    if (!theme) {
      throw new Error("Theme not found");
    }

    await ctx.db.replace(themeId, {
      projectId: theme.projectId,
      name: theme.name,
      repositoryPath: theme.repositoryPath ?? undefined,
      currentVersion: theme.currentVersion,
      content: args.content,
      createdAt: theme.createdAt,
    });

    return args.content;
  },
});
