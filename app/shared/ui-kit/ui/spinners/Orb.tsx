import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const orbVariants = cva("relative overflow-clip rounded-full bg-white", {
  variants: {
    size: {
      xs: "h-4 w-4",
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const spinnerVariants = cva("size-full animate-spin bg-conic from-primary-600 via-rose-400 to-amber-100", {
  variants: {
    size: {
      xs: "blur-[2px]",
      sm: "blur-[4px]",
      md: "blur-[6px]",
      lg: "blur-[8px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface OrbProps extends VariantProps<typeof orbVariants> {
  className?: string;
}

export default function Orb({ size, className }: OrbProps) {
  return (
    <div className={cn(orbVariants({ size }), className)}>
      <div className="absolute inset-0 border border-white bg-radial-[at_50%_75%] from-primary-500/10 via-primary-400/10 to-95% to-white/20" />
      <div className="absolute inset-0 animate-pulse">
        <div className={spinnerVariants({ size })} style={{ animationDuration: "6s" }} />
      </div>
    </div>
  );
}
