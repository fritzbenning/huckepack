import { ThemeToggle } from "@application/theme";
import { prepareProjectRoute } from "@hub/projects";
import { cn } from "@lib/utils";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";

interface AsideHeaderContentProps {
  projectId: string;
  goBackTarget?: string | (() => void);
  onBackClick?: () => void;
  className?: string;
}

export function AsideHeaderContent({ projectId, goBackTarget, onBackClick, className }: AsideHeaderContentProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (goBackTarget) {
      if (typeof goBackTarget === "function") {
        goBackTarget();
      } else {
        navigate(goBackTarget);
      }
    } else {
      const libraryRoute = prepareProjectRoute(projectId);
      navigate(libraryRoute);
    }
  };

  return (
    <header className={cn("flex h-full items-center justify-between px-4", className)}>
      <div className="flex items-center gap-2">
        {goBackTarget && (
          <InlineIconButton
            icon={ArrowLeftIcon}
            onClick={(_e) => handleBackClick()}
            title="Back"
            size="medium"
            weight="bold"
          />
        )}

        <Link to="/dashboard">
          <Logo
            size="small"
            showBadge
            className="text-neutral-400 transition-colors hover:text-primary-500 dark:text-neutral-500 hover:dark:text-white"
          />
        </Link>
      </div>
      <ThemeToggle />
    </header>
  );
}
