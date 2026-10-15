import { useEffect, useLayoutEffect } from "react";

export const useIsomorphicLayoutEffect =
  /* istanbul ignore next */
  typeof window === "undefined" ? useEffect : useLayoutEffect;
