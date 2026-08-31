import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Clock } from "lucide-react";
import { STORE } from "@/data/products";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-lg font-extrabold text-foreground">{STORE.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{STORE.tagline}</p>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <Phone className="size-4 shrink-0 text-primary" /> {STORE.phone}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" /> {STORE.address}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-primary" /> {STORE.hours}
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm font-semibold text-muted-foreground">
          <Link to="/products" className="hover:text-primary">المنتجات</Link>
          <Link to="/cart" className="hover:text-primary">سلة المشتريات</Link>
          <Link to="/contact" className="hover:text-primary">تواصل معنا</Link>
        </nav>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {STORE.name} — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
