import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FileTextIcon, Loader2Icon, SearchIcon } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Kbd, KbdGroup } from "@/shared/ui/kbd";
import { useSearch } from "../../api";

export default function CornerSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { query, setQuery, results, isLoading, totalHits } = useSearch({
    debounceMs: 300,
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSelect(hit: { url?: string; objectID: string }) {
    setOpen(false);
    setQuery("");
    if (hit.url) {
      navigate(hit.url);
    }
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);
    if (!isOpen) {
      setQuery("");
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="text-muted-foreground absolute top-7.5 right-4 gap-2"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="size-4" />
        <span className="hidden sm:inline">Search</span>
        <KbdGroup className="hidden sm:inline-flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Search"
        description="Search across all content"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2Icon className="text-muted-foreground size-4 animate-spin" />
              </div>
            )}

            {!isLoading && query && results.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            {!isLoading && !query && (
              <CommandEmpty>Start typing to search...</CommandEmpty>
            )}

            {!isLoading && results.length > 0 && (
              <CommandGroup
                heading={`Results${totalHits > 0 ? ` (${totalHits})` : ""}`}
              >
                {results.map((hit) => (
                  <CommandItem
                    key={hit.objectID}
                    value={hit.objectID}
                    onSelect={() => handleSelect(hit)}
                  >
                    <FileTextIcon className="text-muted-foreground size-4" />
                    <div className="flex flex-col gap-0.5">
                      <span>{hit.title}</span>
                      {hit.description && (
                        <span className="text-muted-foreground line-clamp-1 text-xs">
                          {hit.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
