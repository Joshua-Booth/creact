/* eslint-disable @typescript-eslint/no-unnecessary-condition -- tableMeta methods are optional at runtime despite types */
import { useCallback } from "react";

import type { ComponentProps } from "react";

import type { DataGridCellProps } from "@/shared/lib/data-grid";
import { getCellKey } from "@/shared/lib/data-grid";
import { useComposedRefs } from "@/shared/lib/data-grid/compose-refs";
import { cn } from "@/shared/lib/utils";

interface DataGridCellWrapperProps<TData>
  extends DataGridCellProps<TData>, ComponentProps<"div"> {}

/** Cell interaction wrapper that manages focus, selection, editing entry, and mouse/keyboard event delegation. */
export function DataGridCellWrapper<TData>({
  tableMeta,
  rowIndex,
  columnId,
  isEditing,
  isFocused,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
  rowHeight,
  className,
  onClick: onClickProp,
  onKeyDown: onKeyDownProp,
  ref,
  ...props
}: DataGridCellWrapperProps<TData>) {
  const cellMapRef = tableMeta?.cellMapRef;

  /* istanbul ignore start @preserve -- browser-only callback tested via Storybook */
  const onCellChange = useCallback(
    (node: HTMLDivElement | null) => {
      if (!cellMapRef) return;

      const cellKey = getCellKey(rowIndex, columnId);

      if (node) {
        cellMapRef.current.set(cellKey, node);
      } else {
        cellMapRef.current.delete(cellKey);
      }
    },
    [rowIndex, columnId, cellMapRef]
  );
  /* istanbul ignore end @preserve */

  const composedRef = useComposedRefs(ref, onCellChange);

  /* istanbul ignore start @preserve -- browser-only callbacks tested via Storybook */
  const onClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isEditing) {
        event.preventDefault();
        onClickProp?.(event);
        if (isFocused && !readOnly) {
          tableMeta?.onCellEditingStart?.(rowIndex, columnId);
        } else {
          tableMeta?.onCellClick?.(rowIndex, columnId, event);
        }
      }
    },
    [tableMeta, rowIndex, columnId, isEditing, isFocused, readOnly, onClickProp]
  );

  const onContextMenu = useCallback(
    (event: React.MouseEvent) => {
      if (!isEditing) {
        tableMeta?.onCellContextMenu?.(rowIndex, columnId, event);
      }
    },
    [tableMeta, rowIndex, columnId, isEditing]
  );

  const onDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      if (!isEditing) {
        event.preventDefault();
        tableMeta?.onCellDoubleClick?.(rowIndex, columnId);
      }
    },
    [tableMeta, rowIndex, columnId, isEditing]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDownProp?.(event);

      if (event.defaultPrevented) return;

      if (
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "Home" ||
        event.key === "End" ||
        event.key === "PageUp" ||
        event.key === "PageDown" ||
        event.key === "Tab"
      ) {
        return;
      }

      /* istanbul ignore start @preserve -- browser-only callback tested via Storybook */
      if (isFocused && !isEditing && !readOnly) {
        if (event.key === "F2" || event.key === "Enter") {
          event.preventDefault();
          event.stopPropagation();
          tableMeta?.onCellEditingStart?.(rowIndex, columnId);
          return;
        }

        if (event.key === " ") {
          event.preventDefault();
          event.stopPropagation();
          tableMeta?.onCellEditingStart?.(rowIndex, columnId);
          return;
        }

        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          event.stopPropagation();
          tableMeta?.onCellEditingStart?.(rowIndex, columnId);
        }
      }
      /* istanbul ignore end @preserve */
    },
    [
      onKeyDownProp,
      isFocused,
      isEditing,
      readOnly,
      tableMeta,
      rowIndex,
      columnId,
    ]
  );

  const onMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!isEditing) {
        tableMeta?.onCellMouseDown?.(rowIndex, columnId, event);
      }
    },
    [tableMeta, rowIndex, columnId, isEditing]
  );

  const onMouseEnter = useCallback(() => {
    if (!isEditing) {
      tableMeta?.onCellMouseEnter?.(rowIndex, columnId);
    }
  }, [tableMeta, rowIndex, columnId, isEditing]);

  const onMouseUp = useCallback(() => {
    if (!isEditing) {
      tableMeta?.onCellMouseUp?.();
    }
  }, [tableMeta, isEditing]);
  /* istanbul ignore end @preserve */

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- focus/interaction wrapper inside role="gridcell" parent; no ARIA role fits nested interactive content
    <div
      data-slot="grid-cell-wrapper"
      data-editing={isEditing ? "" : undefined}
      data-focused={isFocused ? "" : undefined}
      data-selected={isSelected ? "" : undefined}
      tabIndex={isFocused && !isEditing ? 0 : -1}
      {...props}
      ref={composedRef}
      className={cn(
        `size-full px-2 py-1.5 text-start text-sm outline-none
        has-data-[slot=checkbox]:pt-2.5`,
        {
          "ring-ring ring-1 ring-inset": isFocused,
          "bg-yellow-100 dark:bg-yellow-900/30":
            isSearchMatch && !isActiveSearchMatch,
          "bg-orange-200 dark:bg-orange-900/50": isActiveSearchMatch,
          "bg-primary/10": isSelected && !isEditing,
          "cursor-default": !isEditing,
          "**:data-[slot=grid-cell-content]:line-clamp-1":
            !isEditing && rowHeight === "short",
          "**:data-[slot=grid-cell-content]:line-clamp-2":
            !isEditing && rowHeight === "medium",
          "**:data-[slot=grid-cell-content]:line-clamp-3":
            !isEditing && rowHeight === "tall",
          "**:data-[slot=grid-cell-content]:line-clamp-4":
            !isEditing && rowHeight === "extra-tall",
        },
        className
      )}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
      onKeyDown={onKeyDown}
    />
  );
}
