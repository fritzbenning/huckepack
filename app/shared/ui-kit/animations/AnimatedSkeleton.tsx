import { SkeletonItem, type SkeletonItemProps } from "@shared/ui-kit/ui/SkeletonItem";
import { AnimatePresence } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { FadeIn } from "./FadeIn";

interface AnimatedSkeletonProps {
  loading: boolean;
  children: ReactNode;
  skeletonItems?: number;
  itemClassName?: string;
  rounded?: SkeletonItemProps["rounded"];
  containerClassName?: string;
  contentClassName?: string;
  duration?: number;
  skeletonHeight?: CSSProperties["height"];
  skeletonWidth?: CSSProperties["width"];
  minimumVisibleMs?: number;
}

export function AnimatedSkeleton({
  loading,
  children,
  skeletonItems,
  itemClassName,
  rounded,
  containerClassName,
  contentClassName,
  duration,
  skeletonHeight,
  skeletonWidth,
  minimumVisibleMs = 300,
}: AnimatedSkeletonProps) {
  const [showSkeleton, setShowSkeleton] = useState(loading);
  const visibilityStartRef = useRef<number | null>(loading ? Date.now() : null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (loading) {
      setShowSkeleton(true);
      if (visibilityStartRef.current === null) {
        visibilityStartRef.current = Date.now();
      }
      return;
    }

    if (!showSkeleton) {
      visibilityStartRef.current = null;
      return;
    }

    const elapsedMs = visibilityStartRef.current ? Date.now() - visibilityStartRef.current : minimumVisibleMs;
    const remainingMs = Math.max(minimumVisibleMs - elapsedMs, 0);

    if (remainingMs === 0) {
      setShowSkeleton(false);
      visibilityStartRef.current = null;
      return;
    }

    hideTimeoutRef.current = setTimeout(() => {
      setShowSkeleton(false);
      visibilityStartRef.current = null;
      hideTimeoutRef.current = null;
    }, remainingMs);

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [loading, minimumVisibleMs]);

  const reserveHeight = showSkeleton;

  return (
    <div
      className="relative"
      style={{ height: reserveHeight ? skeletonHeight : undefined, width: skeletonWidth ?? undefined }}
    >
      <AnimatePresence mode="popLayout">
        {showSkeleton && (
          <FadeIn key="skeleton" duration={duration} className="pointer-events-none absolute inset-0">
            <div className={containerClassName}>
              {skeletonItems !== undefined && skeletonItems > 0 ? (
                Array.from({ length: skeletonItems }, (_, index) => (
                  <SkeletonItem key={`skeleton-${index}-${rounded}`} className={itemClassName} rounded={rounded} />
                ))
              ) : (
                <SkeletonItem className={itemClassName} rounded={rounded} />
              )}
            </div>
          </FadeIn>
        )}

        {!loading && !showSkeleton && (
          <FadeIn key="content" duration={duration} className={contentClassName}>
            {children}
          </FadeIn>
        )}
      </AnimatePresence>
    </div>
  );
}
