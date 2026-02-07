import preview from "@/storybook/preview";
import { ChevronRightIcon } from "lucide-react";

import { Badge } from "../badge";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

/**
 * Displays a card with header, content, and footer.
 */
const meta = preview.meta({
  title: "ui/Card",
  component: Card,
  argTypes: {},
  args: {
    className: "w-96",
  },
  parameters: {
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the card, showing a login form with `CardAction`,
 * form inputs, and footer buttons.
 */
export const Default = meta.story({
  render: (args) => (
    <Card {...args} className="w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" size="sm" className="ml-auto h-auto p-0">
                  Forgot your password?
                </Button>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  ),
});

/**
 * A compact card using `size="sm"` for feature highlights.
 */
export const Small = meta.story({
  render: (args) => (
    <Card {...args} size="sm" className="mx-auto w-xs">
      <CardHeader>
        <CardTitle>Scheduled reports</CardTitle>
        <CardDescription>
          Weekly snapshots. No more manual exports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 py-2 text-sm">
          <li className="flex gap-2">
            <ChevronRightIcon
              className="text-muted-foreground mt-0.5 size-4 shrink-0"
            />
            <span>Choose a schedule (daily, or weekly).</span>
          </li>
          <li className="flex gap-2">
            <ChevronRightIcon
              className="text-muted-foreground mt-0.5 size-4 shrink-0"
            />
            <span>Send to channels or specific teammates.</span>
          </li>
          <li className="flex gap-2">
            <ChevronRightIcon
              className="text-muted-foreground mt-0.5 size-4 shrink-0"
            />
            <span>Include charts, tables, and key metrics.</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button size="sm" className="w-full">
          Set up scheduled reports
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          See what&apos;s new
        </Button>
      </CardFooter>
    </Card>
  ),
});

/**
 * A card with a cover image, overlay, badge via `CardAction`, and a
 * call-to-action footer.
 */
export const Image = meta.story({
  render: (args) => (
    <Card {...args} className="relative mx-auto w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src="https://avatar.vercel.sh/shadcn1"
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover brightness-60
          grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>Design systems meetup</CardTitle>
        <CardDescription>
          A practical talk on component APIs, accessibility, and shipping
          faster.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  ),
});
