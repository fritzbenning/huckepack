import { Info } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Button from "./Button";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "UI/Modal",
  component: Modal,
  args: {
    title: "Create project",
    size: "md",
    contentPadding: true,
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Basic: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <div className="space-y-4">
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)} icon={Info}>
          <div className="space-y-3 text-sm text-neutral-750 dark:text-neutral-200">
            <p>Share a few details to create the project workspace.</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Give your project a clear name.</li>
              <li>Select the stack you intend to use.</li>
              <li>Invite teammates to collaborate.</li>
            </ul>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" severity="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Create project</Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};

export const LargeContent: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Review summary
        </Button>
        <Modal {...args} isOpen={open} onClose={() => setOpen(false)} size="lg" title="Release notes">
          <div className="space-y-4 text-sm text-neutral-750 dark:text-neutral-200">
            <p>Version 1.8.0 introduces performance and accessibility improvements.</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Faster tree rendering for repositories with many files.</li>
              <li>Improved keyboard navigation for all form controls.</li>
              <li>Added dark-mode polish for cards and popovers.</li>
            </ol>
          </div>
        </Modal>
      </>
    );
  },
};
