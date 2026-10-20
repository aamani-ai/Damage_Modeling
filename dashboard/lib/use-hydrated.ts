import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** true after hydration, false during prerender — without a setState inside an effect */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
