import { Skeleton, type SkeletonProps } from "@shared/ui-kit/ui/Skeleton";
import { AnimatePresence } from "motion/react";
import { type ReactNode, Suspense } from "react";
import { FadeIn } from "./FadeIn";

interface AnimatedSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
  skeletonItems?: SkeletonProps["skeletonItems"];
  containerClassName?: SkeletonProps["containerClassName"];
  itemClassName?: SkeletonProps["itemClassName"];
  rounded?: SkeletonProps["rounded"];
}

export function AnimatedSuspense({
  children,
  fallback,
  skeletonItems,
  containerClassName,
  itemClassName,
  rounded,
}: AnimatedSuspenseProps) {
  const skeletonFallback = fallback ?? (
    <Skeleton
      skeletonItems={skeletonItems}
      containerClassName={containerClassName}
      itemClassName={itemClassName}
      rounded={rounded}
    />
  );

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<FadeIn key="skeleton">{skeletonFallback}</FadeIn>}>
        <FadeIn key="content">{children}</FadeIn>
      </Suspense>
    </AnimatePresence>
  );
}
