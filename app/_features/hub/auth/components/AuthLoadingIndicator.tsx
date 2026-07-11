import Logo from "@shared/ui-kit/layout/Logo";

export function AuthLoadingIndicator() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-50 bg-no-repeat dark:bg-neutral-950"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <header style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
        <div className="relative inline-block animate-pulse">
          <Logo size="large" className="text-neutral-400 dark:text-neutral-600" />
        </div>
      </header>
    </main>
  );
}
