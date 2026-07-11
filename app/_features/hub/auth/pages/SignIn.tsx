import { openModal } from "@shared/modal";
import Logo from "@shared/ui-kit/layout/Logo";
import { Jumbotron } from "@shared/ui-kit/ui/Jumbotron";
import { GitHubLogin } from "../components/GitHubLogin";
import { GoogleLogin } from "../components/GoogleLogin";

export function SignIn() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-50 bg-no-repeat dark:bg-neutral-950"
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <header style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
        <Logo size="large" className="text-black dark:text-white" />
      </header>
      <Jumbotron
        variant="default"
        border
        maxWidth="narrow"
        padding={null}
        className="mx-auto flex min-w-96 flex-col rounded-xl border-neutral-100 bg-white text-center dark:border-neutral-850 dark:bg-neutral-900"
        style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
      >
        <div className="flex flex-col items-center justify-center gap-7 p-12">
          <h1 className="font-bold text-2xl text-gray-900 dark:text-white">Sign in to huckepack</h1>
          <div className="flex flex-col items-center gap-2">
            <GoogleLogin />
            <GitHubLogin />
          </div>
        </div>
        <div className="w-full border-neutral-100 border-t dark:border-neutral-800">
          <button
            onClick={() =>
              openModal("application.notImplemented", {
                message: "Coming soon! We're working on sharing our mission with you.",
              })
            }
            type="button"
            className="w-full p-4 text-center font-bold text-primary-500 text-sm transition-colors hover:text-primary-700 dark:text-neutral-300 hover:dark:text-white"
          >
            Explore our mission
          </button>
        </div>
      </Jumbotron>
    </main>
  );
}
