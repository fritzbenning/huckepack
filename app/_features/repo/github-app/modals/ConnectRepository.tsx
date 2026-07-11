import { useUserRepositories } from "@hooks/repo/useUserRepositories";
import { useCurrentUser } from "@hub/auth";
import { ArrowClockwise, GithubLogo } from "@phosphor-icons/react";
import type { ModalProps } from "@shared/modal/types";
import { Input } from "@shared/ui-kit/inputs/input/Input";
import { Heading } from "@shared/ui-kit/typo";
import Button from "@shared/ui-kit/ui/Button";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { Spinner } from "@shared/ui-kit/ui/Spinner";
import { useState } from "react";
import { RepositoryList } from "../components/RepositoryList";
import { handleInstallGitHubApp } from "../services/handleInstallGitHubApp";

interface ConnectRepositoryProps extends ModalProps<"repo.connect"> {}

export function ConnectRepository({ isOpen, onClose }: ConnectRepositoryProps) {
  const { repositories, loading, error, fetchRepositories } = useUserRepositories();
  const { githubAppId } = useCurrentUser();
  const [search, setSearch] = useState("");

  const handleSelectRepository = (repository: { id: number; name: string; full_name: string }) => {
    onClose();
  };

  if (!githubAppId) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} contentPadding={false} title="Connect Repository" size="md">
        <div className="py-5">
          <div className="px-5">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary-100 dark:bg-neutral-750">
                <GithubLogo className="size-6 text-primary-600 dark:text-white" weight="duotone" />
              </div>
              <Heading as="h2" variant="h2" className="mb-1">
                First connect your GitHub Account
              </Heading>
              <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
                Install our GitHub App to access your repositories.
              </p>
            </div>

            <div className="flex w-full gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleInstallGitHubApp} className="flex flex-1 items-center justify-center gap-2">
                Install GitHub App
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  if (loading) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        contentPadding={false}
        title="Connect Repository"
        icon={GithubLogo}
        size="md"
      >
        <div className="py-5">
          <div className="flex flex-col items-center justify-center gap-4 px-5 py-8">
            <Spinner />
            <p className="text-sm text-neutral-500">Loading repositories...</p>
          </div>
        </div>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        contentPadding={false}
        title="Connect Repository"
        icon={GithubLogo}
        size="md"
      >
        <div className="py-5">
          <div className="flex flex-col gap-4 px-5">
            <div className="text-center">
              <Heading as="h2" variant="h2" className="mb-2 text-red-600 dark:text-red-400">
                Error Loading Repositories
              </Heading>
              <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">{error}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchRepositories} className="flex items-center gap-2">
                <ArrowClockwise className="h-4 w-4" weight="duotone" />
                Retry
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      contentPadding={false}
      title="Select Repository"
      icon={GithubLogo}
      size="xl"
    >
      <div className="flex max-h-[80vh] flex-col py-5">
        <div className="space-y-4 px-5">
          <p className="font-medium text-sm text-neutral-600 dark:text-neutral-400">
            Choose a repository to connect to your project.
          </p>
          <Input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(value) => setSearch(value)}
            className="w-full"
            tone="emphasized"
            dimension="large"
            instant
          />
        </div>

        <div className="mt-5 flex-1 overflow-y-auto border-neutral-200 border-t bg-neutral-100 px-5 dark:border-neutral-750 dark:bg-neutral-950">
          <RepositoryList
            repositories={repositories || []}
            onSelectRepository={handleSelectRepository}
            searchQuery={search}
          />
        </div>

        <div className="border-neutral-200 border-t px-5 pt-4 dark:border-neutral-750">
          <div className="flex gap-2">
            <Button onClick={fetchRepositories} variant="outline" size="small" className="flex items-center gap-2">
              <ArrowClockwise className="h-4 w-4" />
              Refresh
            </Button>
            <div className="flex-1" />
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
