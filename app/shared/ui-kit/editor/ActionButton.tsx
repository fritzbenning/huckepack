import type { Icon } from "@phosphor-icons/react";
import { ArrowLeft, Circle, Code, Trash, Upload } from "@phosphor-icons/react";
import type { DynamicIconName } from "@/types/componentTypes";

// Icon map for ActionButton component
const actionButtonIconMap: Record<string, Icon> = {
  "arrow-left": ArrowLeft,
  import: Upload,
  "code-xml": Code,
  trash: Trash,
};

interface ActionButtonProps {
  icon: DynamicIconName;
  label: string;
  onClick?: () => void;
}

const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => {
  const IconComponent = actionButtonIconMap[icon] || Circle;

  return (
    <button
      type="button"
      className="group flex h-9 items-center gap-1.5 px-0 text-neutral-500 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-white"
      onClick={onClick}
    >
      <div className="flex items-center gap-1.5 rounded-md py-2 pr-3 pl-2.5 group-hover:bg-black/4 dark:group-hover:bg-white/5">
        <IconComponent weight="duotone" className="size-3.5" />
        <span className="font-semibold text-xs">{label}</span>
      </div>
    </button>
  );
};

export default ActionButton;
