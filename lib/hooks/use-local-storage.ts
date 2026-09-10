"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

/*
  Typed localStorage state backed by a single shared store per key. Every hook
  that names the same key reads one snapshot, does one localStorage read, and
  registers one cross tab listener, so a page with a hundred save buttons is
  not a hundred readers fighting each other. Reads happen after mount so server
  and first client render agree.
*/

type State<T> = { value: T; ready: boolean };

type Store<T> = {
  state: State<T>;
  hydrated: boolean;
  listeners: Set<() => void>;
};

const stores = new Map<string, Store<unknown>>();

function getStore<T>(key: string, initial: T): Store<T> {
  let store = stores.get(key) as Store<T> | undefined;
  if (!store) {
    store = {
      state: { value: initial, ready: false },
      hydrated: false,
      listeners: new Set(),
    };
    stores.set(key, store as Store<unknown>);
  }
  return store;
}

function emit<T>(store: Store<T>) {
  store.listeners.forEach((listener) => listener());
}

function hydrate<T>(key: string, initial: T) {
  const store = getStore(key, initial);
  if (store.hydrated) return;
  store.hydrated = true;

  try {
    const raw = window.localStorage.getItem(key);
    store.state = {
      value: raw != null ? (JSON.parse(raw) as T) : store.state.value,
      ready: true,
    };
  } catch {
    store.state = { value: store.state.value, ready: true };
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== key) return;
    try {
      store.state = {
        value:
          event.newValue == null ? initial : (JSON.parse(event.newValue) as T),
        ready: true,
      };
      emit(store);
    } catch {
      // ignore
    }
  });

  emit(store);
}

export function writeLocalStorage<T>(
  key: string,
  initial: T,
  next: T | ((prev: T) => T),
) {
  const store = getStore(key, initial);
  const resolved =
    typeof next === "function"
      ? (next as (prev: T) => T)(store.state.value)
      : next;
  if (Object.is(resolved, store.state.value)) return;

  store.state = { value: resolved, ready: true };
  try {
    window.localStorage.setItem(key, JSON.stringify(resolved));
  } catch {
    // ignore
  }
  emit(store);
}

function useStoreSubscribe(key: string, initial: unknown) {
  const store = getStore(key, initial);
  const subscribe = useCallback(
    (callback: () => void) => {
      store.listeners.add(callback);
      return () => store.listeners.delete(callback);
    },
    [store],
  );
  // initial is only read on first creation; keep the effect keyed to the key.
  useEffect(() => hydrate(key, initial), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return { store, subscribe };
}

export function useLocalStorage<T>(key: string, initial: T) {
  const { store, subscribe } = useStoreSubscribe(key, initial);

  const state = useSyncExternalStore(
    subscribe,
    () => store.state as State<T>,
    () => store.state as State<T>,
  );

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => writeLocalStorage(key, initial, next),
    [key, initial],
  );

  return { value: state.value, setValue, ready: state.ready };
}

/*
  Subscribe to a derived slice of a stored value. The snapshot is whatever the
  selector returns, so a boolean like "is this slug saved" only re-renders the
  component when that boolean actually flips, not on every unrelated write.
*/
export function useLocalStorageSelector<T, S>(
  key: string,
  initial: T,
  selector: (value: T) => S,
): S {
  const { store, subscribe } = useStoreSubscribe(key, initial);
  return useSyncExternalStore(
    subscribe,
    () => selector((store.state as State<T>).value),
    () => selector(initial),
  );
}
