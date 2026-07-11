import type { Repository } from "@hub/auth";
import { RepositoryCard } from "./RepositoryCard";

export interface RepositoryListProps {
  repositories: Repository[];
  onSelectRepository: (repository: Repository) => void;
  searchQuery: string;
  className?: string;
}

export function RepositoryList({ repositories, onSelectRepository, searchQuery, className }: RepositoryListProps) {
  const filteredRepositories = repositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredRepositories.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-neutral-500">
          {searchQuery ? "No repositories match your search." : "No repositories found."}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 py-5 ${className || ""}`}>
      {filteredRepositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} onClick={onSelectRepository} />
      ))}
    </div>
  );
}

export default RepositoryList;
