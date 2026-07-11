import { useEffect, useState } from "react";

interface LoadingBarProps {
  loading: boolean;
  className?: string;
}

export function LoadingBar({ loading, className = "" }: LoadingBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldComplete, setShouldComplete] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsVisible(true);
      setShouldComplete(false);
    } else if (isVisible) {
      // Loading finished, but let the current cycle complete
      setShouldComplete(true);
      // Hide after one complete cycle (2s as per your animation duration)
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setShouldComplete(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [loading, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`absolute inset-x-0 top-0 h-0.75 overflow-hidden ${className}`}>
      <div className={`h-full ${shouldComplete ? "animate-loading-bar-complete" : "animate-loading-bar"}`} />
    </div>
  );
}
