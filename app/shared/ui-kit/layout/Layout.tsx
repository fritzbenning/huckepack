import { useElectron } from "@hooks/application/useElectron";
import { LibrarySidebar } from "@hub/library/components/LibrarySidebar";
import { HubSidebar } from "@hub/sidebar";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { Activity, useMemo } from "react";
import { useLocation } from "react-router-dom";
import TitleBar from "./TitleBar";

interface LayoutProps {
  children: ReactNode;
}

const layoutVariants = cva("grid h-screen grid-cols-1 text-foreground", {
  variants: {
    platform: {
      electron: "grid-rows-[auto_1fr] bg-transparent",
      web: "grid-rows-[1fr]",
    },
  },
  defaultVariants: {
    platform: "web",
  },
});

const contentVariants = cva("flex h-full self-stretch overflow-auto bg-neutral-100 dark:bg-neutral-900", {
  variants: {
    focusMode: {
      true: "w-screen",
      false: "w-full",
    },
  },
  defaultVariants: {
    focusMode: false,
  },
});

export default function Layout({ children }: LayoutProps) {
  const isElectron = useElectron();
  const { pathname } = useLocation();

  const projectId = useMemo(() => pathname.match(/\/project\/([^/]+)/)?.[1], [pathname]);

  return (
    <div className={layoutVariants({ platform: isElectron ? "electron" : "web" })}>
      {isElectron && <TitleBar />}
      <main className={contentVariants({ focusMode: false })}>
        <Activity mode={pathname.includes("library") ? "visible" : "hidden"}>
          <LibrarySidebar projectId={projectId || ""} />
        </Activity>
        <Activity mode={!pathname.includes("library") && !pathname.includes("file") ? "visible" : "hidden"}>
          <HubSidebar projectId={projectId || ""} />
        </Activity>
        {children}
      </main>
    </div>
  );
}
