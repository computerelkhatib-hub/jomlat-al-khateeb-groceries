import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { categoryLabel, type Product } from "@/data/products";
import { formatPrice, useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 start-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              جديد
            </span>
          )}
          {product.oldPrice && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              عرض
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium text-muted-foreground">
          {categoryLabel(product.category)}
        </span>
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0">
            <p className="text-lg font-extrabold text-primary">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-muted-foreground">
              / {product.unit}
              {product.oldPrice && (
                <span className="ms-2 line-through">{formatPrice(product.oldPrice)}</span>
              )}
            </p>
          </div>
        </div>
        <Button
          variant="brand"
          className="mt-3 w-full"
          onClick={() => {
            add(product);
            toast.success(`تمت إضافة ${product.name} إلى السلة`);
          }}
        >
          <ShoppingCart className="size-4" />
          أضف إلى السلة
        </Button>
      </div>
    </article>
  );
}
