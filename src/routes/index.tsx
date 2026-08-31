import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgePercent, Truck, ShieldCheck } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { categories, products, STORE } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "جملة الخطيب | مواد غذائية وبقالة بأسعار الجملة" },
      {
        name: "description",
        content:
          "تسوق مواد غذائية وبقالة من جملة الخطيب: أحدث المنتجات والأكثر مبيعاً بأسعار الجملة مع طلب سريع عبر واتساب.",
      },
      { property: "og:title", content: "جملة الخطيب | مواد غذائية وبقالة" },
      {
        property: "og:description",
        content: "عروض يومية على الألبان والمعلبات والزيوت والحلويات بأسعار الجملة.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const latest = products.filter((p) => p.isNew).slice(0, 8);
  const best = products.filter((p) => p.isBestSeller).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-brand-soft">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:py-16 lg:grid-cols-2">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-accent-foreground">
              <BadgePercent className="size-4" /> عروض الأسبوع حتى ٣٠٪
            </span>
            <h1 className="text-3xl font-extrabold leading-tight text-foreground sm:text-5xl">
              {STORE.name}
              <span className="mt-2 block text-primary">كل احتياجات بيتك بسعر الجملة</span>
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              ألبان وأجبان، معلبات، زيوت، أرز وبهارات وحلويات — منتجات طازجة وأسعار منافسة مع
              توصيل سريع لباب البيت.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/products">
                  تسوق الآن <ArrowLeft className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="rounded-xl">
                <Link to="/contact">تواصل معنا</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <img
              src={heroBanner}
              alt="تشكيلة من المواد الغذائية الطازجة في متجر جملة الخطيب"
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-3">
        {[
          { icon: Truck, title: "توصيل سريع", desc: "خلال ساعات داخل المدينة" },
          { icon: BadgePercent, title: "أسعار جملة", desc: "وفر أكثر مع الكميات" },
          { icon: ShieldCheck, title: "منتجات موثوقة", desc: "ماركات أصلية وصلاحية طويلة" },
        ].map((f) => (
          <div
            key={f.title}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-primary">
              <f.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-foreground">{f.title}</p>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <h2 className="mb-4 text-2xl font-extrabold text-foreground">تسوق حسب الفئة</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/products"
              search={{ cat: c.id, q: undefined }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground shadow-soft transition-colors hover:bg-brand-soft hover:text-primary"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <ProductRow title="أحدث المنتجات" items={latest} />
      <ProductRow title="الأكثر مبيعاً" items={best} />
    </div>
  );
}

function ProductRow({ title, items }: { title: string; items: typeof products }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold text-foreground">{title}</h2>
        <Link to="/products" className="text-sm font-bold text-primary hover:underline">
          عرض الكل
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
