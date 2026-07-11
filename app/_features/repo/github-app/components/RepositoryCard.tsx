import type { Repository } from "@hub/auth";
import { cn } from "@lib/utils";
import { Clock, Globe, Lock, Star } from "@phosphor-icons/react";
import Card from "@shared/ui-kit/cards/Card";
import Button from "@shared/ui-kit/ui/Button";
import { formatDistanceToNow } from "date-fns";

export interface RepositoryCardProps {
  repository: Repository;
  onClick?: (repository: Repository) => void;
  className?: string;
  variant?: "solid" | "ghost" | "draft";
  selected?: boolean;
}

export function RepositoryCard({
  repository,
  onClick,
  className,
  variant = "solid",
  selected = false,
}: RepositoryCardProps) {
  const handleClick = () => {
    onClick?.(repository);
  };

  const formatLastUpdated = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  return (
    <Card
      variant={variant}
      className={cn(selected && "border-primary-300 ring-2 ring-primary-500 dark:border-primary-600", className)}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {repository.private ? (
                <Lock className="size-3 flex-shrink-0 text-amber-500" weight="duotone" />
              ) : (
                <Globe className="size-3 flex-shrink-0 text-green-500" weight="duotone" />
              )}
              <h3 className="truncate font-semibold text-sm text-neutral-950 dark:text-white">{repository.name}</h3>
            </div>
          </div>

          {repository.description && (
            <p className="line-clamp-2 flex-1 text-xs text-neutral-600 dark:text-neutral-400">
              {repository.description}
            </p>
          )}

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              {/* {repository.language && (
              <Badge variant="secondary" className="text-xs">
                {repository.language}
              </Badge>
            )} */}
              <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                <Clock className="size-3" weight="duotone" />
                <span>{formatLastUpdated(repository.updated_at)}</span>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                <Star className="size-3" weight="duotone" />
                <span>{repository.stargazers_count}</span>
              </div>
            </div>
          </div>
        </div>
        <Button size="small" severity="primary">
          Connect
        </Button>
      </div>
    </Card>
  );
}

export default RepositoryCard;
