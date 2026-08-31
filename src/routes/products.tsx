import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ProductCard";
import { categories, products, type CategoryId } from "@/data/products";

type ProductSearch = { q?: string; cat?: CategoryId };

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): ProductSearch => ({
    q: typeof search.q === "string" && search.q ? search.q : undefined,
    cat: categories.some((c) => c.id === search.cat)
      ? (search.cat as CategoryId)
      : undefined,
  }),
  head: () => ({
    meta: [
      { title: "المنتجات | جملة الخطيب" },
      {
        name: "description",
        content:
          "تصفح جميع منتجات جملة الخطيب مع تصفية حسب الفئة وبحث فوري: ألبان، معلبات، زيوت، حلويات، أرز، بهارات ومنظفات.",
      },
      { property: "og:title", content: "المنتجات | جملة الخطيب" },
      {
        property: "og:description",
        content: "كل منتجات البقالة والمواد الغذائية بأسعار الجملة في مكان واحد.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q, cat } = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });

  const setSearch = (next: Partial<ProductSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...next }) });

  const term = (q ?? "").trim();
  const filtered = products.filter(
    (p) => (!cat || p.category === cat) && (!term || p.name.includes(term)),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground">منتجاتنا</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} منتج متاح الآن
        </p>
      </header>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
        <Input
          value={q ?? ""}
          onChange={(e) => setSearch({ q: e.target.value || undefined })}
          placeholder="ابحث باسم المنتج…"
          aria-label="بحث فوري عن المنتجات"
          className="h-12 rounded-xl ps-9"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip active={!cat} onClick={() => setSearch({ cat: undefined })}>
          كل الفئات
        </FilterChip>
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            active={cat === c.id}
            onClick={() => setSearch({ cat: c.id })}
          >
            {c.label}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-lg font-bold text-foreground">لا توجد منتجات مطابقة</p>
          <p className="mt-1 text-sm text-muted-foreground">جرّب كلمة بحث أخرى أو فئة مختلفة.</p>
          <Button
            variant="outline"
            className="mt-4 rounded-xl"
            onClick={() => setSearch({ q: undefined, cat: undefined })}
          >
            <X className="size-4" /> مسح التصفية
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-brand-soft hover:text-primary")
      }
    >
      {children}
    </button>
  );
}
