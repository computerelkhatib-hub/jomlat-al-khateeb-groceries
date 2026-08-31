import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { STORE } from "@/data/products";
import { formatPrice, useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "سلة المشتريات وإتمام الطلب | جملة الخطيب" },
      {
        name: "description",
        content:
          "راجع منتجات سلتك، عدّل الكميات، واحسب الإجمالي ثم أتمم طلبك من جملة الخطيب عبر واتساب.",
      },
      { property: "og:title", content: "سلة المشتريات | جملة الخطيب" },
      {
        property: "og:description",
        content: "إتمام الطلب بسهولة مع إرسال التفاصيل مباشرة إلى المتجر عبر واتساب.",
      },
    ],
  }),
  component: CartPage,
});

const orderSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب").max(60, "الاسم طويل جداً"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{8,15}$/, "رقم هاتف غير صحيح"),
  address: z.string().trim().min(6, "العنوان مطلوب").max(200, "العنوان طويل جداً"),
  notes: z.string().trim().max(300, "الملاحظات طويلة جداً").optional(),
});

const DELIVERY = 25;

function CartPage() {
  const { items, setQty, remove, total, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const grand = items.length ? total + DELIVERY : 0;

  const buildMessage = () => {
    const lines = items.map(
      (i) => `• ${i.product.name} × ${i.qty} = ${formatPrice(i.qty * i.product.price)}`,
    );
    return [
      `طلب جديد من موقع ${STORE.name}`,
      "",
      ...lines,
      "",
      `الإجمالي: ${formatPrice(total)}`,
      `التوصيل: ${formatPrice(DELIVERY)}`,
      `المجموع الكلي: ${formatPrice(grand)}`,
      "",
      `الاسم: ${form.name}`,
      `الهاتف: ${form.phone}`,
      `العنوان: ${form.address}`,
      form.notes ? `ملاحظات: ${form.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) {
      toast.error("السلة فارغة");
      return;
    }
    const parsed = orderSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(buildMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("تم تجهيز طلبك وإرساله عبر واتساب");
    clear();
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-brand-soft text-primary">
          <ShoppingBag className="size-7" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-foreground">سلتك فارغة</h1>
        <p className="mt-2 text-muted-foreground">ابدأ التسوق وأضف منتجاتك المفضلة إلى السلة.</p>
        <Button asChild variant="hero" size="xl" className="mt-6">
          <Link to="/products">تصفح المنتجات</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-foreground">سلة المشتريات</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Items */}
        <div className="space-y-3">
          {items.map(({ product, qty }) => (
            <div
              key={product.id}
              className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-2xl border border-border bg-card p-3 shadow-soft sm:flex"
            >
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                width={800}
                height={800}
                className="size-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-bold text-foreground">{product.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(product.price)} / {product.unit}
                </p>
              </div>
              <div className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1">
                <div className="flex items-center gap-1 rounded-xl border border-border p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg"
                    aria-label="إنقاص الكمية"
                    onClick={() => setQty(product.id, qty - 1)}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="w-8 text-center font-bold">{qty}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg"
                    aria-label="زيادة الكمية"
                    onClick={() => setQty(product.id, qty + 1)}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
                <span className="font-extrabold text-primary">
                  {formatPrice(qty * product.price)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-lg text-destructive"
                  aria-label="حذف المنتج"
                  onClick={() => remove(product.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="rounded-xl" onClick={clear}>
            <Trash2 className="size-4" /> إفراغ السلة
          </Button>
        </div>

        {/* Checkout */}
        <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-24">
          <h2 className="text-lg font-extrabold text-foreground">إتمام الطلب</h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">إجمالي المنتجات</dt>
              <dd className="font-bold">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">رسوم التوصيل</dt>
              <dd className="font-bold">{formatPrice(DELIVERY)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base">
              <dt className="font-bold">المجموع الكلي</dt>
              <dd className="font-extrabold text-primary">{formatPrice(grand)}</dd>
            </div>
          </dl>

          <form onSubmit={submit} className="mt-5 space-y-3" noValidate>
            <Field id="name" label="الاسم بالكامل" error={errors.name}>
              <Input
                id="name"
                value={form.name}
                maxLength={60}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="مثال: محمد الخطيب"
              />
            </Field>
            <Field id="phone" label="رقم الهاتف" error={errors.phone}>
              <Input
                id="phone"
                dir="ltr"
                inputMode="tel"
                maxLength={15}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="01xxxxxxxxx"
              />
            </Field>
            <Field id="address" label="العنوان" error={errors.address}>
              <Textarea
                id="address"
                rows={2}
                maxLength={200}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="الحي، الشارع، رقم المبنى"
              />
            </Field>
            <Field id="notes" label="ملاحظات (اختياري)" error={errors.notes}>
              <Textarea
                id="notes"
                rows={2}
                maxLength={300}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="أي تفاصيل إضافية عن الطلب"
              />
            </Field>

            <Button type="submit" variant="whatsapp" size="xl" className="w-full">
              <MessageCircle className="size-4" /> اطلب عبر الواتساب
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              سيتم فتح واتساب بتفاصيل طلبك جاهزة للإرسال إلى المتجر.
            </p>
          </form>
        </aside>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}
