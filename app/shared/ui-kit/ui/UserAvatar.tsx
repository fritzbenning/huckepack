import { useCurrentUser } from "@hub/auth";
import { AnimatedSkeleton } from "@shared/ui-kit/animations/AnimatedSkeleton";

export function UserAvatar() {
  const { convexUser } = useCurrentUser();
  const image = convexUser?.image;
  const name = convexUser?.name;

  return (
    <AnimatedSkeleton
      loading={!image}
      skeletonHeight={24}
      itemClassName="size-6 bg-neutral-100 dark:bg-neutral-950"
      rounded="full"
    >
      <img
        src={image ?? ""}
        alt={name || "User avatar"}
        referrerPolicy="no-referrer"
        className="block size-6 rounded-full object-cover"
      />
    </AnimatedSkeleton>
  );
}
