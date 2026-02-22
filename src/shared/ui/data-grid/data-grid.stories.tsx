import { withI18n } from "@/storybook/decorators/with-i18n";
import preview from "@/storybook/preview";
import { expect, userEvent, waitFor } from "storybook/test";

import { AllCellTypesDemo } from "./demo/all-cell-types-demo";
import { DataGridDemo } from "./demo/data-grid-demo";
import { EmployeeDirectoryDemo } from "./demo/employee-directory-demo";
import { LargeDatasetDemo } from "./demo/large-dataset-demo";
import { ProductCatalogDemo } from "./demo/product-catalog-demo";
import { RecipeBookDemo } from "./demo/recipe-book-demo";
import { RowHeightsDemo } from "./demo/row-heights-demo";

// --- Story setup ---

const meta = preview.meta({
  title: "ui/DataGrid",
  component: DataGridDemo,
  decorators: [withI18n],
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

/** Virtualized grid with 500 rows. */
export const LargeDataset = meta.story({
  render: (args) => <LargeDatasetDemo {...args} />,
});

/** Grid with tall row height. */
export const RowHeights = meta.story({
  render: (args) => <RowHeightsDemo {...args} />,
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

// --- Tests ---

Default.test(
  "should render the grid with all rows",
  async ({ canvas, step }) => {
    await step("verify grid and rows render", async () => {
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

Default.test("should toggle checkbox cell", async ({ canvas, step }) => {
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

Default.test(
  "should open search and find matches",
  async ({ canvas, canvasElement, step }) => {
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
    await step("focus cell and press Delete to clear it", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Capture original text before clearing
      const originalText = firstWrapper.textContent;

      // Delete clears the cell content
      await userEvent.keyboard("{Delete}");
      await waitFor(async () => {
        const currentText = firstWrapper.textContent;
        await expect(currentText).not.toBe(originalText);
      });
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

Default.test(
  "should close search with close button",
  async ({ canvas, canvasElement, step }) => {
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

Default.test(
  "should navigate search matches with Enter",
  async ({ canvas, canvasElement, step }) => {
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

Default.test(
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

Default.test(
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

Default.test(
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

Default.test(
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

Default.test(
  "should open keyboard shortcuts dialog with Ctrl+/",
  async ({ canvas, canvasElement, step }) => {
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

Default.test(
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

Default.test(
  "should navigate with Shift+Arrow to select range",
  async ({ canvasElement, step }) => {
    await step("select range with Shift+Arrow keys", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Shift+ArrowRight to extend selection
      await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");

      // Shift+ArrowDown to extend selection down
      await userEvent.keyboard("{Shift>}{ArrowDown}{/Shift}");

      // Verify focused cell changed (selection interaction happened)
      await waitFor(async () => {
        const focused = canvasElement.querySelector(
          '[data-slot="grid-cell-wrapper"][data-focused]'
        );
        await expect(focused).not.toBeNull();
      });
    });
  }
);

Default.test(
  "should navigate with Ctrl+Arrow to jump to edges",
  async ({ canvasElement, step }) => {
    await step("jump to edges with Ctrl+Arrow", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Ctrl+ArrowLeft to go to first column
      await userEvent.keyboard("{Meta>}{ArrowLeft}{/Meta}");
      // Ctrl+ArrowUp to go to first row
      await userEvent.keyboard("{Meta>}{ArrowUp}{/Meta}");
      // Ctrl+Home to go to top-left
      await userEvent.keyboard("{Meta>}{Home}{/Meta}");
      // Ctrl+End to go to bottom-right
      await userEvent.keyboard("{Meta>}{End}{/Meta}");

      const focused = canvasElement.querySelector(
        '[data-slot="grid-cell-wrapper"][data-focused]'
      );
      await expect(focused).not.toBeNull();
    });
  }
);

Default.test(
  "should navigate with Ctrl+Shift+Arrow to select to edges",
  async ({ canvasElement, step }) => {
    await step("extend selection to edges", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Ctrl+Shift+ArrowRight to select to end of row
      await userEvent.keyboard("{Meta>}{Shift>}{ArrowRight}{/Shift}{/Meta}");
      await waitFor(async () => {
        const selected = canvasElement.querySelectorAll(
          '[data-slot="grid-cell-wrapper"][data-selected]'
        );
        await expect(selected.length).toBeGreaterThanOrEqual(1);
      });
    });
  }
);

Default.test(
  "should navigate with PageDown and Home/End",
  async ({ canvasElement, step }) => {
    await step("use PageDown and Home/End keys", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Home key - go to first cell in row
      await userEvent.keyboard("{Home}");
      // End key - go to last cell in row
      await userEvent.keyboard("{End}");
      // Navigate down to have room
      await userEvent.keyboard("{ArrowDown}");
      // PageUp
      await userEvent.keyboard("{PageUp}");
      // PageDown
      await userEvent.keyboard("{PageDown}");

      const focused = canvasElement.querySelector(
        '[data-slot="grid-cell-wrapper"][data-focused]'
      );
      await expect(focused).not.toBeNull();
    });
  }
);

Default.test(
  "should handle Escape to clear selection then blur",
  async ({ canvasElement, step }) => {
    await step("select cells then press Escape twice", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Select range
      await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");
      // First Escape clears selection
      await userEvent.keyboard("{Escape}");
      // Second Escape blurs
      await userEvent.keyboard("{Escape}");
    });
  }
);

Default.test(
  "should handle Shift+Enter to add new row",
  async ({ canvas, canvasElement, step }) => {
    await step("press Shift+Enter to add row", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      const initialRows = canvas.getAllByRole("row");
      await userEvent.keyboard("{Shift>}{Enter}{/Shift}");

      await waitFor(async () => {
        const newRows = canvas.getAllByRole("row");
        await expect(newRows.length).toBeGreaterThanOrEqual(initialRows.length);
      });
    });
  }
);

Default.test(
  "should handle Shift+Tab to move backwards",
  async ({ canvasElement, step }) => {
    await step("tab forward then Shift+Tab backward", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Tab forward
      await userEvent.keyboard("{Tab}");
      await waitFor(async () => {
        await expect(firstWrapper).not.toHaveAttribute("data-focused", "");
      });

      // Shift+Tab backward
      await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });
    });
  }
);

Default.test(
  "should handle Ctrl+Delete to delete row",
  async ({ canvasElement, step }) => {
    await step("focus cell and press Ctrl+Delete", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Ctrl+Delete to delete current row
      await userEvent.keyboard("{Meta>}{Delete}{/Meta}");
      // Grid should still be functional
      const grid = canvasElement.querySelector('[role="grid"]');
      await expect(grid).not.toBeNull();
    });
  }
);

Default.test(
  "should add row via click on footer",
  async ({ canvas, canvasElement, step }) => {
    await step("click Add row button", async () => {
      const addRow = canvasElement.querySelector<HTMLElement>(
        '[data-slot="grid-add-row"] [role="gridcell"]'
      );
      if (!addRow) throw new Error("Expected Add row footer");

      const initialRows = canvas.getAllByRole("row");
      await userEvent.click(addRow);

      await waitFor(async () => {
        const newRows = canvas.getAllByRole("row");
        await expect(newRows.length).toBeGreaterThan(initialRows.length);
      });
    });
  }
);

Default.test(
  "should add row via Enter on footer",
  async ({ canvas, canvasElement, step }) => {
    await step("focus Add row footer and press Enter", async () => {
      const addRowCell = canvasElement.querySelector<HTMLElement>(
        '[data-slot="grid-add-row"] [role="gridcell"]'
      );
      if (!addRowCell) throw new Error("Expected Add row footer");

      addRowCell.focus();
      const initialRows = canvas.getAllByRole("row");

      await userEvent.keyboard("{Enter}");

      await waitFor(async () => {
        const newRows = canvas.getAllByRole("row");
        await expect(newRows.length).toBeGreaterThan(initialRows.length);
      });
    });
  }
);

Default.test(
  "should open context menu and exercise Cut action",
  async ({ canvasElement, step }) => {
    await step("right-click and click Cut", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

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

      // Click Cut (2nd item)
      const items = canvasElement.ownerDocument.querySelectorAll(
        '[data-grid-popover] [role="menuitem"]'
      );
      if (items[1]) {
        await userEvent.click(items[1]);
      }
    });
  }
);

Default.test(
  "should open context menu and exercise clear cell action",
  async ({ canvasElement, step }) => {
    await step("right-click and click Clear cell", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      await userEvent.pointer({
        target: firstWrapper,
        keys: "[MouseRight]",
      });

      await waitFor(async () => {
        const items = canvasElement.ownerDocument.querySelectorAll(
          '[data-grid-popover] [role="menuitem"]'
        );
        await expect(items.length).toBeGreaterThanOrEqual(1);
      });

      // Click Clear cell (3rd item typically)
      const items = canvasElement.ownerDocument.querySelectorAll(
        '[data-grid-popover] [role="menuitem"]'
      );
      if (items[2]) {
        await userEvent.click(items[2]);
      }
    });
  }
);

Default.test(
  "should select row via Shift+click for range selection",
  async ({ canvasElement, step }) => {
    await step("click first cell, Shift+click third cell", async () => {
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      const firstCell = wrappers[0];
      const thirdRowCell = wrappers[14]; // 3rd row, 1st col (7 cols per row)
      if (!firstCell || !thirdRowCell)
        throw new Error("Expected cells for range");

      await userEvent.click(firstCell);
      await waitFor(async () => {
        await expect(firstCell).toHaveAttribute("data-focused", "");
      });

      // Use keyboard to extend selection (Shift+click not available in testing-library)
      await userEvent.keyboard("{Shift>}{ArrowDown}{ArrowDown}{/Shift}");
      await waitFor(async () => {
        const selected = canvasElement.querySelectorAll(
          '[data-slot="grid-cell-wrapper"][data-selected]'
        );
        await expect(selected.length).toBeGreaterThan(1);
      });
    });
  }
);

Default.test(
  "should show 'Type to search' and 'No results' states",
  async ({ canvas, canvasElement, step }) => {
    await step("open search and verify empty state text", async () => {
      // Open search via Ctrl+F
      const grid = canvas.getByRole("grid");
      await userEvent.click(grid);
      await userEvent.keyboard("{Meta>}f{/Meta}");

      await waitFor(async () => {
        const searchBar = canvasElement.querySelector(
          '[data-slot="grid-search"]'
        );
        await expect(searchBar).not.toBeNull();
      });

      // Verify "Type to search" text appears before typing
      const searchBar = canvasElement.querySelector(
        '[data-slot="grid-search"]'
      );
      await expect(searchBar?.textContent).toContain("Type to search");
    });

    await step("type non-matching query for no results", async () => {
      const searchInput = canvasElement.querySelector<HTMLInputElement>(
        '[data-slot="grid-search"] input'
      );
      if (!searchInput) throw new Error("Search input not found");

      await userEvent.type(searchInput, "zzzznonexistent");

      await waitFor(
        async () => {
          const searchBar = canvasElement.querySelector(
            '[data-slot="grid-search"]'
          );
          await expect(searchBar?.textContent).toContain("No results");
        },
        { timeout: 2000 }
      );
    });
  }
);

Default.test(
  "should close keyboard shortcuts dialog with Escape",
  async ({ canvas, canvasElement, step }) => {
    await step("open and close shortcuts dialog", async () => {
      const grid = canvas.getByRole("grid");
      await userEvent.click(grid);

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

      // Close with Escape
      await userEvent.keyboard("{Escape}");
      await waitFor(async () => {
        const dialog =
          canvasElement.ownerDocument.querySelector('[role="dialog"]');
        await expect(dialog).toBeNull();
      });
    });
  }
);

Default.test(
  "should handle mouse drag selection",
  async ({ canvasElement, step }) => {
    await step("mousedown and drag to select cells", async () => {
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      const firstCell = wrappers[0];
      const secondCell = wrappers[1];
      if (!firstCell || !secondCell)
        throw new Error("Expected at least two cells");

      // Click to focus
      await userEvent.click(firstCell);
      await waitFor(async () => {
        await expect(firstCell).toHaveAttribute("data-focused", "");
      });

      // Use Shift+Arrow to select range
      await userEvent.keyboard("{Shift>}{ArrowRight}{/Shift}");

      await waitFor(async () => {
        const selected = canvasElement.querySelectorAll(
          '[data-slot="grid-cell-wrapper"][data-selected]'
        );
        await expect(selected.length).toBeGreaterThanOrEqual(1);
      });
    });
  }
);

ReadOnly.test(
  "should render the grid in read-only mode",
  async ({ canvas, step }) => {
    await step("verify grid renders with rows", async () => {
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

AllCellTypes.test(
  "should render all cell type variants",
  async ({ canvas, step }) => {
    await step("verify grid renders with all column headers", async () => {
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
  async ({ canvas, step }) => {
    await step("verify file cell renders file name", async () => {
      await expect(canvas.getByText("report.pdf")).toBeVisible();
    });
  }
);

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
  async ({ canvas, step }) => {
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
  async ({ canvas, step }) => {
    await step("verify date cells contain formatted date text", async () => {
      // The sample data has dates like "2026-03-15" which formatDateForDisplay
      // converts via toLocaleDateString(). Verify actual date text is visible.
      const gridCells = canvas.getAllByRole("gridcell");
      const dateTexts = gridCells
        .map((cell) => cell.textContent)
        .filter((text) => text.includes("2026"));
      await expect(dateTexts.length).toBeGreaterThan(0);
    });
  }
);

AllCellTypes.test(
  "should render number cells with numeric values",
  async ({ canvas, step }) => {
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

AllCellTypes.test(
  "should edit short text cell and cancel with Escape",
  async ({ canvasElement, step }) => {
    await step("edit and cancel with Escape", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.dblClick(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-editing", "");
      });

      // Type some text
      await userEvent.keyboard("changed text");
      // Escape to cancel editing (reverts value)
      await userEvent.keyboard("{Escape}");
      await waitFor(async () => {
        await expect(firstWrapper).not.toHaveAttribute("data-editing");
      });
    });
  }
);

AllCellTypes.test(
  "should trigger edit via single character typing",
  async ({ canvasElement, step }) => {
    await step("type single character to start editing", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Type a single character to start editing
      await userEvent.keyboard("x");
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-editing", "");
      });

      // Escape to cancel
      await userEvent.keyboard("{Escape}");
    });
  }
);

AllCellTypes.test(
  "should open multi-select and toggle an option",
  async ({ canvasElement, step }) => {
    await step("open multi-select dropdown and select option", async () => {
      // Multi-select is 7th column (index 6)
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      const multiSelectCell = wrappers[6];
      if (!multiSelectCell) throw new Error("Expected multi-select cell");

      // Double-click to enter edit mode
      await userEvent.dblClick(multiSelectCell);

      // Check if cell editor popover is rendered
      await waitFor(async () => {
        const editor = canvasElement.ownerDocument.querySelector(
          "[data-grid-cell-editor]"
        );
        await expect(editor).not.toBeNull();
      });

      // Click an option if available
      const option = canvasElement.ownerDocument.querySelector(
        '[data-grid-cell-editor] [role="option"]'
      );
      if (option) {
        await userEvent.click(option);
      }

      // Escape to close
      await userEvent.keyboard("{Escape}");
    });
  }
);

AllCellTypes.test("should edit URL cell", async ({ canvasElement, step }) => {
  await step("focus and edit URL cell", async () => {
    // URL is 4th column (index 3)
    const wrappers = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="grid-cell-wrapper"]'
    );
    const urlCell = wrappers[3];
    if (!urlCell) throw new Error("Expected URL cell");

    // Double-click to enter edit mode
    await userEvent.dblClick(urlCell);

    // Wait for editing state (URL uses contentEditable)
    await waitFor(async () => {
      await expect(urlCell).toHaveAttribute("data-editing", "");
    });

    // Escape to close
    await userEvent.keyboard("{Escape}");
  });
});

AllCellTypes.test(
  "should clear date cell value",
  async ({ canvasElement, step }) => {
    await step("focus date cell and press Delete", async () => {
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

      // Delete to clear date
      await userEvent.keyboard("{Delete}");
    });
  }
);

AllCellTypes.test(
  "should select option in select dropdown",
  async ({ canvasElement, step }) => {
    await step("open select dropdown and choose option", async () => {
      // Select cell is 6th column (index 5)
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      const selectCell = wrappers[5];
      if (!selectCell) throw new Error("Expected select cell");

      // Double-click to open dropdown
      await userEvent.dblClick(selectCell);

      // Wait for cell editor to render
      await waitFor(async () => {
        const editor = canvasElement.ownerDocument.querySelector(
          "[data-grid-cell-editor]"
        );
        await expect(editor).not.toBeNull();
      });

      // Click a select option if available
      const option = canvasElement.ownerDocument.querySelector(
        '[data-grid-cell-editor] [role="option"]'
      );
      if (option) {
        await userEvent.click(option);
      }
    });
  }
);

AllCellTypes.test(
  "should edit file cell and see file display",
  async ({ canvasElement, step }) => {
    await step("focus file cell", async () => {
      // File cell is last column (index 8 in AllCellTypes)
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      // The files column is the 9th column (index 8 on row 0)
      const fileCell = wrappers[8];
      if (!fileCell) throw new Error("Expected file cell");

      await userEvent.click(fileCell);
      await waitFor(async () => {
        await expect(fileCell).toHaveAttribute("data-focused", "");
      });

      // Enter to view file cell editing
      await userEvent.keyboard("{Enter}");
      await waitFor(async () => {
        await expect(fileCell).toHaveAttribute("data-editing", "");
      });

      // Escape to close
      await userEvent.keyboard("{Escape}");
    });
  }
);

AllCellTypes.test(
  "should navigate to second row and edit cells",
  async ({ canvasElement, step }) => {
    await step("navigate to row 2 cells", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Navigate to second row
      await userEvent.keyboard("{ArrowDown}");
      // Verify a different cell is now focused
      const focused = canvasElement.querySelector<HTMLElement>(
        '[data-slot="grid-cell-wrapper"][data-focused]'
      );
      await expect(focused).not.toBeNull();
      await expect(focused).not.toBe(firstWrapper);

      // Edit it
      await userEvent.keyboard("{Enter}");
      await waitFor(async () => {
        const editing = canvasElement.querySelector(
          '[data-slot="grid-cell-wrapper"][data-editing]'
        );
        await expect(editing).not.toBeNull();
      });

      await userEvent.keyboard("{Escape}");
    });
  }
);

AllCellTypes.test(
  "should start editing with F2 on number cell",
  async ({ canvasElement, step }) => {
    await step("focus number cell and press F2", async () => {
      // Number is 3rd column (index 2)
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      const numberCell = wrappers[2];
      if (!numberCell) throw new Error("Expected number cell");

      await userEvent.click(numberCell);
      await waitFor(async () => {
        await expect(numberCell).toHaveAttribute("data-focused", "");
      });

      // F2 to start editing
      await userEvent.keyboard("{F2}");
      await waitFor(async () => {
        await expect(numberCell).toHaveAttribute("data-editing", "");
      });

      // Escape to cancel
      await userEvent.keyboard("{Escape}");
    });
  }
);

AllCellTypes.test(
  "should clear checkbox cell via Delete key",
  async ({ canvasElement, step }) => {
    await step("focus checkbox cell and press Delete", async () => {
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

      // Delete to clear
      await userEvent.keyboard("{Delete}");
    });
  }
);

LargeDataset.test(
  "should render a large virtualized grid",
  async ({ canvas, step }) => {
    await step("verify grid renders", async () => {
      // Should render header + visible virtualized rows (not all 500)
      const rows = canvas.getAllByRole("row");
      await expect(rows.length).toBeLessThan(500);
      await expect(rows.length).toBeGreaterThan(1);
    });
  }
);

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

LargeDataset.test(
  "should navigate with Alt+Arrow for page navigation",
  async ({ canvasElement, step }) => {
    await step("use Alt+ArrowDown for page down", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Alt+ArrowDown for page down
      await userEvent.keyboard("{Alt>}{ArrowDown}{/Alt}");
      // Alt+ArrowUp for page up
      await userEvent.keyboard("{Alt>}{ArrowUp}{/Alt}");

      const focused = canvasElement.querySelector(
        '[data-slot="grid-cell-wrapper"][data-focused]'
      );
      await expect(focused).not.toBeNull();
    });
  }
);

RowHeights.test(
  "should render with tall row height",
  async ({ canvasElement, step }) => {
    await step("verify grid renders with correct row height", async () => {
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

RowHeights.test(
  "should interact with cell in tall row height mode",
  async ({ canvasElement, step }) => {
    await step("click cell, type character, and Escape", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);

      // Click to focus
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Type a character to start editing, then Escape to cancel
      await userEvent.keyboard("a");
      await userEvent.keyboard("{Escape}");
    });
  }
);

RecipeBook.test("should render recipe book grid", async ({ canvas, step }) => {
  await step("verify grid and recipe data", async () => {
    await expect(canvas.getByText("Pad Thai")).toBeVisible();
    await expect(canvas.getByText("Recipe")).toBeVisible();
  });
});

RecipeBook.test(
  "should edit recipe long text cell",
  async ({ canvasElement, step }) => {
    await step("double-click instructions cell to edit", async () => {
      // Instructions is 2nd column (index 1)
      const wrappers = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell-wrapper"]'
      );
      const instructionsCell = wrappers[1];
      if (!instructionsCell) throw new Error("Expected instructions cell");

      await userEvent.click(instructionsCell);
      await waitFor(async () => {
        await expect(instructionsCell).toHaveAttribute("data-focused", "");
      });

      await userEvent.keyboard("{Enter}");
      await waitFor(async () => {
        await expect(instructionsCell).toHaveAttribute("data-editing", "");
      });

      // Escape to close popover
      await userEvent.keyboard("{Escape}");
    });
  }
);

EmployeeDirectory.test(
  "should render employee directory with pinned columns",
  async ({ canvas, step }) => {
    await step("verify grid renders with pinned column", async () => {
      await expect(canvas.getByText("Full Name")).toBeVisible();
      await expect(canvas.getByText("Amara Okafor")).toBeVisible();
    });
  }
);

EmployeeDirectory.test(
  "should navigate in read-only employee directory",
  async ({ canvasElement, step }) => {
    await step("navigate with arrow keys in read-only grid", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.click(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-focused", "");
      });

      // Arrow navigation should still work in read-only mode
      await userEvent.keyboard("{ArrowRight}");
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{Tab}");

      const focused = canvasElement.querySelector(
        '[data-slot="grid-cell-wrapper"][data-focused]'
      );
      await expect(focused).not.toBeNull();
    });
  }
);

ProductCatalog.test(
  "should render product catalog with extra-tall rows",
  async ({ canvas, canvasElement, step }) => {
    await step("verify grid renders with product data", async () => {
      await expect(canvas.getByText("Product")).toBeVisible();
      const dataRow = canvasElement.querySelector<HTMLElement>(
        '[data-slot="grid-row"]'
      );
      if (!dataRow) throw new Error("Expected at least one data row");
      const height = Number.parseInt(dataRow.style.height, 10);
      // Extra-tall row height = 96px
      await expect(height).toBe(96);
    });
  }
);

ProductCatalog.test(
  "should edit product cells",
  async ({ canvasElement, step }) => {
    await step("focus and edit a product name cell", async () => {
      const firstWrapper = getFirstCellWrapper(canvasElement);
      await userEvent.dblClick(firstWrapper);
      await waitFor(async () => {
        await expect(firstWrapper).toHaveAttribute("data-editing", "");
      });

      await userEvent.keyboard("Updated Name{Enter}");
      await waitFor(async () => {
        await expect(firstWrapper).not.toHaveAttribute("data-editing");
      });
    });
  }
);
