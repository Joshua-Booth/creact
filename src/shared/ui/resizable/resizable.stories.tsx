import preview from "@/storybook/preview";
import { expect, fn, userEvent } from "storybook/test";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";

/**
 * Accessible resizable panel groups and layouts with keyboard support.
 */
const meta = preview.meta({
  title: "ui/ResizablePanelGroup",
  component: ResizablePanelGroup,
  argTypes: {
    onLayoutChange: {
      control: false,
    },
  },
  args: {
    onLayoutChange: fn(),
    className: "max-w-md rounded-lg border md:min-w-[450px]",
    orientation: "horizontal",
  },
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize="50%">
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="50%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="25%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="75%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
});

// --- Stories ---

/**
 * The default form of the resizable panel group.
 */
export const Default = meta.story();

/**
 * Vertical direction resizable panels.
 */
export const Vertical = meta.story({
  args: {
    orientation: "vertical",
    className: "min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]",
  },
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize="25%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="75%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
});

/**
 * Horizontal layout with visible drag handle indicator.
 */
export const Handle = meta.story({
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize="25%">
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="75%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
});

/**
 * Nested layout with visible drag handle indicators on all handles.
 */
export const WithHandle = meta.story({
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize="50%">
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="25%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="75%">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
});

// --- Tests ---

Default.test(
  "when using keyboard arrows, should resize panels",
  {
    render: (args) => (
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize="50%">
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">Left</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="50%">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Right</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    ),
  },
  async ({ args, canvas, step }) => {
    const separator = await canvas.findByRole("separator");

    await step("focus the resize handle", async () => {
      await userEvent.click(separator);
      await expect(separator).toHaveFocus();
    });

    await step("resize with ArrowRight", async () => {
      await userEvent.keyboard("{ArrowRight}");
      await expect(args.onLayoutChange).toHaveBeenCalled();
    });

    await step("resize with ArrowLeft", async () => {
      await userEvent.keyboard("{ArrowLeft}");
      await expect(args.onLayoutChange).toHaveBeenCalled();
    });
  }
);
