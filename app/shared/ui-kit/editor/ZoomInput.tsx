"use client";

import { useCanvasStore } from "@editor/canvas";
import { Select } from "@shared/ui-kit/inputs/select/Select";

const zoomOptions = [
  { value: 0.5, label: "50%" },
  { value: 0.75, label: "75%" },
  { value: 1, label: "100%" },
  { value: 1.25, label: "125%" },
  { value: 1.5, label: "150%" },
  { value: 2, label: "200%" },
];

export function ZoomInput({
  setZoomToValue,
  projectId,
}: {
  setZoomToValue: (zoom: number) => void;
  projectId: string;
}) {
  const zoom = useCanvasStore((state) => state.canvases[projectId]?.zoom ?? 1);

  const handleZoomChange = (value: string) => {
    const zoomValue = parseFloat(value);
    setZoomToValue(zoomValue);
  };

  const getCurrentZoomLabel = () => {
    const currentOption = zoomOptions.find((option) => option.value === zoom);
    return currentOption ? currentOption.label : `${Math.round(zoom * 100)}%`;
  };

  // Check if the current zoom value is one of the predefined options
  const isCustomZoom = !zoomOptions.some((option) => Math.abs(option.value - zoom) < 0.01);

  // Create options array for the Select component
  const selectOptions = [
    // Add custom zoom option if it's not in the predefined options
    ...(isCustomZoom
      ? [
          {
            value: zoom.toString(),
            label: `${getCurrentZoomLabel()}`,
          },
        ]
      : []),
    ...zoomOptions.map((option) => ({
      value: option.value.toString(),
      label: option.label,
    })),
  ];

  return (
    <Select
      placeholder="100%"
      options={selectOptions}
      value={zoom.toString()}
      onChange={handleZoomChange}
      className="-ml-1 w-13.25"
      triggerClassName="justify-end"
      triggerLabelClassName="text-right"
      y="top"
      tone="transparent"
    />
  );
}
