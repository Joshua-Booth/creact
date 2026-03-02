import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { ModeToggle } from "@/shared/ui/mode-toggle";
import { NativeSelect, NativeSelectOption } from "@/shared/ui/native-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/shared/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Separator } from "@/shared/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Skeleton } from "@/shared/ui/skeleton";
import { Slider } from "@/shared/ui/slider";
import { Switch } from "@/shared/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Textarea } from "@/shared/ui/textarea";
import { Toggle } from "@/shared/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

/* -------------------------------------------------------------------------- */
/*  Token Data                                                                */
/* -------------------------------------------------------------------------- */

const SEMANTIC_TOKENS = [
  { name: "background", var: "--background" },
  { name: "foreground", var: "--foreground" },
  { name: "card", var: "--card" },
  { name: "card-foreground", var: "--card-foreground" },
  { name: "popover", var: "--popover" },
  { name: "popover-foreground", var: "--popover-foreground" },
  { name: "primary", var: "--primary" },
  { name: "primary-foreground", var: "--primary-foreground" },
  { name: "secondary", var: "--secondary" },
  { name: "secondary-foreground", var: "--secondary-foreground" },
  { name: "muted", var: "--muted" },
  { name: "muted-foreground", var: "--muted-foreground" },
  { name: "accent", var: "--accent" },
  { name: "accent-foreground", var: "--accent-foreground" },
  { name: "destructive", var: "--destructive" },
  { name: "border", var: "--border" },
  { name: "input", var: "--input" },
  { name: "ring", var: "--ring" },
] as const;

const CHART_TOKENS = [
  { name: "chart-1", var: "--chart-1" },
  { name: "chart-2", var: "--chart-2" },
  { name: "chart-3", var: "--chart-3" },
  { name: "chart-4", var: "--chart-4" },
  { name: "chart-5", var: "--chart-5" },
] as const;

const SIDEBAR_TOKENS = [
  { name: "sidebar", var: "--sidebar" },
  { name: "sidebar-foreground", var: "--sidebar-foreground" },
  { name: "sidebar-primary", var: "--sidebar-primary" },
  { name: "sidebar-primary-foreground", var: "--sidebar-primary-foreground" },
  { name: "sidebar-accent", var: "--sidebar-accent" },
  { name: "sidebar-accent-foreground", var: "--sidebar-accent-foreground" },
  { name: "sidebar-border", var: "--sidebar-border" },
  { name: "sidebar-ring", var: "--sidebar-ring" },
] as const;

const OPACITY_PATTERNS = [
  { class: "bg-primary/10", label: "bg-primary/10" },
  { class: "bg-primary/50", label: "bg-primary/50" },
  { class: "bg-primary/80", label: "bg-primary/80" },
  { class: "bg-input/30", label: "bg-input/30" },
  { class: "bg-input/50", label: "bg-input/50" },
  { class: "bg-muted/50", label: "bg-muted/50" },
  { class: "bg-destructive/10", label: "bg-destructive/10" },
  { class: "bg-destructive/20", label: "bg-destructive/20" },
  { class: "bg-black/10", label: "bg-black/10" },
  { class: "bg-black/35", label: "bg-black/35" },
] as const;

const RING_PATTERNS = [
  { class: "ring-2 ring-ring/50", label: "ring-ring/50" },
  { class: "ring-2 ring-destructive/20", label: "ring-destructive/20" },
  { class: "ring-2 ring-destructive/40", label: "ring-destructive/40" },
  { class: "ring-2 ring-foreground/10", label: "ring-foreground/10" },
] as const;

const BORDER_PATTERNS = [
  { class: "border border-border", label: "border-border" },
  { class: "border border-border/50", label: "border-border/50" },
  { class: "border border-destructive/50", label: "border-destructive/50" },
  { class: "border border-input", label: "border-input" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Section: Token Swatches                                                   */
/* -------------------------------------------------------------------------- */

function TokenSwatches() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Semantic Color Tokens</h2>
      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4
          lg:grid-cols-6"
      >
        {SEMANTIC_TOKENS.map((token) => (
          <div key={token.name} className="flex flex-col gap-1.5">
            <div
              className="border-border h-12 rounded-md border"
              style={{ backgroundColor: `var(${token.var})` }}
            />
            <span className="text-muted-foreground font-mono text-xs">
              {token.name}
            </span>
          </div>
        ))}
      </div>

      <h3 className="mt-6 mb-2 text-lg font-medium">Chart Tokens</h3>
      <div className="grid grid-cols-5 gap-3">
        {CHART_TOKENS.map((token) => (
          <div key={token.name} className="flex flex-col gap-1.5">
            <div
              className="border-border h-12 rounded-md border"
              style={{ backgroundColor: `var(${token.var})` }}
            />
            <span className="text-muted-foreground font-mono text-xs">
              {token.name}
            </span>
          </div>
        ))}
      </div>

      <h3 className="mt-6 mb-2 text-lg font-medium">Sidebar Tokens</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {SIDEBAR_TOKENS.map((token) => (
          <div key={token.name} className="flex flex-col gap-1.5">
            <div
              className="border-border h-12 rounded-md border"
              style={{ backgroundColor: `var(${token.var})` }}
            />
            <span className="text-muted-foreground font-mono text-xs">
              {token.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Token Pairs (foreground on background)                           */
/* -------------------------------------------------------------------------- */

function TokenPairs() {
  const pairs = [
    {
      bg: "--background",
      fg: "--foreground",
      label: "background / foreground",
    },
    { bg: "--card", fg: "--card-foreground", label: "card / card-foreground" },
    {
      bg: "--popover",
      fg: "--popover-foreground",
      label: "popover / popover-foreground",
    },
    {
      bg: "--primary",
      fg: "--primary-foreground",
      label: "primary / primary-foreground",
    },
    {
      bg: "--secondary",
      fg: "--secondary-foreground",
      label: "secondary / secondary-foreground",
    },
    {
      bg: "--muted",
      fg: "--muted-foreground",
      label: "muted / muted-foreground",
    },
    {
      bg: "--accent",
      fg: "--accent-foreground",
      label: "accent / accent-foreground",
    },
    {
      bg: "--destructive",
      fg: "--primary-foreground",
      label: "destructive / primary-foreground",
    },
  ] as const;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">
        Token Pairs (Contrast Check)
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {pairs.map((p) => (
          <div
            key={p.label}
            className="border-border flex flex-col justify-center rounded-md
              border p-4"
            style={{
              backgroundColor: `var(${p.bg})`,
              color: `var(${p.fg})`,
            }}
          >
            <span className="text-sm font-medium">Sample Text</span>
            <span className="font-mono text-xs opacity-80">{p.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Opacity Modifier Patterns                                        */
/* -------------------------------------------------------------------------- */

function OpacityPatterns() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Opacity Modifier Patterns</h2>

      <h3 className="mb-2 text-lg font-medium">Backgrounds</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {OPACITY_PATTERNS.map((p) => (
          <div key={p.label} className="flex flex-col gap-1.5">
            <div
              className={`border-border h-12 rounded-md border ${p.class}`}
            />
            <span className="text-muted-foreground font-mono text-xs">
              {p.label}
            </span>
          </div>
        ))}
      </div>

      <h3 className="mt-6 mb-2 text-lg font-medium">Rings</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {RING_PATTERNS.map((p) => (
          <div key={p.label} className="flex flex-col gap-1.5">
            <div className={`bg-background h-12 rounded-md ${p.class}`} />
            <span className="text-muted-foreground font-mono text-xs">
              {p.label}
            </span>
          </div>
        ))}
      </div>

      <h3 className="mt-6 mb-2 text-lg font-medium">Borders</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BORDER_PATTERNS.map((p) => (
          <div key={p.label} className="flex flex-col gap-1.5">
            <div className={`bg-background h-12 rounded-md ${p.class}`} />
            <span className="text-muted-foreground font-mono text-xs">
              {p.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Text Hierarchy                                                   */
/* -------------------------------------------------------------------------- */

function TextHierarchy() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Text Hierarchy</h2>
      <div className="space-y-2">
        <p className="text-foreground">text-foreground — Primary text</p>
        <p className="text-foreground/60">
          text-foreground/60 — Reduced emphasis
        </p>
        <p className="text-muted-foreground">
          text-muted-foreground — Secondary text
        </p>
        <p className="text-destructive">text-destructive — Error text</p>
        <p className="text-destructive/90">
          text-destructive/90 — Muted error text
        </p>
        <p className="text-primary">text-primary — Brand/accent text</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Buttons & Badges                                                 */
/* -------------------------------------------------------------------------- */

function ButtonsAndBadges() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Buttons & Badges</h2>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-lg font-medium">Button Variants</h3>
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Button Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">Large</Button>
            <Button size="default">Default</Button>
            <Button size="sm">Small</Button>
            <Button size="icon">+</Button>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Disabled Buttons</h3>
          <div className="flex flex-wrap gap-3">
            <Button disabled>Default</Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
            <Button variant="destructive" disabled>
              Destructive
            </Button>
            <Button variant="outline" disabled>
              Outline
            </Button>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Badge Variants</h3>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Form Controls                                                    */
/* -------------------------------------------------------------------------- */

function FormControls() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Form Controls</h2>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Text Inputs</h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="input-default">Default Input</Label>
              <Input id="input-default" placeholder="Type something..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="input-disabled">Disabled Input</Label>
              <Input id="input-disabled" placeholder="Disabled" disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="textarea-demo">Textarea</Label>
              <Textarea
                id="textarea-demo"
                placeholder="Write a longer message..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Select Controls</h3>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Radix Select</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option-1">Option 1</SelectItem>
                  <SelectItem value="option-2">Option 2</SelectItem>
                  <SelectItem value="option-3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="native-select-demo">Native Select</Label>
              <NativeSelect id="native-select-demo" defaultValue="">
                <NativeSelectOption value="" disabled>
                  Choose an option
                </NativeSelectOption>
                <NativeSelectOption value="a">Option A</NativeSelectOption>
                <NativeSelectOption value="b">Option B</NativeSelectOption>
                <NativeSelectOption value="c">Option C</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Checkboxes & Switches</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox id="check-1" />
              <Label htmlFor="check-1">Unchecked checkbox</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="check-2" defaultChecked />
              <Label htmlFor="check-2">Checked checkbox</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="check-3" disabled />
              <Label htmlFor="check-3" className="text-muted-foreground">
                Disabled checkbox
              </Label>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Switch id="switch-1" />
              <Label htmlFor="switch-1">Switch off</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="switch-2" defaultChecked />
              <Label htmlFor="switch-2">Switch on</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="switch-3" disabled />
              <Label htmlFor="switch-3" className="text-muted-foreground">
                Switch disabled
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Radio Group</h3>
          <RadioGroup defaultValue="option-1">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="option-1" id="radio-1" />
              <Label htmlFor="radio-1">Option 1</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="option-2" id="radio-2" />
              <Label htmlFor="radio-2">Option 2</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="option-3" id="radio-3" />
              <Label htmlFor="radio-3">Option 3</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Toggles                                                          */
/* -------------------------------------------------------------------------- */

function Toggles() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Toggles</h2>
      <div className="space-y-4">
        <div>
          <h3 className="mb-3 text-lg font-medium">Individual Toggles</h3>
          <div className="flex flex-wrap gap-3">
            <Toggle>Default</Toggle>
            <Toggle variant="outline">Outline</Toggle>
            <Toggle disabled>Disabled</Toggle>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">Toggle Group</h3>
          <ToggleGroup defaultValue={["center"]}>
            <ToggleGroupItem value="left">Left</ToggleGroupItem>
            <ToggleGroupItem value="center">Center</ToggleGroupItem>
            <ToggleGroupItem value="right">Right</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-medium">Toggle Group (Outline)</h3>
          <ToggleGroup variant="outline" defaultValue={["bold"]}>
            <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
            <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
            <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Cards                                                            */
/* -------------------------------------------------------------------------- */

function Cards() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Cards</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Default Card</CardTitle>
            <CardDescription>
              Standard background and border tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Uses card/card-foreground.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Card with Footer</CardTitle>
            <CardDescription>Actions in footer area</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Some card content goes here.
            </p>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button size="sm">Save</Button>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nested Elements</CardTitle>
            <CardDescription>Badges, inputs, and text</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Badge>Active</Badge>
              <Badge variant="secondary">Draft</Badge>
            </div>
            <Input placeholder="Card input" />
            <p className="text-muted-foreground text-xs">
              Muted text inside a card
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Alerts                                                           */
/* -------------------------------------------------------------------------- */

function Alerts() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Alerts</h2>
      <div className="space-y-3">
        <Alert>
          <AlertTitle>Default Alert</AlertTitle>
          <AlertDescription>
            Standard informational alert with default border and background.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Destructive Alert</AlertTitle>
          <AlertDescription>
            Error state using destructive token and bg-destructive/10 overlay.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Tabs                                                             */
/* -------------------------------------------------------------------------- */

function TabsDemo() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Tabs</h2>
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Active</TabsTrigger>
          <TabsTrigger value="tab2">Inactive</TabsTrigger>
          <TabsTrigger value="tab3">Another</TabsTrigger>
          <TabsTrigger value="tab4" disabled>
            Disabled
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm">
                Active tab. Uses ring-ring/50 focus indicator and
                text-foreground/60 for inactive triggers.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tab2">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm">Second tab.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tab3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm">Third tab.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Accordion                                                        */
/* -------------------------------------------------------------------------- */

function AccordionDemo() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Accordion</h2>
      <Accordion className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Background Tokens</AccordionTrigger>
          <AccordionContent>
            background, card, popover, muted, accent, and secondary all define
            surface colors. Foreground variants define text on those surfaces.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Border & Input Tokens</AccordionTrigger>
          <AccordionContent>
            border is for decorative borders (Radix step 6). input is for
            interactive borders (step 7). ring is for focus indicators (step 8).
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Opacity Modifiers</AccordionTrigger>
          <AccordionContent>
            Tailwind v4 uses color-mix() for opacity: bg-primary/50 becomes
            color-mix(in oklch, var(--color-primary) 50%, transparent).
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Avatars                                                          */
/* -------------------------------------------------------------------------- */

function Avatars() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Avatars</h2>
      <div className="flex flex-wrap items-center gap-6">
        <div className="space-y-1.5">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground text-center font-mono text-xs">
            image
          </p>
        </div>
        <div className="space-y-1.5">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground text-center font-mono text-xs">
            fallback
          </p>
        </div>
        <div className="space-y-1.5">
          <AvatarGroup>
            <Avatar>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+5</AvatarGroupCount>
          </AvatarGroup>
          <p className="text-muted-foreground text-center font-mono text-xs">
            group
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Loading States                                                   */
/* -------------------------------------------------------------------------- */

function LoadingStates() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Loading & Progress</h2>
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-lg font-medium">Progress</h3>
          <div className="space-y-3">
            <Progress value={25}>
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
            <Progress value={60}>
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
            <Progress value={100}>
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Skeleton</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Slider</h3>
          <div className="max-w-sm space-y-3">
            <Slider defaultValue={[50]} max={100} step={1} />
            <Slider defaultValue={[25, 75]} max={100} step={1} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Overlays & Popovers                                              */
/* -------------------------------------------------------------------------- */

function OverlaysAndPopovers() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Overlays & Popovers</h2>
      <p className="text-muted-foreground mb-4 text-sm">
        These test popover/popover-foreground tokens, bg-black/10 overlays, and
        focus ring indicators.
      </p>
      <div className="flex flex-wrap gap-3">
        {/* Dialog */}
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            Open Dialog
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                Uses popover tokens for background. Check the overlay backdrop
                (bg-black/10).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-4">
              <Input placeholder="Dialog input" />
              <p className="text-muted-foreground text-sm">
                Muted text inside dialog.
              </p>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sheet */}
        <Sheet>
          <SheetTrigger render={<Button variant="outline" />}>
            Open Sheet
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>
                Side panel using background/foreground tokens.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-3 py-4">
              <Input placeholder="Sheet input" />
              <div className="flex items-center gap-3">
                <Checkbox id="sheet-check" />
                <Label htmlFor="sheet-check">Agree to terms</Label>
              </div>
            </div>
            <SheetFooter>
              <SheetClose render={<Button variant="outline" />}>
                Cancel
              </SheetClose>
              <Button>Save</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Drawer */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
              <DrawerDescription>
                Bottom drawer with bg-black overlay backdrop.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-4">
              <p className="text-muted-foreground text-sm">
                Drawer content area.
              </p>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* Popover */}
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            Open Popover
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">Popover</h4>
              <p className="text-muted-foreground text-sm">
                Uses popover/popover-foreground tokens.
              </p>
              <Input placeholder="Popover input" />
            </div>
          </PopoverContent>
        </Popover>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Open Menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline" />}>
              Hover for Tooltip
            </TooltipTrigger>
            <TooltipContent>
              <p>Tooltip uses popover tokens</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Focus States                                                     */
/* -------------------------------------------------------------------------- */

function FocusStates() {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Focus States</h2>
      <p className="text-muted-foreground mb-3 text-sm">
        Tab through these to see ring-ring/50 and ring-destructive focus
        indicators:
      </p>
      <div className="flex flex-wrap gap-3">
        <Button>Default focus</Button>
        <Button variant="secondary">Secondary focus</Button>
        <Button variant="outline">Outline focus</Button>
        <Button variant="destructive">Destructive focus</Button>
        <Input placeholder="Input focus" className="max-w-48" />
        <Checkbox />
        <Switch />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Radix 12-Step Color Scales                                       */
/* -------------------------------------------------------------------------- */

const RADIX_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

// Static class map — Tailwind needs literal class names to generate utilities.
// Dynamic `bg-${scale}-${step}` won't be detected by Tailwind's JIT scanner.
const RADIX_BG: Record<string, Record<number, string>> = {
  gray: {
    1: "bg-gray-1",
    2: "bg-gray-2",
    3: "bg-gray-3",
    4: "bg-gray-4",
    5: "bg-gray-5",
    6: "bg-gray-6",
    7: "bg-gray-7",
    8: "bg-gray-8",
    9: "bg-gray-9",
    10: "bg-gray-10",
    11: "bg-gray-11",
    12: "bg-gray-12",
  },
  blue: {
    1: "bg-blue-1",
    2: "bg-blue-2",
    3: "bg-blue-3",
    4: "bg-blue-4",
    5: "bg-blue-5",
    6: "bg-blue-6",
    7: "bg-blue-7",
    8: "bg-blue-8",
    9: "bg-blue-9",
    10: "bg-blue-10",
    11: "bg-blue-11",
    12: "bg-blue-12",
  },
  red: {
    1: "bg-red-1",
    2: "bg-red-2",
    3: "bg-red-3",
    4: "bg-red-4",
    5: "bg-red-5",
    6: "bg-red-6",
    7: "bg-red-7",
    8: "bg-red-8",
    9: "bg-red-9",
    10: "bg-red-10",
    11: "bg-red-11",
    12: "bg-red-12",
  },
};

// Alpha variant class map (bg-gray-a1 through bg-gray-a12, etc.)
const RADIX_ALPHA_BG: Record<string, Record<number, string>> = {
  gray: {
    1: "bg-gray-a1",
    2: "bg-gray-a2",
    3: "bg-gray-a3",
    4: "bg-gray-a4",
    5: "bg-gray-a5",
    6: "bg-gray-a6",
    7: "bg-gray-a7",
    8: "bg-gray-a8",
    9: "bg-gray-a9",
    10: "bg-gray-a10",
    11: "bg-gray-a11",
    12: "bg-gray-a12",
  },
  blue: {
    1: "bg-blue-a1",
    2: "bg-blue-a2",
    3: "bg-blue-a3",
    4: "bg-blue-a4",
    5: "bg-blue-a5",
    6: "bg-blue-a6",
    7: "bg-blue-a7",
    8: "bg-blue-a8",
    9: "bg-blue-a9",
    10: "bg-blue-a10",
    11: "bg-blue-a11",
    12: "bg-blue-a12",
  },
  red: {
    1: "bg-red-a1",
    2: "bg-red-a2",
    3: "bg-red-a3",
    4: "bg-red-a4",
    5: "bg-red-a5",
    6: "bg-red-a6",
    7: "bg-red-a7",
    8: "bg-red-a8",
    9: "bg-red-a9",
    10: "bg-red-a10",
    11: "bg-red-a11",
    12: "bg-red-a12",
  },
  black: {
    1: "bg-black-a1",
    2: "bg-black-a2",
    3: "bg-black-a3",
    4: "bg-black-a4",
    5: "bg-black-a5",
    6: "bg-black-a6",
    7: "bg-black-a7",
    8: "bg-black-a8",
    9: "bg-black-a9",
    10: "bg-black-a10",
    11: "bg-black-a11",
    12: "bg-black-a12",
  },
  white: {
    1: "bg-white-a1",
    2: "bg-white-a2",
    3: "bg-white-a3",
    4: "bg-white-a4",
    5: "bg-white-a5",
    6: "bg-white-a6",
    7: "bg-white-a7",
    8: "bg-white-a8",
    9: "bg-white-a9",
    10: "bg-white-a10",
    11: "bg-white-a11",
    12: "bg-white-a12",
  },
};

const STEP_LABELS = [
  "App bg",
  "Subtle bg",
  "Element bg",
  "Hovered bg",
  "Active bg",
  "Subtle border",
  "Border",
  "Strong border",
  "Solid bg",
  "Solid hover",
  "Lo-text",
  "Hi-text",
] as const;

function RadixScales() {
  return (
    <section>
      <h2 className="mb-2 text-2xl font-semibold">
        Radix 12-Step Color Scales
      </h2>
      <p className="text-muted-foreground mb-4 text-sm">
        Direct Radix utility classes via radix-colors-tailwind (bg-gray-3,
        text-blue-11, etc.). These auto-switch in dark mode.
      </p>

      {/* Step labels */}
      <div className="mb-1 hidden grid-cols-12 gap-1 lg:grid">
        {STEP_LABELS.map((label, i) => (
          <span
            key={label}
            className="text-muted-foreground text-center font-mono text-[10px]"
          >
            {i + 1}
          </span>
        ))}
      </div>

      {/* Scale swatches use CSS variables directly to avoid Tailwind dynamic class issues */}
      {(["gray", "blue", "red"] as const).map((scale) => (
        <div key={scale} className="mb-1">
          <span className="text-muted-foreground mb-1 block font-mono text-xs">
            {scale}
          </span>
          <div className="grid grid-cols-12 gap-1">
            {RADIX_STEPS.map((step) => (
              <div
                key={step}
                className={`border-border/50 h-10 rounded-sm border
                ${RADIX_BG[scale][step]}`}
                title={`${scale}-${step}: ${STEP_LABELS[step - 1]}`}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Alpha scale swatches */}
      <h3 className="mt-6 mb-2 text-lg font-medium">Alpha Scales</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        Transparent versions of each step. These composite naturally over any
        background — ideal for overlays, tints on colored surfaces, and shadows.
      </p>

      {/* Alpha step labels */}
      <div className="mb-1 hidden grid-cols-12 gap-1 lg:grid">
        {RADIX_STEPS.map((step) => (
          <span
            key={step}
            className="text-muted-foreground text-center font-mono text-[10px]"
          >
            a{step}
          </span>
        ))}
      </div>

      {/* Color alpha swatches (on white-ish bg to show transparency) */}
      {(["gray", "blue", "red"] as const).map((scale) => (
        <div key={scale} className="mb-1">
          <span className="text-muted-foreground mb-1 block font-mono text-xs">
            {scale} alpha
          </span>
          <div className="grid grid-cols-12 gap-1">
            {RADIX_STEPS.map((step) => (
              <div
                key={step}
                className={`border-border/50 h-10 rounded-sm border
                ${RADIX_ALPHA_BG[scale][step]}`}
                title={`${scale}-a${step}`}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Black/white alpha on contrasting backgrounds */}
      <div className="mb-1">
        <span className="text-muted-foreground mb-1 block font-mono text-xs">
          black alpha
        </span>
        <div className="grid grid-cols-12 gap-1 rounded-sm bg-white p-1">
          {RADIX_STEPS.map((step) => (
            <div
              key={step}
              className={`h-10 rounded-sm ${RADIX_ALPHA_BG.black[step]}`}
              title={`black-a${step}`}
            />
          ))}
        </div>
      </div>
      <div className="mb-1">
        <span className="text-muted-foreground mb-1 block font-mono text-xs">
          white alpha
        </span>
        <div className="grid grid-cols-12 gap-1 rounded-sm bg-black p-1">
          {RADIX_STEPS.map((step) => (
            <div
              key={step}
              className={`h-10 rounded-sm ${RADIX_ALPHA_BG.white[step]}`}
              title={`white-a${step}`}
            />
          ))}
        </div>
      </div>

      {/* Usage examples */}
      <h3 className="mt-6 mb-3 text-lg font-medium">
        Radix-Native Component Pattern
      </h3>
      <p className="text-muted-foreground mb-3 text-sm">
        How you&apos;d build new components using Radix steps directly (not
        through the shadcn bridge):
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Interactive button-like element using steps 3→4→5 */}
        <div className="space-y-2">
          <span className="text-muted-foreground font-mono text-xs">
            bg steps 3→4→5
          </span>
          <div className="flex gap-2">
            <div
              className="bg-gray-3 text-gray-12 flex h-9 items-center rounded-md
                px-4 text-sm"
            >
              Normal
            </div>
            <div
              className="bg-gray-4 text-gray-12 flex h-9 items-center rounded-md
                px-4 text-sm"
            >
              Hovered
            </div>
            <div
              className="bg-gray-5 text-gray-12 flex h-9 items-center rounded-md
                px-4 text-sm"
            >
              Active
            </div>
          </div>
        </div>

        {/* Blue accent buttons */}
        <div className="space-y-2">
          <span className="text-muted-foreground font-mono text-xs">
            blue 9→10 solid
          </span>
          <div className="flex gap-2">
            <div
              className="bg-blue-9 flex h-9 items-center rounded-md px-4 text-sm
                text-white"
            >
              Solid
            </div>
            <div
              className="bg-blue-10 flex h-9 items-center rounded-md px-4
                text-sm text-white"
            >
              Hovered
            </div>
          </div>
        </div>

        {/* Border hierarchy: steps 6, 7, 8 */}
        <div className="space-y-2">
          <span className="text-muted-foreground font-mono text-xs">
            border steps 6→7→8
          </span>
          <div className="flex gap-2">
            <div
              className="border-gray-6 flex h-9 items-center rounded-md border
                px-4 text-sm"
            >
              Subtle
            </div>
            <div
              className="border-gray-7 flex h-9 items-center rounded-md border
                px-4 text-sm"
            >
              Default
            </div>
            <div
              className="border-gray-8 flex h-9 items-center rounded-md border-2
                px-4 text-sm"
            >
              Strong
            </div>
          </div>
        </div>

        {/* Text hierarchy: steps 11 and 12 */}
        <div className="space-y-2">
          <span className="text-muted-foreground font-mono text-xs">
            text steps 11, 12
          </span>
          <div className="bg-gray-2 space-y-1 rounded-md p-3">
            <p className="text-gray-12 text-sm">High-contrast text (12)</p>
            <p className="text-gray-11 text-sm">Low-contrast text (11)</p>
          </div>
        </div>

        {/* Red destructive */}
        <div className="space-y-2">
          <span className="text-muted-foreground font-mono text-xs">
            red 3→9→11
          </span>
          <div className="flex gap-2">
            <div
              className="bg-red-3 text-red-11 flex h-9 items-center rounded-md
                px-4 text-sm"
            >
              Subtle
            </div>
            <div
              className="bg-red-9 flex h-9 items-center rounded-md px-4 text-sm
                text-white"
            >
              Solid
            </div>
          </div>
        </div>

        {/* Blue info */}
        <div className="space-y-2">
          <span className="text-muted-foreground font-mono text-xs">
            blue 3→9→11
          </span>
          <div className="flex gap-2">
            <div
              className="bg-blue-3 text-blue-11 flex h-9 items-center rounded-md
                px-4 text-sm"
            >
              Subtle
            </div>
            <div
              className="bg-blue-9 flex h-9 items-center rounded-md px-4 text-sm
                text-white"
            >
              Solid
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page Root                                                                 */
/* -------------------------------------------------------------------------- */

export function KitchenSinkPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 pt-8 pb-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kitchen Sink</h1>
          <p className="text-muted-foreground">
            Visual verification of color tokens, opacity patterns, and
            components
          </p>
        </div>
        <ModeToggle />
      </div>

      <div className="space-y-12">
        <TokenSwatches />
        <Separator />
        <TokenPairs />
        <Separator />
        <OpacityPatterns />
        <Separator />
        <TextHierarchy />
        <Separator />
        <ButtonsAndBadges />
        <Separator />
        <FormControls />
        <Separator />
        <Toggles />
        <Separator />
        <Cards />
        <Separator />
        <Alerts />
        <Separator />
        <TabsDemo />
        <Separator />
        <AccordionDemo />
        <Separator />
        <Avatars />
        <Separator />
        <LoadingStates />
        <Separator />
        <OverlaysAndPopovers />
        <Separator />
        <FocusStates />
        <Separator />
        <RadixScales />
      </div>
    </main>
  );
}
