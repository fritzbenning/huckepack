import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@hub/auth/hooks/useCurrentUser";
import { GearIcon, SignOutIcon } from "@phosphor-icons/react";
import { openModal } from "@shared/modal";
import { AnimatedSkeleton } from "@shared/ui-kit/animations/AnimatedSkeleton";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import { useNavigate } from "react-router-dom";

export function AsideUser() {
  const { convexUser } = useCurrentUser();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-1 items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 py-1.5 pr-3.5 pl-1.5 dark:border-neutral-750 dark:bg-neutral-800">
      <div className="flex items-center gap-3">
        <AnimatedSkeleton
          loading={!convexUser}
          skeletonWidth={28}
          skeletonHeight={28}
          itemClassName="size-7 bg-neutral-100 dark:bg-neutral-950"
        >
          <img
            src={convexUser?.image}
            alt="User avatar"
            className="block size-7 overflow-hidden rounded-sm object-cover"
          />
        </AnimatedSkeleton>
        <span className="font-bold text-sm text-neutral-850 dark:text-neutral-200">
          {convexUser?.name || convexUser?.email?.split("@")[0] || "User"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <InlineIconButton
          icon={GearIcon}
          onClick={() => openModal("application.notImplemented")}
          title="Open user menu"
          size="medium"
        />
        <InlineIconButton icon={SignOutIcon} onClick={handleSignOut} title="Sign out" size="medium" weight="regular" />
      </div>
    </div>
  );
}
