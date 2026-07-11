import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Upload } from "./Upload";

const meta: Meta<typeof Upload> = {
  title: "Inputs/Upload",
  component: Upload,
  args: {
    acceptedTypes: [".css", ".txt"],
    maxSize: 2,
    placeholder: "Upload a style file",
  },
};

export default meta;
type Story = StoryObj<typeof Upload>;

export const WithFilePreview: Story = {
  render: (args) => {
    const [filename, setFilename] = useState<string>();
    return (
      <div className="space-y-3">
        <Upload
          {...args}
          currentFile={filename}
          onFileSelect={(content, name) => {
            setFilename(name);
            console.info("Uploaded content sample:", content.slice(0, 80));
          }}
          onFileRemove={() => setFilename(undefined)}
        />
        {filename && <p className="text-xs text-neutral-500">Selected: {filename}</p>}
      </div>
    );
  },
};
