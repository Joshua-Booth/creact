import { MemoryRouter, Link as RouterLink } from "react-router";

import preview from "@/storybook/preview";

import { Button } from "../button";
import { Field, FieldLabel } from "../field/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

/**
 * Pagination with page navigation, next and previous links.
 */
const meta = preview.meta({
  title: "ui/Pagination",
  component: Pagination,
  argTypes: {},
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  parameters: {
    docs: {
      description: {
        component:
          "Pagination with page navigation, next and previous links.\n\n[shadcn/ui docs](https://ui.shadcn.com/docs/components/base/pagination)",
      },
    },
    layout: "centered",
  },
});

// --- Stories ---

/**
 * The default form of the pagination.
 */
export const Default = meta.story();

/**
 * Simple pagination with just page numbers.
 */
export const Simple = meta.story({
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">4</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">5</PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
});

/**
 * Pagination with rows per page selector and prev/next icons.
 */
export const IconsOnly = meta.story({
  render: (args) => (
    <div className="flex items-center justify-between gap-4">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel
          htmlFor="select-rows-per-page"
          className="whitespace-nowrap"
        >
          Rows per page
        </FieldLabel>
        <Select defaultValue="10">
          <SelectTrigger id="select-rows-per-page" className="w-20">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Pagination {...args} className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ),
});

/**
 * Pagination using React Router `Link` components for client-side navigation.
 */
export const ReactRouter = meta.story({
  name: "React Router",
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  render: (args) => (
    <Pagination {...args}>
      <PaginationContent>
        <PaginationItem>
          <Button variant="ghost" size="icon" render={<RouterLink to="/1" />}>
            1
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button variant="outline" size="icon" render={<RouterLink to="/2" />}>
            2
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button variant="ghost" size="icon" render={<RouterLink to="/3" />}>
            3
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
});
