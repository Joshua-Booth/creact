import type { Meta, StoryObj } from "@storybook/react-vite";

import { useState } from "react";

import { MinusIcon } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldLegendDescription,
  FieldSet,
  FieldTitle,
} from "../field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";
import { Checkbox } from "./checkbox";

/**
 * A control that allows the user to toggle between checked and not checked.
 */
const meta: Meta<typeof Checkbox> = {
  title: "ui/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    disabled: false,
  },
  render: (args) => (
    <Field>
      <FieldLabel className="flex items-center gap-2">
        <Checkbox {...args} />
        Accept terms and conditions
      </FieldLabel>
    </Field>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the checkbox.
 */
export const Default: Story = {};

/**
 * Use the `disabled` prop to disable the checkbox.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Field data-disabled>
      <FieldLabel>
        <Checkbox {...args} />
        Accept terms and conditions
      </FieldLabel>
    </Field>
  ),
};

/**
 * Use the `indeterminate` prop to show a partially checked state.
 * This is useful for "select all" checkboxes when only some items are selected.
 */
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
  render: (args) => (
    <Field>
      <FieldLabel className="flex items-center gap-2">
        <Checkbox
          {...args}
          render={(props, state) => (
            <span {...props}>
              {state.indeterminate && <MinusIcon className="size-3.5" />}
            </span>
          )}
        />
        Select all items
      </FieldLabel>
    </Field>
  ),
};

/**
 * Checkbox with a description providing additional context below the label.
 */
export const WithDescription: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          // Base UI Checkbox renders both a hidden native checkbox and a visible indicator
          // This causes duplicate form label association warnings
          { id: "form-field-multiple-labels", enabled: false },
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: (args) => (
    <Field orientation="horizontal">
      <Checkbox {...args} id="terms" />
      <FieldContent>
        <FieldTitle>Accept terms and conditions</FieldTitle>
        <FieldDescription>
          You agree to our Terms of Service and Privacy Policy.
        </FieldDescription>
      </FieldContent>
    </Field>
  ),
};

/**
 * Multiple checkboxes grouped together using FieldSet and FieldLegend.
 * Useful for selecting multiple items from a list of options.
 */
export const Group: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: "form-field-multiple-labels", enabled: false },
          { id: "aria-toggle-field-name", enabled: false },
        ],
      },
    },
  },
  render: function Render(args) {
    const [recents, setRecents] = useState(true);
    const [home, setHome] = useState(false);
    const [applications, setApplications] = useState(true);

    return (
      <FieldSet>
        <FieldLegend>Sidebar</FieldLegend>
        <FieldLegendDescription>
          Select the items you want to display in the sidebar.
        </FieldLegendDescription>
        <div className="flex flex-col gap-3 pt-2">
          <Field orientation="horizontal">
            <Checkbox
              {...args}
              id="recents"
              checked={recents}
              onCheckedChange={setRecents}
            />
            <FieldContent>
              <FieldTitle>Recents</FieldTitle>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              {...args}
              id="home"
              checked={home}
              onCheckedChange={setHome}
            />
            <FieldContent>
              <FieldTitle>Home</FieldTitle>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              {...args}
              id="applications"
              checked={applications}
              onCheckedChange={setApplications}
            />
            <FieldContent>
              <FieldTitle>Applications</FieldTitle>
            </FieldContent>
          </Field>
        </div>
      </FieldSet>
    );
  },
};

const tableData = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    role: "Admin",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    email: "marcus.rodriguez@example.com",
    role: "User",
  },
  {
    id: "3",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    role: "User",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@example.com",
    role: "Editor",
  },
];

/**
 * Checkboxes integrated within a data table for row selection.
 * Includes a "select all" checkbox in the header that manages selection state.
 */
export const InTable: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "empty-table-header", enabled: false }],
      },
    },
  },
  render: function Render(args) {
    const [selectedRows, setSelectedRows] = useState<Set<string>>(
      () => new Set(["1"])
    );

    const selectAll = selectedRows.size === tableData.length;

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedRows(new Set(tableData.map((row) => row.id)));
      } else {
        setSelectedRows(new Set());
      }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
      const newSelected = new Set(selectedRows);
      if (checked) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      setSelectedRows(newSelected);
    };

    return (
      <Table className="w-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <Checkbox
                {...args}
                id="select-all-checkbox"
                name="select-all-checkbox"
                aria-label="Select all rows"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row) => (
            <TableRow
              key={row.id}
              data-state={selectedRows.has(row.id) ? "selected" : undefined}
            >
              <TableCell>
                <Checkbox
                  {...args}
                  id={`row-${row.id}-checkbox`}
                  name={`row-${row.id}-checkbox`}
                  aria-label={`Select ${row.name}`}
                  checked={selectedRows.has(row.id)}
                  onCheckedChange={(checked) =>
                    handleSelectRow(row.id, checked === true)
                  }
                />
              </TableCell>
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};

export const ShouldToggleCheck: Story = {
  name: "when the checkbox is clicked, should toggle between checked and not checked",
  tags: ["!dev", "!autodocs"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = await canvas.getByRole("checkbox");
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    await userEvent.click(checkbox, { delay: 100 });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox, { delay: 100 });
    expect(checkbox).toBeChecked();
  },
};
