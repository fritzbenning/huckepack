import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { LoadingBar } from "./LoadingBar";

const pageContainerVariants = cva(
  "custom-scrollbar relative w-full overflow-y-auto bg-neutral-50 dark:bg-neutral-900",
  {
    variants: {
      withPadding: {
        true: "min-h-full px-16 py-10",
        false: "h-full",
      },
    },
    defaultVariants: {
      withPadding: true,
    },
  }
);

interface PageContainerProps extends VariantProps<typeof pageContainerVariants> {
  children: ReactNode;
  className?: string;
  loading?: boolean;
  loadingLabel?: string;
}

export function PageContainer({ children, className = "", withPadding = true, loading = false }: PageContainerProps) {
  return (
    <div className={cn(pageContainerVariants({ withPadding }), className)}>
      <LoadingBar loading={loading} />
      {children}
    </div>
  );
}
