import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Quote } from '../types';

type CompareValue = {
  items: Quote[];
  has: (id: string) => boolean;
  toggle: (quote: Quote) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CompareContext = createContext<CompareValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Quote[]>([]);

  const value = useMemo<CompareValue>(
    () => ({
      items,
      has: (id) => items.some((q) => q.id === id),
      toggle: (quote) =>
        setItems((prev) =>
          prev.some((q) => q.id === quote.id)
            ? prev.filter((q) => q.id !== quote.id)
            : [...prev, quote]
        ),
      remove: (id) => setItems((prev) => prev.filter((q) => q.id !== id)),
      clear: () => setItems([]),
    }),
    [items]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used inside CompareProvider');
  return ctx;
}
