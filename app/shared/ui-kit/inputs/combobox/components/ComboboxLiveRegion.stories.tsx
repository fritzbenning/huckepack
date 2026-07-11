import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComboboxLiveRegion } from "./ComboboxLiveRegion";

const meta: Meta<typeof ComboboxLiveRegion> = {
  title: "Inputs/Combobox/LiveRegion",
  component: ComboboxLiveRegion,
  args: {
    id: "live-region",
    resultsCount: 3,
    emptyText: "No results",
    isOpen: true,
  },
};

export default meta;
type Story = StoryObj<typeof ComboboxLiveRegion>;

export const Default: Story = {};

