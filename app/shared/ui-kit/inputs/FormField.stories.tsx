import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "./FormField";
import { Input } from "./input/Input";
import { Switch } from "./switch";

const meta: Meta<typeof FormField> = {
  title: "Inputs/FormField",
  component: FormField,
  args: {
    label: "Project name",
    description: "Displayed in the workspace sidebar and URL.",
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const TextInput: Story = {
  render: (args) => (
    <FormField {...args} htmlFor="project-name">
      <Input id="project-name" value="Huckepack" onChange={() => {}} />
    </FormField>
  ),
};

export const WithCustomContent: Story = {
  args: {
    label: "Enable AI features",
    description: "Controls access to AI-assisted tooling.",
    customContent: <Switch checked onCheckedChange={() => {}} label="Allow team access" />,
  },
  render: (args) => (
    <FormField {...args}>
      <Input value="Optional details…" onChange={() => {}} />
    </FormField>
  ),
};

