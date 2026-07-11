import { executeAction } from "@shared/action";
import { openModal } from "@shared/modal";
import { useState } from "react";
import { toast } from "sonner";
import { availableElements } from "../constants";
import type { Element } from "../types";
import { AddElementButton } from "./AddElementButton";
import { AddElementItem } from "./AddElementItem";

export function AddElement({ projectId, fileId }: { projectId: string; fileId: string }) {
  const [isActive, setIsActive] = useState(false);

  const handleAddElement = async (element: Element) => {
    // Handle Component case - open modal instead of inserting directly
    if (element.name === "Instance" && (!element.type || element.type.trim() === "")) {
      setIsActive(false);
      openModal("component.select", {
        projectId,
        currentFileId: fileId,
        onSelect: async (componentFileId: string) => {
          try {
            const result = await executeAction("instance.insert", {
              instanceFileId: componentFileId,
              projectId,
              targetFileId: fileId,
            });

            if (result && typeof result === "object" && "success" in result && !result.success) {
              const errorResult = result as { success: false; error?: string };
              toast.error("Failed to insert component", {
                description: errorResult.error || "Unknown error occurred",
              });
            } else {
              toast.success("Component inserted successfully", {
                description: "Component added to canvas",
              });
            }
          } catch (error) {
            console.error("Error inserting component:", error);
            toast.error("Failed to insert component", {
              description: error instanceof Error ? error.message : "Unknown error occurred",
            });
          }
        },
      });
      return;
    }

    if (!element.type || element.type.trim() === "") {
      toast.error("Cannot insert element", {
        description: "Element type is required",
      });
      return;
    }

    setIsActive(false);

    try {
      const result = await executeAction("node.insert", {
        elementType: element.type,
        projectId,
        fileId,
        classes: element.classes || undefined,
      });

      if (result && typeof result === "object" && "success" in result && !result.success) {
        const errorResult = result as { success: false; error?: string };
        toast.error("Failed to insert element", {
          description: errorResult.error || "Unknown error occurred",
        });
      } else {
        toast.success("Element inserted successfully", {
          description: `${element.name} element added to canvas`,
        });
      }
    } catch (error) {
      console.error("Error inserting element:", error);
      toast.error("Failed to insert element", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  return (
    <div className="relative">
      <AddElementButton isActive={isActive} onClick={() => setIsActive(!isActive)} />
      {isActive && (
        <div className="-left-11 absolute bottom-12">
          <div className="flex gap-0.75 rounded-lg bg-white p-0.75 shadow-lg dark:bg-black">
            {availableElements.map((element) => (
              <AddElementItem
                key={element.name}
                name={element.name}
                icon={element.icon}
                onClick={() => handleAddElement(element)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
