import type { Repository } from "@hub/auth";
import { useCurrentUser } from "@hub/auth";
import { getBackendUrl } from "@lib/utils/getBackendUrl";
import { useCallback, useEffect, useState } from "react";

export function useUserRepositories() {
  const { convexUser, githubAppId } = useCurrentUser();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if GitHub App is installed
  const hasGitHubToken = !!githubAppId;

  const fetchRepositories = useCallback(async () => {
    if (!convexUser?._id) {
      setError("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Use our GitHub App API endpoint instead of calling GitHub directly
      const backendUrl = getBackendUrl();
      const apiUrl = `${backendUrl}/api/github/repositories`;

      const response = await fetch(apiUrl, {
        headers: {
          "X-User-ID": convexUser._id,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle specific GitHub App installation error
        if (response.status === 404 && errorData.error === "GitHub App not installed") {
          setError("GitHub App not installed. Please install the GitHub App to access repositories.");
          return;
        }

        throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      const repositoriesList: Repository[] = data.repositories;
      setRepositories(repositoriesList);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch repositories";
      console.error("fetchRepositories: Error:", error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [convexUser?._id]);

  // Auto-fetch repositories when the hook is first used and user is authenticated
  useEffect(() => {
    if (convexUser?._id && hasGitHubToken) {
      fetchRepositories();
    }
  }, [fetchRepositories, convexUser?._id, hasGitHubToken]);

  return {
    repositories,
    loading,
    error,
    hasGitHubToken,
    fetchRepositories,
    refetch: fetchRepositories,
  };
}

export type { Repository };
