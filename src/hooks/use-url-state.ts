'use client';
import { useSyncExternalStore } from 'react';
const eventName = 'erdenvaux:urlchange';
const subscribe = (notify: () => void) => {
  window.addEventListener('popstate', notify);
  window.addEventListener(eventName, notify);
  return () => {
    window.removeEventListener('popstate', notify);
    window.removeEventListener(eventName, notify);
  };
};
const snapshot = () => window.location.search;
const serverSnapshot = () => '';
export function useUrlSearch() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
export function updateSearch(key: string, value: string, replace = false) {
  const url = new URL(window.location.href);
  if (value && value !== 'all') url.searchParams.set(key, value);
  else url.searchParams.delete(key);
  window.history[replace ? 'replaceState' : 'pushState'](
    {},
    '',
    `${url.pathname}${url.search}${url.hash}`,
  );
  window.dispatchEvent(new Event(eventName));
}
export function resetSearch() {
  const url = new URL(window.location.href);
  window.history.pushState({}, '', url.pathname);
  window.dispatchEvent(new Event(eventName));
}
