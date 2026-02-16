import { useSyncExternalStore } from "react";

/* istanbul ignore next 3 -- No-op unsubscribe callback, never invoked during render */
function noop() {
  // Intentionally empty - used as a stable no-op callback reference
}
function emptySubscribe() {
  return noop;
}

/**
 * Returns `true` once the client has hydrated, `false` during SSR and
 * before hydration completes. Use this to gate interactive controls so
 * that users (and Playwright) cannot interact before event handlers are
 * attached.
 * @returns Whether the client has completed hydration
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    /* istanbul ignore next -- SSR-only snapshot, never called in browser tests */
    () => false
  );
}
