import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

export type CartItem = { product: Product; qty: number };

type CartContextValue = {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "khatib-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const add = (product: Product, qty = 1) =>
      setItems((prev) => {
        const found = prev.find((i) => i.product.id === product.id);
        if (found)
          return prev.map((i) =>
            i.product.id === product.id ? { ...i, qty: i.qty + qty } : i,
          );
        return [...prev, { product, qty }];
      });

    const remove = (id: string) =>
      setItems((prev) => prev.filter((i) => i.product.id !== id));

    const setQty = (id: string, qty: number) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.product.id !== id)
          : prev.map((i) => (i.product.id === id ? { ...i, qty } : i)),
      );

    return {
      items,
      add,
      remove,
      setQty,
      clear: () => setItems([]),
      count: items.reduce((s, i) => s + i.qty, 0),
      total: items.reduce((s, i) => s + i.qty * i.product.price, 0),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const formatPrice = (n: number) =>
  `${n.toLocaleString("ar-EG", { maximumFractionDigits: 2 })} ج.م`;
