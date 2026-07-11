import { type AIModel, models } from "@assistent/constants";
import { CodesandboxLogoIcon } from "@phosphor-icons/react";
import { Select } from "@shared/ui-kit/inputs/select/Select";
import type React from "react";

interface ModelSelectorProps {
  selectedModel: AIModel;
  setSelectedModel: (model: AIModel) => void;
  isLoading: boolean;
  y?: "top" | "bottom";
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  setSelectedModel,
  isLoading,
  y = "top",
}) => (
  <div className="flex items-center gap-1.5">
    <CodesandboxLogoIcon className="shrin-0 size-4" />
    <Select
      options={models}
      value={selectedModel}
      onChange={(value) => setSelectedModel(value as AIModel)}
      placeholder="Select AI model"
      tone="transparent"
      dimension="small"
      height="auto"
      dropdownWidth={140}
      x="left"
      distance="medium"
      y={y}
      disabled={isLoading}
    />
  </div>
);
