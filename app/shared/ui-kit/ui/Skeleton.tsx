import { SkeletonItem, type SkeletonItemProps } from "./SkeletonItem";

export interface SkeletonProps {
  skeletonItems?: number;
  itemClassName?: string;
  rounded?: SkeletonItemProps["rounded"];
  containerClassName?: string;
}

export function Skeleton({ skeletonItems, itemClassName, rounded, containerClassName }: SkeletonProps) {
  return (
    <div className={containerClassName}>
      {skeletonItems !== undefined && skeletonItems > 0 ? (
        Array.from({ length: skeletonItems }, (_, index) => (
          <SkeletonItem
            key={`skeleton-item-${index}-${rounded || "default"}`}
            className={itemClassName}
            rounded={rounded}
          />
        ))
      ) : (
        <SkeletonItem className={itemClassName} rounded={rounded} />
      )}
    </div>
  );
}
