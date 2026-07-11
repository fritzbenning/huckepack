import { cn } from "@lib/utils";
import type { IconProps, IconWeight } from "@phosphor-icons/react";
import { PlusIcon } from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { Heading } from "../typo";
import Card from "./Card";

export interface EmptyCardProps {
  headline: string;
  onClick: () => void;
  className?: string;
  icon?: ComponentType<IconProps>;
  weight?: IconWeight;
}

const EmptyCard: React.FC<EmptyCardProps> = ({
  headline,
  onClick,
  className = "",
  icon: Icon = PlusIcon,
  weight = "regular",
}) => {
  return (
    <Card
      variant="ghost"
      className={cn("group transition-colors hover:bg-white/50 dark:hover:bg-neutral-850/50", className)}
      onClick={onClick}
    >
      <div className="flex h-full min-h-30 flex-col items-center justify-center space-y-4">
        <Icon
          className="size-9 p-1 text-neutral-600 transition-colors group-hover:text-primary-500 dark:text-neutral-300 dark:group-hover:text-white"
          weight={weight}
        />
        <Heading
          as="h3"
          variant="h6"
          className="text-center text-neutral-500 transition-colors group-hover:text-primary-500 dark:text-neutral-400 dark:group-hover:text-white"
        >
          {headline}
        </Heading>
      </div>
    </Card>
  );
};

export default EmptyCard;
