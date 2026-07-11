import { api } from "@convex/_generated/api";
import { useCurrentUser } from "@hub/auth/hooks/useCurrentUser";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useGitHubCallback() {
  const currentUser = useCurrentUser();
  const updateGitHubAppId = useMutation(api.users.updateGitHubAppId);
  const upsertInstallation = useMutation(api.githubInstallations.upsert);
  const [githubAppId, setGitHubAppId] = useState<string | null>(null);
  const [transmitted, setTransmitted] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlgithubAppId = urlParams.get("installation_id");
    if (urlgithubAppId) {
      setGitHubAppId(urlgithubAppId);
    }
  }, []);

  useEffect(() => {
    if (!githubAppId || !currentUser?.convexUser || transmitted) {
      return;
    }

    const upsertUserWithGitHubApp = async () => {
      try {
        const githubAppIdNum = parseInt(githubAppId, 10);

        // Update GitHub installation record
        await upsertInstallation({ githubAppId: githubAppIdNum });

        // Update user with GitHub App ID
        const existingUser = currentUser?.convexUser;
        if (!existingUser) {
          console.error("No authenticated user available");
          return;
        }

        const userId = await updateGitHubAppId({
          userId: existingUser._id,
          githubAppId: githubAppIdNum,
        });

        if (userId) {
          setTransmitted(true);
          toast.success("GitHub App installed successfully");

          const url = new URL(window.location.href);
          url.searchParams.delete("installation_id");
          url.searchParams.delete("setup_action");
          url.searchParams.delete("code");
          window.history.replaceState({}, document.title, url.pathname + url.search);
        } else {
          console.error("Failed to update user GitHub App ID");
        }
      } catch (error) {
        console.error("Error upserting user with GitHub App:", error);
        toast.error("Failed to install GitHub App");
      }
    };

    upsertUserWithGitHubApp();
  }, [githubAppId, currentUser?.convexUser, transmitted, updateGitHubAppId, upsertInstallation]);

  return {
    isHandlingCallback: new URLSearchParams(window.location.search).has("installation_id"),
    githubAppId,
    transmitted,
  };
}
