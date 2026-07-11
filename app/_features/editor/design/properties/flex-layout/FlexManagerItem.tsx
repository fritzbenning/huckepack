import { cva } from "class-variance-authority";

const containerVariants = cva("", {
  variants: {
    isActive: {
      true: "px-2 py-1.5",
      false: "px-2.5 py-2",
    },
  },
});

const dotVariants = cva("block rounded-full", {
  variants: {
    isActive: {
      true: "h-1.5 w-1.5 bg-primary-500",
      false: "h-0.5 w-0.5 bg-neutral-350 dark:bg-neutral-500",
    },
  },
});

interface FlexManagerItemProps {
  onClick: () => void;
  isActive: boolean;
}

export const FlexManagerItem: React.FC<FlexManagerItemProps> = ({ onClick, isActive }) => {
  return (
    <button type="button" onClick={onClick}>
      <div className={containerVariants({ isActive })}>
        <span className={dotVariants({ isActive })} />
      </div>
    </button>
  );
};
