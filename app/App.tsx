import { Editor } from "@editor/wrapper";
import { AppAuthCallback, AuthGuard, BrowserAuthCallback, useCurrentUser } from "@hub/auth";
import { Dashboard } from "@hub/dashboard";
import { Imagine } from "@hub/imagine";
import { Library } from "@hub/library";
import { Namespace } from "@hub/namespace";
import { useProjectManagerStore } from "@hub/projects";
import { Teamspace } from "@hub/teams";
import { Workspace } from "@hub/workspace";
import { useGitHubCallback } from "@repo/github-app";
import { Modal } from "@shared/modal";
import Layout from "@shared/ui-kit/layout/Layout";
import { Toaster } from "@shared/ui-kit/ui/sonner";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { useElectron } from "./hooks/application/useElectron";
import { useElectronAuth } from "./hooks/application/useElectronAuth";
import { preloadWASM } from "./hooks/application/useSWC";

function Redirect({ to }: { to: string }) {
  return <Navigate to={to} replace />;
}

export default function App() {
  useEffect(() => {
    preloadWASM();
  }, []);

  useGitHubCallback();
  useElectronAuth();
  useCurrentUser();

  const isElectron = useElectron();

  useProjectManagerStore(useShallow((state) => Object.values(state.projects)));

  return (
    <div className={`antialiased ${isElectron ? "bg-transparent" : "bg-neutral-100 dark:bg-neutral-900"}`}>
      <Routes>
        {/* Browser auth callback - outside AuthGuard to allow unauthenticated access and stay on page to open Electron */}
        <Route path="/browser-auth-callback" element={<BrowserAuthCallback />} />
        {/* App auth callback - outside AuthGuard to set auth token before authentication check */}
        <Route path="/app-auth-callback" element={<AppAuthCallback />} />
        <Route
          path="/*"
          element={
            <AuthGuard>
              <Layout>
                <Routes>
                  <Route path="/" element={<Redirect to="/dashboard" />} />
                  <Route path="/:unknown" element={<Redirect to="/dashboard" />} />
                  {/* Workspace */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/imagine" element={<Imagine />} />
                  {/* <Route path="/recently-viewed" element={<Namespace />} /> */}
                  <Route path="/your-projects" element={<Namespace />} />
                  <Route path="/workspace/:workspaceId" element={<Workspace />} />
                  {/* Team */}
                  <Route path="/team/:teamId" element={<Teamspace />} />

                  {/* Project */}
                  <Route path="/project/:projectId" element={<Redirect to={`/dashboard`} />} />
                  <Route path="/project/:projectId/library" element={<Library />} />
                  <Route path="/project/:projectId/file/:fileId" element={<Editor />} />
                </Routes>
              </Layout>
            </AuthGuard>
          }
        />
      </Routes>
      <Toaster />
      <Modal />
    </div>
  );
}
