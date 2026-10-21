"use client";

// URL state without a Suspense boundary: the prerendered HTML carries the default view (so the static page is
// complete and fast), and the query string is read and written on the client through the native history API,
// which Next keeps in sync with its router. Every view stays a link (P17).
import { useCallback, useSyncExternalStore } from "react";

const EVENT = "urlstatechange";

function subscribe(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
}

export function useUrlParam(name: string): [string | null, (value: string | null) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
  const set = useCallback(
    (v: string | null) => {
      const url = new URL(window.location.href);
      if (v == null || v === "") url.searchParams.delete(name);
      else url.searchParams.set(name, v);
      window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
      window.dispatchEvent(new Event(EVENT));
    },
    [name],
  );
  return [value, set];
}
