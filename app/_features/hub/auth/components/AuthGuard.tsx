import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { SignIn } from "../pages/SignIn";
import type { AuthGuardProps } from "../types";
import { AuthLoadingIndicator } from "./AuthLoadingIndicator";

export function AuthGuard({ children }: AuthGuardProps) {
  return (
    <>
      <AuthLoading>
        <AuthLoadingIndicator />
      </AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
    </>
  );
}
