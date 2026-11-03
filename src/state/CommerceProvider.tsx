'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useStore } from 'zustand';
import { createCommerceStore, type CommerceState } from './commerce-store';
import {
  browserStorage,
  readSelections,
  saveSelections,
} from '../adapters/persistence';
type Store = ReturnType<typeof createCommerceStore>;
const CommerceContext = createContext<Store | null>(null);
export function CommerceProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createCommerceStore());
  useEffect(() => {
    const storage = browserStorage();
    const saved = readSelections(storage);
    store.getState().hydrate(saved.data, saved.status);
    if (saved.status === 'recovered' && !saveSelections(storage, saved.data))
      store.getState().setStatus('unavailable');
    return store.subscribe((state, previous) => {
      if (state.cart === previous.cart && state.wishlist === previous.wishlist)
        return;
      if (
        !saveSelections(storage, { cart: state.cart, wishlist: state.wishlist })
      )
        store.getState().setStatus('unavailable');
    });
  }, [store]);
  return (
    <CommerceContext.Provider value={store}>
      {children}
    </CommerceContext.Provider>
  );
}
export function useCommerce<T>(selector: (state: CommerceState) => T): T {
  const store = useContext(CommerceContext);
  if (!store) throw new Error('CommerceProvider is required');
  return useStore(store, selector);
}
