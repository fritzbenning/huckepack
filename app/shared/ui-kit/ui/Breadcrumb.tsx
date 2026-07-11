import { cn } from "@lib/utils";
import { HouseIcon } from "@phosphor-icons/react";
import { AnimatedSkeleton } from "@shared/ui-kit/animations/AnimatedSkeleton";
import React from "react";
import { Link } from "react-router-dom";
import { BreadcrumbDivider } from "./BreadcrumbDivider";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  homeHref?: string;
  maxItems?: number;
  loading?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items = [],
  className,
  showHome = true,
  homeHref = "/dashboard",
  maxItems = 3,
  loading = false,
}) => {
  const showHomeDivider = showHome && (loading ? maxItems > 0 : items.length > 0);

  return (
    <nav className={cn("flex h-5 items-center gap-1", className)} aria-label="Breadcrumb">
      {showHome && (
        <>
          <Link
            to={homeHref}
            className="font-medium text-neutral-400 transition-colors hover:text-primary-500 dark:text-neutral-500 dark:hover:text-white"
            aria-label="Home"
          >
            <HouseIcon className="size-4" weight="duotone" />
          </Link>
          {showHomeDivider && <BreadcrumbDivider className="text-neutral-300" />}
        </>
      )}

      <AnimatedSkeleton
        loading={loading}
        skeletonItems={maxItems}
        skeletonHeight={20}
        containerClassName="flex items-center gap-2"
        itemClassName="h-5 w-20"
        rounded="sm"
        contentClassName="flex items-center"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isEllipsis = item.label === "...";

          return (
            <React.Fragment key={`breadcrumb-${item.label}-${index}`}>
              {isEllipsis ? (
                <span className="font-light text-sm text-neutral-400">...</span>
              ) : item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="flex items-center gap-1 font-medium text-sm text-neutral-400 leading-5 transition-colors hover:text-primary-500 dark:text-neutral-500 dark:hover:text-white"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <span className="flex items-center gap-1 font-medium text-sm text-neutral-950 leading-5 dark:text-neutral-100">
                  {item.icon}
                  {item.label}
                </span>
              )}

              {!isLast && <BreadcrumbDivider />}
            </React.Fragment>
          );
        })}
      </AnimatedSkeleton>
    </nav>
  );
};

export default Breadcrumb;
