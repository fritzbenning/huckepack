import { cn } from "@lib/utils";
import { PageContainer } from "@shared/ui-kit/ui/PageContainer";
import type { ReactNode } from "react";

interface HubPageProps {
  children: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  sidebar?: boolean;
  className?: string;
  containerClassName?: string;
  background?: "default" | "transparent";
}

export function HubPage({
  children,
  loading = false,
  loadingLabel,
  className,
  containerClassName,
  background = "default",
}: HubPageProps) {
  const backgroundClass = background === "transparent" ? "bg-transparent dark:bg-transparent" : "";

  return (
    <PageContainer loading={loading} loadingLabel={loadingLabel} className={cn(backgroundClass, className)}>
      <div className={`flex min-h-full flex-col space-y-7 ${containerClassName || ""}`}>{children}</div>
    </PageContainer>
  );
}
