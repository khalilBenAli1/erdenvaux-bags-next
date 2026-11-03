import type { PersistenceStatus, SavedSelections } from '../domain/types';
import {
  STORAGE_KEY,
  decodeSaved,
  encodeSaved,
  emptySelections,
} from '../domain/persistence';
export interface SelectionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export function readSelections(storage: SelectionStorage | null): {
  data: SavedSelections;
  status: PersistenceStatus;
} {
  if (!storage) return { data: emptySelections(), status: 'unavailable' };
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { data: emptySelections(), status: 'ready' };
    const data = decodeSaved(raw);
    return data
      ? { data, status: 'restored' }
      : { data: emptySelections(), status: 'recovered' };
  } catch {
    return { data: emptySelections(), status: 'unavailable' };
  }
}
export function saveSelections(
  storage: SelectionStorage | null,
  data: SavedSelections,
): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, encodeSaved(data));
    return true;
  } catch {
    return false;
  }
}
export function browserStorage(): SelectionStorage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
