/* eslint-disable @typescript-eslint/no-non-null-assertion -- Test assertions on known DOM elements */
import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, userEvent, waitFor, within } from "storybook/test";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

function getOpenPanels(container: HTMLElement) {
  return container.querySelectorAll(
    '[data-slot="accordion-content"][data-open]'
  );
}

/**
 * A vertically stacked set of interactive headings that each reveal a section
 * of content.
 */
const meta = {
  title: "ui/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    multiple: {
      control: "boolean",
      description: "Whether multiple items can be open at the same time",
    },
    disabled: {
      control: "boolean",
    },
  },
  args: {
    className: "w-96",
    multiple: false,
    disabled: false,
    defaultValue: ["item-1"],
  },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>How do I reset my password?</AccordionTrigger>
        <AccordionContent>
          Click on &apos;Forgot Password&apos; on the login page, enter your
          email address, and we&apos;ll send you a link to reset your password.
          The link will expire in 24 hours.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Can I change my subscription plan?</AccordionTrigger>
        <AccordionContent>
          Yes, you can upgrade or downgrade your plan at any time from your
          account settings. Changes will be reflected in your next billing
          cycle.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
        <AccordionContent>
          We accept all major credit cards, PayPal, and bank transfers. All
          payments are processed securely through our payment partners.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default behavior of the accordion allows only one item to be open.
 */
export const Default: Story = {};

/**
 * When `multiple` is set to `true`, multiple accordion items can be open at
 * the same time.
 */
export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ["item-1"],
  },
};

/**
 * Individual accordion items can be disabled to prevent interaction while
 * keeping other items functional.
 */
export const Disabled: Story = {
  render: (args) => (
    <Accordion {...args} defaultValue={["item-1"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Can I access my account history?</AccordionTrigger>
        <AccordionContent>
          Yes, you can view your complete account history including all
          transactions, plan changes, and support tickets in the Account History
          section of your dashboard.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Premium feature information</AccordionTrigger>
        <AccordionContent>
          This section contains information about premium features. Upgrade your
          plan to access this content.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How do I update my email address?</AccordionTrigger>
        <AccordionContent>
          You can update your email address in your account settings.
          You&apos;ll receive a verification email at your new address to
          confirm the change.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Accordion items styled with borders for visual separation.
 */
export const WithBorders: Story = {
  render: (args) => (
    <Accordion
      {...args}
      className="w-96 rounded-lg border"
      defaultValue={["item-1"]}
    >
      <AccordionItem value="item-1" className="border-b px-4 last:border-b-0">
        <AccordionTrigger>How does billing work?</AccordionTrigger>
        <AccordionContent>
          We offer monthly and annual subscription plans. Billing is charged at
          the beginning of each cycle, and you can cancel anytime.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border-b px-4 last:border-b-0">
        <AccordionTrigger>Is my data secure?</AccordionTrigger>
        <AccordionContent>
          Yes. We use end-to-end encryption, SOC 2 Type II compliance, and
          regular third-party security audits.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" className="border-b px-4 last:border-b-0">
        <AccordionTrigger>What integrations do you support?</AccordionTrigger>
        <AccordionContent>
          We integrate with 500+ popular tools including Slack, Zapier,
          Salesforce, and more.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

/**
 * Accordion wrapped in a Card component for a cohesive grouped appearance.
 */
export const WithCard: Story = {
  render: (args) => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Subscription & Billing</CardTitle>
        <CardDescription>
          Common questions about your account, plans, payments and
          cancellations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion {...args} defaultValue={["item-1"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What subscription plans do you offer?
            </AccordionTrigger>
            <AccordionContent>
              We offer three subscription tiers: Starter ($9/month),
              Professional ($29/month), and Enterprise ($99/month).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How does billing work?</AccordionTrigger>
            <AccordionContent>
              Billing occurs automatically at the start of each billing cycle.
              We accept all major credit cards and PayPal.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              How do I cancel my subscription?
            </AccordionTrigger>
            <AccordionContent>
              You can cancel your subscription anytime from your account
              settings. There are no cancellation fees or penalties.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  ),
};

export const ShouldOnlyOpenOneWhenSingleType: Story = {
  name: "when accordions are clicked, should open only one item at a time",
  args: {
    multiple: false,
    defaultValue: ["item-1"],
  },
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accordions = canvas.getAllByRole("button");

    // First item is already open via defaultValue
    await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(1));

    // Click second item - first should close, second should open
    await userEvent.click(accordions[1]!);
    await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(1));

    // Click third item - second should close, third should open
    await userEvent.click(accordions[2]!);
    await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(1));

    // Close the last opened tab
    await userEvent.click(accordions[2]!);
    await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(0));
  },
};

export const ShouldOpenAllWhenMultipleType: Story = {
  name: "when accordions are clicked, should open all items one at a time",
  args: {
    multiple: true,
    defaultValue: ["item-1"],
  },
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const accordions = canvas.getAllByRole("button");

    // First item is already open via defaultValue
    await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(1));

    // Open remaining tabs one at a time (starting from index 1)
    for (let i = 1; i < accordions.length; i++) {
      await userEvent.click(accordions[i]!);
      await waitFor(() =>
        expect(getOpenPanels(canvasElement).length).toBe(i + 1)
      );
    }

    // Close all tabs one at a time
    for (let i = accordions.length - 1; i > 0; i--) {
      await userEvent.click(accordions[i]!);
      await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(i));
    }

    // Close the last opened tab
    await userEvent.click(accordions[0]!);
    await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(0));
  },
};
