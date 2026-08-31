import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products as seedProducts, type CategoryId, type Product } from "@/data/products";

const STORAGE_KEY = "khatib-catalog";
export const ADMIN_CODE = "1611";

type StoreContextValue = {
  catalog: Product[];
  offers: Product[];
  addProduct: (p: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  setOffer: (id: string, price: number, oldPrice?: number | undefined) => void;
  resetCatalog: () => void;
  isAdmin: boolean;
  tryLogin: (code: string) => boolean;
  logout: () => void;
  adminOpen: boolean;
  setAdminOpen: (v: boolean) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Product[]>(seedProducts);
  const [hydrated, setHydrated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Product[];
        if (Array.isArray(parsed)) setCatalog(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
    } catch {
      /* ignore */
    }
  }, [catalog, hydrated]);

  const value = useMemo<StoreContextValue>(
    () => ({
      catalog,
      offers: catalog.filter((p) => p.oldPrice && p.oldPrice > p.price),
      addProduct: (p) =>
        setCatalog((prev) => [{ ...p, id: `c-${Date.now()}` }, ...prev]),
      deleteProduct: (id) => setCatalog((prev) => prev.filter((p) => p.id !== id)),
      setOffer: (id, price, oldPrice) =>
        setCatalog((prev) =>
          prev.map((p) => {
            if (p.id !== id) return p;
            const next: Product = { ...p, price };
            if (oldPrice && oldPrice > price) next.oldPrice = oldPrice;
            else delete next.oldPrice;
            return next;
          }),
        ),
      resetCatalog: () => setCatalog(seedProducts),
      isAdmin,
      tryLogin: (code: string) => {
        const ok = code.trim() === ADMIN_CODE;
        if (ok) {
          setIsAdmin(true);
          setAdminOpen(true);
        }
        return ok;
      },
      logout: () => {
        setIsAdmin(false);
        setAdminOpen(false);
      },
      adminOpen,
      setAdminOpen,
    }),
    [catalog, isAdmin, adminOpen],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export type { CategoryId, Product };
