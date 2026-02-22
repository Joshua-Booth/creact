import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { SearchIcon, XIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Kbd, KbdGroup } from "@/shared/ui/kbd";
import { Separator } from "@/shared/ui/separator";

const SHORTCUT_KEY = "/";

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
  }[];
}

interface DataGridKeyboardShortcutsProps {
  /** When true, includes search-related shortcuts in the listing. */
  enableSearch?: boolean;
}

/** Keyboard shortcuts reference dialog triggered by Ctrl+/ with searchable shortcut listing. */
export const DataGridKeyboardShortcuts = memo(
  DataGridKeyboardShortcutsImpl,
  (prev, next) => {
    return prev.enableSearch === next.enableSearch;
  }
);

function DataGridKeyboardShortcutsImpl({
  enableSearch = false,
}: DataGridKeyboardShortcutsProps) {
  const { t } = useTranslation("components");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isMac =
    typeof navigator === "undefined"
      ? false
      : /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

  const modKey = isMac ? "⌘" : "Ctrl";

  const onOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setInput("");
    }
  }, []);

  const initialFocus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInput(event.target.value);
    },
    []
  );

  const shortcutGroups: ShortcutGroup[] = useMemo(
    () => [
      {
        title: t("dataGrid.keyboard.sectionNavigation"),
        shortcuts: [
          {
            keys: ["↑", "↓", "←", "→"],
            description: t("dataGrid.keyboard.navigateBetweenCells"),
          },
          { keys: ["Tab"], description: t("dataGrid.keyboard.moveToNextCell") },
          {
            keys: ["Shift", "Tab"],
            description: t("dataGrid.keyboard.moveToPreviousCell"),
          },
          {
            keys: ["Home"],
            description: t("dataGrid.keyboard.moveToFirstColumn"),
          },
          {
            keys: ["End"],
            description: t("dataGrid.keyboard.moveToLastColumn"),
          },
          {
            keys: [modKey, "Home"],
            description: t("dataGrid.keyboard.moveToFirstCell"),
          },
          {
            keys: [modKey, "End"],
            description: t("dataGrid.keyboard.moveToLastCell"),
          },
          { keys: ["PgUp"], description: t("dataGrid.keyboard.moveUpOnePage") },
          {
            keys: ["PgDn"],
            description: t("dataGrid.keyboard.moveDownOnePage"),
          },
        ],
      },
      {
        title: t("dataGrid.keyboard.sectionSelection"),
        shortcuts: [
          {
            keys: ["Shift", "↑↓←→"],
            description: t("dataGrid.keyboard.extendSelection"),
          },
          {
            keys: [modKey, "A"],
            description: t("dataGrid.keyboard.selectAllCells"),
          },
          {
            keys: [modKey, "Click"],
            description: t("dataGrid.keyboard.toggleCellSelection"),
          },
          {
            keys: ["Shift", "Click"],
            description: t("dataGrid.keyboard.selectRange"),
          },
          { keys: ["Esc"], description: t("dataGrid.keyboard.clearSelection") },
        ],
      },
      {
        title: t("dataGrid.keyboard.sectionEditing"),
        shortcuts: [
          {
            keys: ["Enter"],
            description: t("dataGrid.keyboard.startEditingCell"),
          },
          {
            keys: ["Double Click"],
            description: t("dataGrid.keyboard.startEditingCellClick"),
          },
          {
            keys: ["Delete"],
            description: t("dataGrid.keyboard.clearSelectedCells"),
          },
          {
            keys: ["Backspace"],
            description: t("dataGrid.keyboard.clearSelectedCellsBackspace"),
          },
        ],
      },
      ...(enableSearch
        ? [
            {
              title: t("dataGrid.keyboard.sectionSearch"),
              shortcuts: [
                {
                  keys: [modKey, "F"],
                  description: t("dataGrid.keyboard.openSearch"),
                },
                {
                  keys: ["Enter"],
                  description: t("dataGrid.keyboard.nextMatch"),
                },
                {
                  keys: ["Shift", "Enter"],
                  description: t("dataGrid.keyboard.previousMatch"),
                },
                {
                  keys: ["Esc"],
                  description: t("dataGrid.keyboard.closeSearch"),
                },
              ],
            },
          ]
        : []),
      {
        title: t("dataGrid.keyboard.sectionSorting"),
        shortcuts: [
          {
            keys: [modKey, "Shift", "S"],
            description: t("dataGrid.keyboard.toggleSortMenu"),
          },
          {
            keys: ["Backspace"],
            description: t("dataGrid.keyboard.removeSortBackspace"),
          },
          {
            keys: ["Delete"],
            description: t("dataGrid.keyboard.removeSortDelete"),
          },
        ],
      },
      {
        title: t("dataGrid.keyboard.sectionGeneral"),
        shortcuts: [
          {
            keys: [modKey, "/"],
            description: t("dataGrid.keyboard.showKeyboardShortcuts"),
          },
        ],
      },
    ],
    [modKey, enableSearch, t]
  );

  const filteredGroups = useMemo(() => {
    if (input.trim() === "") return shortcutGroups;

    const query = input.toLowerCase();
    return shortcutGroups
      .map((group) => ({
        ...group,
        shortcuts: group.shortcuts.filter((shortcut) =>
          matchesShortcut(shortcut, query)
        ),
      }))
      .filter((group) => group.shortcuts.length > 0);
  }, [shortcutGroups, input]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === SHORTCUT_KEY) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl px-0"
        initialFocus={initialFocus}
        showCloseButton={false}
      >
        <DialogClose
          render={
            <Button
              aria-label="Close"
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 size-6"
            />
          }
        >
          <XIcon />
        </DialogClose>
        <DialogHeader className="px-6">
          <DialogTitle>{t("dataGrid.keyboard.title")}</DialogTitle>
          <DialogDescription className="sr-only">
            Use these keyboard shortcuts to navigate and interact with the data
            grid more efficiently.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <div className="relative">
            <SearchIcon
              className="text-muted-foreground absolute top-1/2 left-3 size-3.5
                -translate-y-1/2"
            />
            <Input
              ref={inputRef}
              placeholder={t("dataGrid.keyboard.searchPlaceholder")}
              className="h-8 pl-8"
              value={input}
              onChange={onInputChange}
            />
          </div>
        </div>
        <Separator
          className="mx-auto
            data-[orientation=horizontal]:w-[calc(100%-(--spacing(12)))]"
        />
        <div className="h-[40vh] overflow-y-auto px-6">
          {filteredGroups.length === 0 ? (
            <div
              className="flex h-full flex-col items-center justify-center gap-3
                text-center"
            >
              <div
                className="bg-muted text-foreground flex size-10 shrink-0
                  items-center justify-center rounded-lg"
              >
                <SearchIcon className="pointer-events-none size-6" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-lg font-medium tracking-tight">
                  {t("dataGrid.keyboard.noShortcutsFound")}
                </div>
                <p className="text-muted-foreground text-sm">
                  {t("dataGrid.keyboard.noShortcutsFoundDescription")}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredGroups.map((shortcutGroup) => (
                <div key={shortcutGroup.title} className="flex flex-col gap-2">
                  <h3 className="text-foreground text-sm font-semibold">
                    {shortcutGroup.title}
                  </h3>
                  <div className="divide-border divide-y rounded-md border">
                    {shortcutGroup.shortcuts.map((shortcut) => (
                      <ShortcutCard
                        key={shortcut.description}
                        keys={shortcut.keys}
                        description={shortcut.description}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function matchesShortcut(
  shortcut: ShortcutGroup["shortcuts"][number],
  query: string
) {
  return (
    shortcut.description.toLowerCase().includes(query) ||
    shortcut.keys.some((key) => key.toLowerCase().includes(query))
  );
}

function ShortcutCard({
  keys,
  description,
}: ShortcutGroup["shortcuts"][number]) {
  return (
    <div className="flex items-center gap-4 px-3 py-2">
      <span className="flex-1 text-sm">{description}</span>
      <KbdGroup className="shrink-0">
        {keys.map((key, index) => (
          <span key={key}>
            {index > 0 && (
              <span className="text-muted-foreground text-xs">+</span>
            )}
            <Kbd>{key}</Kbd>
          </span>
        ))}
      </KbdGroup>
    </div>
  );
}
