import type { Meta, StoryObj } from "@storybook/react-vite";
import Card from "../cards/Card";
import { CardGrid } from "./CardGrid";

const meta: Meta<typeof CardGrid> = {
  title: "UI/CardGrid",
  component: CardGrid,
};

export default meta;
type Story = StoryObj<typeof CardGrid>;

const sampleCards = Array.from({ length: 5 }, (_, i) => (
  <Card key={i}>
    <div className="space-y-1">
      <p className="font-semibold text-sm text-neutral-950 dark:text-neutral-50">Card {i + 1}</p>
      <p className="text-xs text-neutral-600 dark:text-neutral-300">Responsive auto-fit grid layout.</p>
    </div>
  </Card>
));

export const Default: Story = {
  render: (args) => <CardGrid {...args}>{sampleCards}</CardGrid>,
};

export const FourColumns: Story = {
  render: (args) => (
    <CardGrid {...args} variant="col-4">
      {sampleCards}
    </CardGrid>
  ),
};
