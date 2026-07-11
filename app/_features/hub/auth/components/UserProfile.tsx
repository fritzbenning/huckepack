import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@hub/auth/hooks/useCurrentUser";
import Button from "@shared/ui-kit/ui/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const { convexUser } = useCurrentUser();
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (!convexUser) return null;

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const image = convexUser.image;
  const name = convexUser.name;
  const email = convexUser.email;

  return (
    <div className="flex items-center gap-3">
      {image && (
        <img
          src={image}
          alt={name || "User avatar"}
          className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700"
        />
      )}
      <div className="flex flex-col">
        {name && <span className="font-medium text-gray-900 text-sm dark:text-white">{name}</span>}
        {email && <span className="text-xs text-neutral-500 dark:text-gray-400">{email}</span>}
      </div>
      <Button onClick={handleSignOut} variant="outline" size="small" disabled={isSigningOut} className="ml-2">
        {isSigningOut ? (
          <>
            <div className="mr-1 h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-transparent"></div>
            Signing out...
          </>
        ) : (
          "Sign Out"
        )}
      </Button>
    </div>
  );
}
