import { AsideDivider } from "@shared/ui-kit/layout/AsideDivider";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import type React from "react";

interface DesignPropertyProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onDelete: () => void;
  disablePadding?: boolean;
}

export function DesignProperty({ title, children }: DesignPropertyProps) {
  return (
    <>
      <AsideSection title={title}>{children}</AsideSection>
      <AsideDivider />
    </>
  );
}
