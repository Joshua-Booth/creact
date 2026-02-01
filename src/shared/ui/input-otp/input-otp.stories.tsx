import type { Meta, StoryObj } from "@storybook/react-vite";

import { useState } from "react";

import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { RefreshCwIcon } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";

import { Button } from "../button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { Field, FieldDescription, FieldLabel } from "../field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./input-otp";

/**
 * Accessible one-time password component with copy paste functionality.
 */
const meta = {
  title: "ui/InputOTP",
  component: InputOTP,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    maxLength: 6,
    onChange: fn(),
    onComplete: fn(),
    pattern: REGEXP_ONLY_DIGITS_AND_CHARS,
    children: null,
    "aria-label": "One-time password",
  },

  render: (args) => (
    <InputOTP {...args} render={undefined}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof InputOTP>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the InputOTP field.
 */
export const Default: Story = {};

/**
 * The number form of the InputOTP field.
 */
export const OnlyNumbers: Story = {
  args: {
    pattern: REGEXP_ONLY_DIGITS,
  },
};

/**
 * Use the `<InputOTPSeparator />` component to add a separator between input groups.
 */
export const Separator: Story = {
  render: (args) => (
    <InputOTP {...args} render={undefined}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

export const ShouldAcceptTextWhenTyping: Story = {
  name: "when typing text, should call onChange and onComplete",
  tags: ["!dev", "!autodocs"],
  play: async ({ args, canvas, step }) => {
    const inputTextbox = await canvas.findByRole("textbox");

    await step("type into input textbox", async () => {
      await userEvent.click(inputTextbox);
      await userEvent.type(inputTextbox, "mocked");
      expect(args.onChange).toHaveBeenCalledTimes(6);
    });

    await step("finish typing by pressing Enter", async () => {
      await userEvent.keyboard("{enter}");
      expect(args.onComplete).toHaveBeenCalledTimes(1);
    });
  },
};

export const ShouldAcceptOnlyNumbersWhenRestricted: Story = {
  ...OnlyNumbers,
  name: "when only numbers are allowed, should call onChange for numbers and onComplete",
  tags: ["!dev", "!autodocs"],
  play: async ({ args, canvas, step }) => {
    const inputTextbox = await canvas.findByRole("textbox");

    await step("type text into input textbox", async () => {
      await userEvent.click(inputTextbox);
      await userEvent.type(inputTextbox, "mocked");
      expect(args.onChange).toHaveBeenCalledTimes(0);
    });

    await step("type numbers into input textbox", async () => {
      await userEvent.type(inputTextbox, "123456");
      expect(args.onChange).toHaveBeenCalledTimes(6);
    });

    await step("finish typing by pressing Enter", async () => {
      await userEvent.keyboard("{enter}");
      expect(args.onComplete).toHaveBeenCalledTimes(1);
    });
  },
};

/**
 * Use the `disabled` prop to disable the input and prevent interactions.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

/**
 * Use the `value` and `onChange` props to control the input value externally.
 */
export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [value, setValue] = useState("");

    return (
      <div className="space-y-2">
        <InputOTP
          {...args}
          render={undefined}
          value={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="text-muted-foreground text-center text-sm">
          {value === "" ? (
            <>Enter your one-time password.</>
          ) : (
            <>You entered: {value}</>
          )}
        </div>
      </div>
    );
  },
};

/**
 * Use `aria-invalid` on slots to indicate an invalid or error state.
 */
export const Invalid: Story = {
  render: (args) => (
    <InputOTP {...args} render={undefined}>
      <InputOTPGroup aria-invalid="true">
        <InputOTPSlot index={0} aria-invalid="true" />
        <InputOTPSlot index={1} aria-invalid="true" />
        <InputOTPSlot index={2} aria-invalid="true" />
        <InputOTPSlot index={3} aria-invalid="true" />
        <InputOTPSlot index={4} aria-invalid="true" />
        <InputOTPSlot index={5} aria-invalid="true" />
      </InputOTPGroup>
    </InputOTP>
  ),
};

/**
 * A 4-digit OTP variant commonly used for PIN codes.
 */
export const FourDigits: Story = {
  args: {
    maxLength: 4,
    pattern: REGEXP_ONLY_DIGITS,
  },
  render: (args) => (
    <InputOTP {...args} render={undefined}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

/**
 * OTP input integrated with a form using Field and Card components.
 */
export const Form: Story = {
  render: (args) => (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Verify your login</CardTitle>
        <CardDescription>
          Enter the verification code we sent to your email address:{" "}
          <span className="font-medium">m@example.com</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="otp-verification">
              Verification code
            </FieldLabel>
            <Button variant="outline" size="xs">
              <RefreshCwIcon />
              Resend Code
            </Button>
          </div>
          <InputOTP {...args} render={undefined} id="otp-verification" required>
            <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator className="mx-2" />
            <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription>
            <span className="hover:text-primary cursor-pointer underline underline-offset-4 transition-colors">
              I no longer have access to this email address.
            </span>
          </FieldDescription>
        </Field>
      </CardContent>
      <CardFooter>
        <Field>
          <Button type="submit" className="w-full">
            Verify
          </Button>
          <div className="text-muted-foreground text-sm">
            Having trouble signing in?{" "}
            <span className="hover:text-primary cursor-pointer underline underline-offset-4 transition-colors">
              Contact support
            </span>
          </div>
        </Field>
      </CardFooter>
    </Card>
  ),
};
