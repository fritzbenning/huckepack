import { cn } from "@lib/utils";
import { forwardRef } from "react";

export interface SpotlightInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SpotlightInput = forwardRef<HTMLInputElement, SpotlightInputProps>(
  ({ value, onChange, placeholder = "Search files...", className, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {/* <MagnifyingGlassIcon className="absolute left-4 size-5 text-neutral-400 dark:text-neutral-500" weight="regular" /> */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent px-6 py-4 text-base text-neutral-950 placeholder-neutral-400 outline-none dark:text-neutral-100 dark:placeholder-neutral-500",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SpotlightInput.displayName = "SpotlightInput";
