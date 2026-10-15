import { useRef } from "react";

import type { RefObject } from "react";

/**
 * Create a ref that is lazily initialized on first access.
 * @param fn - Factory function to create the initial value
 * @returns A ref object with the lazily initialized value
 */
export function useLazyRef<T>(fn: () => T) {
  const ref = useRef<T | null>(null);

  ref.current ??= fn();

  return ref as RefObject<T>;
}
