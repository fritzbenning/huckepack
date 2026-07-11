import { v } from "convex/values";
import { api } from "../_generated/api";
import { action } from "../_generated/server";
import { getUserIdFromAction } from "../lib/auth";

async function getInstallationOctokit(githubAppId: number) {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

  if (!appId || !privateKey) {
    throw new Error("GitHub App configuration is missing");
  }

  const { App } = await import("@octokit/app");
  const app = new App({
    appId,
    privateKey,
  });

  return await app.getInstallationOctokit(githubAppId);
}

export const getRepositories = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdFromAction(ctx);
    const user = await ctx.runQuery(api.users.get, { userId });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.githubAppId) {
      throw new Error("GitHub App not installed for this user");
    }

    const octokit = await getInstallationOctokit(user.githubAppId);

    const { data } = await octokit.request("GET /installation/repositories");

    return {
      repositories: data.repositories,
      count: data.repositories.length,
      source: "github-app",
      totalCount: data.total_count,
    };
  },
});

export const getFileContent = action({
  args: {
    owner: v.string(),
    repo: v.string(),
    path: v.string(),
    ref: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdFromAction(ctx);
    const user = await ctx.runQuery(api.users.get, { userId });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.githubAppId) {
      throw new Error("GitHub App not installed for this user");
    }

    const octokit = await getInstallationOctokit(user.githubAppId);

    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: args.owner,
      repo: args.repo,
      path: args.path,
      ref: args.ref || "main",
    });

    if (Array.isArray(data)) {
      throw new Error("Path is a directory, not a file");
    }

    if (data.type !== "file" || !("content" in data)) {
      throw new Error("Path is not a regular file");
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8");

    return {
      content,
      path: args.path,
      owner: args.owner,
      repo: args.repo,
      ref: args.ref || "main",
      sha: data.sha,
      size: data.size,
    };
  },
});

export const getRepositoriesByUserId = action({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.get, { userId: args.userId });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.githubAppId) {
      throw new Error("GitHub App not installed for this user");
    }

    const octokit = await getInstallationOctokit(user.githubAppId);

    const { data } = await octokit.request("GET /installation/repositories");

    return {
      repositories: data.repositories,
      count: data.repositories.length,
      source: "github-app",
      totalCount: data.total_count,
    };
  },
});

export const getFileContentByUserId = action({
  args: {
    userId: v.id("users"),
    owner: v.string(),
    repo: v.string(),
    path: v.string(),
    ref: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(api.users.get, { userId: args.userId });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.githubAppId) {
      throw new Error("GitHub App not installed for this user");
    }

    const octokit = await getInstallationOctokit(user.githubAppId);

    const { data } = await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: args.owner,
      repo: args.repo,
      path: args.path,
      ref: args.ref || "main",
    });

    if (Array.isArray(data)) {
      throw new Error("Path is a directory, not a file");
    }

    if (data.type !== "file" || !("content" in data)) {
      throw new Error("Path is not a regular file");
    }

    const content = Buffer.from(data.content, "base64").toString("utf-8");

    return {
      content,
      path: args.path,
      owner: args.owner,
      repo: args.repo,
      ref: args.ref || "main",
      sha: data.sha,
      size: data.size,
    };
  },
});
