import { createStore } from 'zustand/vanilla';
import type {
  BagLine,
  Selection,
  SavedSelections,
  PersistenceStatus,
} from '../domain/types';
import {
  addToBag,
  changeQuantity,
  removeFromBag,
  toggleSaved,
} from '../domain/bag';
import { emptySelections } from '../domain/persistence';
export interface CommerceState extends SavedSelections {
  readonly status: PersistenceStatus;
  add(selection: Selection, quantity: number): ReturnType<typeof addToBag>;
  setQuantity(
    selection: Selection,
    quantity: number,
  ): ReturnType<typeof changeQuantity>;
  remove(selection: Selection): void;
  toggleWishlist(selection: Selection): void;
  clearBag(): void;
  reset(): void;
  hydrate(data: SavedSelections, status: PersistenceStatus): void;
  setStatus(status: PersistenceStatus): void;
}
const cloneLines = (lines: readonly BagLine[]) =>
  lines.map((line) => ({ ...line }));
export function createCommerceStore(
  initial: SavedSelections = emptySelections(),
) {
  return createStore<CommerceState>()((set, get) => ({
    cart: cloneLines(initial.cart),
    wishlist: initial.wishlist.map((item) => ({ ...item })),
    status: 'loading',
    add: (selection, quantity) => {
      const result = addToBag(get().cart, selection, quantity);
      if (result.ok) set({ cart: result.cart });
      return result;
    },
    setQuantity: (selection, quantity) => {
      const result = changeQuantity(get().cart, selection, quantity);
      if (result.ok) set({ cart: result.cart });
      return result;
    },
    remove: (selection) =>
      set((state) => ({ cart: removeFromBag(state.cart, selection) })),
    toggleWishlist: (selection) =>
      set((state) => ({ wishlist: toggleSaved(state.wishlist, selection) })),
    clearBag: () => set({ cart: [] }),
    reset: () => set({ ...emptySelections() }),
    hydrate: (data, status) =>
      set({
        cart: cloneLines(data.cart),
        wishlist: data.wishlist.map((item) => ({ ...item })),
        status,
      }),
    setStatus: (status) => set({ status }),
  }));
}
