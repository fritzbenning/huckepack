import type { Doc } from "@convex/_generated/dataModel";
import { cn } from "@lib/utils";
import { AnimatedSkeleton } from "@shared/ui-kit/animations/AnimatedSkeleton";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import InitialsAvatar from "./InitialsAvatar";

const userAvatarsVariants = cva("flex items-center", {
  variants: {
    size: {
      sm: "space-x-[-6px]", // Small overlap
      md: "space-x-[-8px]", // Medium overlap
      lg: "space-x-[-10px]", // Large overlap
      xl: "space-x-[-12px]", // Extra large overlap
    },
    maxVisible: {
      3: "",
      4: "",
      5: "",
      unlimited: "",
    },
  },
  defaultVariants: {
    size: "md",
    maxVisible: 4,
  },
});

const avatarVariants = cva(
  "relative overflow-hidden rounded-full border-2 border-white bg-neutral-100 dark:border-neutral-850 dark:bg-neutral-750",
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-6",
        lg: "size-8",
        xl: "size-10",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const moreCountVariants = cva(
  "flex items-center justify-center rounded-full border-2 border-white bg-neutral-200 font-semibold text-xs text-neutral-600 dark:border-neutral-850 dark:bg-neutral-600 dark:text-neutral-300",
  {
    variants: {
      size: {
        sm: "size-6 text-2xs",
        md: "size-8 text-xs",
        lg: "size-10 text-sm",
        xl: "size-12 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface UserAvatarsProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof userAvatarsVariants> {
  users: Doc<"users">[] | null;
  className?: string;
}

const UserAvatars: React.FC<UserAvatarsProps> = ({ users, size = "md", maxVisible = 4, className, ...props }) => {
  const maxVisibleNum = maxVisible === "unlimited" ? (users?.length ?? 0) : Number(maxVisible);
  const visibleUsers = users?.slice(0, maxVisibleNum) ?? [];
  const remainingCount = (users?.length ?? 0) - maxVisibleNum;

  const skeletonSizeMap = {
    sm: { className: "size-4", height: 16 },
    md: { className: "size-6", height: 24 },
    lg: { className: "size-8", height: 32 },
    xl: { className: "size-10", height: 40 },
  } as const;

  const currentSkeletonSize = skeletonSizeMap[size ?? "md"];

  return (
    <AnimatedSkeleton
      loading={!users}
      skeletonHeight={currentSkeletonSize.height}
      itemClassName={cn(currentSkeletonSize.className, "bg-neutral-100 dark:bg-neutral-950")}
      rounded="full"
    >
      <div className={cn(userAvatarsVariants({ size, maxVisible }), className)} {...props}>
        {visibleUsers.map((user, index) => {
          const username = user.name ?? user.email?.split("@")[0] ?? undefined;
          const avatarUrl = user.image ?? undefined;

          return (
            <div
              key={user._id}
              className={cn(avatarVariants({ size }))}
              style={{ zIndex: visibleUsers.length - index }}
              title={username}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={username ?? "User"} className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <InitialsAvatar
                    name={username ?? "?"}
                    size={size === "sm" ? "sm" : size === "lg" ? "md" : size === "xl" ? "lg" : "sm"}
                    className="border-0"
                  />
                </div>
              )}
            </div>
          );
        })}

        {remainingCount > 0 && (
          <div
            className={cn(moreCountVariants({ size }))}
            style={{ zIndex: 0 }}
            title={`+${remainingCount} more users`}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </AnimatedSkeleton>
  );
};

export default UserAvatars;
