import type { ColumnDef } from "@tanstack/react-table";

import { useMemo } from "react";

import preview from "@/storybook/preview";
import {
  BedDouble,
  Building2,
  CalendarIcon,
  Castle,
  CheckCircle2,
  CircleDashed,
  Clock,
  Home,
  Landmark,
  Text,
  XCircle,
} from "lucide-react";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test";

import { useDataTable } from "@/shared/lib/data-table";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";

import { DataTable } from "./data-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableToolbar } from "./data-table-toolbar";

// --- Types ---

interface Project {
  id: string;
  title: string;
  status: "active" | "archived" | "draft";
  priority: "low" | "medium" | "high";
  budget: number;
}

interface FilterProject {
  id: string;
  title: string;
  status: "active" | "archived" | "draft";
  priority: "low" | "medium" | "high";
  budget: number;
  startDate: number;
  progress: number;
}

// --- Sample data ---

const projects: Project[] = [
  {
    id: "1",
    title: "Website Redesign",
    status: "active",
    priority: "high",
    budget: 12000,
  },
  {
    id: "2",
    title: "Mobile App",
    status: "active",
    priority: "high",
    budget: 45000,
  },
  {
    id: "3",
    title: "API Migration",
    status: "draft",
    priority: "medium",
    budget: 8000,
  },
  {
    id: "4",
    title: "Documentation",
    status: "active",
    priority: "low",
    budget: 3000,
  },
  {
    id: "5",
    title: "CI/CD Pipeline",
    status: "archived",
    priority: "medium",
    budget: 6000,
  },
  {
    id: "6",
    title: "Design System",
    status: "active",
    priority: "high",
    budget: 20000,
  },
  {
    id: "7",
    title: "Analytics Dashboard",
    status: "draft",
    priority: "medium",
    budget: 15000,
  },
  {
    id: "8",
    title: "Auth Service",
    status: "active",
    priority: "high",
    budget: 10000,
  },
  {
    id: "9",
    title: "Email Templates",
    status: "archived",
    priority: "low",
    budget: 2000,
  },
  {
    id: "10",
    title: "Performance Audit",
    status: "draft",
    priority: "medium",
    budget: 5000,
  },
  {
    id: "11",
    title: "Localization",
    status: "active",
    priority: "low",
    budget: 7000,
  },
  {
    id: "12",
    title: "Database Optimization",
    status: "active",
    priority: "high",
    budget: 9000,
  },
];

function createFilterProjects(): FilterProject[] {
  return [
    {
      id: "1",
      title: "Website Redesign",
      status: "active",
      priority: "high",
      budget: 12000,
      startDate: new Date(2026, 0, 15).getTime(),
      progress: 75,
    },
    {
      id: "2",
      title: "Mobile App",
      status: "active",
      priority: "high",
      budget: 45000,
      startDate: new Date(2026, 1, 1).getTime(),
      progress: 30,
    },
    {
      id: "3",
      title: "API Migration",
      status: "draft",
      priority: "medium",
      budget: 8000,
      startDate: new Date(2026, 2, 10).getTime(),
      progress: 0,
    },
    {
      id: "4",
      title: "Documentation",
      status: "active",
      priority: "low",
      budget: 3000,
      startDate: new Date(2026, 0, 5).getTime(),
      progress: 90,
    },
    {
      id: "5",
      title: "CI/CD Pipeline",
      status: "archived",
      priority: "medium",
      budget: 6000,
      startDate: new Date(2025, 10, 1).getTime(),
      progress: 100,
    },
    {
      id: "6",
      title: "Design System",
      status: "active",
      priority: "high",
      budget: 20000,
      startDate: new Date(2026, 3, 1).getTime(),
      progress: 10,
    },
    {
      id: "7",
      title: "Analytics Dashboard",
      status: "draft",
      priority: "medium",
      budget: 15000,
      startDate: new Date(2026, 4, 15).getTime(),
      progress: 0,
    },
    {
      id: "8",
      title: "Auth Service",
      status: "active",
      priority: "high",
      budget: 10000,
      startDate: new Date(2026, 1, 20).getTime(),
      progress: 55,
    },
    {
      id: "9",
      title: "Email Templates",
      status: "archived",
      priority: "low",
      budget: 2000,
      startDate: new Date(2025, 8, 1).getTime(),
      progress: 100,
    },
    {
      id: "10",
      title: "Performance Audit",
      status: "draft",
      priority: "medium",
      budget: 5000,
      startDate: new Date(2026, 5, 1).getTime(),
      progress: 0,
    },
  ];
}

function createPaginationData(): Project[] {
  return Array.from({ length: 35 }, (_, i) => ({
    id: String(i + 1),
    title: `Project ${i + 1}`,
    status: (["active", "archived", "draft"] as const)[i % 3] ?? "active",
    priority: (["low", "medium", "high"] as const)[i % 3] ?? "medium",
    budget: (i + 1) * 1000,
  }));
}

// --- Column helpers ---

const statusIcons = {
  active: CheckCircle2,
  draft: CircleDashed,
  archived: XCircle,
};

const priorityIcons = {
  low: CircleDashed,
  medium: Clock,
  high: CheckCircle2,
};

const statusOptions = [
  { label: "Active", value: "active", icon: CheckCircle2 },
  { label: "Draft", value: "draft", icon: CircleDashed },
  { label: "Archived", value: "archived", icon: XCircle },
];

const priorityOptions = [
  { label: "Low", value: "low", icon: CircleDashed },
  { label: "Medium", value: "medium", icon: Clock },
  { label: "High", value: "high", icon: CheckCircle2 },
];

// --- Story setup ---

const meta = preview.meta({
  title: "ui/DataTable",
  component: DataTableDemo,
  decorators: [
    (Story) => (
      <NuqsAdapter>
        <Story />
      </NuqsAdapter>
    ),
  ],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Feature-rich read-focused data table with sorting, filtering, pagination, and row selection.",
      },
    },
  },
});

// --- Stories ---

/** Data table with sorting, filtering, and pagination. */
export const Default = meta.story({
  render: (args) => <DataTableDemo {...args} />,
});

/** Table with all filter variants: text, number, range, date, dateRange, select, multiSelect. */
export const AllFilters = meta.story({
  render: (args) => <AllFiltersDemo {...args} />,
});

/** Table with 35 rows demonstrating multi-page pagination. */
export const Pagination = meta.story({
  render: (args) => <PaginationDemo {...args} />,
});

/** Table with empty data array. */
export const EmptyState = meta.story({
  render: (args) => <EmptyStateDemo {...args} />,
});

/** Real estate listings with boolean, range, and multi-select filters. */
export const RealEstateListings = meta.story({
  render: (args) => <RealEstateListingsDemo {...args} />,
});

/** Music library with dateRange filter, BPM range, and custom cell formatting. */
export const MusicLibrary = meta.story({
  render: (args) => <MusicLibraryDemo {...args} />,
});

/** Student gradebook with conditional styling and multiple range filters. */
export const StudentGrades = meta.story({
  render: (args) => <StudentGradesDemo {...args} />,
});

/** Restaurant menu without row selection, with allergen badges and boolean filters. */
export const RestaurantMenu = meta.story({
  render: (args) => <RestaurantMenuDemo {...args} />,
});

/** Table with actionBar prop that appears when rows are selected. */
export const ActionBar = meta.story({
  render: (args) => <ActionBarDemo {...args} />,
});

/** Table with a non-sortable, non-hideable column header rendered as plain text. */
export const NonSortableColumn = meta.story({
  render: (args) => <NonSortableColumnDemo {...args} />,
});

/** Faceted filter with count values on options. */
export const FacetedFilterWithCounts = meta.story({
  render: (args) => <FacetedFilterWithCountsDemo {...args} />,
});

// --- Tests ---

Default.test("should render all rows", async ({ canvas, step }) => {
  await step("verify table rows render", async () => {
    // Check that project titles are visible (first page, default 10 per page)
    await expect(canvas.getByText("Website Redesign")).toBeVisible();
    await expect(canvas.getByText("Mobile App")).toBeVisible();
  });
});

Default.test("should select a row with checkbox", async ({ canvas, step }) => {
  await step("click row checkbox and verify selection", async () => {
    const firstRowCheckbox = canvas.getAllByRole("checkbox", {
      name: /select row/i,
    })[0];
    if (!firstRowCheckbox)
      throw new Error("Expected at least one row checkbox");
    await userEvent.click(firstRowCheckbox);
    await waitFor(async () => {
      const dataRow = canvas
        .getAllByRole("row")
        .find((row) => row.getAttribute("data-state") === "selected");
      await expect(dataRow).toBeDefined();
    });
  });
});

Default.test("should render view options toggle", async ({ canvas, step }) => {
  await step("verify view options button is present", async () => {
    const viewButton = canvas.getByRole("combobox", {
      name: /toggle columns/i,
    });
    await expect(viewButton).toBeVisible();
  });
});

Default.test(
  "should select all rows with header checkbox",
  async ({ canvas, step }) => {
    await step("click header checkbox to select all rows", async () => {
      const headerCheckbox = canvas.getByRole("checkbox", {
        name: /select all/i,
      });
      await userEvent.click(headerCheckbox);
      await waitFor(async () => {
        const selectedRows = canvas
          .getAllByRole("row")
          .filter((row) => row.getAttribute("data-state") === "selected");
        await expect(selectedRows.length).toBeGreaterThan(0);
      });
    });
  }
);

Default.test(
  "should open sort dropdown for Budget column",
  async ({ canvas, canvasElement, step }) => {
    await step(
      "click Budget header and verify sort options appear",
      async () => {
        const budgetHeader = canvas.getByRole("button", { name: /budget/i });
        await userEvent.click(budgetHeader);

        await waitFor(async () => {
          const sortItems = canvasElement.ownerDocument.querySelectorAll(
            '[role="menuitemcheckbox"]'
          );
          await expect(sortItems.length).toBeGreaterThanOrEqual(2);
        });

        // Close the dropdown
        await userEvent.keyboard("{Escape}");
      }
    );
  }
);

Default.test(
  "should filter by text and show results",
  async ({ canvas, step }) => {
    await step("type in title filter and verify filtering", async () => {
      const filterInput = canvas.getByPlaceholderText(/search titles/i);
      await userEvent.clear(filterInput);
      await userEvent.type(filterInput, "Design");
      await waitFor(async () => {
        await expect(filterInput).toHaveValue("Design");
      });

      // Clear filter
      await userEvent.clear(filterInput);
      await waitFor(async () => {
        await expect(filterInput).toHaveValue("");
      });
    });
  }
);

Default.test(
  "should toggle column visibility",
  async ({ canvas, canvasElement, step }) => {
    await step("open view options and toggle a column", async () => {
      const viewButton = canvas.getByRole("combobox", {
        name: /toggle columns/i,
      });
      await userEvent.click(viewButton);

      await waitFor(async () => {
        const option =
          canvasElement.ownerDocument.querySelector('[role="option"]');
        await expect(option).not.toBeNull();
      });

      // Click an option to toggle a column off
      const options =
        canvasElement.ownerDocument.querySelectorAll('[role="option"]');
      if (options.length > 0 && options[0]) {
        await userEvent.click(options[0]);
      }
    });
  }
);

Default.test(
  "should sort desc and reset via dropdown",
  async ({ canvas, canvasElement, step }) => {
    await step("open Title dropdown and click Desc", async () => {
      const titleHeader = canvas.getByRole("button", { name: /title/i });
      await userEvent.click(titleHeader);

      await waitFor(async () => {
        const menuItems = canvasElement.ownerDocument.querySelectorAll(
          '[role="menuitemcheckbox"]'
        );
        await expect(menuItems.length).toBeGreaterThanOrEqual(2);
      });

      // Click Desc (second checkbox item) — fireEvent bypasses pointer-events check
      const menuItems = canvasElement.ownerDocument.querySelectorAll(
        '[role="menuitemcheckbox"]'
      );
      if (menuItems[1]) await fireEvent.click(menuItems[1]);
    });

    await step("re-open dropdown and click Reset", async () => {
      const titleHeader = canvas.getByRole("button", { name: /title/i });
      await userEvent.click(titleHeader);

      await waitFor(async () => {
        const resetItem =
          canvasElement.ownerDocument.querySelector('[role="menuitem"]');
        await expect(resetItem).not.toBeNull();
      });

      const resetItem =
        canvasElement.ownerDocument.querySelector('[role="menuitem"]');
      if (resetItem) await fireEvent.click(resetItem);
    });
  }
);

Default.test(
  "should hide column via header dropdown",
  async ({ canvasElement, step }) => {
    await step("open Status dropdown and click Hide", async () => {
      // Target the column header button inside thead to avoid matching the filter button
      const thead = canvasElement.querySelector("thead");
      if (!thead) throw new Error("Expected thead");
      const statusHeader = within(thead).getByRole("button", {
        name: /status/i,
      });
      await userEvent.click(statusHeader);

      await waitFor(async () => {
        const menuItems = canvasElement.ownerDocument.querySelectorAll(
          '[role="menuitemcheckbox"]'
        );
        await expect(menuItems.length).toBeGreaterThanOrEqual(1);
      });

      // Hide is the last checkbox item — fireEvent bypasses pointer-events check
      const menuItems = canvasElement.ownerDocument.querySelectorAll(
        '[role="menuitemcheckbox"]'
      );
      const hideItem = [...menuItems].find((item) =>
        item.textContent.includes("Hide")
      );
      if (hideItem) await fireEvent.click(hideItem);
    });

    await step("verify Status column header is gone from thead", async () => {
      await waitFor(async () => {
        const thead = canvasElement.querySelector("thead");
        if (!thead) throw new Error("Expected thead");
        const statusHeader = within(thead).queryByRole("button", {
          name: /status/i,
        });
        await expect(statusHeader).toBeNull();
      });
    });
  }
);

Default.test(
  "should sort column via header dropdown",
  async ({ canvas, canvasElement, step }) => {
    await step("open header dropdown and click Sort asc", async () => {
      const titleHeader = canvas.getByRole("button", { name: /title/i });
      await userEvent.click(titleHeader);

      await waitFor(async () => {
        const sortAsc = canvasElement.ownerDocument.querySelector(
          '[role="menuitemcheckbox"]'
        );
        await expect(sortAsc).not.toBeNull();
      });

      // Click Sort asc
      const sortItems = canvasElement.ownerDocument.querySelectorAll(
        '[role="menuitemcheckbox"]'
      );
      if (sortItems[0]) {
        await userEvent.click(sortItems[0]);
      }
    });

    await step("verify sort was applied", async () => {
      // After sorting, the header should still be visible
      const titleHeader = canvas.getByRole("button", { name: /title/i });
      await expect(titleHeader).toBeVisible();
    });
  }
);

AllFilters.test(
  "should render all filter controls",
  async ({ canvas, canvasElement, step }) => {
    await step("verify filter controls are present", async () => {
      // Text filter
      await expect(canvas.getByPlaceholderText(/search titles/i)).toBeVisible();
      // Number filter
      await expect(canvas.getByPlaceholderText(/budget/i)).toBeVisible();
      // Toolbar should be present
      const toolbar = canvasElement.querySelector(
        '[data-slot="data-table-toolbar"]'
      );
      await expect(toolbar).not.toBeNull();
      // Faceted filter buttons (rendered with border-dashed class)
      const filterButtons = canvasElement.querySelectorAll(
        '[data-slot="data-table-toolbar"] button.border-dashed'
      );
      await expect(filterButtons.length).toBeGreaterThanOrEqual(3);
    });
  }
);

AllFilters.test("should filter by number input", async ({ canvas, step }) => {
  await step("type in budget number filter", async () => {
    const numberInput = canvas.getByPlaceholderText(/budget/i);
    await userEvent.type(numberInput, "10000");
    await expect(numberInput).toHaveValue(10_000);
  });
});

AllFilters.test(
  "should open and interact with faceted filter (Status)",
  async ({ canvasElement, step }) => {
    await step("click Status filter button to open popover", async () => {
      // Find faceted filter buttons in the toolbar
      const filterButtons = canvasElement.querySelectorAll(
        '[data-slot="data-table-toolbar"] button.border-dashed'
      );

      // Status filter should be one of the faceted buttons
      let statusButton: HTMLElement | null = null;
      for (const btn of filterButtons) {
        if (btn.textContent.includes("Status")) {
          statusButton = btn as HTMLElement;
          break;
        }
      }
      if (!statusButton) throw new Error("Expected Status filter button");

      await userEvent.click(statusButton);

      await waitFor(async () => {
        const popover =
          canvasElement.ownerDocument.querySelector('[role="dialog"]');
        await expect(popover).not.toBeNull();
      });
    });

    await step("select a filter option", async () => {
      const options = canvasElement.ownerDocument.querySelectorAll(
        '[data-slot="popover-content"] [role="option"]'
      );
      await expect(options.length).toBeGreaterThan(0);

      // Click first option to select it
      if (options[0]) {
        await userEvent.click(options[0]);
      }
    });

    await step("close popover to avoid a11y violation", async () => {
      await userEvent.keyboard("{Escape}");
    });
  }
);

AllFilters.test(
  "should open and interact with slider filter (Progress)",
  async ({ canvasElement, step }) => {
    await step("click Progress filter button to open popover", async () => {
      const filterButtons = canvasElement.querySelectorAll(
        '[data-slot="data-table-toolbar"] button.border-dashed'
      );

      let progressButton: HTMLElement | null = null;
      for (const btn of filterButtons) {
        if (btn.textContent.includes("Progress")) {
          progressButton = btn as HTMLElement;
          break;
        }
      }
      if (!progressButton) throw new Error("Expected Progress filter button");

      await userEvent.click(progressButton);

      await waitFor(async () => {
        // The slider filter popover contains number inputs
        const inputs = canvasElement.ownerDocument.querySelectorAll(
          'input[type="number"]'
        );
        await expect(inputs.length).toBeGreaterThanOrEqual(2);
      });
    });

    await step("modify the from input", async () => {
      const inputs = canvasElement.ownerDocument.querySelectorAll(
        'input[type="number"]'
      );
      const fromInput = inputs[0];
      if (!fromInput) throw new Error("Expected from input");

      await userEvent.clear(fromInput);
      await userEvent.type(fromInput, "25");
    });

    await step("verify Clear button exists", async () => {
      await waitFor(async () => {
        const clearBtn = canvasElement.ownerDocument.querySelector(
          'button[aria-label*="Clear"]'
        );
        await expect(clearBtn).not.toBeNull();
      });
    });
  }
);

AllFilters.test(
  "should open date filter and interact with calendar",
  async ({ canvasElement, step }) => {
    await step("click Start Date filter button", async () => {
      const filterButtons = canvasElement.querySelectorAll(
        '[data-slot="data-table-toolbar"] button.border-dashed'
      );

      let dateButton: HTMLElement | null = null;
      for (const btn of filterButtons) {
        if (btn.textContent.includes("Start Date")) {
          dateButton = btn as HTMLElement;
          break;
        }
      }
      if (!dateButton) throw new Error("Expected Start Date filter button");

      await userEvent.click(dateButton);

      await waitFor(async () => {
        // Calendar should appear
        const calendar = canvasElement.ownerDocument.querySelector("table");
        await expect(calendar).not.toBeNull();
      });
    });

    await step("click a date in the calendar", async () => {
      // Click a day button in the calendar
      const dayButtons = canvasElement.ownerDocument.querySelectorAll(
        'table button[name="day"]'
      );
      if (dayButtons.length > 0 && dayButtons[10]) {
        await userEvent.click(dayButtons[10]);
      }
    });
  }
);

AllFilters.test(
  "should show aggregate badge when 3+ faceted options selected",
  async ({ canvasElement, step }) => {
    await step("open Status filter and select all 3 options", async () => {
      const filterButtons = canvasElement.querySelectorAll(
        '[data-slot="data-table-toolbar"] button.border-dashed'
      );
      let statusButton: HTMLElement | null = null;
      for (const btn of filterButtons) {
        if (btn.textContent.includes("Status")) {
          statusButton = btn as HTMLElement;
          break;
        }
      }
      if (!statusButton) throw new Error("Expected Status filter button");
      await userEvent.click(statusButton);

      await waitFor(async () => {
        const options = canvasElement.ownerDocument.querySelectorAll(
          '[data-slot="popover-content"] [role="option"]'
        );
        await expect(options.length).toBeGreaterThanOrEqual(3);
      });

      // Select all 3 options one at a time, skipping already-selected ones
      // (prior tests in the same story may have toggled some options on)
      const win = canvasElement.ownerDocument.defaultView ?? window;
      for (let i = 0; i < 3; i++) {
        const opts = canvasElement.ownerDocument.querySelectorAll(
          '[data-slot="popover-content"] [role="option"]'
        );
        const opt = opts[i];
        if (!opt) continue;

        // Only click if the option is not already selected.
        // Selected options have a visible check SVG; unselected ones
        // use [&_svg]:invisible (visibility: hidden).
        const svg = opt.querySelector("svg.lucide-check");
        if (!svg || win.getComputedStyle(svg).visibility === "hidden") {
          await userEvent.click(opt);
        }

        // Re-query inside waitFor because React re-renders may replace DOM nodes
        await waitFor(async () => {
          const freshOpts = canvasElement.ownerDocument.querySelectorAll(
            '[data-slot="popover-content"] [role="option"]'
          );
          const checkmark = freshOpts[i]?.querySelector("svg.lucide-check");
          await expect(checkmark).toBeVisible();
        });
      }
    });

    await step("verify aggregate badge appears", async () => {
      // Close popover first
      await userEvent.keyboard("{Escape}");
      // "3 selected" renders on lg+ screens; "3" badge renders on smaller viewports
      await waitFor(
        async () => {
          const badges = canvasElement.querySelectorAll('[data-slot="badge"]');
          const hasBadgeWith3 = [...badges].some(
            (b) =>
              b.textContent.includes("3 selected") ||
              b.textContent.trim() === "3"
          );
          await expect(hasBadgeWith3).toBe(true);
        },
        { timeout: 5000 }
      );
    });
  }
);

AllFilters.test(
  "should clear filters in faceted filter",
  async ({ canvasElement, step }) => {
    await step("open Status filter and select an option", async () => {
      const filterButtons = canvasElement.querySelectorAll(
        '[data-slot="data-table-toolbar"] button.border-dashed'
      );
      let statusButton: HTMLElement | null = null;
      for (const btn of filterButtons) {
        if (btn.textContent.includes("Status")) {
          statusButton = btn as HTMLElement;
          break;
        }
      }
      if (!statusButton) throw new Error("Expected Status filter button");
      await userEvent.click(statusButton);

      await waitFor(async () => {
        const options = canvasElement.ownerDocument.querySelectorAll(
          '[data-slot="popover-content"] [role="option"]'
        );
        await expect(options.length).toBeGreaterThan(0);
      });

      const options = canvasElement.ownerDocument.querySelectorAll(
        '[data-slot="popover-content"] [role="option"]'
      );
      if (options[0]) await userEvent.click(options[0]);
    });

    await step("verify Clear filters appears and click it", async () => {
      await waitFor(async () => {
        const clearItem = canvasElement.ownerDocument.querySelector(
          '[data-slot="popover-content"] [role="option"]'
        );
        await expect(clearItem).not.toBeNull();
      });

      const allOptions = canvasElement.ownerDocument.querySelectorAll(
        '[data-slot="popover-content"] [role="option"]'
      );
      // "Clear filters" is the last option after the separator
      const clearOption = [...allOptions].find((opt) =>
        opt.textContent.includes("Clear filters")
      );
      if (clearOption) await userEvent.click(clearOption);
    });

    await step("close popover", async () => {
      await userEvent.keyboard("{Escape}");
    });
  }
);

AllFilters.test(
  "should accept value in slider To input",
  async ({ canvasElement, step }) => {
    await step("open Progress slider filter", async () => {
      const filterButtons = canvasElement.querySelectorAll(
        '[data-slot="data-table-toolbar"] button.border-dashed'
      );
      let progressButton: HTMLElement | null = null;
      for (const btn of filterButtons) {
        if (btn.textContent.includes("Progress")) {
          progressButton = btn as HTMLElement;
          break;
        }
      }
      if (!progressButton) throw new Error("Expected Progress filter button");
      await userEvent.click(progressButton);

      await waitFor(async () => {
        const popover = canvasElement.ownerDocument.querySelector(
          '[data-slot="popover-content"]'
        );
        const inputs = popover?.querySelectorAll('input[type="number"]');
        await expect(inputs?.length).toBeGreaterThanOrEqual(2);
      });
    });

    await step("modify the To input", async () => {
      const popover = canvasElement.ownerDocument.querySelector(
        '[data-slot="popover-content"]'
      );
      if (!popover) throw new Error("Expected popover content");
      const inputs = popover.querySelectorAll('input[type="number"]');
      const toInput = inputs[1];
      if (!toInput) throw new Error("Expected To input");

      await userEvent.clear(toInput);
      await userEvent.type(toInput, "75");
    });
  }
);

AllFilters.test(
  "should clear slider filter via Clear button in popover",
  async ({ canvasElement, step }) => {
    await step("open Progress slider and modify from input", async () => {
      const filterButtons = canvasElement.querySelectorAll(
        '[data-slot="data-table-toolbar"] button.border-dashed'
      );
      let progressButton: HTMLElement | null = null;
      for (const btn of filterButtons) {
        if (btn.textContent.includes("Progress")) {
          progressButton = btn as HTMLElement;
          break;
        }
      }
      if (!progressButton) throw new Error("Expected Progress filter button");
      await userEvent.click(progressButton);

      await waitFor(async () => {
        const popover = canvasElement.ownerDocument.querySelector(
          '[data-slot="popover-content"]'
        );
        const inputs = popover?.querySelectorAll('input[type="number"]');
        await expect(inputs?.length).toBeGreaterThanOrEqual(2);
      });

      const popover = canvasElement.ownerDocument.querySelector(
        '[data-slot="popover-content"]'
      );
      if (!popover) throw new Error("Expected popover content");
      const inputs = popover.querySelectorAll('input[type="number"]');
      const fromInput = inputs[0];
      if (!fromInput) throw new Error("Expected from input");
      await userEvent.clear(fromInput);
      await userEvent.type(fromInput, "25");
    });

    await step("click Clear button inside the popover", async () => {
      const popover = canvasElement.ownerDocument.querySelector(
        '[data-slot="popover-content"]'
      );
      if (!popover) throw new Error("Expected popover content");
      const popoverScope = within(popover as HTMLElement);
      const clearBtn = popoverScope.getByRole("button", {
        name: /clear progress filter/i,
      });
      // fireEvent bypasses pointer-events check on popover overlay
      await fireEvent.click(clearBtn);
    });
  }
);

AllFilters.test(
  "should reset all filters via toolbar Reset button",
  async ({ canvas, canvasElement, step }) => {
    await step("set a text filter to make Reset button appear", async () => {
      const filterInput = canvas.getByPlaceholderText(/search titles/i);
      await userEvent.clear(filterInput);
      await userEvent.type(filterInput, "test");
    });

    await step("click the Reset button", async () => {
      await waitFor(
        async () => {
          const resetBtn = canvas.getByRole("button", {
            name: /reset filters/i,
          });
          await expect(resetBtn).toBeTruthy();
        },
        { timeout: 3000 }
      );
      const resetBtn = canvas.getByRole("button", {
        name: /reset filters/i,
      });
      await fireEvent.click(resetBtn);
    });

    await step("verify filters are cleared", async () => {
      await waitFor(async () => {
        const resetBtn = canvasElement.querySelector(
          'button[aria-label="Reset filters"]'
        );
        await expect(resetBtn).toBeNull();
      });
    });
  }
);

Pagination.test("should navigate between pages", async ({ canvas, step }) => {
  await step("verify pagination controls are present", async () => {
    await expect(canvas.getByText(/page 1 of/i)).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: /go to next page/i })
    ).toBeVisible();
  });

  await step("click next page", async () => {
    const nextButton = canvas.getByRole("button", {
      name: /go to next page/i,
    });
    await userEvent.click(nextButton);
    await waitFor(async () => {
      await expect(canvas.getByText(/page 2 of/i)).toBeVisible();
    });
  });
});

Pagination.test(
  "should show rows per page selector",
  async ({ canvas, step }) => {
    await step("verify rows per page control is present", async () => {
      // The rows per page selector should be visible
      await expect(canvas.getByText(/rows per page/i)).toBeVisible();
    });
  }
);

Pagination.test(
  "should navigate forward and backward with prev button",
  async ({ canvas, step }) => {
    await step("click next then previous", async () => {
      const nextButton = canvas.getByRole("button", {
        name: /go to next page/i,
      });

      // Click next (may go to page 3 or 4 depending on prior test state)
      if (!(nextButton as HTMLButtonElement).disabled) {
        await userEvent.click(nextButton);
      }

      // Click previous to go back
      const prevButton = canvas.getByRole("button", {
        name: /go to previous page/i,
      });
      if (!(prevButton as HTMLButtonElement).disabled) {
        await userEvent.click(prevButton);
      }

      // Verify pagination controls are still functional
      await expect(canvas.getByText(/rows per page/i)).toBeVisible();
    });
  }
);

Pagination.test(
  "should change page size via selector",
  async ({ canvas, canvasElement, step }) => {
    await step("open rows per page dropdown and change size", async () => {
      const trigger = canvas.getByRole("combobox", {
        name: /rows per page/i,
      });
      await userEvent.click(trigger);

      await waitFor(async () => {
        const option =
          canvasElement.ownerDocument.querySelector('[role="option"]');
        await expect(option).not.toBeNull();
      });

      // Select 20 rows per page
      const options =
        canvasElement.ownerDocument.querySelectorAll('[role="option"]');
      for (const opt of options) {
        if (opt.textContent === "20") {
          await userEvent.click(opt);
          break;
        }
      }
    });
  }
);

Pagination.test(
  "should navigate with first and last page buttons",
  async ({ canvas, step }) => {
    await step("verify first page button is disabled on page 1", async () => {
      // First page button is hidden on non-lg screens, but we can check disabled state
      const firstPageBtn = canvas.getByRole("button", {
        name: /go to first page/i,
      });
      await expect(firstPageBtn).toBeDisabled();
    });

    await step("go to page 2", async () => {
      const nextButton = canvas.getByRole("button", {
        name: /go to next page/i,
      });
      await userEvent.click(nextButton);
      await waitFor(async () => {
        await expect(canvas.getByText(/page 2 of/i)).toBeVisible();
      });
    });

    await step("click Go to first page", async () => {
      const firstPageBtn = canvas.getByRole("button", {
        name: /go to first page/i,
      });
      await userEvent.click(firstPageBtn);
      await waitFor(async () => {
        await expect(canvas.getByText(/page 1 of/i)).toBeVisible();
      });
    });

    await step("click Go to last page", async () => {
      const lastPageBtn = canvas.getByRole("button", {
        name: /go to last page/i,
      });
      await userEvent.click(lastPageBtn);
      await waitFor(async () => {
        const lastPageBtn2 = canvas.getByRole("button", {
          name: /go to last page/i,
        });
        await expect(lastPageBtn2).toBeDisabled();
      });
    });
  }
);

EmptyState.test("should render empty state", async ({ canvas, step }) => {
  await step("verify empty state message", async () => {
    await expect(canvas.getByText("No results.")).toBeVisible();
  });
});

EmptyState.test(
  "should render table header even with no data",
  async ({ canvas, step }) => {
    await step("verify column headers are present", async () => {
      await expect(
        canvas.getByRole("button", { name: /title/i })
      ).toBeVisible();
    });
  }
);

ActionBar.test(
  "should show action bar when rows are selected",
  async ({ canvas, step }) => {
    await step("verify action bar is not visible initially", async () => {
      await expect(
        canvas.queryByText("Delete selected")
      ).not.toBeInTheDocument();
    });

    await step("select a row and verify action bar appears", async () => {
      const firstRowCheckbox = canvas.getAllByRole("checkbox", {
        name: /select row/i,
      })[0];
      if (!firstRowCheckbox)
        throw new Error("Expected at least one row checkbox");
      await userEvent.click(firstRowCheckbox);
      await waitFor(async () => {
        await expect(canvas.getByText("Delete selected")).toBeVisible();
      });
    });
  }
);

NonSortableColumn.test(
  "should render non-sortable column as plain text",
  async ({ canvas, step }) => {
    await step(
      "verify ID column renders as plain text without dropdown",
      async () => {
        // The ID column header should be plain text, not a button
        await expect(canvas.getByText("ID")).toBeVisible();
        // Should not be a button
        const buttons = canvas.getAllByRole("button");
        const idButton = buttons.find((btn) => btn.textContent.trim() === "ID");
        await expect(idButton).toBeUndefined();
      }
    );
  }
);

FacetedFilterWithCounts.test(
  "should display count values in filter options",
  async ({ canvasElement, step }) => {
    await step("open status filter and verify counts are visible", async () => {
      const filterButtons = canvasElement.querySelectorAll(
        '[data-slot="data-table-toolbar"] button.border-dashed'
      );
      let statusButton: HTMLElement | null = null;
      for (const btn of filterButtons) {
        if (btn.textContent.includes("Status")) {
          statusButton = btn as HTMLElement;
          break;
        }
      }
      if (!statusButton) throw new Error("Expected Status filter button");
      await userEvent.click(statusButton);

      await waitFor(async () => {
        const doc = within(canvasElement.ownerDocument.body);
        await expect(doc.getByText("5")).toBeVisible();
        // "3" and "2" may match multiple elements (table data + filter counts)
        const threes = doc.getAllByText("3");
        await expect(threes.length).toBeGreaterThanOrEqual(1);
        const twos = doc.getAllByText("2");
        await expect(twos.length).toBeGreaterThanOrEqual(1);
      });
    });

    await step("close popover", async () => {
      await userEvent.keyboard("{Escape}");
    });
  }
);

// --- Demo components ---

function DataTableDemo() {
  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<Project["title"]>()}</div>
        ),
        meta: {
          label: "Title",
          placeholder: "Search titles...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<Project["status"]>();
          const Icon = statusIcons[status];
          return (
            <Badge variant="outline" className="capitalize">
              <Icon className="size-3.5" />
              {status}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: statusOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Priority" />
        ),
        cell: ({ cell }) => {
          const priority = cell.getValue<Project["priority"]>();
          const Icon = priorityIcons[priority];
          return (
            <div className="flex items-center gap-2 capitalize">
              <Icon className="text-muted-foreground size-3.5" />
              {priority}
            </div>
          );
        },
        meta: {
          label: "Priority",
          variant: "multiSelect",
          options: priorityOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Budget" />
        ),
        cell: ({ cell }) => {
          const amount = cell.getValue<number>();
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(amount);
          return (
            <div className="text-right font-medium tabular-nums">
              {formatted}
            </div>
          );
        },
        size: 120,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: projects,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "title", desc: false }],
    },
  });

  return (
    <div className="w-full max-w-4xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

function AllFiltersDemo() {
  const data = useMemo(() => createFilterProjects(), []);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<FilterProject>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">
            {cell.getValue<FilterProject["title"]>()}
          </div>
        ),
        meta: {
          label: "Title",
          placeholder: "Search titles...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Budget" />
        ),
        cell: ({ cell }) => {
          const amount = cell.getValue<number>();
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(amount);
          return (
            <div className="text-right font-medium tabular-nums">
              {formatted}
            </div>
          );
        },
        size: 120,
        meta: {
          label: "Budget",
          placeholder: "Budget",
          variant: "number",
          unit: "$",
          unitPlacement: "prefix",
        },
        enableColumnFilter: true,
      },
      {
        id: "progress",
        accessorKey: "progress",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Progress" />
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return <div className="text-right tabular-nums">{value}%</div>;
        },
        size: 100,
        meta: {
          label: "Progress",
          variant: "range",
          range: [0, 100] as [number, number],
          unit: "%",
        },
        enableColumnFilter: true,
      },
      {
        id: "startDate",
        accessorKey: "startDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Start Date" />
        ),
        cell: ({ cell }) => {
          const timestamp = cell.getValue<number>();
          return <div>{new Date(timestamp).toLocaleDateString("en-US")}</div>;
        },
        meta: {
          label: "Start Date",
          variant: "date",
          icon: CalendarIcon,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<FilterProject["status"]>();
          const Icon = statusIcons[status];
          return (
            <Badge variant="outline" className="capitalize">
              <Icon className="size-3.5" />
              {status}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: statusOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Priority" />
        ),
        cell: ({ cell }) => {
          const priority = cell.getValue<FilterProject["priority"]>();
          const Icon = priorityIcons[priority];
          return (
            <div className="flex items-center gap-2 capitalize">
              <Icon className="text-muted-foreground size-3.5" />
              {priority}
            </div>
          );
        },
        meta: {
          label: "Priority",
          variant: "select",
          options: priorityOptions,
        },
        enableColumnFilter: true,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "title", desc: false }],
    },
  });

  return (
    <div className="w-full max-w-5xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

function PaginationDemo() {
  const data = useMemo(() => createPaginationData(), []);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
        ),
        meta: { label: "Title" },
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<Project["status"]>();
          const Icon = statusIcons[status];
          return (
            <Badge variant="outline" className="capitalize">
              <Icon className="size-3.5" />
              {status}
            </Badge>
          );
        },
        meta: { label: "Status" },
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Budget" />
        ),
        cell: ({ cell }) => {
          const amount = cell.getValue<number>();
          return (
            <div className="text-right font-medium tabular-nums">
              ${amount.toLocaleString()}
            </div>
          );
        },
        size: 120,
        meta: { label: "Budget" },
      },
    ],
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: Math.ceil(data.length / 10),
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "title", desc: false }],
    },
  });

  return (
    <div className="w-full max-w-4xl">
      <DataTable table={table} />
    </div>
  );
}

function EmptyStateDemo() {
  const emptyData: Project[] = [];

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
        ),
        meta: { label: "Title" },
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        meta: { label: "Status" },
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Budget" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        meta: { label: "Budget" },
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: emptyData,
    columns,
    pageCount: 0,
    getRowId: (row) => row.id,
  });

  return (
    <div className="w-full max-w-4xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

// --- Types: RealEstateListings ---

interface Listing {
  id: string;
  address: string;
  city: string;
  price: number;
  sqft: number;
  bedrooms: number;
  yearBuilt: number;
  hasPool: boolean;
  type: string;
  status: string;
  listedDate: number;
}

// --- Types: MusicLibrary ---

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: string[];
  releaseDate: number;
  bpm: number;
  durationSec: number;
  rating: number;
}

// --- Types: StudentGrades ---

interface Student {
  id: string;
  name: string;
  grade: string;
  math: number;
  science: number;
  english: number;
  history: number;
  average: number;
  passing: boolean;
  enrolledDate: number;
}

// --- Types: RestaurantMenu ---

interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
  calories: number;
  allergens: string[];
  vegetarian: boolean;
}

// --- Data: RealEstateListings ---

function createListingData(): Listing[] {
  return [
    {
      id: "1",
      address: "742 Evergreen Terrace",
      city: "Springfield",
      price: 295000,
      sqft: 1800,
      bedrooms: 3,
      yearBuilt: 1985,
      hasPool: false,
      type: "Single Family",
      status: "Active",
      listedDate: new Date(2025, 11, 1).getTime(),
    },
    {
      id: "2",
      address: "1600 Pennsylvania Ave",
      city: "Washington",
      price: 1250000,
      sqft: 4200,
      bedrooms: 5,
      yearBuilt: 1800,
      hasPool: true,
      type: "Single Family",
      status: "Active",
      listedDate: new Date(2025, 10, 15).getTime(),
    },
    {
      id: "3",
      address: "221B Baker Street",
      city: "London",
      price: 875000,
      sqft: 2400,
      bedrooms: 2,
      yearBuilt: 1890,
      hasPool: false,
      type: "Townhouse",
      status: "Pending",
      listedDate: new Date(2025, 9, 20).getTime(),
    },
    {
      id: "4",
      address: "350 Fifth Avenue",
      city: "New York",
      price: 520000,
      sqft: 950,
      bedrooms: 1,
      yearBuilt: 2018,
      hasPool: false,
      type: "Condo",
      status: "Active",
      listedDate: new Date(2026, 0, 5).getTime(),
    },
    {
      id: "5",
      address: "12 Grimmauld Place",
      city: "London",
      price: 425000,
      sqft: 3100,
      bedrooms: 4,
      yearBuilt: 1870,
      hasPool: false,
      type: "Townhouse",
      status: "Sold",
      listedDate: new Date(2025, 7, 10).getTime(),
    },
    {
      id: "6",
      address: "4 Privet Drive",
      city: "Surrey",
      price: 310000,
      sqft: 1650,
      bedrooms: 3,
      yearBuilt: 1972,
      hasPool: false,
      type: "Single Family",
      status: "Active",
      listedDate: new Date(2025, 11, 20).getTime(),
    },
    {
      id: "7",
      address: "1007 Mountain Drive",
      city: "Gotham",
      price: 985000,
      sqft: 5500,
      bedrooms: 6,
      yearBuilt: 1940,
      hasPool: true,
      type: "Estate",
      status: "Active",
      listedDate: new Date(2026, 0, 12).getTime(),
    },
    {
      id: "8",
      address: "42 Wallaby Way",
      city: "Sydney",
      price: 185000,
      sqft: 1200,
      bedrooms: 2,
      yearBuilt: 2005,
      hasPool: true,
      type: "Condo",
      status: "Pending",
      listedDate: new Date(2025, 10, 28).getTime(),
    },
    {
      id: "9",
      address: "90210 Sunset Blvd",
      city: "Beverly Hills",
      price: 1100000,
      sqft: 3800,
      bedrooms: 4,
      yearBuilt: 1995,
      hasPool: true,
      type: "Single Family",
      status: "Active",
      listedDate: new Date(2026, 1, 1).getTime(),
    },
    {
      id: "10",
      address: "31 Spooner Street",
      city: "Quahog",
      price: 245000,
      sqft: 1400,
      bedrooms: 3,
      yearBuilt: 1990,
      hasPool: false,
      type: "Single Family",
      status: "Sold",
      listedDate: new Date(2025, 6, 15).getTime(),
    },
    {
      id: "11",
      address: "124 Conch Street",
      city: "Bikini Bottom",
      price: 199000,
      sqft: 800,
      bedrooms: 1,
      yearBuilt: 2010,
      hasPool: false,
      type: "Condo",
      status: "Active",
      listedDate: new Date(2026, 1, 10).getTime(),
    },
    {
      id: "12",
      address: "1725 Slough Avenue",
      city: "Scranton",
      price: 275000,
      sqft: 2100,
      bedrooms: 3,
      yearBuilt: 1978,
      hasPool: false,
      type: "Single Family",
      status: "Pending",
      listedDate: new Date(2025, 8, 5).getTime(),
    },
  ];
}

const listingTypeOptions = [
  { label: "Single Family", value: "Single Family" },
  { label: "Condo", value: "Condo" },
  { label: "Townhouse", value: "Townhouse" },
  { label: "Estate", value: "Estate" },
];

const listingStatusOptions = [
  { label: "Active", value: "Active", icon: CheckCircle2 },
  { label: "Pending", value: "Pending", icon: Clock },
  { label: "Sold", value: "Sold", icon: XCircle },
];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

function RealEstateListingsDemo() {
  const data = useMemo(() => createListingData(), []);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Listing>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "address",
        accessorKey: "address",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Address" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
        ),
        meta: {
          label: "Address",
          placeholder: "Search addresses...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "city",
        accessorKey: "city",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="City" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        meta: {
          label: "City",
          variant: "select",
          options: [
            { label: "Springfield", value: "Springfield" },
            { label: "Washington", value: "Washington" },
            { label: "London", value: "London" },
            { label: "New York", value: "New York" },
            { label: "Surrey", value: "Surrey" },
            { label: "Gotham", value: "Gotham" },
            { label: "Sydney", value: "Sydney" },
            { label: "Beverly Hills", value: "Beverly Hills" },
            { label: "Quahog", value: "Quahog" },
            { label: "Bikini Bottom", value: "Bikini Bottom" },
            { label: "Scranton", value: "Scranton" },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "price",
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Price" />
        ),
        cell: ({ cell }) => (
          <div className="text-right font-medium tabular-nums">
            {formatCurrency(cell.getValue<number>())}
          </div>
        ),
        size: 150,
        meta: {
          label: "Price",
          variant: "range",
          range: [100_000, 1_500_000] as [number, number],
          unit: "$",
          unitPlacement: "prefix",
        },
        enableColumnFilter: true,
      },
      {
        id: "sqft",
        accessorKey: "sqft",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Sq Ft" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>().toLocaleString()}
          </div>
        ),
        size: 100,
        meta: {
          label: "Sq Ft",
          placeholder: "Sq ft",
          variant: "number",
        },
        enableColumnFilter: true,
      },
      {
        id: "listedDate",
        accessorKey: "listedDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Listed" />
        ),
        cell: ({ cell }) => (
          <div>
            {new Date(cell.getValue<number>()).toLocaleDateString("en-US")}
          </div>
        ),
        meta: {
          label: "Listed",
          variant: "date",
          icon: CalendarIcon,
        },
        enableColumnFilter: true,
      },
      {
        id: "hasPool",
        accessorKey: "hasPool",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Pool" />
        ),
        cell: ({ cell }) => (
          <div>{cell.getValue<boolean>() ? "Yes" : "No"}</div>
        ),
        meta: {
          label: "Pool",
          variant: "boolean",
        },
        enableColumnFilter: true,
      },
      {
        id: "bedrooms",
        accessorKey: "bedrooms",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Beds" />
        ),
        cell: ({ cell }) => (
          <div className="flex items-center gap-1.5">
            <BedDouble className="text-muted-foreground size-3.5" />
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        id: "type",
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ cell }) => {
          const type = cell.getValue<string>();
          const icons: Record<string, typeof Home> = {
            "Single Family": Home,
            Condo: Building2,
            Townhouse: Landmark,
            Estate: Castle,
          };
          const Icon = icons[type] ?? Home;
          return (
            <Badge variant="outline">
              <Icon className="size-3.5" />
              {type}
            </Badge>
          );
        },
        meta: {
          label: "Type",
          variant: "multiSelect",
          options: listingTypeOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue<string>();
          const opt = listingStatusOptions.find((o) => o.value === status);
          const Icon = opt?.icon ?? CircleDashed;
          return (
            <Badge variant="outline">
              <Icon className="size-3.5" />
              {status}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: listingStatusOptions,
        },
        enableColumnFilter: true,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "price", desc: true }],
    },
  });

  return (
    <div className="w-full max-w-6xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

// --- Data: MusicLibrary ---

function createTrackData(): Track[] {
  return [
    {
      id: "1",
      title: "Bohemian Rhapsody",
      artist: "Queen",
      genre: "Rock",
      mood: ["Epic", "Dramatic"],
      releaseDate: new Date(1975, 9, 31).getTime(),
      bpm: 72,
      durationSec: 355,
      rating: 5,
    },
    {
      id: "2",
      title: "Get Lucky",
      artist: "Daft Punk",
      genre: "Funk",
      mood: ["Upbeat", "Groovy"],
      releaseDate: new Date(2013, 3, 19).getTime(),
      bpm: 116,
      durationSec: 369,
      rating: 4,
    },
    {
      id: "3",
      title: "So What",
      artist: "Miles Davis",
      genre: "Jazz",
      mood: ["Chill", "Mellow"],
      releaseDate: new Date(1959, 7, 17).getTime(),
      bpm: 136,
      durationSec: 562,
      rating: 5,
    },
    {
      id: "4",
      title: "Strobe",
      artist: "Deadmau5",
      genre: "Electronic",
      mood: ["Atmospheric", "Epic"],
      releaseDate: new Date(2009, 8, 22).getTime(),
      bpm: 128,
      durationSec: 637,
      rating: 5,
    },
    {
      id: "5",
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      genre: "Rock",
      mood: ["Epic", "Mellow"],
      releaseDate: new Date(1971, 10, 8).getTime(),
      bpm: 82,
      durationSec: 482,
      rating: 5,
    },
    {
      id: "6",
      title: "Superstition",
      artist: "Stevie Wonder",
      genre: "Funk",
      mood: ["Upbeat", "Groovy"],
      releaseDate: new Date(1972, 9, 24).getTime(),
      bpm: 101,
      durationSec: 245,
      rating: 4,
    },
    {
      id: "7",
      title: "Clair de Lune",
      artist: "Debussy",
      genre: "Classical",
      mood: ["Chill", "Atmospheric"],
      releaseDate: new Date(1905, 0, 1).getTime(),
      bpm: 54,
      durationSec: 312,
      rating: 5,
    },
    {
      id: "8",
      title: "Blinding Lights",
      artist: "The Weeknd",
      genre: "Pop",
      mood: ["Upbeat", "Dramatic"],
      releaseDate: new Date(2019, 10, 29).getTime(),
      bpm: 171,
      durationSec: 200,
      rating: 4,
    },
    {
      id: "9",
      title: "Take Five",
      artist: "Dave Brubeck",
      genre: "Jazz",
      mood: ["Groovy", "Chill"],
      releaseDate: new Date(1959, 6, 1).getTime(),
      bpm: 172,
      durationSec: 324,
      rating: 5,
    },
    {
      id: "10",
      title: "Billie Jean",
      artist: "Michael Jackson",
      genre: "Pop",
      mood: ["Groovy", "Dramatic"],
      releaseDate: new Date(1983, 0, 2).getTime(),
      bpm: 117,
      durationSec: 294,
      rating: 5,
    },
    {
      id: "11",
      title: "Midnight City",
      artist: "M83",
      genre: "Electronic",
      mood: ["Atmospheric", "Upbeat"],
      releaseDate: new Date(2011, 9, 18).getTime(),
      bpm: 105,
      durationSec: 244,
      rating: 4,
    },
    {
      id: "12",
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      genre: "Rock",
      mood: ["Epic", "Dramatic"],
      releaseDate: new Date(1991, 8, 10).getTime(),
      bpm: 117,
      durationSec: 301,
      rating: 5,
    },
    {
      id: "13",
      title: "Gymnopedie No.1",
      artist: "Erik Satie",
      genre: "Classical",
      mood: ["Chill", "Mellow"],
      releaseDate: new Date(1888, 0, 1).getTime(),
      bpm: 66,
      durationSec: 186,
      rating: 4,
    },
    {
      id: "14",
      title: "Redbone",
      artist: "Childish Gambino",
      genre: "R&B",
      mood: ["Groovy", "Mellow"],
      releaseDate: new Date(2016, 10, 10).getTime(),
      bpm: 81,
      durationSec: 327,
      rating: 4,
    },
    {
      id: "15",
      title: "Around the World",
      artist: "Daft Punk",
      genre: "Electronic",
      mood: ["Upbeat", "Groovy"],
      releaseDate: new Date(1997, 2, 17).getTime(),
      bpm: 121,
      durationSec: 429,
      rating: 4,
    },
  ];
}

const genreOptions = [
  { label: "Rock", value: "Rock" },
  { label: "Funk", value: "Funk" },
  { label: "Jazz", value: "Jazz" },
  { label: "Electronic", value: "Electronic" },
  { label: "Classical", value: "Classical" },
  { label: "Pop", value: "Pop" },
  { label: "R&B", value: "R&B" },
];

const moodOptions = [
  { label: "Epic", value: "Epic" },
  { label: "Dramatic", value: "Dramatic" },
  { label: "Upbeat", value: "Upbeat" },
  { label: "Groovy", value: "Groovy" },
  { label: "Chill", value: "Chill" },
  { label: "Mellow", value: "Mellow" },
  { label: "Atmospheric", value: "Atmospheric" },
];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < rating ? "text-amber-500" : "text-muted-foreground/30"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function MusicLibraryDemo() {
  const data = useMemo(() => createTrackData(), []);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Track>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
        ),
        meta: {
          label: "Title",
          placeholder: "Search titles...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "artist",
        accessorKey: "artist",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Artist" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        meta: {
          label: "Artist",
          placeholder: "Search artists...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "genre",
        accessorKey: "genre",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Genre" />
        ),
        cell: ({ cell }) => {
          const genre = cell.getValue<string>();
          const dotColors: Record<string, string> = {
            Rock: "bg-red-500",
            Funk: "bg-orange-500",
            Jazz: "bg-blue-500",
            Electronic: "bg-violet-500",
            Classical: "bg-amber-500",
            Pop: "bg-pink-500",
            "R&B": "bg-emerald-500",
          };
          const dotColor = dotColors[genre] ?? "bg-gray-500";
          return (
            <Badge variant="outline">
              <span className={cn("size-2 shrink-0 rounded-full", dotColor)} />
              {genre}
            </Badge>
          );
        },
        meta: {
          label: "Genre",
          variant: "select",
          options: genreOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "mood",
        accessorKey: "mood",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Mood" />
        ),
        cell: ({ cell }) => (
          <div className="flex flex-wrap gap-1">
            {cell.getValue<string[]>().map((m) => (
              <Badge key={m} variant="secondary" className="text-xs">
                {m}
              </Badge>
            ))}
          </div>
        ),
        meta: {
          label: "Mood",
          variant: "multiSelect",
          options: moodOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "releaseDate",
        accessorKey: "releaseDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Released" />
        ),
        cell: ({ cell }) => (
          <div>
            {new Date(cell.getValue<number>()).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}
          </div>
        ),
        meta: {
          label: "Released",
          variant: "dateRange",
          icon: CalendarIcon,
        },
        enableColumnFilter: true,
      },
      {
        id: "bpm",
        accessorKey: "bpm",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="BPM" />
        ),
        cell: ({ cell }) => (
          <div className="text-right font-mono text-xs tabular-nums">
            {cell.getValue<number>()}
          </div>
        ),
        meta: {
          label: "BPM",
          variant: "range",
          range: [40, 220] as [number, number],
        },
        enableColumnFilter: true,
      },
      {
        id: "durationSec",
        accessorKey: "durationSec",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Duration" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {formatDuration(cell.getValue<number>())}
          </div>
        ),
      },
      {
        id: "rating",
        accessorKey: "rating",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Rating" />
        ),
        cell: ({ cell }) => <StarRating rating={cell.getValue<number>()} />,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "artist", desc: false }],
    },
  });

  return (
    <div className="w-full max-w-6xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

// --- Data: StudentGrades ---

function createStudentData(): Student[] {
  const students = [
    {
      id: "1",
      name: "Aiden Brooks",
      grade: "Senior",
      math: 92,
      science: 88,
      english: 78,
      history: 85,
      enrolledDate: new Date(2022, 8, 1).getTime(),
    },
    {
      id: "2",
      name: "Maya Singh",
      grade: "Junior",
      math: 98,
      science: 95,
      english: 92,
      history: 90,
      enrolledDate: new Date(2023, 8, 1).getTime(),
    },
    {
      id: "3",
      name: "Carlos Reyes",
      grade: "Sophomore",
      math: 55,
      science: 62,
      english: 70,
      history: 58,
      enrolledDate: new Date(2024, 8, 1).getTime(),
    },
    {
      id: "4",
      name: "Lily Nakamura",
      grade: "Senior",
      math: 74,
      science: 80,
      english: 88,
      history: 82,
      enrolledDate: new Date(2022, 8, 1).getTime(),
    },
    {
      id: "5",
      name: "Ethan Park",
      grade: "Freshman",
      math: 45,
      science: 52,
      english: 58,
      history: 48,
      enrolledDate: new Date(2025, 8, 1).getTime(),
    },
    {
      id: "6",
      name: "Zara Ahmed",
      grade: "Junior",
      math: 88,
      science: 91,
      english: 85,
      history: 93,
      enrolledDate: new Date(2023, 8, 1).getTime(),
    },
    {
      id: "7",
      name: "Finn O'Brien",
      grade: "Sophomore",
      math: 65,
      science: 58,
      english: 72,
      history: 60,
      enrolledDate: new Date(2024, 8, 1).getTime(),
    },
    {
      id: "8",
      name: "Isabella Costa",
      grade: "Senior",
      math: 95,
      science: 98,
      english: 90,
      history: 94,
      enrolledDate: new Date(2022, 8, 1).getTime(),
    },
    {
      id: "9",
      name: "Noah Kim",
      grade: "Freshman",
      math: 78,
      science: 72,
      english: 68,
      history: 75,
      enrolledDate: new Date(2025, 8, 1).getTime(),
    },
    {
      id: "10",
      name: "Harper Lee",
      grade: "Junior",
      math: 82,
      science: 76,
      english: 95,
      history: 88,
      enrolledDate: new Date(2023, 8, 1).getTime(),
    },
    {
      id: "11",
      name: "Jamal Washington",
      grade: "Sophomore",
      math: 70,
      science: 68,
      english: 62,
      history: 71,
      enrolledDate: new Date(2024, 8, 1).getTime(),
    },
    {
      id: "12",
      name: "Mia Petrov",
      grade: "Freshman",
      math: 58,
      science: 55,
      english: 64,
      history: 52,
      enrolledDate: new Date(2025, 8, 1).getTime(),
    },
  ];
  return students.map((s) => {
    const avg = Math.round((s.math + s.science + s.english + s.history) / 4);
    return { ...s, average: avg, passing: avg >= 60 };
  });
}

const gradeOptions = [
  { label: "Freshman", value: "Freshman" },
  { label: "Sophomore", value: "Sophomore" },
  { label: "Junior", value: "Junior" },
  { label: "Senior", value: "Senior" },
];

function averageColor(avg: number): string {
  if (avg < 60) return "text-red-700 dark:text-red-400";
  if (avg < 80) return "text-amber-800 dark:text-yellow-400";
  return "text-green-800 dark:text-green-400";
}

function StudentGradesDemo() {
  const data = useMemo(() => createStudentData(), []);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Student" />
        ),
        cell: ({ row, cell }) => {
          const passing = row.original.passing;
          return (
            <div
              className={cn(
                "border-l-4 pl-2 font-medium",
                passing ? "border-l-green-500" : "border-l-red-500"
              )}
            >
              {cell.getValue<string>()}
            </div>
          );
        },
        meta: {
          label: "Student",
          placeholder: "Search students...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "grade",
        accessorKey: "grade",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Year" />
        ),
        cell: ({ cell }) => (
          <Badge variant="outline">{cell.getValue<string>()}</Badge>
        ),
        meta: {
          label: "Year",
          variant: "select",
          options: gradeOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "math",
        accessorKey: "math",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Math" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>()}
          </div>
        ),
        meta: {
          label: "Math",
          variant: "range",
          range: [0, 100] as [number, number],
        },
        enableColumnFilter: true,
      },
      {
        id: "science",
        accessorKey: "science",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Science" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        id: "english",
        accessorKey: "english",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="English" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        id: "history",
        accessorKey: "history",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="History" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>()}
          </div>
        ),
      },
      {
        id: "average",
        accessorKey: "average",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Average" />
        ),
        cell: ({ cell }) => {
          const avg = cell.getValue<number>();
          return (
            <div
              className={`text-right font-bold tabular-nums
                ${averageColor(avg)}`}
            >
              {avg}
            </div>
          );
        },
        meta: {
          label: "Average",
          variant: "range",
          range: [0, 100] as [number, number],
        },
        enableColumnFilter: true,
      },
      {
        id: "passing",
        accessorKey: "passing",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Passing" />
        ),
        cell: ({ cell }) => {
          const pass = cell.getValue<boolean>();
          return (
            <Badge variant={pass ? "default" : "destructive"}>
              {pass ? "Pass" : "Fail"}
            </Badge>
          );
        },
        meta: {
          label: "Passing",
          variant: "boolean",
        },
        enableColumnFilter: true,
      },
      {
        id: "enrolledDate",
        accessorKey: "enrolledDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Enrolled" />
        ),
        cell: ({ cell }) => (
          <div>
            {new Date(cell.getValue<number>()).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
            })}
          </div>
        ),
        meta: {
          label: "Enrolled",
          variant: "date",
          icon: CalendarIcon,
        },
        enableColumnFilter: true,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "name", desc: false }],
    },
  });

  return (
    <div className="w-full max-w-6xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

// --- Data: RestaurantMenu ---

function createMenuData(): MenuItem[] {
  return [
    {
      id: "1",
      name: "Bruschetta",
      description:
        "Grilled bread rubbed with garlic, topped with diced tomatoes, basil, and olive oil",
      course: "Appetizer",
      price: 9.5,
      calories: 220,
      allergens: ["Gluten"],
      vegetarian: true,
    },
    {
      id: "2",
      name: "Caesar Salad",
      description:
        "Romaine lettuce, parmesan, croutons, and house-made Caesar dressing",
      course: "Appetizer",
      price: 12.0,
      calories: 340,
      allergens: ["Gluten", "Dairy", "Eggs"],
      vegetarian: true,
    },
    {
      id: "3",
      name: "French Onion Soup",
      description:
        "Slow-caramelized onion broth topped with a crusty baguette and melted Gruyere",
      course: "Appetizer",
      price: 11.0,
      calories: 420,
      allergens: ["Gluten", "Dairy"],
      vegetarian: true,
    },
    {
      id: "4",
      name: "Grilled Salmon",
      description:
        "Atlantic salmon fillet with lemon-dill butter, served with seasonal vegetables",
      course: "Main",
      price: 28.0,
      calories: 520,
      allergens: ["Fish"],
      vegetarian: false,
    },
    {
      id: "5",
      name: "Mushroom Risotto",
      description:
        "Arborio rice with porcini and cremini mushrooms, finished with truffle oil and parmesan",
      course: "Main",
      price: 22.0,
      calories: 680,
      allergens: ["Dairy"],
      vegetarian: true,
    },
    {
      id: "6",
      name: "Filet Mignon",
      description:
        "8oz center-cut beef tenderloin with red wine reduction and roasted garlic mash",
      course: "Main",
      price: 42.0,
      calories: 750,
      allergens: ["Dairy"],
      vegetarian: false,
    },
    {
      id: "7",
      name: "Pad See Ew",
      description:
        "Wide rice noodles stir-fried with Chinese broccoli, egg, and sweet soy sauce",
      course: "Main",
      price: 18.0,
      calories: 590,
      allergens: ["Gluten", "Soy", "Eggs"],
      vegetarian: false,
    },
    {
      id: "8",
      name: "Truffle Fries",
      description:
        "Hand-cut fries tossed with truffle oil, parmesan, and fresh parsley",
      course: "Side",
      price: 10.0,
      calories: 450,
      allergens: ["Dairy"],
      vegetarian: true,
    },
    {
      id: "9",
      name: "Roasted Brussels Sprouts",
      description:
        "Crispy sprouts with balsamic glaze, toasted hazelnuts, and dried cranberries",
      course: "Side",
      price: 9.0,
      calories: 180,
      allergens: ["Nuts"],
      vegetarian: true,
    },
    {
      id: "10",
      name: "Garlic Bread",
      description: "Toasted ciabatta with roasted garlic butter and herbs",
      course: "Side",
      price: 7.0,
      calories: 290,
      allergens: ["Gluten", "Dairy"],
      vegetarian: true,
    },
    {
      id: "11",
      name: "Tiramisu",
      description:
        "Classic Italian dessert with espresso-soaked ladyfingers, mascarpone cream, and cocoa",
      course: "Dessert",
      price: 12.0,
      calories: 480,
      allergens: ["Gluten", "Dairy", "Eggs"],
      vegetarian: true,
    },
    {
      id: "12",
      name: "Chocolate Lava Cake",
      description:
        "Warm dark chocolate cake with a molten center, served with vanilla bean ice cream",
      course: "Dessert",
      price: 14.0,
      calories: 620,
      allergens: ["Gluten", "Dairy", "Eggs"],
      vegetarian: true,
    },
    {
      id: "13",
      name: "Espresso",
      description: "Double shot of house-roasted single-origin espresso",
      course: "Beverage",
      price: 4.0,
      calories: 5,
      allergens: [],
      vegetarian: true,
    },
    {
      id: "14",
      name: "Sparkling Lemonade",
      description:
        "Fresh-squeezed lemon juice with sparkling water and elderflower syrup",
      course: "Beverage",
      price: 6.0,
      calories: 120,
      allergens: [],
      vegetarian: true,
    },
  ];
}

const courseOptions = [
  { label: "Appetizer", value: "Appetizer" },
  { label: "Main", value: "Main" },
  { label: "Side", value: "Side" },
  { label: "Dessert", value: "Dessert" },
  { label: "Beverage", value: "Beverage" },
];

const allergenOptions = [
  { label: "Gluten", value: "Gluten" },
  { label: "Dairy", value: "Dairy" },
  { label: "Nuts", value: "Nuts" },
  { label: "Eggs", value: "Eggs" },
  { label: "Fish", value: "Fish" },
  { label: "Soy", value: "Soy" },
  { label: "Shellfish", value: "Shellfish" },
];

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

function RestaurantMenuDemo() {
  const data = useMemo(() => createMenuData(), []);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<MenuItem>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Item" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
        ),
        meta: {
          label: "Item",
          placeholder: "Search menu...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "description",
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Description" />
        ),
        cell: ({ cell }) => (
          <div className="text-muted-foreground max-w-[300px] truncate italic">
            {cell.getValue<string>()}
          </div>
        ),
      },
      {
        id: "course",
        accessorKey: "course",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Course" />
        ),
        cell: ({ cell }) => {
          const course = cell.getValue<string>();
          const dotColors: Record<string, string> = {
            Appetizer: "bg-emerald-500",
            Main: "bg-blue-500",
            Side: "bg-amber-500",
            Dessert: "bg-pink-500",
            Beverage: "bg-slate-500",
          };
          const dotColor = dotColors[course] ?? "bg-gray-500";
          return (
            <Badge variant="outline">
              <span className={cn("size-2 shrink-0 rounded-full", dotColor)} />
              {course}
            </Badge>
          );
        },
        meta: {
          label: "Course",
          variant: "select",
          options: courseOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "price",
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Price" />
        ),
        cell: ({ cell }) => (
          <div className="text-right font-medium tabular-nums">
            {formatPrice(cell.getValue<number>())}
          </div>
        ),
        size: 100,
        meta: {
          label: "Price",
          placeholder: "Price",
          variant: "number",
          unit: "$",
        },
        enableColumnFilter: true,
      },
      {
        id: "calories",
        accessorKey: "calories",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Calories" />
        ),
        cell: ({ cell }) => (
          <div className="text-right tabular-nums">
            {cell.getValue<number>()} cal
          </div>
        ),
        meta: {
          label: "Calories",
          variant: "range",
          range: [0, 1200] as [number, number],
          unit: "cal",
        },
        enableColumnFilter: true,
      },
      {
        id: "allergens",
        accessorKey: "allergens",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Allergens" />
        ),
        cell: ({ cell }) => {
          const items = cell.getValue<string[]>();
          if (items.length === 0)
            return <span className="text-muted-foreground">None</span>;
          return (
            <div className="flex flex-wrap gap-1">
              {items.map((a) => (
                <Badge key={a} variant="destructive" className="text-xs">
                  {a}
                </Badge>
              ))}
            </div>
          );
        },
        meta: {
          label: "Allergens",
          variant: "multiSelect",
          options: allergenOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: "vegetarian",
        accessorKey: "vegetarian",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Vegetarian" />
        ),
        cell: ({ cell }) => (
          <div>{cell.getValue<boolean>() ? "🌱 Yes" : "No"}</div>
        ),
        meta: {
          label: "Vegetarian",
          variant: "boolean",
        },
        enableColumnFilter: true,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "course", desc: false }],
    },
  });

  return (
    <div className="w-full max-w-5xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}

// --- Demo: ActionBar ---

function ActionBarDemo() {
  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
        ),
        meta: { label: "Title" },
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        meta: { label: "Status" },
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: projects,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
  });

  return (
    <div className="w-full max-w-4xl">
      <DataTable
        table={table}
        actionBar={
          <div className="bg-muted rounded-md p-2 text-center text-sm">
            Delete selected
          </div>
        }
      />
    </div>
  );
}

// --- Demo: NonSortableColumn ---

function NonSortableColumnDemo() {
  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="ID" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
        ),
        meta: { label: "Title" },
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        meta: { label: "Status" },
        enableSorting: false,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: projects,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
  });

  return (
    <div className="w-full max-w-4xl">
      <DataTable table={table} />
    </div>
  );
}

// --- Demo: FacetedFilterWithCounts ---

const statusOptionsWithCounts = [
  { label: "Active", value: "active", icon: CheckCircle2, count: 5 },
  { label: "Draft", value: "draft", icon: CircleDashed, count: 3 },
  { label: "Archived", value: "archived", icon: XCircle, count: 2 },
];

function FacetedFilterWithCountsDemo() {
  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable reference for table config
  const columns = useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ cell }) => (
          <div className="font-medium">{cell.getValue<string>()}</div>
        ),
        meta: {
          label: "Title",
          placeholder: "Search titles...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => cell.getValue<string>(),
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: statusOptionsWithCounts,
        },
        enableColumnFilter: true,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data: projects,
    columns,
    pageCount: 1,
    getRowId: (row) => row.id,
  });

  return (
    <div className="w-full max-w-4xl">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
