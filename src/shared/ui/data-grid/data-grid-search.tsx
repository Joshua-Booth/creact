import { memo, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { ChevronDown, ChevronUp, X } from "lucide-react";

import type { SearchState } from "@/shared/lib/data-grid";
import { useAsRef } from "@/shared/lib/data-grid";
import { useDebouncedCallback } from "@/shared/lib/data-table/use-debounced-callback";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

/* istanbul ignore start @preserve -- pointer capture handling for search button focus management */
function onTriggerPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.hasPointerCapture(event.pointerId)) {
    target.releasePointerCapture(event.pointerId);
  }

  if (
    event.button === 0 &&
    !event.ctrlKey &&
    event.pointerType === "mouse" &&
    !(event.target instanceof HTMLInputElement)
  ) {
    event.preventDefault();
  }
}
/* istanbul ignore end @preserve */

/** Search overlay with debounced query input and prev/next match navigation. */
/* istanbul ignore start @preserve -- memo comparator is a performance optimization */
export const DataGridSearch = memo(DataGridSearchImpl, (prev, next) => {
  if (prev.searchOpen !== next.searchOpen) return false;
  if (!next.searchOpen) return true;

  if (
    prev.searchQuery !== next.searchQuery ||
    prev.matchIndex !== next.matchIndex
  ) {
    return false;
  }

  if (prev.searchMatches.length !== next.searchMatches.length) return false;

  for (let i = 0; i < prev.searchMatches.length; i++) {
    const prevMatch = prev.searchMatches[i];
    const nextMatch = next.searchMatches[i];

    if (!prevMatch || !nextMatch) return false;

    if (
      prevMatch.rowIndex !== nextMatch.rowIndex ||
      prevMatch.columnId !== nextMatch.columnId
    ) {
      return false;
    }
  }

  return true;
});
/* istanbul ignore end @preserve */

function DataGridSearchImpl({
  searchMatches,
  matchIndex,
  searchOpen,
  onSearchOpenChange,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onNavigateToNextMatch,
  onNavigateToPrevMatch,
}: SearchState) {
  const { t } = useTranslation("components");
  const propsRef = useAsRef({
    onSearchOpenChange,
    onSearchQueryChange,
    onSearch,
    onNavigateToNextMatch,
    onNavigateToPrevMatch,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    /* istanbul ignore start @preserve -- browser-only callback tested via Storybook */
    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        propsRef.current.onSearchOpenChange(false);
      }
    }
    /* istanbul ignore end @preserve */

    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [searchOpen, propsRef]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      event.stopPropagation();

      if (event.key === "Enter") {
        event.preventDefault();
        if (event.shiftKey) {
          propsRef.current.onNavigateToPrevMatch();
        } else {
          propsRef.current.onNavigateToNextMatch();
        }
      }
    },
    [propsRef]
  );

  const debouncedSearch = useDebouncedCallback((query: string) => {
    propsRef.current.onSearch(query);
  }, 150);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      propsRef.current.onSearchQueryChange(value);
      debouncedSearch(value);
    },
    [propsRef, debouncedSearch]
  );

  const onClose = useCallback(() => {
    propsRef.current.onSearchOpenChange(false);
  }, [propsRef]);

  /* istanbul ignore start @preserve -- browser-only callback tested via Storybook */
  const onPrevMatch = useCallback(() => {
    propsRef.current.onNavigateToPrevMatch();
  }, [propsRef]);

  const onNextMatch = useCallback(() => {
    propsRef.current.onNavigateToNextMatch();
  }, [propsRef]);
  /* istanbul ignore end @preserve */

  if (!searchOpen) return null;

  return (
    <div
      role="search"
      data-slot="grid-search"
      className="fade-in-0 slide-in-from-top-2 bg-background animate-in absolute
        inset-e-4 top-4 z-50 flex flex-col gap-2 rounded-lg border p-2
        shadow-lg"
    >
      <div className="flex items-center gap-2">
        <Input
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={t("dataGrid.search.placeholder")}
          className="h-8 w-64"
          ref={inputRef}
          value={searchQuery}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <div className="flex items-center gap-1">
          <Button
            aria-label={t("dataGrid.search.previousMatch")}
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onPrevMatch}
            onPointerDown={onTriggerPointerDown}
            disabled={searchMatches.length === 0}
          >
            <ChevronUp />
          </Button>
          <Button
            aria-label={t("dataGrid.search.nextMatch")}
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onNextMatch}
            onPointerDown={onTriggerPointerDown}
            disabled={searchMatches.length === 0}
          >
            <ChevronDown />
          </Button>
          <Button
            aria-label={t("dataGrid.search.closeSearch")}
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onClose}
          >
            <X />
          </Button>
        </div>
      </div>
      <div
        className="text-muted-foreground flex items-center gap-1 text-xs
          whitespace-nowrap"
      >
        {searchMatches.length > 0 ? (
          <span>
            {t("dataGrid.search.matchCounter", {
              current: matchIndex + 1,
              total: searchMatches.length,
            })}
          </span>
        ) : (
          <span>
            {searchQuery === ""
              ? t("dataGrid.search.typeToSearch")
              : t("dataGrid.search.noResults")}
          </span>
        )}
      </div>
    </div>
  );
}
