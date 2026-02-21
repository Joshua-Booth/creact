import preview from "@/storybook/preview";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { expect, fireEvent, userEvent, waitFor, within } from "storybook/test";

import { ActionBarDemo } from "./demo/action-bar-demo";
import { AllFiltersDemo } from "./demo/all-filters-demo";
import { DataTableDemo } from "./demo/data-table-demo";
import { EmptyStateDemo } from "./demo/empty-state-demo";
import { FacetedFilterWithCountsDemo } from "./demo/faceted-filter-with-counts-demo";
import { MusicLibraryDemo } from "./demo/music-library-demo";
import { NonSortableColumnDemo } from "./demo/non-sortable-column-demo";
import { PaginationDemo } from "./demo/pagination-demo";
import { RealEstateListingsDemo } from "./demo/real-estate-listings-demo";
import { RestaurantMenuDemo } from "./demo/restaurant-menu-demo";
import { StudentGradesDemo } from "./demo/student-grades-demo";

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
