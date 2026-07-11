import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "./Button";
import { ModalFooter } from "./ModalFooter";

const meta: Meta<typeof ModalFooter> = {
  title: "UI/Modal/Footer",
  component: ModalFooter,
};

export default meta;
type Story = StoryObj<typeof ModalFooter>;

export const WithActions: Story = {
  render: () => (
    <ModalFooter>
      <Button variant="outline" severity="secondary">
        Cancel
      </Button>
      <Button>Save</Button>
    </ModalFooter>
  ),
};

