import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { Check, Upload, X } from "lucide-react";
import { toast } from "sonner";

import type { DataGridCellProps, FileCellData } from "@/shared/lib/data-grid";
import {
  formatDateForDisplay,
  formatDateToString,
  formatFileSize,
  getCellKey,
  getFileIcon,
  getLineCount,
  getUrlHref,
  parseLocalDate,
} from "@/shared/lib/data-grid";
import { useBadgeOverflow } from "@/shared/lib/data-grid/use-badge-overflow";
import { useDebouncedCallback } from "@/shared/lib/data-table/use-debounced-callback";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/shared/ui/command";
import { Popover, PopoverContent } from "@/shared/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { Textarea } from "@/shared/ui/textarea";

import { DataGridCellWrapper } from "./data-grid-cell-wrapper";

// Remaining eslint-disable reasons:
//  - no-unnecessary-condition: tableMeta methods are optional at runtime despite types
//  - react-hooks/refs: ref reads during render for sync-prop-to-state (getDerivedStateFromProps replacement)
//  - cognitive-complexity: keyboard-handling switch statements, splitting hurts readability
//  - no-deprecated: FormEvent (correct for contentEditable onInput), execCommand (no replacement)
//  - no-event-handler: useEffect for focus management on isEditing flip, event-based would need API changes
//  - role-supports-aria-props: intentional aria-invalid/aria-disabled on role="region" dropzone
//  - no-autofocus: autoFocus on Calendar in popover, standard UX
//  - no-noninteractive-element-interactions: dropzone region with click/keyboard handlers, intentional
/* eslint-disable @typescript-eslint/no-unnecessary-condition, react-hooks/refs, sonarjs/cognitive-complexity, @typescript-eslint/no-deprecated, react-you-might-not-need-an-effect/no-event-handler, jsx-a11y/role-supports-aria-props, jsx-a11y/no-autofocus, jsx-a11y/no-noninteractive-element-interactions -- see above */

function stopPropagation(event: React.SyntheticEvent) {
  event.stopPropagation();
}

function preventDefaultAndStopPropagation(event: React.SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

/* istanbul ignore start @preserve -- browser-only cell variants tested via Storybook interaction tests */

/** Short text cell with contentEditable inline editing. */
export function ShortTextCell<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  rowHeight,
  isEditing,
  isFocused,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
}: DataGridCellProps<TData>) {
  const initialValue = cell.getValue() as string;
  const [value, setValue] = useState(initialValue);
  const cellRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevInitialValueRef = useRef(initialValue);
  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue);
    if (cellRef.current && !isEditing) {
      cellRef.current.textContent = initialValue;
    }
  }

  const onBlur = useCallback(() => {
    const currentValue = cellRef.current?.textContent ?? "";
    if (!readOnly && currentValue !== initialValue) {
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: currentValue });
    }
    tableMeta?.onCellEditingStop?.();
  }, [tableMeta, rowIndex, columnId, initialValue, readOnly]);

  const onInput = useCallback((event: React.FormEvent<HTMLDivElement>) => {
    const currentValue = event.currentTarget.textContent ?? "";
    setValue(currentValue);
  }, []);

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) {
        switch (event.key) {
          case "Enter": {
            event.preventDefault();
            const currentValue = cellRef.current?.textContent ?? "";
            if (currentValue !== initialValue) {
              tableMeta?.onDataUpdate?.({
                rowIndex,
                columnId,
                value: currentValue,
              });
            }
            tableMeta?.onCellEditingStop?.({ moveToNextRow: true });

            break;
          }
          case "Tab": {
            event.preventDefault();
            const currentValue = cellRef.current?.textContent ?? "";
            if (currentValue !== initialValue) {
              tableMeta?.onDataUpdate?.({
                rowIndex,
                columnId,
                value: currentValue,
              });
            }
            tableMeta?.onCellEditingStop?.({
              direction: event.shiftKey ? "left" : "right",
            });

            break;
          }
          case "Escape": {
            event.preventDefault();
            setValue(initialValue);
            cellRef.current?.blur();

            break;
          }
          // No default
        }
      } else if (
        isFocused &&
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        setValue(event.key);

        queueMicrotask(() => {
          if (cellRef.current?.contentEditable === "true") {
            cellRef.current.textContent = event.key;
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(cellRef.current);
            range.collapse(false);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        });
      }
    },
    [isEditing, isFocused, initialValue, tableMeta, rowIndex, columnId]
  );

  useEffect(() => {
    if (isEditing && cellRef.current) {
      cellRef.current.focus();

      if (cellRef.current.textContent === "" && value !== "") {
        cellRef.current.textContent = value;
      }

      if (cellRef.current.textContent !== "") {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(cellRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [isEditing, value]);

  const displayValue = isEditing ? "" : (value ?? "");

  return (
    <DataGridCellWrapper<TData>
      ref={containerRef}
      cell={cell}
      tableMeta={tableMeta}
      rowIndex={rowIndex}
      columnId={columnId}
      rowHeight={rowHeight}
      isEditing={isEditing}
      isFocused={isFocused}
      isSelected={isSelected}
      isSearchMatch={isSearchMatch}
      isActiveSearchMatch={isActiveSearchMatch}
      readOnly={readOnly}
      onKeyDown={onWrapperKeyDown}
    >
      <div
        role="textbox"
        aria-label={cell.column.columnDef.meta?.label ?? columnId}
        data-slot="grid-cell-content"
        contentEditable={isEditing}
        tabIndex={-1}
        ref={cellRef}
        onBlur={onBlur}
        onInput={onInput}
        suppressContentEditableWarning
        className={cn("size-full overflow-hidden outline-none", {
          "whitespace-nowrap **:inline **:whitespace-nowrap [&_br]:hidden":
            isEditing,
        })}
      >
        {displayValue}
      </div>
    </DataGridCellWrapper>
  );
}

/** Long text cell with popover textarea editor. */
export function LongTextCell<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  rowHeight,
  isFocused,
  isEditing,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
}: DataGridCellProps<TData>) {
  const { t } = useTranslation("components");
  const initialValue = cell.getValue() as string;
  const [value, setValue] = useState(initialValue ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingCharRef = useRef<string | null>(null);
  const sideOffset = -(containerRef.current?.clientHeight ?? 0);

  const prevInitialValueRef = useRef(initialValue);

  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue ?? "");
  }

  const debouncedSave = useDebouncedCallback((newValue: string) => {
    if (!readOnly) {
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: newValue });
    }
  }, 300);

  const onSave = useCallback(() => {
    if (!readOnly && value !== initialValue) {
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value });
    }
    tableMeta?.onCellEditingStop?.();
  }, [tableMeta, value, initialValue, rowIndex, columnId, readOnly]);

  const onCancel = useCallback(() => {
    setValue(initialValue ?? "");
    if (!readOnly) {
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: initialValue });
    }
    tableMeta?.onCellEditingStop?.();
  }, [tableMeta, initialValue, rowIndex, columnId, readOnly]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open && !readOnly) {
        tableMeta?.onCellEditingStart?.(rowIndex, columnId);
      } else {
        if (!readOnly && value !== initialValue) {
          tableMeta?.onDataUpdate?.({ rowIndex, columnId, value });
        }
        tableMeta?.onCellEditingStop?.();
      }
    },
    [tableMeta, value, initialValue, rowIndex, columnId, readOnly]
  );

  const initialFocus = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);

      if (pendingCharRef.current) {
        const char = pendingCharRef.current;
        pendingCharRef.current = null;
        /* istanbul ignore next 7 -- requestAnimationFrame callback */
        requestAnimationFrame(() => {
          if (
            textareaRef.current &&
            document.activeElement === textareaRef.current
          ) {
            document.execCommand("insertText", false, char);
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
          }
        });
      } else {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }
  }, []);

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        isFocused &&
        !isEditing &&
        !readOnly &&
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        pendingCharRef.current = event.key;
      }
    },
    [isFocused, isEditing, readOnly]
  );

  const onBlur = useCallback(() => {
    if (!readOnly && value !== initialValue) {
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value });
    }
    tableMeta?.onCellEditingStop?.();
  }, [tableMeta, value, initialValue, rowIndex, columnId, readOnly]);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value;
      setValue(newValue);
      debouncedSave(newValue);
    },
    [debouncedSave]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      } else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onSave();
      } else if (event.key === "Tab") {
        event.preventDefault();
        if (value !== initialValue) {
          tableMeta?.onDataUpdate?.({ rowIndex, columnId, value });
        }
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
        return;
      }
      event.stopPropagation();
    },
    [onSave, onCancel, value, initialValue, tableMeta, rowIndex, columnId]
  );

  return (
    <Popover open={isEditing} onOpenChange={onOpenChange}>
      <DataGridCellWrapper<TData>
        ref={containerRef}
        cell={cell}
        tableMeta={tableMeta}
        rowIndex={rowIndex}
        columnId={columnId}
        rowHeight={rowHeight}
        isEditing={isEditing}
        isFocused={isFocused}
        isSelected={isSelected}
        isSearchMatch={isSearchMatch}
        isActiveSearchMatch={isActiveSearchMatch}
        readOnly={readOnly}
        onKeyDown={onWrapperKeyDown}
      >
        <span data-slot="grid-cell-content">{value}</span>
      </DataGridCellWrapper>
      <PopoverContent
        data-grid-cell-editor=""
        anchor={containerRef}
        align="start"
        side="bottom"
        sideOffset={sideOffset}
        className="w-[400px] rounded-none p-0"
        initialFocus={initialFocus}
        aria-label={`Edit ${cell.column.columnDef.meta?.label ?? columnId}`}
      >
        <Textarea
          placeholder={t("dataGrid.cell.enterText")}
          className="focus-visible:ring-ring max-h-[300px] min-h-[150px]
            resize-none overflow-y-auto rounded-none border-0 shadow-none
            focus-visible:ring-1"
          ref={textareaRef}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </PopoverContent>
    </Popover>
  );
}

/** Number cell with numeric input editor. */
export function NumberCell<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  rowHeight,
  isFocused,
  isEditing,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
}: DataGridCellProps<TData>) {
  const initialValue = cell.getValue() as number;
  const [value, setValue] = useState(String(initialValue ?? ""));
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cellOpts = cell.column.columnDef.meta?.cell;
  const numberCellOpts = cellOpts?.variant === "number" ? cellOpts : null;
  const min = numberCellOpts?.min;
  const max = numberCellOpts?.max;
  const step = numberCellOpts?.step;

  const prevIsEditingRef = useRef(isEditing);

  const prevInitialValueRef = useRef(initialValue);
  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(String(initialValue ?? ""));
  }

  const onBlur = useCallback(() => {
    const numValue = value === "" ? null : Number(value);
    if (!readOnly && numValue !== initialValue) {
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: numValue });
    }
    tableMeta?.onCellEditingStop?.();
  }, [tableMeta, rowIndex, columnId, initialValue, value, readOnly]);

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) {
        switch (event.key) {
          case "Enter": {
            event.preventDefault();
            const numValue = value === "" ? null : Number(value);
            if (numValue !== initialValue) {
              tableMeta?.onDataUpdate?.({
                rowIndex,
                columnId,
                value: numValue,
              });
            }
            tableMeta?.onCellEditingStop?.({ moveToNextRow: true });

            break;
          }
          case "Tab": {
            event.preventDefault();
            const numValue = value === "" ? null : Number(value);
            if (numValue !== initialValue) {
              tableMeta?.onDataUpdate?.({
                rowIndex,
                columnId,
                value: numValue,
              });
            }
            tableMeta?.onCellEditingStop?.({
              direction: event.shiftKey ? "left" : "right",
            });

            break;
          }
          case "Escape": {
            event.preventDefault();
            setValue(String(initialValue ?? ""));
            inputRef.current?.blur();

            break;
          }
          // No default
        }
      } else if (isFocused) {
        if (event.key === "Backspace") {
          setValue("");
        } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          setValue(event.key);
        }
      }
    },
    [isEditing, isFocused, initialValue, tableMeta, rowIndex, columnId, value]
  );

  useEffect(() => {
    const wasEditing = prevIsEditingRef.current;
    prevIsEditingRef.current = isEditing;

    if (isEditing && !wasEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <DataGridCellWrapper<TData>
      ref={containerRef}
      cell={cell}
      tableMeta={tableMeta}
      rowIndex={rowIndex}
      columnId={columnId}
      rowHeight={rowHeight}
      isEditing={isEditing}
      isFocused={isFocused}
      isSelected={isSelected}
      isSearchMatch={isSearchMatch}
      isActiveSearchMatch={isActiveSearchMatch}
      readOnly={readOnly}
      onKeyDown={onWrapperKeyDown}
    >
      {isEditing ? (
        <input
          type="number"
          ref={inputRef}
          value={value}
          min={min}
          max={max}
          step={step}
          className="w-full [appearance:textfield] border-none bg-transparent
            p-0 outline-none [&::-webkit-inner-spin-button]:appearance-none
            [&::-webkit-outer-spin-button]:appearance-none"
          onBlur={onBlur}
          onChange={onChange}
        />
      ) : (
        <span data-slot="grid-cell-content">{value}</span>
      )}
    </DataGridCellWrapper>
  );
}

/** URL cell with contentEditable editing and clickable link display. */
export function UrlCell<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  rowHeight,
  isEditing,
  isFocused,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
}: DataGridCellProps<TData>) {
  const initialValue = cell.getValue() as string;
  const [value, setValue] = useState(initialValue ?? "");
  const cellRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevInitialValueRef = useRef(initialValue);

  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue ?? "");
    if (cellRef.current && !isEditing) {
      cellRef.current.textContent = initialValue ?? "";
    }
  }

  const onBlur = useCallback(() => {
    const currentValue = cellRef.current?.textContent?.trim() ?? "";

    if (!readOnly && currentValue !== initialValue) {
      tableMeta?.onDataUpdate?.({
        rowIndex,
        columnId,
        value: currentValue === "" ? null : currentValue,
      });
    }
    tableMeta?.onCellEditingStop?.();
  }, [tableMeta, rowIndex, columnId, initialValue, readOnly]);

  const onInput = useCallback((event: React.FormEvent<HTMLDivElement>) => {
    const currentValue = event.currentTarget.textContent ?? "";
    setValue(currentValue);
  }, []);

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) {
        switch (event.key) {
          case "Enter": {
            event.preventDefault();
            const currentValue = cellRef.current?.textContent?.trim() ?? "";
            if (!readOnly && currentValue !== initialValue) {
              tableMeta?.onDataUpdate?.({
                rowIndex,
                columnId,
                value: currentValue === "" ? null : currentValue,
              });
            }
            tableMeta?.onCellEditingStop?.({ moveToNextRow: true });

            break;
          }
          case "Tab": {
            event.preventDefault();
            const currentValue = cellRef.current?.textContent?.trim() ?? "";
            if (!readOnly && currentValue !== initialValue) {
              tableMeta?.onDataUpdate?.({
                rowIndex,
                columnId,
                value: currentValue === "" ? null : currentValue,
              });
            }
            tableMeta?.onCellEditingStop?.({
              direction: event.shiftKey ? "left" : "right",
            });

            break;
          }
          case "Escape": {
            event.preventDefault();
            setValue(initialValue ?? "");
            cellRef.current?.blur();

            break;
          }
          // No default
        }
      } else if (
        isFocused &&
        !readOnly &&
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        setValue(event.key);

        queueMicrotask(() => {
          if (cellRef.current?.contentEditable === "true") {
            cellRef.current.textContent = event.key;
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(cellRef.current);
            range.collapse(false);
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        });
      }
    },
    [
      isEditing,
      isFocused,
      initialValue,
      tableMeta,
      rowIndex,
      columnId,
      readOnly,
    ]
  );

  const onLinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (isEditing) {
        event.preventDefault();
        return;
      }

      const href = getUrlHref(value);
      if (href === "") {
        event.preventDefault();
        toast.error("Invalid URL", {
          description:
            "URL contains a dangerous protocol (javascript:, data:, vbscript:, or file:)",
        });
        return;
      }

      event.stopPropagation();
    },
    [isEditing, value]
  );

  useEffect(() => {
    if (isEditing && cellRef.current) {
      cellRef.current.focus();

      if (cellRef.current.textContent === "" && value !== "") {
        cellRef.current.textContent = value;
      }

      if (cellRef.current.textContent !== "") {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(cellRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [isEditing, value]);

  const displayValue = isEditing ? "" : (value ?? "");
  const urlHref = displayValue === "" ? "" : getUrlHref(displayValue);
  const isDangerousUrl = displayValue !== "" && urlHref === "";

  return (
    <DataGridCellWrapper<TData>
      ref={containerRef}
      cell={cell}
      tableMeta={tableMeta}
      rowIndex={rowIndex}
      columnId={columnId}
      rowHeight={rowHeight}
      isEditing={isEditing}
      isFocused={isFocused}
      isSelected={isSelected}
      isSearchMatch={isSearchMatch}
      isActiveSearchMatch={isActiveSearchMatch}
      readOnly={readOnly}
      onKeyDown={onWrapperKeyDown}
    >
      {!isEditing && displayValue !== "" ? (
        <div
          data-slot="grid-cell-content"
          className="size-full overflow-hidden"
        >
          <a
            data-focused={isFocused && !isDangerousUrl ? "" : undefined}
            data-invalid={isDangerousUrl ? "" : undefined}
            href={urlHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary decoration-primary/30
              hover:decoration-primary/60 data-invalid:text-destructive
              data-focused:text-foreground
              data-invalid:decoration-destructive/50
              data-focused:decoration-foreground/50
              data-focused:hover:decoration-foreground/70
              data-invalid:hover:decoration-destructive/70 truncate underline
              underline-offset-2 data-invalid:cursor-not-allowed"
            onClick={onLinkClick}
          >
            {displayValue}
          </a>
        </div>
      ) : (
        <div
          role="textbox"
          aria-label={cell.column.columnDef.meta?.label ?? columnId}
          data-slot="grid-cell-content"
          contentEditable={isEditing}
          tabIndex={-1}
          ref={cellRef}
          onBlur={onBlur}
          onInput={onInput}
          suppressContentEditableWarning
          className={cn("size-full overflow-hidden outline-none", {
            "whitespace-nowrap **:inline **:whitespace-nowrap [&_br]:hidden":
              isEditing,
          })}
        >
          {displayValue}
        </div>
      )}
    </DataGridCellWrapper>
  );
}

/** Checkbox cell with toggle on click/space/enter. */
export function CheckboxCell<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  rowHeight,
  isFocused,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
}: Omit<DataGridCellProps<TData>, "isEditing">) {
  const initialValue = cell.getValue() as boolean;
  const [value, setValue] = useState(initialValue);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevInitialValueRef = useRef(initialValue);
  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue);
  }

  const onCheckedChange = useCallback(
    (checked: boolean) => {
      if (readOnly) return;
      setValue(checked);
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: checked });
    },
    [tableMeta, rowIndex, columnId, readOnly]
  );

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        isFocused &&
        !readOnly &&
        (event.key === " " || event.key === "Enter")
      ) {
        event.preventDefault();
        event.stopPropagation();
        onCheckedChange(!value);
      } else if (isFocused && event.key === "Tab") {
        event.preventDefault();
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
      }
    },
    [isFocused, value, onCheckedChange, tableMeta, readOnly]
  );

  const onWrapperClick = useCallback(
    (event: React.MouseEvent) => {
      if (isFocused && !readOnly) {
        event.preventDefault();
        event.stopPropagation();
        onCheckedChange(!value);
      }
    },
    [isFocused, value, onCheckedChange, readOnly]
  );

  return (
    <DataGridCellWrapper<TData>
      ref={containerRef}
      cell={cell}
      tableMeta={tableMeta}
      rowIndex={rowIndex}
      columnId={columnId}
      rowHeight={rowHeight}
      isEditing={false}
      isFocused={isFocused}
      isSelected={isSelected}
      isSearchMatch={isSearchMatch}
      isActiveSearchMatch={isActiveSearchMatch}
      readOnly={readOnly}
      className="flex size-full justify-center"
      onClick={onWrapperClick}
      onKeyDown={onWrapperKeyDown}
    >
      <Checkbox
        aria-label={cell.column.columnDef.meta?.label ?? columnId}
        checked={value}
        onCheckedChange={onCheckedChange}
        disabled={readOnly}
        className="border-primary"
        onClick={stopPropagation}
        onMouseDown={stopPropagation}
        onDoubleClick={stopPropagation}
      />
    </DataGridCellWrapper>
  );
}

/** Select cell with dropdown selection. */
export function SelectCell<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  rowHeight,
  isFocused,
  isEditing,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
}: DataGridCellProps<TData>) {
  const initialValue = cell.getValue() as string;
  const [value, setValue] = useState(initialValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const cellOpts = cell.column.columnDef.meta?.cell;
  const options = cellOpts?.variant === "select" ? cellOpts.options : [];

  const prevInitialValueRef = useRef(initialValue);

  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue);
  }

  const onValueChange = useCallback(
    (newValue: string | null) => {
      if (readOnly || newValue === null) return;
      setValue(newValue);
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: newValue });
      tableMeta?.onCellEditingStop?.();
    },
    [tableMeta, rowIndex, columnId, readOnly]
  );

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open && !readOnly) {
        tableMeta?.onCellEditingStart?.(rowIndex, columnId);
      } else {
        tableMeta?.onCellEditingStop?.();
      }
    },
    [tableMeta, rowIndex, columnId, readOnly]
  );

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing && event.key === "Escape") {
        event.preventDefault();
        setValue(initialValue);
        tableMeta?.onCellEditingStop?.();
      } else if (isFocused && event.key === "Tab") {
        event.preventDefault();
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
      }
    },
    [isEditing, isFocused, initialValue, tableMeta]
  );

  const displayLabel =
    options.find((opt) => opt.value === value)?.label ?? value;

  return (
    <DataGridCellWrapper<TData>
      ref={containerRef}
      cell={cell}
      tableMeta={tableMeta}
      rowIndex={rowIndex}
      columnId={columnId}
      rowHeight={rowHeight}
      isEditing={isEditing}
      isFocused={isFocused}
      isSelected={isSelected}
      isSearchMatch={isSearchMatch}
      isActiveSearchMatch={isActiveSearchMatch}
      readOnly={readOnly}
      onKeyDown={onWrapperKeyDown}
    >
      {isEditing && (
        <Select
          value={value}
          onValueChange={onValueChange}
          open={isEditing}
          onOpenChange={onOpenChange}
        >
          <SelectTrigger
            size="sm"
            className="size-full items-start border-none p-0 shadow-none
              focus-visible:ring-0 dark:bg-transparent [&_svg]:hidden"
          >
            {displayLabel === "" ? (
              <SelectValue />
            ) : (
              <Badge
                variant="secondary"
                className="px-1.5 py-px whitespace-pre-wrap"
              >
                <SelectValue />
              </Badge>
            )}
          </SelectTrigger>
          <SelectContent
            data-grid-cell-editor=""
            align="start"
            alignOffset={-8}
            sideOffset={-8}
            className="min-w-[calc(var(--anchor-width)+16px)]"
          >
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {!isEditing && displayLabel !== "" && (
        <Badge
          data-slot="grid-cell-content"
          variant="secondary"
          className="px-1.5 py-px whitespace-pre-wrap"
        >
          {displayLabel}
        </Badge>
      )}
    </DataGridCellWrapper>
  );
}

/** Multi-select cell with command-based multi-select popover. */
export function MultiSelectCell<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  rowHeight,
  isFocused,
  isEditing,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
}: DataGridCellProps<TData>) {
  const { t } = useTranslation("components");
  const cellValue = useMemo(() => {
    const value = cell.getValue() as string[];
    return value ?? [];
  }, [cell]);

  const cellKey = getCellKey(rowIndex, columnId);
  const prevCellKeyRef = useRef(cellKey);

  const [selectedValues, setSelectedValues] = useState<string[]>(cellValue);
  const [searchValue, setSearchValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cellOpts = cell.column.columnDef.meta?.cell;
  const options = cellOpts?.variant === "multi-select" ? cellOpts.options : [];
  const sideOffset = -(containerRef.current?.clientHeight ?? 0);

  const prevCellValueRef = useRef(cellValue);

  if (cellValue !== prevCellValueRef.current) {
    prevCellValueRef.current = cellValue;
    setSelectedValues(cellValue);
  }

  if (prevCellKeyRef.current !== cellKey) {
    prevCellKeyRef.current = cellKey;
    setSearchValue("");
  }
  const onValueChange = useCallback(
    (value: string) => {
      if (readOnly) return;
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];

      setSelectedValues(newValues);
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: newValues });
      setSearchValue("");
      queueMicrotask(() => inputRef.current?.focus());
    },
    [selectedValues, tableMeta, rowIndex, columnId, readOnly]
  );

  const removeValue = useCallback(
    (valueToRemove: string, event?: React.MouseEvent) => {
      if (readOnly) return;
      event?.stopPropagation();
      event?.preventDefault();
      const newValues = selectedValues.filter((v) => v !== valueToRemove);
      setSelectedValues(newValues);
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: newValues });
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [selectedValues, tableMeta, rowIndex, columnId, readOnly]
  );

  const clearAll = useCallback(() => {
    if (readOnly) return;
    setSelectedValues([]);
    tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: [] });
    queueMicrotask(() => inputRef.current?.focus());
  }, [tableMeta, rowIndex, columnId, readOnly]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open && !readOnly) {
        tableMeta?.onCellEditingStart?.(rowIndex, columnId);
      } else {
        setSearchValue("");
        tableMeta?.onCellEditingStop?.();
      }
    },
    [tableMeta, rowIndex, columnId, readOnly]
  );

  const initialFocus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing && event.key === "Escape") {
        event.preventDefault();
        setSelectedValues(cellValue);
        setSearchValue("");
        tableMeta?.onCellEditingStop?.();
      } else if (isFocused && event.key === "Tab") {
        event.preventDefault();
        setSearchValue("");
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
      }
    },
    [isEditing, isFocused, cellValue, tableMeta]
  );

  const onInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        event.key === "Backspace" &&
        searchValue === "" &&
        selectedValues.length > 0
      ) {
        event.preventDefault();
        const lastValue = selectedValues.at(-1);
        if (lastValue) {
          removeValue(lastValue);
        }
      }
      if (event.key === "Escape") {
        event.stopPropagation();
      }
    },
    [searchValue, selectedValues, removeValue]
  );

  const displayLabels = selectedValues
    .map((val) => options.find((opt) => opt.value === val)?.label ?? val)
    .filter(Boolean);

  const lineCount = getLineCount(rowHeight);

  const { visibleItems: visibleLabels, hiddenCount: hiddenBadgeCount } =
    useBadgeOverflow({
      items: displayLabels,
      getLabel: (label) => label,
      containerRef,
      lineCount,
    });

  return (
    <DataGridCellWrapper<TData>
      ref={containerRef}
      cell={cell}
      tableMeta={tableMeta}
      rowIndex={rowIndex}
      columnId={columnId}
      rowHeight={rowHeight}
      isEditing={isEditing}
      isFocused={isFocused}
      isSelected={isSelected}
      isSearchMatch={isSearchMatch}
      isActiveSearchMatch={isActiveSearchMatch}
      readOnly={readOnly}
      onKeyDown={onWrapperKeyDown}
    >
      {isEditing ? (
        <Popover open={isEditing} onOpenChange={onOpenChange}>
          <div ref={anchorRef} className="absolute inset-0" />
          <PopoverContent
            data-grid-cell-editor=""
            anchor={anchorRef}
            align="start"
            sideOffset={sideOffset}
            className="w-[300px] rounded-none p-0"
            initialFocus={initialFocus}
            aria-label={`Select ${cell.column.columnDef.meta?.label ?? columnId}`}
          >
            <Command
              className="**:data-[slot=command-input-wrapper]:h-auto
                **:data-[slot=command-input-wrapper]:border-none
                **:data-[slot=command-input-wrapper]:p-0
                [&_[data-slot=command-input-wrapper]_svg]:hidden"
            >
              <div
                className="flex min-h-9 flex-wrap items-center gap-1 border-b
                  px-3 py-1.5"
              >
                {selectedValues.map((value) => {
                  const option = options.find((opt) => opt.value === value);
                  const label = option?.label ?? value;

                  return (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="gap-1 px-1.5 py-px"
                    >
                      {label}
                      <button
                        type="button"
                        aria-label={`Remove ${label}`}
                        onClick={
                          /* istanbul ignore next */ (event) =>
                            removeValue(value, event)
                        }
                        onPointerDown={
                          /* istanbul ignore next 4 */ (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                          }
                        }
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  );
                })}
                <CommandInput
                  ref={inputRef}
                  value={searchValue}
                  onValueChange={setSearchValue}
                  onKeyDown={onInputKeyDown}
                  placeholder={t("dataGrid.cell.search")}
                  className="h-auto flex-1 p-0"
                />
              </div>
              <CommandList className="max-h-full">
                <CommandEmpty>{t("dataGrid.cell.noOptionsFound")}</CommandEmpty>
                <CommandGroup
                  className="max-h-[300px] scroll-py-1 overflow-x-hidden
                    overflow-y-auto"
                >
                  {options.map((option) => {
                    const isOptionSelected = selectedValues.includes(
                      option.value
                    );

                    return (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={
                          /* istanbul ignore next */ () =>
                            onValueChange(option.value)
                        }
                      >
                        <div
                          className={cn(
                            `border-primary flex size-4 items-center
                              justify-center rounded-sm border`,
                            isOptionSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className="size-3" />
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {selectedValues.length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={clearAll}
                        className="text-muted-foreground justify-center"
                      >
                        {t("dataGrid.cell.clearAll")}
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : null}
      {displayLabels.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1 overflow-hidden">
          {visibleLabels.map((label, index) => (
            <Badge
              key={selectedValues[index]}
              variant="secondary"
              className="px-1.5 py-px"
            >
              {label}
            </Badge>
          ))}
          {hiddenBadgeCount > 0 && (
            <Badge
              variant="outline"
              className="text-muted-foreground px-1.5 py-px"
            >
              +{hiddenBadgeCount}
            </Badge>
          )}
        </div>
      ) : null}
    </DataGridCellWrapper>
  );
}

/** Date cell with calendar popover. */
export function DateCell<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  rowHeight,
  isFocused,
  isEditing,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
}: DataGridCellProps<TData>) {
  const initialValue = cell.getValue() as string;
  const [value, setValue] = useState(initialValue ?? "");
  const containerRef = useRef<HTMLDivElement>(null);

  const prevInitialValueRef = useRef(initialValue);

  if (initialValue !== prevInitialValueRef.current) {
    prevInitialValueRef.current = initialValue;
    setValue(initialValue ?? "");
  }

  const selectedDate =
    value === "" ? undefined : (parseLocalDate(value) ?? undefined);

  const onDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date || readOnly) return;

      const formattedDate = formatDateToString(date);
      setValue(formattedDate);
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: formattedDate });
      tableMeta?.onCellEditingStop?.();
    },
    [tableMeta, rowIndex, columnId, readOnly]
  );

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open && !readOnly) {
        tableMeta?.onCellEditingStart?.(rowIndex, columnId);
      } else {
        tableMeta?.onCellEditingStop?.();
      }
    },
    [tableMeta, rowIndex, columnId, readOnly]
  );

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing && event.key === "Escape") {
        event.preventDefault();
        setValue(initialValue);
        tableMeta?.onCellEditingStop?.();
      } else if (isFocused && event.key === "Tab") {
        event.preventDefault();
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
      }
    },
    [isEditing, isFocused, initialValue, tableMeta]
  );

  return (
    <DataGridCellWrapper<TData>
      ref={containerRef}
      cell={cell}
      tableMeta={tableMeta}
      rowIndex={rowIndex}
      columnId={columnId}
      rowHeight={rowHeight}
      isEditing={isEditing}
      isFocused={isFocused}
      isSelected={isSelected}
      isSearchMatch={isSearchMatch}
      isActiveSearchMatch={isActiveSearchMatch}
      readOnly={readOnly}
      onKeyDown={onWrapperKeyDown}
    >
      <span data-slot="grid-cell-content">{formatDateForDisplay(value)}</span>
      {isEditing && (
        <Popover open onOpenChange={onOpenChange}>
          <PopoverContent
            data-grid-cell-editor=""
            anchor={containerRef}
            align="start"
            alignOffset={-8}
            className="w-auto p-0"
            aria-label={`Select ${cell.column.columnDef.meta?.label ?? columnId}`}
          >
            <Calendar
              autoFocus
              captionLayout="dropdown"
              mode="single"
              defaultMonth={selectedDate ?? new Date()}
              selected={selectedDate}
              onSelect={onDateSelect}
            />
          </PopoverContent>
        </Popover>
      )}
    </DataGridCellWrapper>
  );
}

/** File cell with drag-and-drop upload and file management popover. */
export function FileCell<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  rowHeight,
  isFocused,
  isEditing,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
}: DataGridCellProps<TData>) {
  const { t } = useTranslation("components");
  const cellValue = useMemo(
    () => (cell.getValue() as FileCellData[]) ?? [],
    [cell]
  );

  const cellKey = getCellKey(rowIndex, columnId);
  const prevCellKeyRef = useRef(cellKey);

  const labelId = useId();
  const descriptionId = useId();

  const [files, setFiles] = useState<FileCellData[]>(cellValue);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(
    () => new Set()
  );
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(
    () => new Set()
  );
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUploading = uploadingFiles.size > 0;
  const isDeleting = deletingFiles.size > 0;
  const isPending = isUploading || isDeleting;
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const cellOpts = cell.column.columnDef.meta?.cell;
  const sideOffset = -(containerRef.current?.clientHeight ?? 0);

  const fileCellOpts = cellOpts?.variant === "file" ? cellOpts : null;
  const maxFileSize = fileCellOpts?.maxFileSize ?? 10 * 1024 * 1024;
  const maxFiles = fileCellOpts?.maxFiles ?? 10;
  const accept = fileCellOpts?.accept;
  const multiple = fileCellOpts?.multiple ?? false;

  const acceptedTypes = useMemo(
    () => (accept ? accept.split(",").map((t) => t.trim()) : null),
    [accept]
  );

  const prevCellValueRef = useRef(cellValue);

  if (cellValue !== prevCellValueRef.current) {
    prevCellValueRef.current = cellValue;
    for (const file of files) {
      if (file.url) {
        URL.revokeObjectURL(file.url);
      }
    }
    setFiles(cellValue);
    setError(null);
  }

  if (prevCellKeyRef.current !== cellKey) {
    prevCellKeyRef.current = cellKey;
    setError(null);
  }
  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxFileSize !== 0 && file.size > maxFileSize) {
        return `File size exceeds ${formatFileSize(maxFileSize)}`;
      }
      if (acceptedTypes) {
        const fileExtension = `.${file.name.split(".").pop()}`;
        const isAccepted = acceptedTypes.some((type) => {
          if (type.endsWith("/*")) {
            const baseType = type.slice(0, -2);
            return file.type.startsWith(`${baseType}/`);
          }
          if (type.startsWith(".")) {
            return fileExtension.toLowerCase() === type.toLowerCase();
          }
          return file.type === type;
        });
        if (!isAccepted) {
          return "File type not accepted";
        }
      }
      return null;
    },
    [maxFileSize, acceptedTypes]
  );

  const addFiles = useCallback(
    async (newFiles: File[], skipUpload = false) => {
      if (readOnly || isPending) return;
      setError(null);

      if (maxFiles !== 0 && files.length + newFiles.length > maxFiles) {
        const errorMessage = `Maximum ${maxFiles} files allowed`;
        setError(errorMessage);
        toast(errorMessage);
        setTimeout(() => {
          setError(null);
        }, 2000);
        return;
      }

      const rejectedFiles: { name: string; reason: string }[] = [];
      const filesToValidate: File[] = [];

      for (const file of newFiles) {
        const validationError = validateFile(file);
        if (validationError) {
          rejectedFiles.push({ name: file.name, reason: validationError });
          continue;
        }
        filesToValidate.push(file);
      }

      if (rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0];
        if (firstError) {
          setError(firstError.reason);

          const truncatedName =
            firstError.name.length > 20
              ? `${firstError.name.slice(0, 20)}...`
              : firstError.name;

          if (rejectedFiles.length === 1) {
            toast(firstError.reason, {
              description: `"${truncatedName}" has been rejected`,
            });
          } else {
            toast(firstError.reason, {
              description: `"${truncatedName}" and ${rejectedFiles.length - 1} more rejected`,
            });
          }

          setTimeout(() => {
            setError(null);
          }, 2000);
        }
      }

      if (filesToValidate.length > 0) {
        if (skipUpload) {
          const newFilesData: FileCellData[] = filesToValidate.map((f) => ({
            id: crypto.randomUUID(),
            name: f.name,
            size: f.size,
            type: f.type,
            url: URL.createObjectURL(f),
          }));
          const updatedFiles = [...files, ...newFilesData];
          setFiles(updatedFiles);
          tableMeta?.onDataUpdate?.({
            rowIndex,
            columnId,
            value: updatedFiles,
          });
        } else {
          const tempFiles = filesToValidate.map((f) => ({
            id: crypto.randomUUID(),
            name: f.name,
            size: f.size,
            type: f.type,
            url: undefined,
          }));
          const filesWithTemp = [...files, ...tempFiles];
          setFiles(filesWithTemp);

          const uploadingIds = new Set(tempFiles.map((f) => f.id));
          setUploadingFiles(uploadingIds);

          let uploadedFiles: FileCellData[] = [];

          if (tableMeta?.onFilesUpload) {
            try {
              uploadedFiles = await tableMeta.onFilesUpload({
                files: filesToValidate,
                rowIndex,
                columnId,
              });
            } catch (uploadError) {
              const fileSuffix = filesToValidate.length === 1 ? "" : "s";
              const fallbackMessage = `Failed to upload ${filesToValidate.length} file${fileSuffix}`;
              const errorMessage =
                uploadError instanceof Error
                  ? uploadError.message
                  : fallbackMessage;
              toast.error(errorMessage);
              setFiles((prev) => prev.filter((f) => !uploadingIds.has(f.id)));
              setUploadingFiles(new Set());
              return;
            }
          } else {
            uploadedFiles = filesToValidate.map((f, i) => ({
              id: tempFiles[i]?.id ?? crypto.randomUUID(),
              name: f.name,
              size: f.size,
              type: f.type,
              url: URL.createObjectURL(f),
            }));
          }

          const finalFiles = filesWithTemp
            .map((f) => {
              if (uploadingIds.has(f.id)) {
                return uploadedFiles.find((uf) => uf.name === f.name) ?? f;
              }
              return f;
            })
            .filter((f) => f.url !== undefined);

          setFiles(finalFiles);
          setUploadingFiles(new Set());
          tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: finalFiles });
        }
      }
    },
    [
      files,
      maxFiles,
      validateFile,
      tableMeta,
      rowIndex,
      columnId,
      readOnly,
      isPending,
    ]
  );

  const removeFile = useCallback(
    async (fileId: string) => {
      if (readOnly || isPending) return;
      setError(null);

      const fileToRemove = files.find((f) => f.id === fileId);
      if (!fileToRemove) return;

      setDeletingFiles((prev) => new Set(prev).add(fileId));

      if (tableMeta?.onFilesDelete) {
        try {
          await tableMeta.onFilesDelete({
            fileIds: [fileId],
            rowIndex,
            columnId,
          });
        } catch (deleteError) {
          toast.error(
            deleteError instanceof Error
              ? deleteError.message
              : `Failed to delete ${fileToRemove.name}`
          );
          setDeletingFiles((prev) => {
            const next = new Set(prev);
            next.delete(fileId);
            return next;
          });
          return;
        }
      }

      if (fileToRemove.url?.startsWith("blob:")) {
        URL.revokeObjectURL(fileToRemove.url);
      }

      const updatedFiles = files.filter((f) => f.id !== fileId);
      setFiles(updatedFiles);
      setDeletingFiles((prev) => {
        const next = new Set(prev);
        next.delete(fileId);
        return next;
      });
      tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: updatedFiles });
    },
    [files, tableMeta, rowIndex, columnId, readOnly, isPending]
  );

  const clearAll = useCallback(async () => {
    if (readOnly || isPending) return;
    setError(null);

    const fileIds = files.map((f) => f.id);
    setDeletingFiles(new Set(fileIds));

    if (tableMeta?.onFilesDelete && files.length > 0) {
      try {
        await tableMeta.onFilesDelete({
          fileIds,
          rowIndex,
          columnId,
        });
      } catch (deleteError) {
        toast.error(
          deleteError instanceof Error
            ? deleteError.message
            : "Failed to delete files"
        );
        setDeletingFiles(new Set());
        return;
      }
    }

    for (const file of files) {
      if (file.url?.startsWith("blob:")) {
        URL.revokeObjectURL(file.url);
      }
    }
    setFiles([]);
    setDeletingFiles(new Set());
    tableMeta?.onDataUpdate?.({ rowIndex, columnId, value: [] });
  }, [files, tableMeta, rowIndex, columnId, readOnly, isPending]);

  const onCellDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.types.includes("Files")) {
      setIsDraggingOver(true);
    }
  }, []);

  const onCellDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDraggingOver(false);
    }
  }, []);

  const onCellDragOver = preventDefaultAndStopPropagation;

  const onCellDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDraggingOver(false);

      const droppedFiles = [...event.dataTransfer.files];
      if (droppedFiles.length > 0) {
        void addFiles(droppedFiles, false);
      }
    },
    [addFiles]
  );

  const onDropzoneDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDropzoneDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;

    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false);
    }
  }, []);

  const onDropzoneDragOver = preventDefaultAndStopPropagation;

  const onDropzoneDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const droppedFiles = [...event.dataTransfer.files];
      void addFiles(droppedFiles, false);
    },
    [addFiles]
  );

  const onDropzoneClick = () => {
    fileInputRef.current?.click();
  };

  const onDropzoneKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const onFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = [...(event.target.files ?? [])];
      void addFiles(selectedFiles, false);
      event.target.value = "";
    },
    [addFiles]
  );

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open && !readOnly) {
        setError(null);
        tableMeta?.onCellEditingStart?.(rowIndex, columnId);
      } else {
        setError(null);
        tableMeta?.onCellEditingStop?.();
      }
    },
    [tableMeta, rowIndex, columnId, readOnly]
  );

  const initialFocus = () => {
    queueMicrotask(() => {
      dropzoneRef.current?.focus();
    });
  };

  const onWrapperKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (isEditing) {
        switch (event.key) {
          case "Escape": {
            event.preventDefault();
            setFiles(cellValue);
            setError(null);
            tableMeta?.onCellEditingStop?.();

            break;
          }
          case " ": {
            event.preventDefault();
            fileInputRef.current?.click();

            break;
          }
          case "Tab": {
            event.preventDefault();
            tableMeta?.onCellEditingStop?.({
              direction: event.shiftKey ? "left" : "right",
            });

            break;
          }
          // No default
        }
      } else if (isFocused && event.key === "Enter") {
        event.preventDefault();
        tableMeta?.onCellEditingStart?.(rowIndex, columnId);
      } else if (isFocused && event.key === "Tab") {
        event.preventDefault();
        tableMeta?.onCellEditingStop?.({
          direction: event.shiftKey ? "left" : "right",
        });
      }
    },
    [isEditing, isFocused, cellValue, tableMeta, rowIndex, columnId]
  );

  useEffect(() => {
    return () => {
      for (const file of files) {
        if (file.url) {
          URL.revokeObjectURL(file.url);
        }
      }
    };
  }, [files]);

  const lineCount = getLineCount(rowHeight);

  const { visibleItems: visibleFiles, hiddenCount: hiddenFileCount } =
    useBadgeOverflow({
      items: files,
      getLabel: (file) => file.name,
      containerRef,
      lineCount,
      cacheKeyPrefix: "file",
      iconSize: 12,
      maxWidth: 100,
    });

  const dropzoneDescription = (() => {
    const maxFilesLabel = maxFiles === 0 ? "" : `Max ${maxFiles} files`;
    if (maxFileSize !== 0) {
      const sizeLabel = `Max size: ${formatFileSize(maxFileSize)}`;
      return maxFilesLabel === ""
        ? sizeLabel
        : `${sizeLabel} \u2022 ${maxFilesLabel}`;
    }
    return maxFilesLabel === "" ? "Select files to upload" : maxFilesLabel;
  })();

  return (
    <DataGridCellWrapper<TData>
      ref={containerRef}
      cell={cell}
      tableMeta={tableMeta}
      rowIndex={rowIndex}
      columnId={columnId}
      rowHeight={rowHeight}
      isEditing={isEditing}
      isFocused={isFocused}
      isSelected={isSelected}
      isSearchMatch={isSearchMatch}
      isActiveSearchMatch={isActiveSearchMatch}
      readOnly={readOnly}
      className={cn({
        "ring-primary/80 ring-1 ring-inset": isDraggingOver,
      })}
      onDragEnter={onCellDragEnter}
      onDragLeave={onCellDragLeave}
      onDragOver={onCellDragOver}
      onDrop={onCellDrop}
      onKeyDown={onWrapperKeyDown}
    >
      {isEditing ? (
        <Popover open={isEditing} onOpenChange={onOpenChange}>
          <div ref={anchorRef} className="absolute inset-0" />
          <PopoverContent
            data-grid-cell-editor=""
            anchor={anchorRef}
            align="start"
            sideOffset={sideOffset}
            className="w-[400px] rounded-none p-0"
            initialFocus={initialFocus}
            aria-label={`Upload files for ${cell.column.columnDef.meta?.label ?? columnId}`}
          >
            <div className="flex flex-col gap-2 p-3">
              <span id={labelId} className="sr-only">
                {t("dataGrid.cell.fileUpload")}
              </span>
              <div
                role="region"
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                aria-invalid={!!error}
                aria-disabled={isPending}
                data-dragging={isDragging ? "" : undefined}
                data-invalid={error ? "" : undefined}
                data-disabled={isPending ? "" : undefined}
                tabIndex={isDragging || isPending ? -1 : 0}
                className="hover:bg-accent/30 focus-visible:border-ring/50
                  data-dragging:border-primary/30
                  data-invalid:border-destructive data-dragging:bg-accent/30
                  data-invalid:ring-destructive/20 flex cursor-pointer flex-col
                  items-center justify-center gap-2 rounded-md border-2
                  border-dashed p-6 transition-colors outline-none
                  data-disabled:pointer-events-none data-disabled:opacity-50"
                ref={dropzoneRef}
                onClick={onDropzoneClick}
                onDragEnter={onDropzoneDragEnter}
                onDragLeave={onDropzoneDragLeave}
                onDragOver={onDropzoneDragOver}
                onDrop={onDropzoneDrop}
                onKeyDown={onDropzoneKeyDown}
              >
                <Upload className="text-muted-foreground size-8" />
                <div className="text-center text-sm">
                  <p className="font-medium">
                    {isDragging
                      ? t("dataGrid.cell.dropFilesHere")
                      : t("dataGrid.cell.dragFilesHere")}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {t("dataGrid.cell.orClickToBrowse")}
                  </p>
                </div>
                <p id={descriptionId} className="text-muted-foreground text-xs">
                  {dropzoneDescription}
                </p>
              </div>
              <input
                type="file"
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                multiple={multiple}
                accept={accept}
                className="sr-only"
                ref={fileInputRef}
                onChange={onFileInputChange}
              />
              {files.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs font-medium">
                      {t("dataGrid.cell.fileCount", { count: files.length })}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground h-6 text-xs"
                      onClick={() => void clearAll()}
                      disabled={isPending}
                    >
                      {t("dataGrid.cell.clearAll")}
                    </Button>
                  </div>
                  <div className="max-h-[200px] space-y-1 overflow-y-auto">
                    {files.map((file) => {
                      const FileIcon = getFileIcon(file.type);
                      const isFileUploading = uploadingFiles.has(file.id);
                      const isFileDeleting = deletingFiles.has(file.id);
                      const isFilePending = isFileUploading || isFileDeleting;

                      let fileStatus: string;
                      if (isFileUploading) {
                        fileStatus = t("dataGrid.cell.uploading");
                      } else if (isFileDeleting) {
                        fileStatus = t("dataGrid.cell.deleting");
                      } else {
                        fileStatus = formatFileSize(file.size);
                      }

                      return (
                        <div
                          key={file.id}
                          data-pending={isFilePending ? "" : undefined}
                          className="bg-muted/50 flex items-center gap-2
                            rounded-md border px-2 py-1.5
                            data-pending:opacity-60"
                        >
                          <FileIcon
                            className="text-muted-foreground size-4 shrink-0"
                          />
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm">{file.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {fileStatus}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Remove ${file.name}`}
                            className="size-5 rounded-sm"
                            onClick={() => void removeFile(file.id)}
                            disabled={isPending}
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      ) : null}
      {isDraggingOver && (
        <div
          className="text-primary flex items-center justify-center gap-2
            text-sm"
        >
          <Upload className="size-4" />
          <span>{t("dataGrid.cell.dropFilesHere")}</span>
        </div>
      )}
      {!isDraggingOver && files.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 overflow-hidden">
          {visibleFiles.map((file) => {
            const isFileUploading = uploadingFiles.has(file.id);

            if (isFileUploading) {
              return (
                <Skeleton
                  key={file.id}
                  className="h-5 shrink-0 px-1.5"
                  style={{
                    width: `${Math.min(file.name.length * 8 + 30, 100)}px`,
                  }}
                />
              );
            }

            const FileIcon = getFileIcon(file.type);

            return (
              <Badge
                key={file.id}
                variant="secondary"
                className="gap-1 px-1.5 py-px"
              >
                <FileIcon className="size-3 shrink-0" />
                <span className="max-w-[100px] truncate">{file.name}</span>
              </Badge>
            );
          })}
          {hiddenFileCount > 0 && (
            <Badge
              variant="outline"
              className="text-muted-foreground px-1.5 py-px"
            >
              +{hiddenFileCount}
            </Badge>
          )}
        </div>
      )}
    </DataGridCellWrapper>
  );
}
/* istanbul ignore end @preserve */
/* eslint-enable @typescript-eslint/no-unnecessary-condition, react-hooks/refs, sonarjs/cognitive-complexity, @typescript-eslint/no-deprecated, react-you-might-not-need-an-effect/no-event-handler, jsx-a11y/role-supports-aria-props, jsx-a11y/no-autofocus, jsx-a11y/no-noninteractive-element-interactions -- Re-enable rules disabled at top of file */
