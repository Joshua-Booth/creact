import { useCallback, useEffect, useRef, useState } from "react";

import { debounce } from "@/shared/lib/search";

import type { SearchHit, SearchResult } from "./search";
import { search } from "./search";

interface UseSearchOptions {
  debounceMs?: number;
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchHit[];
  isLoading: boolean;
  error: Error | null;
  totalHits: number;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceMs = 300 } = options;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalHits, setTotalHits] = useState(0);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalHits(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result: SearchResult = await search(searchQuery);
      setResults(result.hits);
      setTotalHits(result.nbHits);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Search failed"));
      setResults([]);
      setTotalHits(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useRef(
    debounce((q: string) => performSearch(q), debounceMs)
  ).current;

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    totalHits,
  };
}
