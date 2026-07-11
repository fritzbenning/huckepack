import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import Button from "@shared/ui-kit/ui/Button";
import { cva } from "class-variance-authority";
import { Link } from "react-router-dom";
import { Heading } from "../typo";
import Card from "./Card";

const headlineVariants = cva("", {
  variants: {
    hasIcon: {
      true: "flex items-center gap-2",
      false: "",
    },
  },
  defaultVariants: {
    hasIcon: false,
  },
});

export interface CardTeaserProps {
  variant?: "solid" | "ghost" | "draft";
  head?: React.ReactNode;
  headline: string;
  headlineIcon?: Icon;
  subline?: string;
  sublineIcon?: Icon;
  buttonLabel?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  actions?: React.ReactNode;
  onMouseOver?: () => void;
}

const CardTeaser: React.FC<CardTeaserProps> = ({
  head,
  headline,
  headlineIcon: HeadlineIcon,
  subline,
  sublineIcon: SublineIcon,
  buttonLabel,
  href,
  onClick,
  className = "",
  style,
  actions,
  variant = "solid",
}) => {
  return (
    <Card variant={variant} className={className} style={style}>
      <div className="flex h-full flex-col">
        {head && <div className="mb-4 flex justify-between">{head}</div>}
        <div className="flex flex-1 flex-col">
          <div className="mb-5 space-y-2">
            <Heading as="h2" variant="h4" className={cn(headlineVariants({ hasIcon: !!HeadlineIcon }))}>
              {HeadlineIcon && <HeadlineIcon className="size-4" weight="duotone" />}
              {headline}
            </Heading>

            {subline && (
              <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                {SublineIcon && <SublineIcon className="size-3" weight="duotone" />}
                {subline}
              </div>
            )}
          </div>
          {buttonLabel && (href || onClick) && (
            <div className="mt-auto flex gap-2">
              {href ? (
                <Link to={href} className="flex-1">
                  <Button variant="solid" className="w-full">
                    {buttonLabel}
                  </Button>
                </Link>
              ) : (
                <Button variant="solid" className="w-full" onClick={onClick}>
                  {buttonLabel}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-0 right-0 flex items-center gap-2.5">{actions}</div>
    </Card>
  );
};

export default CardTeaser;
