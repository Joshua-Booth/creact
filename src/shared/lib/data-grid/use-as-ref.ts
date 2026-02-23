import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

/**
 * Keep a mutable ref always in sync with the latest value.
 * @param props - The value to keep in sync
 * @returns A ref object that always holds the latest value
 */
export function useAsRef<T>(props: T) {
  const ref = useRef<T>(props);

  useIsomorphicLayoutEffect(() => {
    ref.current = props;
  });

  return ref;
}
