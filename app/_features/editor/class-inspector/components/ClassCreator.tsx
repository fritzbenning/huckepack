import { executeAction } from "@shared/action";
import { Combobox } from "@shared/ui-kit/inputs/combobox/Combobox";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import { useState } from "react";
import { tailwindClassOptions } from "../tailwindClasses";

interface ClassCreatorProps {
  projectId: string;
  fileId: string;
  selectedNodeAstPosition: number | null;
}

export function ClassCreator({ projectId, fileId, selectedNodeAstPosition }: ClassCreatorProps) {
  const [selectedClass, setSelectedClass] = useState("");

  const addClass = async (className: string) => {
    if (selectedNodeAstPosition) {
      await executeAction("node.class.add", { className, nodeStart: selectedNodeAstPosition, projectId, fileId });
      setSelectedClass("");
    } else {
      console.error("Unable to determine node position for adding class");
    }
  };

  return (
    <AsideSection title="Add new class" contentGap="none">
      <Combobox
        options={tailwindClassOptions}
        value={selectedClass}
        onValueChange={addClass}
        placeholder="Insert new class"
        emptyText="No classes found."
        allowCustom={true}
        maxDisplayItems={1500}
      />
    </AsideSection>
  );
}
