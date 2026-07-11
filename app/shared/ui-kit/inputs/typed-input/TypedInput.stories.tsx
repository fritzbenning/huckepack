import type { Meta, StoryObj } from "@storybook/react-vite";
import * as FileManager from "@project/file-manager";
import { TypedInput } from "./TypedInput";
import type { TypedInputProps } from "./types";

// Mock file manager hook for Storybook
(FileManager as any).useStoreFiles = () => [
  { id: "comp-1", name: "Header.tsx", export: true },
  { id: "comp-2", name: "Button.tsx", export: true },
];

const baseType: TypedInputProps["type"] = { kind: "string" } as const;

const meta: Meta<typeof TypedInput> = {
  title: "Inputs/TypedInput",
  component: TypedInput,
  args: {
    type: baseType,
    value: "Primary CTA",
    projectId: "proj-1",
    fileId: "comp-1",
  },
  argTypes: {
    type: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof TypedInput>;

export const StringType: Story = {};

export const NumberType: Story = {
  args: {
    type: { kind: "number" },
    value: 24,
  },
};

export const BooleanType: Story = {
  args: {
    type: { kind: "boolean" },
    value: true,
  },
};

export const UnionType: Story = {
  args: {
    type: { kind: "union", unionOptions: ["xs", "sm", "md", "lg"] },
    value: "md",
  },
};

export const InstanceType: Story = {
  args: {
    type: { kind: "ReactNode" } as any,
    value: "comp-2",
  },
};

