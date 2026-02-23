import { useCallback, useEffect, useRef } from "react";

import { useCallbackRef } from "./use-callback-ref";

/**
 * Debounce a callback by the given delay in milliseconds.
 * @param callback - The function to debounce
 * @param delay - Delay in milliseconds before invoking the callback
 * @returns A debounced version of the callback
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  delay: number
) {
  const handleCallback = useCallbackRef(callback);
  const debounceTimerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);

  return useCallback(
    (...args: Parameters<T>) => {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(
        /* istanbul ignore next @preserve */
        () => handleCallback(...args),
        delay
      );
    },
    [handleCallback, delay]
  );
}
