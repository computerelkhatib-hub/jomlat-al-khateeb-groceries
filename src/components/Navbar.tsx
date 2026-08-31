import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, Store } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { STORE } from "@/data/products";

const links = [
  { to: "/", label: "الرئيسية" },
  { to: "/products", label: "المنتجات" },
  { to: "/cart", label: "السلة" },
  { to: "/contact", label: "تواصل معنا" },
] as const;

export function Navbar() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/products", search: { q: q || undefined, cat: undefined } });
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:flex lg:gap-6">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Store className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-extrabold text-foreground">
              {STORE.name}
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {STORE.tagline}
            </span>
          </span>
        </Link>

        <form onSubmit={submit} className="order-3 col-span-2 w-full lg:order-none lg:flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ابحث عن منتج… مثل: أرز، زيت، جبنة"
              className="h-11 rounded-xl ps-9"
              aria-label="بحث عن المنتجات"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon" className="relative rounded-xl">
            <Link to="/cart" aria-label="سلة المشتريات">
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute -top-2 -end-2 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="القائمة"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-card px-4 py-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary"
              activeProps={{ className: "bg-secondary text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
