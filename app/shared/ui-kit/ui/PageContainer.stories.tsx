import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "./Button";
import { PageContainer } from "./PageContainer";

const meta: Meta<typeof PageContainer> = {
  title: "UI/PageContainer",
  component: PageContainer,
  args: {
    withPadding: true,
  },
};

export default meta;
type Story = StoryObj<typeof PageContainer>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">Project overview</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Keep work organized with sections, tags, and reviews.
        </p>
      </div>
    ),
  },
};

export const WithLoadingBar: Story = {
  render: (args) => (
    <PageContainer {...args} loading>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">Deploying preview</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-300">We are preparing your Vercel build.</p>
        </div>
        <Button variant="outline" severity="secondary">
          Cancel build
        </Button>
      </div>
    </PageContainer>
  ),
};
