/* eslint-disable @typescript-eslint/no-non-null-assertion -- Test assertions on known DOM elements */
import preview from "@/storybook/preview";
import { expect, userEvent, waitFor } from "storybook/test";

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

// --- Helpers ---

function getOpenPanels(container: HTMLElement) {
  return container.querySelectorAll(
    '[data-slot="accordion-content"][data-open]'
  );
}

/**
 * A vertically stacked set of interactive headings that each reveal a section
 * of content.
 */
const meta = preview.meta({
  title: "ui/Accordion",
  component: Accordion,
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
});

// --- Stories ---

/**
 * The default behavior of the accordion allows only one item to be open.
 */
export const Default = meta.story();

/**
 * When `multiple` is set to `true`, multiple accordion items can be open at
 * the same time.
 */
export const Multiple = meta.story({
  args: {
    multiple: true,
    defaultValue: ["item-1"],
  },
});

/**
 * Individual accordion items can be disabled to prevent interaction while
 * keeping other items functional.
 */
export const Disabled = meta.story({
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
});

/**
 * Accordion items styled with borders for visual separation.
 */
export const WithBorders = meta.story({
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
});

/**
 * Accordion wrapped in a Card component for a cohesive grouped appearance.
 */
export const WithCard = meta.story({
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
});

// --- Tests ---

Default.test(
  "when accordions are clicked, should open only one item at a time",
  {
    args: {
      multiple: false,
      defaultValue: ["item-1"],
    },
  },
  async ({ canvas, canvasElement, step }) => {
    const accordions = canvas.getAllByRole("button");

    await step("verify first item is open via defaultValue", async () => {
      await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(1));
    });

    await step("click second item, only second should be open", async () => {
      await userEvent.click(accordions[1]!);
      await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(1));
    });

    await step("click third item, only third should be open", async () => {
      await userEvent.click(accordions[2]!);
      await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(1));
    });

    await step("click third item again, all should be closed", async () => {
      await userEvent.click(accordions[2]!);
      await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(0));
    });
  }
);

Default.test(
  "when accordions are clicked, should open all items one at a time",
  {
    args: {
      multiple: true,
      defaultValue: ["item-1"],
    },
  },
  async ({ canvas, canvasElement, step }) => {
    const accordions = canvas.getAllByRole("button");

    await step("verify first item is open via defaultValue", async () => {
      await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(1));
    });

    await step("open remaining items one at a time", async () => {
      for (let i = 1; i < accordions.length; i++) {
        await userEvent.click(accordions[i]!);
        await waitFor(() =>
          expect(getOpenPanels(canvasElement).length).toBe(i + 1)
        );
      }
    });

    await step("close all items one at a time", async () => {
      for (let i = accordions.length - 1; i > 0; i--) {
        await userEvent.click(accordions[i]!);
        await waitFor(() =>
          expect(getOpenPanels(canvasElement).length).toBe(i)
        );
      }
    });

    await step("close the last item", async () => {
      await userEvent.click(accordions[0]!);
      await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(0));
    });
  }
);

Default.test(
  "when using keyboard, should navigate and toggle accordion items",
  {
    args: {
      multiple: false,
      defaultValue: [],
    },
  },
  async ({ canvas, canvasElement, step }) => {
    const triggers = canvas.getAllByRole("button");

    await step("tab to focus first trigger", async () => {
      await userEvent.tab();
      await expect(triggers[0]).toHaveFocus();
    });

    await step("press Enter to open first item", async () => {
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(1));
    });

    await step("press ArrowDown to move to second trigger", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await expect(triggers[1]).toHaveFocus();
    });

    await step("press Space to open second item", async () => {
      await userEvent.keyboard(" ");
      await waitFor(() => expect(getOpenPanels(canvasElement).length).toBe(1));
    });

    await step("press ArrowUp to move back to first trigger", async () => {
      await userEvent.keyboard("{ArrowUp}");
      await expect(triggers[0]).toHaveFocus();
    });

    await step("press Home to jump to first trigger", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{Home}");
      await expect(triggers[0]).toHaveFocus();
    });

    await step("press End to jump to last trigger", async () => {
      await userEvent.keyboard("{End}");
      await expect(triggers[2]).toHaveFocus();
    });
  }
);
