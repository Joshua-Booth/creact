import { useCallback } from "react";

import type { Ref, RefCallback } from "react";

type PossibleRef<T> = Ref<T> | undefined;

function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    return ref(value);
  }

  if (ref != null) {
    ref.current = value;
  }
}

/**
 * Compose multiple refs into a single ref callback.
 * @param refs - Array of refs to compose
 * @returns A ref callback that sets all provided refs
 */
function composeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => setRef(ref, node));

    /* istanbul ignore start -- ref cleanup during unmount */
    return () => {
      for (let i = 0; i < cleanups.length; i++) {
        const cleanup = cleanups[i];
        if (typeof cleanup === "function") {
          cleanup();
        } else {
          setRef(refs[i], null);
        }
      }
    };
    /* istanbul ignore end */
  };
}

/**
 * Compose multiple refs into a single memoized ref callback.
 * @param refs - Array of refs to compose
 * @returns A memoized ref callback that sets all provided refs
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  // eslint-disable-next-line react-compiler/react-compiler, react-hooks/exhaustive-deps, react-hooks/use-memo -- memoize by all ref values
  return useCallback(composeRefs(...refs), refs);
}

export { composeRefs, useComposedRefs };
