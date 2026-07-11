import Breadcrumb from "@shared/ui-kit/ui/Breadcrumb";
import type { ReactNode } from "react";

interface HubPageHeaderProps {
  breadcrumbItems?: Array<{
    label: string;
    href?: string;
  }>;
  children?: ReactNode;
  loading?: boolean;
}

export function HubPageHeader({ breadcrumbItems, children, loading = false }: HubPageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Breadcrumb items={breadcrumbItems} loading={loading} />
      {children && <div className="flex items-center gap-4">{children}</div>}
    </div>
  );
}
