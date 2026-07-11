import { PageContainer } from "@shared/ui-kit/ui/PageContainer";
import type { ReactNode } from "react";

interface ProjectPageProps {
  children: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  sidebar?: boolean;
  className?: string;
  containerClassName?: string;
}

export function LibraryPage({
  children,
  loading = false,
  loadingLabel,
  className,
  containerClassName,
}: ProjectPageProps) {
  return (
    <PageContainer loading={loading} loadingLabel={loadingLabel} className={className}>
      <div className={`flex min-h-full flex-col space-y-7 ${containerClassName || ""}`}>{children}</div>
    </PageContainer>
  );
}
