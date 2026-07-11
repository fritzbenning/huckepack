import { capitalize } from "@lib/utils/capitalize";
import { CaretDown, Folder, GridFour, Shapes } from "@phosphor-icons/react";
import AsideItem from "@shared/ui-kit/ui/AsideItem";
import { setCurrentComponentFolder } from "@stores/activeProjectStore";

export interface TreeNode {
  name: string;
  path: string;
  children: TreeNode[];
  isExpanded: boolean;
}

export interface FolderItemProps {
  node: TreeNode;
  onToggle: (path: string) => void;
  depth?: number;
  selectedFolder: string;
  isAllComponents?: boolean;
}

export function FolderItem({ node, onToggle, depth = 0, selectedFolder, isAllComponents = false }: FolderItemProps) {
  const hasChildren = !isAllComponents && node.children.length > 0;
  const paddingLeft = depth * 22;
  const isSelected = isAllComponents ? selectedFolder === "" : selectedFolder === node.path;

  const handleClick = () => {
    if (isAllComponents) {
      setCurrentComponentFolder("");
    } else {
      setCurrentComponentFolder(node.path);
      // Also toggle expansion if the folder has children
      if (hasChildren) {
        onToggle(node.path);
      }
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(node.path);
  };

  // Determine the appropriate icon
  const getIcon = () => {
    if (isAllComponents) return GridFour;
    if (hasChildren) return Folder;
    return Shapes;
  };

  return (
    <div className="select-none">
      <div className="relative" style={{ paddingLeft: paddingLeft }}>
        <AsideItem isActive={isSelected} icon={getIcon()} onClick={handleClick} className="w-full">
          {isAllComponents ? "All elements" : capitalize(node.name)}
        </AsideItem>
        {hasChildren && (
          <button
            type="button"
            className="-translate-y-1/2 absolute top-1/2 right-3 flex h-4 w-4 transform cursor-pointer items-center justify-center"
            onClick={handleToggleClick}
          >
            <CaretDown
              className={`size-4 transition-transform duration-200 ${
                node.isExpanded ? "rotate-180" : "rotate-0"
              } ${isSelected ? "text-primary-600 dark:text-primary-400" : "text-neutral-500"}`}
              weight="duotone"
            />
          </button>
        )}
      </div>

      {node.isExpanded && (
        <div className="mt-1 space-y-0">
          {/* Render child folders */}
          {node.children.map((child) => (
            <FolderItem
              key={child.path}
              node={child}
              onToggle={onToggle}
              depth={depth + 1}
              selectedFolder={selectedFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
