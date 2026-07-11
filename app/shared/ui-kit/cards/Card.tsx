import DraftBackground from "@assets/images/draft-background.svg";
import DarkDraftBackground from "@assets/images/draft-background-dark.svg";
import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva("group relative h-full rounded-xl border border-neutral-200/75 p-5 dark:border-neutral-750", {
  variants: {
    variant: {
      solid: "bg-white dark:bg-neutral-850",
      ghost: "border-neutral-150 border-dashed bg-transparent dark:border-neutral-600",
      draft: "bg-white dark:bg-neutral-850",
    },
  },
  defaultVariants: {
    variant: "solid",
  },
});

const draftBackgroundVariants = cva("absolute inset-0 rounded-xl bg-bottom bg-cover bg-no-repeat", {
  variants: {
    variant: {
      draft: "bg-[image:var(--light-bg)] dark:bg-[image:var(--dark-bg)]",
    },
  },
});

export interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = "", style, variant = "solid", onClick }) => {
  return (
    <div className={cn(cardVariants({ variant }), className)} style={style} onClick={onClick}>
      {variant === "draft" && (
        <div
          className={draftBackgroundVariants({ variant })}
          style={
            {
              "--light-bg": `url(${DraftBackground})`,
              "--dark-bg": `url(${DarkDraftBackground})`,
            } as React.CSSProperties & { "--light-bg": string; "--dark-bg": string }
          }
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

export default Card;
