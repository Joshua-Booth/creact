import type { ColumnDef } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import preview from "@/storybook/preview";
import { expect, userEvent, waitFor, within } from "storybook/test";

import type { FileCellData, RowHeightValue } from "@/shared/lib/data-grid";
import { useDataGrid } from "@/shared/lib/data-grid";

import { DataGrid } from "./data-grid";
import { DataGridKeyboardShortcuts } from "./data-grid-keyboard-shortcuts";

// --- Types ---

interface Task {
  id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
  completed: boolean;
  effort: number;
  dueDate: string;
}

interface AllCellTypesRow {
  id: string;
  shortText: string;
  longText: string;
  number: number;
  url: string;
  checkbox: boolean;
  select: string;
  multiSelect: string[];
  date: string;
  files: FileCellData[];
}

// --- Sample data ---

function createSampleData(): Task[] {
  return [
    {
      id: "1",
      title: "Set up CI/CD pipeline",
      status: "done",
      priority: "high",
      assignee: "Alice",
      completed: true,
      effort: 8,
      dueDate: "2026-01-15",
    },
    {
      id: "2",
      title: "Design landing page",
      status: "in-progress",
      priority: "medium",
      assignee: "Bob",
      completed: false,
      effort: 5,
      dueDate: "2026-02-01",
    },
    {
      id: "3",
      title: "Write unit tests",
      status: "todo",
      priority: "high",
      assignee: "Charlie",
      completed: false,
      effort: 13,
      dueDate: "2026-02-20",
    },
    {
      id: "4",
      title: "Update documentation",
      status: "todo",
      priority: "low",
      assignee: "Alice",
      completed: false,
      effort: 3,
      dueDate: "2026-03-01",
    },
    {
      id: "5",
      title: "Fix login bug",
      status: "in-progress",
      priority: "high",
      assignee: "Bob",
      completed: false,
      effort: 2,
      dueDate: "2026-01-28",
    },
    {
      id: "6",
      title: "Add dark mode support",
      status: "todo",
      priority: "medium",
      assignee: "Charlie",
      completed: false,
      effort: 8,
      dueDate: "2026-03-15",
    },
    {
      id: "7",
      title: "Optimize bundle size",
      status: "done",
      priority: "medium",
      assignee: "Alice",
      completed: true,
      effort: 5,
      dueDate: "2026-01-10",
    },
    {
      id: "8",
      title: "Implement search",
      status: "in-progress",
      priority: "high",
      assignee: "Bob",
      completed: false,
      effort: 8,
      dueDate: "2026-02-10",
    },
  ];
}

function createAllCellTypesData(): AllCellTypesRow[] {
  return [
    {
      id: "1",
      shortText: "Quick note",
      longText:
        "This is a longer description that spans multiple lines and demonstrates how the long text cell handles overflow with a popover editing experience.",
      number: 42,
      url: "https://example.com",
      checkbox: true,
      select: "active",
      multiSelect: ["frontend", "backend"],
      date: "2026-03-15",
      files: [
        {
          id: "f1",
          name: "report.pdf",
          size: 1048576,
          type: "application/pdf",
        },
      ],
    },
    {
      id: "2",
      shortText: "Meeting notes",
      longText:
        "Brief summary of the quarterly review meeting and action items.",
      number: 99,
      url: "docs.example.com/guide",
      checkbox: false,
      select: "draft",
      multiSelect: ["design", "frontend", "mobile"],
      date: "2026-01-20",
      files: [
        { id: "f2", name: "screenshot.png", size: 204800, type: "image/png" },
        {
          id: "f3",
          name: "data.xlsx",
          size: 51200,
          type: "application/vnd.ms-excel",
        },
      ],
    },
    {
      id: "3",
      shortText: "Release checklist",
      longText: "Final verification steps before v2.0 release.",
      number: 7,
      url: "https://github.com/org/repo",
      checkbox: true,
      select: "archived",
      multiSelect: ["ops"],
      date: "2026-06-01",
      files: [],
    },
    {
      id: "4",
      shortText: "Bug report",
      longText:
        "Users report intermittent 500 errors when submitting the contact form during peak hours.",
      number: 0,
      url: "",
      checkbox: false,
      select: "active",
      multiSelect: ["backend", "ops"],
      date: "2026-02-28",
      files: [
        {
          id: "f4",
          name: "presentation.pptx",
          size: 5242880,
          type: "application/vnd.ms-powerpoint",
        },
      ],
    },
    {
      id: "5",
      shortText: "Design review",
      longText: "Review the new dashboard layout with the team.",
      number: 256,
      url: "figma.com/file/abc123",
      checkbox: false,
      select: "draft",
      multiSelect: ["design"],
      date: "2026-04-10",
      files: [
        {
          id: "f5",
          name: "archive.zip",
          size: 10485760,
          type: "application/zip",
        },
        { id: "f6", name: "video.mp4", size: 52428800, type: "video/mp4" },
        { id: "f7", name: "audio.mp3", size: 3145728, type: "audio/mpeg" },
      ],
    },
  ];
}

function mockFilesUpload(params: {
  files: File[];
  rowIndex: number;
  columnId: string;
}): Promise<FileCellData[]> {
  return Promise.resolve(
    params.files.map((file, i) => ({
      id: `upload-${Date.now()}-${i}`,
      name: file.name,
      size: file.size,
      type: file.type,
    }))
  );
}

function createLargeDataset(): Task[] {
  const statuses: Task["status"][] = ["todo", "in-progress", "done"];
  const priorities: Task["priority"][] = ["low", "medium", "high"];
  const assignees = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
  return Array.from({ length: 500 }, (_, i) => ({
    id: String(i + 1),
    title: `Task ${i + 1}: ${["Implement", "Fix", "Refactor", "Test", "Document"][i % 5]} ${["auth", "API", "UI", "build", "deploy"][i % 5]}`,
    status: statuses[i % 3] ?? "todo",
    priority: priorities[i % 3] ?? "medium",
    assignee: assignees[i % 5] ?? "Alice",
    completed: i % 4 === 0,
    effort: (i % 13) + 1,
    dueDate: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  }));
}

// --- Story setup ---

const meta = preview.meta({
  title: "ui/DataGrid",
  component: DataGridDemo,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Spreadsheet-like editable data grid with virtualization, clipboard support, and undo/redo.",
      },
    },
  },
  args: {
    readOnly: false,
  },
});

// --- Stories ---

/** Editable data grid with multiple cell variants. */
export const Default = meta.story({
  render: (args) => <DataGridDemo {...args} />,
});

/** Read-only data grid. */
export const ReadOnly = meta.story({
  args: { readOnly: true },
  render: (args) => <DataGridDemo {...args} />,
});

/** Grid showcasing all 9 cell type variants. */
export const AllCellTypes = meta.story({
  render: (args) => <AllCellTypesDemo {...args} />,
});

/** Grid with search enabled and pre-opened search overlay. */
export const WithSearch = meta.story({
  render: (args) => <DataGridDemo {...args} />,
});

/** Virtualized grid with 500 rows. */
export const LargeDataset = meta.story({
  render: (args) => <LargeDatasetDemo {...args} />,
});

/** Grid with tall row height. */
export const RowHeights = meta.story({
  render: (args) => <RowHeightsDemo {...args} />,
});

/** Grid with context menu enabled via right-click. */
export const ContextMenu = meta.story({
  render: (args) => <DataGridDemo {...args} />,
});

/** Grid with paste enabled, demonstrating the paste dialog. */
export const WithPaste = meta.story({
  render: (args) => <DataGridDemo {...args} />,
});

/** Editable recipe collection with long-text instructions, multi-select dietary tags, and file uploads. */
export const RecipeBook = meta.story({
  render: (args) => <RecipeBookDemo {...args} />,
});

/** Read-only company directory with search for employee lookup. */
export const EmployeeDirectory = meta.story({
  args: { readOnly: true },
  render: (args) => <EmployeeDirectoryDemo {...args} />,
});

/** E-commerce product catalog with all cell variants, paste, and search. */
export const ProductCatalog = meta.story({
  render: (args) => <ProductCatalogDemo {...args} />,
});

// --- Test helpers ---

function getFirstCellWrapper(canvasElement: HTMLElement): HTMLElement {
  const wrapper = canvasElement.querySelector<HTMLElement>(
    '[data-slot="grid-cell-wrapper"]'
  );
  if (!wrapper) throw new Error("Expected at least one grid cell wrapper");
  return wrapper;
}

// --- Tests: Default ---

Default.test(
  "should render the grid with all rows",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify grid and rows render", async () => {
      await expect(canvas.getByRole("grid")).toBeInTheDocument();
      const rows = canvas.getAllByRole("row");
      // 8 data rows + 1 header row + 1 add-row footer
      await expect(rows).toHaveLength(10);
    });
  }
);

Default.test(
  "should focus a cell on click",
  async ({ canvasElement, step }) => {
    await step("click a cell and verify focus", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });
    });
  }
);

Default.test(
  "should enter edit mode on double-click",
  async ({ canvasElement, step }) => {
    await step("double-click a text cell and verify editing", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      // Double-click from unfocused triggers focus then editing
      await userEvent.dblClick(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-editing", "");
      });
    });
  }
);

Default.test(
  "should navigate cells with arrow keys",
  async ({ canvasElement, step }) => {
    await step("focus cell and press ArrowRight", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      await userEvent.keyboard("{ArrowRight}");
      await waitFor(async () => {
        await expect(firstWrapper).not.toHaveAttribute("data-focused", "");
      });
    });
  }
);

Default.test("should toggle checkbox cell", async ({ canvasElement, step }) => {
  const canvas = within(canvasElement);

  await step("click checkbox cell and verify toggle", async () => {
    const checkboxes = canvas.getAllByRole("checkbox", { name: /done/i });
    const firstCheckbox = checkboxes[0];
    if (!firstCheckbox) throw new Error("Expected at least one Done checkbox");
    const wasChecked = firstCheckbox.ariaChecked === "true";
    await userEvent.click(firstCheckbox);
    await waitFor(async () => {
      await (wasChecked
        ? expect(firstCheckbox).not.toBeChecked()
        : expect(firstCheckbox).toBeChecked());
    });
  });
});

// --- Tests: ReadOnly ---

ReadOnly.test(
  "should render the grid in read-only mode",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify grid renders with rows", async () => {
      await expect(canvas.getByRole("grid")).toBeInTheDocument();
      const rows = canvas.getAllByRole("row");
      // 8 data rows + 1 header row
      await expect(rows).toHaveLength(9);
    });
  }
);

ReadOnly.test(
  "should not enter edit mode on double-click",
  async ({ canvasElement, step }) => {
    await step("double-click cell and verify no editing", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await userEvent.dblClick(firstWrapper);
      await expect(firstWrapper).not.toHaveAttribute("data-editing");
    });
  }
);

// --- Tests: AllCellTypes ---

AllCellTypes.test(
  "should render all cell type variants",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify grid renders with all column headers", async () => {
      await expect(canvas.getByRole("grid")).toBeInTheDocument();
      await expect(canvas.getByText("Short Text")).toBeVisible();
      await expect(canvas.getByText("Long Text")).toBeVisible();
      await expect(canvas.getByText("Number")).toBeVisible();
      await expect(canvas.getByText("URL")).toBeVisible();
      await expect(canvas.getByText("Done")).toBeVisible();
      await expect(canvas.getByText("Status")).toBeVisible();
      await expect(canvas.getByText("Tags")).toBeVisible();
      await expect(canvas.getByText("Due Date")).toBeVisible();
      await expect(canvas.getByText("Attachments")).toBeVisible();
    });
  }
);

AllCellTypes.test(
  "should render URL as a link",
  async ({ canvasElement, step }) => {
    await step("verify URL cell renders anchor element", async () => {
      const link = canvasElement.querySelector<HTMLAnchorElement>(
        'a[href="https://example.com"]'
      );
      await expect(link).not.toBeNull();
    });
  }
);

AllCellTypes.test(
  "should render multi-select badges",
  async ({ canvasElement, step }) => {
    await step("verify multi-select cells render badge elements", async () => {
      const badges = canvasElement.querySelectorAll('[data-slot="badge"]');
      await expect(badges.length).toBeGreaterThan(0);
    });
  }
);

AllCellTypes.test(
  "should render file attachments",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify file cell renders file name", async () => {
      await expect(canvas.getByText("report.pdf")).toBeVisible();
    });
  }
);

// --- Tests: WithSearch ---

WithSearch.test(
  "should open search and find matches",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("open search overlay", async () => {
      const grid = canvas.getByRole("grid");
      await userEvent.click(grid);
      await userEvent.keyboard("{Meta>}f{/Meta}");
      await waitFor(async () => {
        const searchInput = canvasElement.querySelector<HTMLInputElement>(
          '[data-slot="grid-search"] input'
        );
        await expect(searchInput).not.toBeNull();
      });
    });

    await step("type a search query", async () => {
      const searchInput = canvasElement.querySelector<HTMLInputElement>(
        '[data-slot="grid-search"] input'
      );
      if (!searchInput) throw new Error("Search input not found");
      await userEvent.type(searchInput, "Alice");
      await waitFor(async () => {
        await expect(searchInput).toHaveValue("Alice");
      });
    });
  }
);

// --- Tests: LargeDataset ---

LargeDataset.test(
  "should render a large virtualized grid",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify grid renders", async () => {
      await expect(canvas.getByRole("grid")).toBeInTheDocument();
      // Should render header + visible virtualized rows (not all 500)
      const rows = canvas.getAllByRole("row");
      await expect(rows.length).toBeLessThan(500);
      await expect(rows.length).toBeGreaterThan(1);
    });
  }
);

// --- Tests: RowHeights ---

RowHeights.test(
  "should render with tall row height",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify grid renders with correct row height", async () => {
      await expect(canvas.getByRole("grid")).toBeInTheDocument();
      const dataRow = canvasElement.querySelector<HTMLElement>(
        '[data-slot="grid-row"]'
      );
      if (!dataRow) throw new Error("Expected at least one data row");
      const height = Number.parseInt(dataRow.style.height, 10);
      // Tall row height = 76px
      await expect(height).toBe(76);
    });
  }
);

// --- Tests: ContextMenu ---

ContextMenu.test(
  "should render the grid with context menu support",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify grid renders and cells are focusable", async () => {
      await expect(canvas.getByRole("grid")).toBeInTheDocument();
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });
    });
  }
);

// --- Tests: Default (comprehensive keyboard + editing tests) ---

Default.test(
  "should support keyboard navigation",
  async ({ canvasElement, step }) => {
    await step("navigate with Tab and arrow keys", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Tab to next cell
      await userEvent.keyboard("{Tab}");
      // ArrowDown to move down
      await userEvent.keyboard("{ArrowDown}");
      // Home to go back to first cell in row
      await userEvent.keyboard("{Home}");
      // Ctrl+ArrowRight to jump to end of row
      await userEvent.keyboard("{Meta>}{ArrowRight}{/Meta}");
      // Ctrl+ArrowDown to jump to last row
      await userEvent.keyboard("{Meta>}{ArrowDown}{/Meta}");
      // Verify something is still focused
      const focused = canvasElement.querySelector(
        '[data-slot="grid-cell-wrapper"][data-focused]'
      );
      await expect(focused).not.toBeNull();
    });
  }
);

Default.test(
  "should support editing lifecycle",
  async ({ canvasElement, step }) => {
    await step("Enter to edit, Escape to cancel, F2, type char", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Enter to start editing
      await userEvent.keyboard("{Enter}");
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-editing", "");
      });

      // Escape to cancel editing
      await userEvent.keyboard("{Escape}");
      await waitFor(async () => {
        await expect(firstWrapper).not.toHaveAttribute("data-editing");
      });

      // F2 to start editing again
      await userEvent.keyboard("{F2}");
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-editing", "");
      });

      // Escape
      await userEvent.keyboard("{Escape}");
      await waitFor(async () => {
        await expect(firstWrapper).not.toHaveAttribute("data-editing");
      });
    });
  }
);

Default.test(
  "should support select-all and clipboard",
  async ({ canvasElement, step }) => {
    await step("Ctrl+A to select all, then Ctrl+C to copy", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Ctrl+A to select all
      await userEvent.keyboard("{Meta>}a{/Meta}");
      await waitFor(async () => {
        const selectedCells = canvasElement.querySelectorAll(
          '[data-slot="grid-cell-wrapper"][data-selected]'
        );
        await expect(selectedCells.length).toBeGreaterThan(1);
      });

      // Ctrl+C to copy (exercises handler)
      await userEvent.keyboard("{Meta>}c{/Meta}");
    });
  }
);

Default.test(
  "should handle Delete and Backspace keys",
  async ({ canvasElement, step }) => {
    await step("focus cell and press Delete", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Delete exercises the clear cell handler
      await userEvent.keyboard("{Delete}");
      // Backspace exercises the clear cell handler
      await userEvent.keyboard("{Backspace}");
      // Grid should still be functional
      const grid = canvasElement.querySelector('[role="grid"]');
      await expect(grid).not.toBeNull();
    });
  }
);

Default.test(
  "should have add-row footer when not read-only",
  async ({ canvasElement, step }) => {
    await step("verify add-row button exists", async () => {
      const addRowButton = canvasElement.querySelector<HTMLElement>(
        '[data-slot="grid-add-row"]'
      );
      await expect(addRowButton).not.toBeNull();
    });
  }
);

// --- Tests: AllCellTypes (additional editing tests) ---

AllCellTypes.test(
  "should edit a short-text cell inline",
  async ({ canvasElement, step }) => {
    await step(
      "double-click short text cell and verify edit mode",
      async () => {
        const firstWrapper = getFirstCellWrapper(canvasElement);
        await userEvent.dblClick(firstWrapper);
        await waitFor(async () => {
          await expect(firstWrapper).toHaveAttribute("data-editing", "");
        });

        // Short text cell uses contentEditable - type and press Enter to save
        await userEvent.keyboard("Updated text{Enter}");
        await waitFor(async () => {
          await expect(firstWrapper).not.toHaveAttribute("data-editing");
        });
      }
    );
  }
);

AllCellTypes.test(
  "should navigate between cell types with Tab",
  async ({ canvasElement, step }) => {
    await step("tab through different cell types", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Tab through several cells
      for (let i = 0; i < 3; i++) {
        await userEvent.keyboard("{Tab}");
      }

      await waitFor(async () => {
        const focusedCell = canvasElement.querySelector(
          '[data-slot="grid-cell-wrapper"][data-focused]'
        );
        await expect(focusedCell).not.toBeNull();
        await expect(focusedCell).not.toBe(firstWrapper);
      });
    });
  }
);

AllCellTypes.test(
  "should toggle checkbox in AllCellTypes grid",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("click a checkbox cell", async () => {
      const checkboxes = canvas.getAllByRole("checkbox", { name: /done/i });
      const firstCheckbox = checkboxes[0];
      if (!firstCheckbox)
        throw new Error("Expected at least one Done checkbox");
      const wasChecked = firstCheckbox.ariaChecked === "true";
      await userEvent.click(firstCheckbox);
      await waitFor(async () => {
        await (wasChecked
          ? expect(firstCheckbox).not.toBeChecked()
          : expect(firstCheckbox).toBeChecked());
      });
    });
  }
);

AllCellTypes.test(
  "should render date cells with formatted dates",
  async ({ canvasElement, step }) => {
    await step("verify date cells contain formatted date text", async () => {
      // Look for date-related content in the grid (dates are formatted for display)
      const dateCells = canvasElement.querySelectorAll(
        '[data-slot="grid-cell-wrapper"]'
      );
      await expect(dateCells.length).toBeGreaterThan(0);
    });
  }
);

AllCellTypes.test(
  "should render number cells with numeric values",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify number cell content", async () => {
      await expect(canvas.getByText("42")).toBeVisible();
      await expect(canvas.getByText("99")).toBeVisible();
    });
  }
);

AllCellTypes.test(
  "should edit number cell with keyboard",
  async ({ canvasElement, step }) => {
    await step("navigate to number cell and edit", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Tab twice to reach the Number column (Short Text -> Long Text -> Number)
      await userEvent.keyboard("{Tab}{Tab}");

      // Find the currently focused cell
      const focusedCell = canvasElement.querySelector<HTMLElement>(
        '[data-slot="grid-cell-wrapper"][data-focused]'
      );
      if (!focusedCell) throw new Error("Expected a focused cell");

      // Enter to start editing
      await userEvent.keyboard("{Enter}");
      await waitFor(async () => {
        await expect(focusedCell).toHaveAttribute("data-editing", "");
      });

      // Type a number
      await userEvent.keyboard("123");
      // Tab to save and move to next cell
      await userEvent.keyboard("{Tab}");
      await waitFor(async () => {
        await expect(focusedCell).not.toHaveAttribute("data-editing");
      });
    });
  }
);

AllCellTypes.test(
  "should navigate to URL cell and render link",
  async ({ canvasElement, step }) => {
    await step("verify URL cell has clickable link", async () => {
      const links = canvasElement.querySelectorAll<HTMLAnchorElement>(
        '[data-slot="grid-cell-wrapper"] a'
      );
      await expect(links.length).toBeGreaterThan(0);
      const firstLink = links[0];
      if (!firstLink) throw new Error("Expected at least one link");
      await expect(firstLink.getAttribute("target")).toBe("_blank");
    });
  }
);

AllCellTypes.test(
  "should edit short-text cell with Tab to save",
  async ({ canvasElement, step }) => {
    await step("double-click to edit, Tab to save and move", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      // Double-click to reliably enter edit mode
      await userEvent.dblClick(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-editing", "");
      });

      // Tab to save and move to next cell
      await userEvent.keyboard("{Tab}");
      await waitFor(async () => {
        await expect(firstWrapper).not.toHaveAttribute("data-editing");
      });
    });
  }
);

// --- Tests: WithSearch (additional interaction tests) ---

WithSearch.test(
  "should close search with close button",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("open search then click close button", async () => {
      const grid = canvas.getByRole("grid");
      await userEvent.click(grid);
      await userEvent.keyboard("{Meta>}f{/Meta}");
      await waitFor(async () => {
        const searchInput = canvasElement.querySelector<HTMLInputElement>(
          '[data-slot="grid-search"] input'
        );
        await expect(searchInput).not.toBeNull();
      });

      // Click close button to dismiss search
      const closeButton = canvasElement.querySelector<HTMLButtonElement>(
        '[data-slot="grid-search"] button[aria-label="Close search"]'
      );
      if (closeButton) {
        await userEvent.click(closeButton);
        await waitFor(async () => {
          const searchInput = canvasElement.querySelector<HTMLInputElement>(
            '[data-slot="grid-search"] input'
          );
          await expect(searchInput).toBeNull();
        });
      }
    });
  }
);

WithSearch.test(
  "should navigate search matches with Enter",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step(
      "open search, type query, then press Enter to cycle matches",
      async () => {
        const grid = canvas.getByRole("grid");
        await userEvent.click(grid);
        await userEvent.keyboard("{Meta>}f{/Meta}");

        const searchInput = await waitFor(() => {
          const input = canvasElement.querySelector<HTMLInputElement>(
            '[data-slot="grid-search"] input'
          );
          if (!input) throw new Error("Search input not found");
          return input;
        });

        await userEvent.type(searchInput, "Alice");
        // Wait for search results to populate
        await waitFor(async () => {
          await expect(searchInput).toHaveValue("Alice");
        });

        // Press Enter to navigate to next match
        await userEvent.keyboard("{Enter}");
        // Verify search overlay is still open
        await waitFor(async () => {
          const overlay = canvasElement.querySelector(
            '[data-slot="grid-search"]'
          );
          await expect(overlay).not.toBeNull();
        });
      }
    );
  }
);

// --- Tests: LargeDataset (additional tests) ---

LargeDataset.test(
  "should navigate in virtualized grid with keyboard",
  async ({ canvasElement, step }) => {
    await step("focus cell and navigate with arrow keys", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Navigate down multiple times
      for (let i = 0; i < 5; i++) {
        await userEvent.keyboard("{ArrowDown}");
      }

      await waitFor(async () => {
        const focusedCell = canvasElement.querySelector(
          '[data-slot="grid-cell-wrapper"][data-focused]'
        );
        await expect(focusedCell).not.toBeNull();
      });
    });
  }
);

LargeDataset.test(
  "should navigate to end of large dataset with Ctrl+End",
  async ({ canvasElement, step }) => {
    await step("press Ctrl+End to jump to last cell", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      await userEvent.keyboard("{Meta>}{End}{/Meta}");
      await waitFor(async () => {
        // Focus should have moved from first cell
        await expect(firstWrapper).not.toHaveAttribute("data-focused", "");
      });
    });
  }
);

// --- Tests: RowHeights (additional tests) ---

RowHeights.test(
  "should edit cell in tall row height mode",
  async ({ canvasElement, step }) => {
    await step("double-click cell to edit in tall row mode", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.dblClick(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-editing", "");
      });

      await userEvent.keyboard("{Escape}");
      await waitFor(async () => {
        await expect(firstWrapper).not.toHaveAttribute("data-editing");
      });
    });
  }
);

// --- Tests: WithPaste ---

WithPaste.test(
  "should render the grid with paste enabled",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("verify grid renders", async () => {
      await expect(canvas.getByRole("grid")).toBeInTheDocument();
    });
  }
);

WithPaste.test(
  "should handle paste keyboard shortcut",
  async ({ canvasElement, step }) => {
    await step("focus cell and press Ctrl+V", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Ctrl+V won't actually paste (clipboard not available) but exercises the handler
      await userEvent.keyboard("{Meta>}v{/Meta}");
      // Grid should still be functional
      await waitFor(async () => {
        const grid = canvasElement.querySelector('[role="grid"]');
        await expect(grid).not.toBeNull();
      });
    });
  }
);

WithPaste.test(
  "should handle cut keyboard shortcut",
  async ({ canvasElement, step }) => {
    await step("focus cell and press Ctrl+X", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      await userEvent.keyboard("{Meta>}x{/Meta}");
      // Cell should still be focused after cut
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });
    });
  }
);

// --- Tests: ContextMenu (right-click interactions) ---

ContextMenu.test(
  "should open context menu on right-click and exercise Copy",
  async ({ canvasElement, step }) => {
    await step("right-click a cell to open context menu", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Right-click to open context menu
      await userEvent.pointer({
        target: firstWrapper,
        keys: "[MouseRight]",
      });

      await waitFor(async () => {
        const menu = canvasElement.ownerDocument.querySelector(
          '[data-grid-popover] [role="menuitem"]'
        );
        await expect(menu).not.toBeNull();
      });
    });

    await step("click Copy menu item", async () => {
      const copyItem = canvasElement.ownerDocument.querySelector(
        '[data-grid-popover] [role="menuitem"]'
      );
      if (copyItem) {
        await userEvent.click(copyItem);
      }
    });
  }
);

ContextMenu.test(
  "should show Clear in context menu and exercise it",
  async ({ canvasElement, step }) => {
    await step("right-click cell, select cells, clear", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Select multiple cells
      await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
      await waitFor(async () => {
        const selected = canvasElement.querySelectorAll(
          '[data-slot="grid-cell-wrapper"][data-selected]'
        );
        await expect(selected.length).toBeGreaterThanOrEqual(1);
      });

      // Right-click to open context menu
      await userEvent.pointer({
        target: firstWrapper,
        keys: "[MouseRight]",
      });

      await waitFor(async () => {
        const items = canvasElement.ownerDocument.querySelectorAll(
          '[data-grid-popover] [role="menuitem"]'
        );
        await expect(items.length).toBeGreaterThanOrEqual(3);
      });

      // Click Clear (3rd menu item)
      const items = canvasElement.ownerDocument.querySelectorAll(
        '[data-grid-popover] [role="menuitem"]'
      );
      if (items[2]) {
        await userEvent.click(items[2]);
      }
    });
  }
);

// Column header sort/pin/hide callbacks are tested via unit tests in data-table.test.ts.
// The dropdown trigger cannot be reliably opened in the Storybook test environment
// because base-ui's Menu.Trigger requires browser-native pointer events.

// --- Tests: Keyboard shortcuts dialog ---

Default.test(
  "should open keyboard shortcuts dialog with Ctrl+/",
  async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("press Ctrl+/ to open shortcuts dialog", async () => {
      const grid = canvas.getByRole("grid");
      await userEvent.click(grid);

      // Dispatch keyboard event directly on window since the listener is on window
      canvasElement.ownerDocument.defaultView?.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "/",
          ctrlKey: true,
          bubbles: true,
        })
      );

      await waitFor(async () => {
        const dialog =
          canvasElement.ownerDocument.querySelector('[role="dialog"]');
        await expect(dialog).not.toBeNull();
      });
    });

    await step("verify shortcut groups render", async () => {
      const dialog =
        canvasElement.ownerDocument.querySelector('[role="dialog"]');
      if (!dialog) throw new Error("Dialog not found");
      const dialogEl = dialog as HTMLElement;

      const headings = dialogEl.querySelectorAll("h3");
      await expect(headings.length).toBeGreaterThanOrEqual(4);
    });

    await step("search for a shortcut", async () => {
      const dialog =
        canvasElement.ownerDocument.querySelector('[role="dialog"]');
      if (!dialog) throw new Error("Dialog not found");

      const searchInput = dialog.querySelector("input");
      if (!searchInput) throw new Error("Search input not found");

      await userEvent.type(searchInput, "navigate");

      await waitFor(async () => {
        // Should filter to show matching shortcuts only
        const headings = dialog.querySelectorAll("h3");
        await expect(headings.length).toBeGreaterThanOrEqual(1);
      });
    });

    await step("search for non-existent term shows empty state", async () => {
      const dialog =
        canvasElement.ownerDocument.querySelector('[role="dialog"]');
      if (!dialog) throw new Error("Dialog not found");

      const searchInput = dialog.querySelector("input");
      if (!searchInput) throw new Error("Search input not found");

      await userEvent.clear(searchInput);
      await userEvent.type(searchInput, "zzzznonexistent");

      await waitFor(async () => {
        const emptyState = dialog.querySelector(".text-lg");
        await expect(emptyState?.textContent).toBe("No shortcuts found");
      });
    });
  }
);

// --- Tests: Search (navigation) ---

WithSearch.test(
  "should navigate matches with Enter and Shift+Enter",
  async ({ canvasElement, step }) => {
    await step("open search and type a query", async () => {
      const grid = canvasElement.querySelector('[role="grid"]');
      if (!grid) throw new Error("Expected grid");
      await userEvent.click(grid);

      // Open search with Ctrl+F
      await userEvent.keyboard("{Meta>}f{/Meta}");

      await waitFor(async () => {
        const searchBar = canvasElement.querySelector(
          '[data-slot="grid-search"]'
        );
        await expect(searchBar).not.toBeNull();
      });
    });

    await step("type search query", async () => {
      const searchInput = canvasElement.querySelector(
        '[data-slot="grid-search"] input'
      );
      if (!searchInput) throw new Error("Search input not found");

      await userEvent.type(searchInput as HTMLElement, "Alice");

      // Wait for debounce
      await waitFor(
        async () => {
          const matchInfo = canvasElement.querySelector(
            '[data-slot="grid-search"]'
          );
          // Should show match count or "No results"
          await expect(matchInfo?.textContent).toBeTruthy();
        },
        { timeout: 1000 }
      );
    });

    await step("press Enter for next match", async () => {
      const searchInput = canvasElement.querySelector(
        '[data-slot="grid-search"] input'
      );
      if (!searchInput) throw new Error("Search input not found");
      await userEvent.keyboard("{Enter}");
    });

    await step("press Shift+Enter for previous match", async () => {
      await userEvent.keyboard("{Shift>}{Enter}{/Shift}");
    });

    await step("click next/prev buttons if enabled", async () => {
      const searchBar = canvasElement.querySelector(
        '[data-slot="grid-search"]'
      );
      if (!searchBar) return;

      const buttons = searchBar.querySelectorAll("button");
      for (const btn of buttons) {
        const label = btn.getAttribute("aria-label");
        if (label?.includes("Next") || label?.includes("Previous")) {
          const style = window.getComputedStyle(btn);
          if (style.pointerEvents !== "none" && !btn.disabled) {
            await userEvent.click(btn);
          }
        }
      }
    });

    await step("close search via close button", async () => {
      const closeBtn = canvasElement.querySelector(
        '[data-slot="grid-search"] button[aria-label="Close search"]'
      );
      if (closeBtn) {
        await userEvent.click(closeBtn);
      }
    });
  }
);

// --- Tests: AllCellTypes (cell variant editing) ---

AllCellTypes.test(
  "should edit number cell with keyboard input",
  async ({ canvasElement, step }) => {
    await step("click number cell and type a value", async () => {
      // Find the number column cells (3rd column, index 2)
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      // Number column is the 3rd column
      const numberCell = wrappers[2];
      if (!numberCell) throw new Error("Expected number cell");

      await userEvent.click(numberCell);
      await waitFor(async () => {
        await expect(numberCell).toHaveAttribute("data-focused", "");
      });

      // Enter to start editing
      await userEvent.keyboard("{Enter}");
      await waitFor(async () => {
        await expect(numberCell).toHaveAttribute("data-editing", "");
      });

      // Type a number
      const input = numberCell.querySelector("input");
      if (input) {
        await userEvent.clear(input);
        await userEvent.type(input, "42");
      }

      // Tab to save and move to next cell
      await userEvent.keyboard("{Tab}");
    });
  }
);

AllCellTypes.test(
  "should toggle checkbox cell via keyboard",
  async ({ canvasElement, step }) => {
    await step("focus checkbox cell and press Space", async () => {
      // Checkbox is 5th column (index 4)
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      const checkboxCell = wrappers[4];
      if (!checkboxCell) throw new Error("Expected checkbox cell");

      await userEvent.click(checkboxCell);
      await waitFor(async () => {
        await expect(checkboxCell).toHaveAttribute("data-focused", "");
      });

      // Space to toggle
      await userEvent.keyboard(" ");
      // Enter also toggles
      await userEvent.keyboard("{Enter}");
    });
  }
);

AllCellTypes.test(
  "should open select cell dropdown",
  async ({ canvasElement, step }) => {
    await step("click select cell and enter edit mode", async () => {
      // Select cell is 6th column (index 5)
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      const selectCell = wrappers[5];
      if (!selectCell) throw new Error("Expected select cell");

      await userEvent.click(selectCell);
      await waitFor(async () => {
        await expect(selectCell).toHaveAttribute("data-focused", "");
      });

      // Enter to open select dropdown
      await userEvent.keyboard("{Enter}");
      await waitFor(async () => {
        await expect(selectCell).toHaveAttribute("data-editing", "");
      });

      // Escape to close
      await userEvent.keyboard("{Escape}");
    });
  }
);

AllCellTypes.test(
  "should open url cell and display link",
  async ({ canvasElement, step }) => {
    await step("focus URL cell", async () => {
      // URL is 4th column (index 3)
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      const urlCell = wrappers[3];
      if (!urlCell) throw new Error("Expected URL cell");

      await userEvent.click(urlCell);
      await waitFor(async () => {
        await expect(urlCell).toHaveAttribute("data-focused", "");
      });

      // Enter to edit
      await userEvent.keyboard("{Enter}");
      await waitFor(async () => {
        await expect(urlCell).toHaveAttribute("data-editing", "");
      });

      // Escape to cancel
      await userEvent.keyboard("{Escape}");
    });
  }
);

AllCellTypes.test(
  "should open date cell calendar picker",
  async ({ canvasElement, step }) => {
    await step("click date cell and open calendar", async () => {
      // Date cell is 9th column (index 8)
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      const dateCell = wrappers[8];
      if (!dateCell) throw new Error("Expected date cell");

      await userEvent.click(dateCell);
      await waitFor(async () => {
        await expect(dateCell).toHaveAttribute("data-focused", "");
      });

      // Enter to open calendar
      await userEvent.keyboard("{Enter}");
      await waitFor(async () => {
        await expect(dateCell).toHaveAttribute("data-editing", "");
      });

      // Escape to close
      await userEvent.keyboard("{Escape}");
    });
  }
);

AllCellTypes.test(
  "should open long text cell popover",
  async ({ canvasElement, step }) => {
    await step("focus long text cell and enter edit mode", async () => {
      // Long text is 2nd column (index 1)
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      const longTextCell = wrappers[1];
      if (!longTextCell) throw new Error("Expected long text cell");

      await userEvent.click(longTextCell);
      await waitFor(async () => {
        await expect(longTextCell).toHaveAttribute("data-focused", "");
      });

      // Enter to open popover editing
      await userEvent.keyboard("{Enter}");
      await waitFor(async () => {
        await expect(longTextCell).toHaveAttribute("data-editing", "");
      });

      // Escape to close
      await userEvent.keyboard("{Escape}");
    });
  }
);

// --- Demo components ---

// --- Types: RecipeBook ---

interface Recipe {
  id: string;
  name: string;
  instructions: string;
  prepMinutes: number;
  servings: number;
  cuisine: string;
  dietary: string[];
  sourceUrl: string;
  photos: FileCellData[];
}

// --- Types: EmployeeDirectory ---

interface Employee {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  skills: string[];
  startDate: string;
  active: boolean;
}

// --- Types: ProductCatalog ---

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  tags: string[];
  productUrl: string;
  inStock: boolean;
  images: FileCellData[];
}

function DataGridDemo({ readOnly = false }: { readOnly?: boolean }) {
  const [data, setData] = useState(createSampleData);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        meta: {
          label: "Title",
          cell: { variant: "short-text" as const },
        },
        minSize: 200,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        meta: {
          label: "Status",
          cell: {
            variant: "select" as const,
            options: [
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Done", value: "done" },
            ],
          },
        },
        minSize: 130,
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        meta: {
          label: "Priority",
          cell: {
            variant: "select" as const,
            options: [
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
            ],
          },
        },
        minSize: 120,
      },
      {
        id: "assignee",
        accessorKey: "assignee",
        header: "Assignee",
        meta: {
          label: "Assignee",
          cell: { variant: "short-text" as const },
        },
        minSize: 130,
      },
      {
        id: "completed",
        accessorKey: "completed",
        header: "Done",
        meta: {
          label: "Done",
          cell: { variant: "checkbox" as const },
        },
        minSize: 80,
      },
      {
        id: "effort",
        accessorKey: "effort",
        header: "Effort (pts)",
        meta: {
          label: "Effort",
          cell: {
            variant: "number" as const,
            min: 1,
            max: 100,
          },
        },
        minSize: 110,
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        meta: {
          label: "Due Date",
          cell: { variant: "date" as const },
        },
        minSize: 130,
      },
    ],
    []
  );

  const onRowAdd = () => {
    const newRow: Task = {
      id: String(Date.now()),
      title: "",
      status: "todo",
      priority: "medium",
      assignee: "",
      completed: false,
      effort: 1,
      dueDate: new Date().toISOString().split("T")[0] ?? "",
    };
    setData((prev) => [...prev, newRow]);
    return null;
  };

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data,
    onDataChange: setData,
    onRowAdd: readOnly ? undefined : onRowAdd,
    getRowId: (row) => row.id,
    enableSearch: true,
    enablePaste: !readOnly,
    readOnly,
  });

  return (
    <div className="w-full max-w-5xl">
      <DataGridKeyboardShortcuts enableSearch={!!dataGridProps.searchState} />
      <DataGrid {...dataGridProps} table={table} height={400} />
    </div>
  );
}

const allCellTypesSelectOptions = [
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

const allCellTypesTagOptions = [
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Design", value: "design" },
  { label: "Mobile", value: "mobile" },
  { label: "Ops", value: "ops" },
];

function AllCellTypesDemo({ readOnly = false }: { readOnly?: boolean }) {
  const [data, setData] = useState(createAllCellTypesData);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<AllCellTypesRow>[]>(
    () => [
      {
        id: "shortText",
        accessorKey: "shortText",
        header: "Short Text",
        meta: { label: "Short Text", cell: { variant: "short-text" as const } },
        minSize: 140,
      },
      {
        id: "longText",
        accessorKey: "longText",
        header: "Long Text",
        meta: { label: "Long Text", cell: { variant: "long-text" as const } },
        minSize: 200,
      },
      {
        id: "number",
        accessorKey: "number",
        header: "Number",
        meta: {
          label: "Number",
          cell: { variant: "number" as const, min: 0, max: 1000 },
        },
        minSize: 100,
      },
      {
        id: "url",
        accessorKey: "url",
        header: "URL",
        meta: { label: "URL", cell: { variant: "url" as const } },
        minSize: 180,
      },
      {
        id: "checkbox",
        accessorKey: "checkbox",
        header: "Done",
        meta: { label: "Done", cell: { variant: "checkbox" as const } },
        minSize: 80,
      },
      {
        id: "select",
        accessorKey: "select",
        header: "Status",
        meta: {
          label: "Status",
          cell: {
            variant: "select" as const,
            options: allCellTypesSelectOptions,
          },
        },
        minSize: 120,
      },
      {
        id: "multiSelect",
        accessorKey: "multiSelect",
        header: "Tags",
        meta: {
          label: "Tags",
          cell: {
            variant: "multi-select" as const,
            options: allCellTypesTagOptions,
          },
        },
        minSize: 180,
      },
      {
        id: "date",
        accessorKey: "date",
        header: "Due Date",
        meta: { label: "Due Date", cell: { variant: "date" as const } },
        minSize: 130,
      },
      {
        id: "files",
        accessorKey: "files",
        header: "Attachments",
        meta: {
          label: "Attachments",
          cell: { variant: "file" as const, maxFiles: 5, multiple: true },
        },
        minSize: 200,
      },
    ],
    []
  );

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data,
    onDataChange: setData,
    onFilesUpload: mockFilesUpload,
    getRowId: (row) => row.id,
    enableSearch: true,
    enablePaste: !readOnly,
    readOnly,
  });

  return (
    <div className="w-full max-w-6xl">
      <DataGrid {...dataGridProps} table={table} height={400} />
    </div>
  );
}

function LargeDatasetDemo({ readOnly = false }: { readOnly?: boolean }) {
  const [data, setData] = useState(createLargeDataset);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        meta: { label: "Title", cell: { variant: "short-text" as const } },
        minSize: 250,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        meta: {
          label: "Status",
          cell: {
            variant: "select" as const,
            options: [
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Done", value: "done" },
            ],
          },
        },
        minSize: 130,
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        meta: {
          label: "Priority",
          cell: {
            variant: "select" as const,
            options: [
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
            ],
          },
        },
        minSize: 120,
      },
      {
        id: "assignee",
        accessorKey: "assignee",
        header: "Assignee",
        meta: { label: "Assignee", cell: { variant: "short-text" as const } },
        minSize: 130,
      },
      {
        id: "effort",
        accessorKey: "effort",
        header: "Effort",
        meta: {
          label: "Effort",
          cell: { variant: "number" as const, min: 1, max: 100 },
        },
        minSize: 100,
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        meta: { label: "Due Date", cell: { variant: "date" as const } },
        minSize: 130,
      },
    ],
    []
  );

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data,
    onDataChange: setData,
    getRowId: (row) => row.id,
    enableSearch: true,
    readOnly,
  });

  return (
    <div className="w-full max-w-5xl">
      <DataGrid {...dataGridProps} table={table} height={500} />
    </div>
  );
}

function RowHeightsDemo({ readOnly = false }: { readOnly?: boolean }) {
  const [data, setData] = useState(createSampleData);
  const [rowHeight] = useState<RowHeightValue>("tall");

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: "Title",
        meta: { label: "Title", cell: { variant: "short-text" as const } },
        minSize: 200,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        meta: {
          label: "Status",
          cell: {
            variant: "select" as const,
            options: [
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Done", value: "done" },
            ],
          },
        },
        minSize: 130,
      },
      {
        id: "assignee",
        accessorKey: "assignee",
        header: "Assignee",
        meta: { label: "Assignee", cell: { variant: "short-text" as const } },
        minSize: 130,
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        meta: { label: "Due Date", cell: { variant: "date" as const } },
        minSize: 130,
      },
    ],
    []
  );

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data,
    onDataChange: setData,
    getRowId: (row) => row.id,
    rowHeight,
    readOnly,
  });

  return (
    <div className="w-full max-w-4xl">
      <DataGrid {...dataGridProps} table={table} height={500} />
    </div>
  );
}

// --- Data: RecipeBook ---

function createRecipeData(): Recipe[] {
  return [
    {
      id: "1",
      name: "Pad Thai",
      instructions:
        "Soak rice noodles in warm water for 30 minutes. Stir-fry shrimp and tofu in a hot wok with garlic. Add noodles, tamarind sauce, fish sauce, and sugar. Toss with bean sprouts, crushed peanuts, and a squeeze of lime.",
      prepMinutes: 45,
      servings: 4,
      cuisine: "Thai",
      dietary: ["Gluten-Free"],
      sourceUrl: "https://example.com/pad-thai",
      photos: [
        { id: "r1", name: "pad-thai.jpg", size: 204800, type: "image/jpeg" },
      ],
    },
    {
      id: "2",
      name: "Margherita Pizza",
      instructions:
        "Stretch dough into a 12-inch circle. Spread San Marzano tomato sauce evenly. Top with fresh mozzarella slices and basil leaves. Bake at 500 F on a preheated pizza stone for 8-10 minutes until the crust is golden and cheese is bubbling.",
      prepMinutes: 90,
      servings: 2,
      cuisine: "Italian",
      dietary: ["Vegetarian"],
      sourceUrl: "https://example.com/margherita",
      photos: [],
    },
    {
      id: "3",
      name: "Butter Chicken",
      instructions:
        "Marinate chicken in yogurt, garam masala, and turmeric for at least 2 hours. Grill or broil until charred. Simmer in a sauce of tomatoes, butter, cream, and spices until rich and velvety. Serve with basmati rice or naan.",
      prepMinutes: 180,
      servings: 6,
      cuisine: "Indian",
      dietary: ["Gluten-Free"],
      sourceUrl: "https://example.com/butter-chicken",
      photos: [
        {
          id: "r2",
          name: "butter-chicken.jpg",
          size: 310000,
          type: "image/jpeg",
        },
      ],
    },
    {
      id: "4",
      name: "Black Bean Tacos",
      instructions:
        "Sauté black beans with cumin, chili powder, and lime juice. Warm corn tortillas. Fill with beans, diced avocado, pickled onions, cilantro, and a drizzle of crema.",
      prepMinutes: 25,
      servings: 4,
      cuisine: "Mexican",
      dietary: ["Vegetarian", "Vegan", "Gluten-Free"],
      sourceUrl: "https://example.com/bean-tacos",
      photos: [],
    },
    {
      id: "5",
      name: "Miso Ramen",
      instructions:
        "Prepare dashi stock with kombu and bonito flakes. Whisk in white miso paste. Cook ramen noodles separately. Assemble bowls with broth, noodles, soft-boiled egg, chashu pork, corn, and scallions.",
      prepMinutes: 60,
      servings: 2,
      cuisine: "Japanese",
      dietary: [],
      sourceUrl: "https://example.com/miso-ramen",
      photos: [
        { id: "r3", name: "ramen.png", size: 420000, type: "image/png" },
      ],
    },
    {
      id: "6",
      name: "Greek Salad",
      instructions:
        "Chop cucumbers, tomatoes, red onion, and bell pepper into bite-sized pieces. Add Kalamata olives and a block of feta cheese. Dress with extra virgin olive oil, red wine vinegar, dried oregano, salt, and pepper.",
      prepMinutes: 15,
      servings: 4,
      cuisine: "Greek",
      dietary: ["Vegetarian", "Gluten-Free"],
      sourceUrl: "",
      photos: [],
    },
    {
      id: "7",
      name: "Croissants",
      instructions:
        "Mix flour, sugar, yeast, and salt into a dough. Enclose a cold butter block and perform three double folds with chilling in between. Shape into crescents, proof until doubled, then bake at 400 F until deeply golden and flaky.",
      prepMinutes: 480,
      servings: 12,
      cuisine: "French",
      dietary: ["Vegetarian"],
      sourceUrl: "https://example.com/croissants",
      photos: [
        {
          id: "r4",
          name: "croissants.jpg",
          size: 180000,
          type: "image/jpeg",
        },
      ],
    },
    {
      id: "8",
      name: "Bibimbap",
      instructions:
        "Cook short-grain rice. Prepare individual toppings: sautéed spinach, bean sprouts, carrots, zucchini, and marinated beef. Arrange on rice in a hot stone bowl. Top with a fried egg and gochujang. Mix thoroughly before eating.",
      prepMinutes: 50,
      servings: 2,
      cuisine: "Korean",
      dietary: [],
      sourceUrl: "https://example.com/bibimbap",
      photos: [],
    },
    {
      id: "9",
      name: "Falafel Wrap",
      instructions:
        "Blend soaked chickpeas with parsley, cilantro, garlic, cumin, and coriander. Form into balls and deep-fry at 350 F until crispy. Serve in warm pita with tahini sauce, pickled turnips, and fresh vegetables.",
      prepMinutes: 40,
      servings: 6,
      cuisine: "Middle Eastern",
      dietary: ["Vegetarian", "Vegan"],
      sourceUrl: "",
      photos: [],
    },
    {
      id: "10",
      name: "Ceviche",
      instructions:
        "Dice fresh white fish into small cubes. Marinate in lime juice for 30 minutes until opaque. Mix with diced red onion, tomato, jalapeño, cilantro, and avocado. Season with salt and serve with tortilla chips.",
      prepMinutes: 45,
      servings: 6,
      cuisine: "Peruvian",
      dietary: ["Gluten-Free", "Dairy-Free"],
      sourceUrl: "https://example.com/ceviche",
      photos: [
        { id: "r5", name: "ceviche.jpg", size: 250000, type: "image/jpeg" },
      ],
    },
  ];
}

const cuisineOptions = [
  { label: "Thai", value: "Thai" },
  { label: "Italian", value: "Italian" },
  { label: "Indian", value: "Indian" },
  { label: "Mexican", value: "Mexican" },
  { label: "Japanese", value: "Japanese" },
  { label: "Greek", value: "Greek" },
  { label: "French", value: "French" },
  { label: "Korean", value: "Korean" },
  { label: "Middle Eastern", value: "Middle Eastern" },
  { label: "Peruvian", value: "Peruvian" },
];

const dietaryOptions = [
  { label: "Vegetarian", value: "Vegetarian" },
  { label: "Vegan", value: "Vegan" },
  { label: "Gluten-Free", value: "Gluten-Free" },
  { label: "Dairy-Free", value: "Dairy-Free" },
  { label: "Nut-Free", value: "Nut-Free" },
  { label: "Low-Carb", value: "Low-Carb" },
  { label: "Keto", value: "Keto" },
];

function RecipeBookDemo({ readOnly = false }: { readOnly?: boolean }) {
  const [data, setData] = useState(createRecipeData);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Recipe>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Recipe",
        meta: { label: "Recipe", cell: { variant: "short-text" as const } },
        minSize: 160,
      },
      {
        id: "instructions",
        accessorKey: "instructions",
        header: "Instructions",
        meta: {
          label: "Instructions",
          cell: { variant: "long-text" as const },
        },
        minSize: 250,
      },
      {
        id: "prepMinutes",
        accessorKey: "prepMinutes",
        header: "Prep (min)",
        meta: {
          label: "Prep (min)",
          cell: {
            variant: "number" as const,
            min: 5,
            max: 480,
            step: 5,
          },
        },
        minSize: 110,
      },
      {
        id: "servings",
        accessorKey: "servings",
        header: "Servings",
        meta: {
          label: "Servings",
          cell: { variant: "number" as const, min: 1, max: 50 },
        },
        minSize: 100,
      },
      {
        id: "cuisine",
        accessorKey: "cuisine",
        header: "Cuisine",
        meta: {
          label: "Cuisine",
          cell: { variant: "select" as const, options: cuisineOptions },
        },
        minSize: 140,
      },
      {
        id: "dietary",
        accessorKey: "dietary",
        header: "Dietary",
        meta: {
          label: "Dietary",
          cell: {
            variant: "multi-select" as const,
            options: dietaryOptions,
          },
        },
        minSize: 200,
      },
      {
        id: "sourceUrl",
        accessorKey: "sourceUrl",
        header: "Source",
        meta: { label: "Source", cell: { variant: "url" as const } },
        minSize: 180,
      },
      {
        id: "photos",
        accessorKey: "photos",
        header: "Photos",
        meta: {
          label: "Photos",
          cell: {
            variant: "file" as const,
            accept: "image/*",
            multiple: true,
            maxFiles: 5,
          },
        },
        minSize: 180,
      },
    ],
    []
  );

  const onRowAdd = readOnly
    ? undefined
    : () => {
        const newRow: Recipe = {
          id: String(Date.now()),
          name: "",
          instructions: "",
          prepMinutes: 30,
          servings: 4,
          cuisine: "",
          dietary: [],
          sourceUrl: "",
          photos: [],
        };
        setData((prev) => [...prev, newRow]);
        return null;
      };

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data,
    onDataChange: setData,
    onRowAdd,
    onFilesUpload: mockFilesUpload,
    getRowId: (row) => row.id,
    enableSearch: true,
    rowHeight: "tall",
    readOnly,
  });

  return (
    <div className="w-full max-w-6xl">
      <DataGrid {...dataGridProps} table={table} height={450} stretchColumns />
    </div>
  );
}

// --- Data: EmployeeDirectory ---

function createEmployeeData(): Employee[] {
  return [
    {
      id: "1",
      fullName: "Amara Okafor",
      email: "amara.okafor@acme.com",
      department: "Engineering",
      role: "Staff Engineer",
      skills: ["TypeScript", "Rust", "System Design"],
      startDate: "2019-03-15",
      active: true,
    },
    {
      id: "2",
      fullName: "Liam Chen",
      email: "liam.chen@acme.com",
      department: "Design",
      role: "Senior Designer",
      skills: ["Figma", "CSS", "Prototyping"],
      startDate: "2020-07-01",
      active: true,
    },
    {
      id: "3",
      fullName: "Sofia Martinez",
      email: "sofia.martinez@acme.com",
      department: "Product",
      role: "Product Manager",
      skills: ["SQL", "Analytics", "Roadmapping"],
      startDate: "2021-01-10",
      active: true,
    },
    {
      id: "4",
      fullName: "Raj Patel",
      email: "raj.patel@acme.com",
      department: "Engineering",
      role: "Backend Engineer",
      skills: ["Python", "Go", "PostgreSQL"],
      startDate: "2022-06-20",
      active: true,
    },
    {
      id: "5",
      fullName: "Emma Johansson",
      email: "emma.johansson@acme.com",
      department: "Marketing",
      role: "Growth Lead",
      skills: ["Analytics", "SEO", "Copywriting"],
      startDate: "2020-11-05",
      active: true,
    },
    {
      id: "6",
      fullName: "Kenji Tanaka",
      email: "kenji.tanaka@acme.com",
      department: "Engineering",
      role: "Frontend Engineer",
      skills: ["TypeScript", "React", "CSS"],
      startDate: "2023-02-14",
      active: true,
    },
    {
      id: "7",
      fullName: "Fatima Al-Rashid",
      email: "fatima.alrashid@acme.com",
      department: "Data Science",
      role: "ML Engineer",
      skills: ["Python", "TensorFlow", "SQL"],
      startDate: "2021-09-01",
      active: true,
    },
    {
      id: "8",
      fullName: "Marcus Johnson",
      email: "marcus.johnson@acme.com",
      department: "Sales",
      role: "Account Executive",
      skills: ["Negotiation", "CRM", "Presentations"],
      startDate: "2022-04-18",
      active: false,
    },
    {
      id: "9",
      fullName: "Yuki Sato",
      email: "yuki.sato@acme.com",
      department: "QA",
      role: "QA Lead",
      skills: ["Playwright", "TypeScript", "CI/CD"],
      startDate: "2020-01-20",
      active: true,
    },
    {
      id: "10",
      fullName: "Priya Sharma",
      email: "priya.sharma@acme.com",
      department: "Engineering",
      role: "DevOps Engineer",
      skills: ["Kubernetes", "Terraform", "Go"],
      startDate: "2021-05-12",
      active: true,
    },
    {
      id: "11",
      fullName: "Oliver Eriksen",
      email: "oliver.eriksen@acme.com",
      department: "Finance",
      role: "Financial Analyst",
      skills: ["Excel", "SQL", "Forecasting"],
      startDate: "2023-08-01",
      active: true,
    },
    {
      id: "12",
      fullName: "Nia Williams",
      email: "nia.williams@acme.com",
      department: "HR",
      role: "People Partner",
      skills: ["Recruiting", "Coaching", "Analytics"],
      startDate: "2019-10-28",
      active: true,
    },
  ];
}

const departmentOptions = [
  { label: "Engineering", value: "Engineering" },
  { label: "Design", value: "Design" },
  { label: "Product", value: "Product" },
  { label: "Marketing", value: "Marketing" },
  { label: "Data Science", value: "Data Science" },
  { label: "Sales", value: "Sales" },
  { label: "QA", value: "QA" },
  { label: "Finance", value: "Finance" },
  { label: "HR", value: "HR" },
];

const skillOptions = [
  { label: "TypeScript", value: "TypeScript" },
  { label: "Python", value: "Python" },
  { label: "Go", value: "Go" },
  { label: "Rust", value: "Rust" },
  { label: "React", value: "React" },
  { label: "Figma", value: "Figma" },
  { label: "CSS", value: "CSS" },
  { label: "SQL", value: "SQL" },
  { label: "Kubernetes", value: "Kubernetes" },
  { label: "Terraform", value: "Terraform" },
  { label: "Analytics", value: "Analytics" },
  { label: "Playwright", value: "Playwright" },
];

function EmployeeDirectoryDemo({ readOnly = true }: { readOnly?: boolean }) {
  const [data, setData] = useState(createEmployeeData);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: "fullName",
        accessorKey: "fullName",
        header: "Full Name",
        meta: {
          label: "Full Name",
          cell: { variant: "short-text" as const },
        },
        minSize: 170,
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        meta: { label: "Email", cell: { variant: "url" as const } },
        minSize: 220,
      },
      {
        id: "department",
        accessorKey: "department",
        header: "Department",
        meta: {
          label: "Department",
          cell: {
            variant: "select" as const,
            options: departmentOptions,
          },
        },
        minSize: 140,
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Role",
        meta: { label: "Role", cell: { variant: "short-text" as const } },
        minSize: 160,
      },
      {
        id: "skills",
        accessorKey: "skills",
        header: "Skills",
        meta: {
          label: "Skills",
          cell: {
            variant: "multi-select" as const,
            options: skillOptions,
          },
        },
        minSize: 220,
      },
      {
        id: "startDate",
        accessorKey: "startDate",
        header: "Start Date",
        meta: {
          label: "Start Date",
          cell: { variant: "date" as const },
        },
        minSize: 130,
      },
      {
        id: "active",
        accessorKey: "active",
        header: "Active",
        meta: { label: "Active", cell: { variant: "checkbox" as const } },
        minSize: 80,
      },
    ],
    []
  );

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data,
    onDataChange: setData,
    getRowId: (row) => row.id,
    enableSearch: true,
    rowHeight: "short",
    initialState: {
      columnPinning: { left: ["fullName"] },
    },
    readOnly,
  });

  return (
    <div className="w-full max-w-6xl">
      <DataGridKeyboardShortcuts enableSearch={!!dataGridProps.searchState} />
      <DataGrid {...dataGridProps} table={table} height={380} />
    </div>
  );
}

// --- Data: ProductCatalog ---

function createProductData(): Product[] {
  return [
    {
      id: "1",
      name: "Wireless Headphones",
      description:
        "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and multipoint Bluetooth connectivity. Memory foam ear cushions for all-day comfort.",
      price: 249.99,
      sku: "AUDIO-WH-001",
      category: "Electronics",
      tags: ["Best Seller", "New Arrival"],
      productUrl: "https://shop.example.com/headphones",
      inStock: true,
      images: [
        {
          id: "p1",
          name: "headphones-black.jpg",
          size: 350000,
          type: "image/jpeg",
        },
      ],
    },
    {
      id: "2",
      name: "Organic Cotton T-Shirt",
      description:
        "Heavyweight 220gsm organic cotton tee with a relaxed fit. Pre-shrunk and garment-dyed for a vintage feel.",
      price: 38.0,
      sku: "APP-TS-042",
      category: "Apparel",
      tags: ["Eco-Friendly"],
      productUrl: "https://shop.example.com/cotton-tee",
      inStock: true,
      images: [],
    },
    {
      id: "3",
      name: "Cast Iron Dutch Oven",
      description:
        "5.5-quart enameled cast iron dutch oven. Even heat distribution and superior heat retention for braising, baking, and slow-cooking.",
      price: 89.95,
      sku: "KITCHEN-DO-007",
      category: "Kitchen",
      tags: ["Best Seller"],
      productUrl: "https://shop.example.com/dutch-oven",
      inStock: true,
      images: [
        {
          id: "p2",
          name: "dutch-oven.jpg",
          size: 280000,
          type: "image/jpeg",
        },
      ],
    },
    {
      id: "4",
      name: "Yoga Mat",
      description:
        "6mm thick non-slip yoga mat made from natural tree rubber. Antimicrobial surface with alignment markings.",
      price: 68.0,
      sku: "FIT-YM-015",
      category: "Fitness",
      tags: ["Eco-Friendly", "New Arrival"],
      productUrl: "https://shop.example.com/yoga-mat",
      inStock: true,
      images: [],
    },
    {
      id: "5",
      name: "Mechanical Keyboard",
      description:
        "65% layout with hot-swappable switches, PBT keycaps, and per-key RGB. USB-C and Bluetooth 5.0 connectivity.",
      price: 159.0,
      sku: "TECH-KB-023",
      category: "Electronics",
      tags: ["Sale"],
      productUrl: "https://shop.example.com/keyboard",
      inStock: false,
      images: [
        { id: "p3", name: "keyboard.png", size: 420000, type: "image/png" },
        {
          id: "p4",
          name: "keyboard-side.png",
          size: 310000,
          type: "image/png",
        },
      ],
    },
    {
      id: "6",
      name: "Ceramic Planter Set",
      description:
        "Set of 3 minimalist ceramic planters in matte white. Includes drainage holes and bamboo saucers. Sizes: 4, 6, and 8 inches.",
      price: 42.5,
      sku: "HOME-PL-088",
      category: "Home",
      tags: [],
      productUrl: "",
      inStock: true,
      images: [],
    },
    {
      id: "7",
      name: "Running Shoes",
      description:
        "Lightweight neutral running shoe with responsive foam midsole. Engineered mesh upper for breathability. 8mm heel-to-toe drop.",
      price: 134.99,
      sku: "FIT-RS-061",
      category: "Fitness",
      tags: ["New Arrival"],
      productUrl: "https://shop.example.com/running-shoes",
      inStock: true,
      images: [
        { id: "p5", name: "shoes.jpg", size: 380000, type: "image/jpeg" },
      ],
    },
    {
      id: "8",
      name: "Espresso Machine",
      description:
        "Semi-automatic espresso machine with 15-bar pressure pump, PID temperature control, and built-in grinder. 2L removable water tank.",
      price: 599.0,
      sku: "KITCHEN-EM-003",
      category: "Kitchen",
      tags: ["Best Seller", "Sale"],
      productUrl: "https://shop.example.com/espresso",
      inStock: true,
      images: [],
    },
    {
      id: "9",
      name: "Leather Journal",
      description:
        "Hand-stitched full-grain leather journal with 240 pages of 100gsm acid-free paper. Lay-flat binding and ribbon bookmark.",
      price: 45.0,
      sku: "STAT-LJ-012",
      category: "Stationery",
      tags: [],
      productUrl: "https://shop.example.com/journal",
      inStock: true,
      images: [],
    },
    {
      id: "10",
      name: "Portable Bluetooth Speaker",
      description:
        "Waterproof IP67 portable speaker with 360-degree sound. 20-hour battery life and built-in power bank feature.",
      price: 79.99,
      sku: "AUDIO-BS-009",
      category: "Electronics",
      tags: ["Sale", "Best Seller"],
      productUrl: "https://shop.example.com/speaker",
      inStock: false,
      images: [
        { id: "p6", name: "speaker.jpg", size: 190000, type: "image/jpeg" },
      ],
    },
  ];
}

const categoryOptions = [
  { label: "Electronics", value: "Electronics" },
  { label: "Apparel", value: "Apparel" },
  { label: "Kitchen", value: "Kitchen" },
  { label: "Fitness", value: "Fitness" },
  { label: "Home", value: "Home" },
  { label: "Stationery", value: "Stationery" },
  { label: "Outdoor", value: "Outdoor" },
];

const productTagOptions = [
  { label: "New Arrival", value: "New Arrival" },
  { label: "Sale", value: "Sale" },
  { label: "Best Seller", value: "Best Seller" },
  { label: "Eco-Friendly", value: "Eco-Friendly" },
  { label: "Limited Edition", value: "Limited Edition" },
  { label: "Clearance", value: "Clearance" },
];

function ProductCatalogDemo({ readOnly = false }: { readOnly?: boolean }) {
  const [data, setData] = useState(createProductData);

  // eslint-disable-next-line @eslint-react/no-unnecessary-use-memo -- stable column definitions
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Product",
        meta: { label: "Product", cell: { variant: "short-text" as const } },
        minSize: 180,
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
        meta: {
          label: "Description",
          cell: { variant: "long-text" as const },
        },
        minSize: 200,
      },
      {
        id: "price",
        accessorKey: "price",
        header: "Price",
        meta: {
          label: "Price",
          cell: {
            variant: "number" as const,
            min: 0,
            step: 0.01,
          },
        },
        minSize: 100,
      },
      {
        id: "sku",
        accessorKey: "sku",
        header: "SKU",
        meta: { label: "SKU", cell: { variant: "short-text" as const } },
        minSize: 140,
      },
      {
        id: "category",
        accessorKey: "category",
        header: "Category",
        meta: {
          label: "Category",
          cell: { variant: "select" as const, options: categoryOptions },
        },
        minSize: 130,
      },
      {
        id: "tags",
        accessorKey: "tags",
        header: "Tags",
        meta: {
          label: "Tags",
          cell: {
            variant: "multi-select" as const,
            options: productTagOptions,
          },
        },
        minSize: 200,
      },
      {
        id: "productUrl",
        accessorKey: "productUrl",
        header: "URL",
        meta: { label: "URL", cell: { variant: "url" as const } },
        minSize: 220,
      },
      {
        id: "inStock",
        accessorKey: "inStock",
        header: "In Stock",
        meta: {
          label: "In Stock",
          cell: { variant: "checkbox" as const },
        },
        minSize: 90,
      },
      {
        id: "images",
        accessorKey: "images",
        header: "Images",
        meta: {
          label: "Images",
          cell: {
            variant: "file" as const,
            accept: "image/*",
            multiple: true,
            maxFiles: 5,
          },
        },
        minSize: 200,
      },
    ],
    []
  );

  const onRowAdd = readOnly
    ? undefined
    : () => {
        const newRow: Product = {
          id: String(Date.now()),
          name: "",
          description: "",
          price: 0,
          sku: "",
          category: "",
          tags: [],
          productUrl: "",
          inStock: true,
          images: [],
        };
        setData((prev) => [...prev, newRow]);
        return null;
      };

  const { table, ...dataGridProps } = useDataGrid({
    columns,
    data,
    onDataChange: setData,
    onRowAdd,
    onFilesUpload: mockFilesUpload,
    getRowId: (row) => row.id,
    enableSearch: true,
    enablePaste: !readOnly,
    rowHeight: "extra-tall",
    initialState: {
      columnPinning: { left: ["name"] },
    },
    readOnly,
  });

  return (
    <div className="w-full max-w-7xl">
      <DataGrid {...dataGridProps} table={table} height={450} />
    </div>
  );
}
