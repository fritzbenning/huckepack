import type React from "react";

interface DotsSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export const DotsSpinner: React.FC<DotsSpinnerProps> = ({ size = "sm", color = "bg-neutral-400", className = "" }) => {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const dotClass = `${sizeClasses[size]} ${color} rounded-full animate-bounce`;

  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className={dotClass}></div>
      <div className={dotClass} style={{ animationDelay: "0.1s" }}></div>
      <div className={dotClass} style={{ animationDelay: "0.2s" }}></div>
    </div>
  );
};
