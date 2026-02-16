import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect =
  /* v8 ignore next */
  typeof window === "undefined" ? useEffect : useLayoutEffect;
