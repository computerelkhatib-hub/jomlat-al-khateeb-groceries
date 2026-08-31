import { useState } from "react";
import { toast } from "sonner";
import { LogOut, Plus, RotateCcw, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories, categoryLabel, type CategoryId } from "@/data/products";
import { formatPrice } from "@/lib/cart";
import { useStore } from "@/lib/store";
import fallbackImage from "@/assets/p-grains.jpg";

export function AdminDialog() {
  const {
    adminOpen,
    setAdminOpen,
    isAdmin,
    logout,
    catalog,
    addProduct,
    deleteProduct,
    setOffer,
    resetCatalog,
  } = useStore();

  if (!isAdmin) return null;

  return (
    <Dialog open={adminOpen} onOpenChange={setAdminOpen}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto" dir="rtl">
        <DialogHeader className="text-start">
          <DialogTitle className="text-xl font-extrabold">لوحة تحكم المسؤول</DialogTitle>
          <DialogDescription>
            إدارة منتجات المتجر والعروض — هذه اللوحة خاصة بصاحب المحل فقط.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="add" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="add" className="flex-1">
              إضافة منتج
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex-1">
              حذف المنتجات
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex-1">
              إدارة العروض
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <AddProductForm onAdd={addProduct} />
          </TabsContent>

          <TabsContent value="manage" className="space-y-2">
            {catalog.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-2"
              >
                <img src={p.image} alt={p.name} className="size-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {categoryLabel(p.category)} — {formatPrice(p.price)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-destructive"
                  onClick={() => {
                    deleteProduct(p.id);
                    toast.success("تم حذف المنتج");
                  }}
                >
                  <Trash2 className="size-4" /> حذف
                </Button>
              </div>
            ))}
            <Button variant="outline" className="mt-2 w-full rounded-xl" onClick={resetCatalog}>
              <RotateCcw className="size-4" /> استعادة القائمة الأصلية
            </Button>
          </TabsContent>

          <TabsContent value="offers" className="space-y-2">
            {catalog.map((p) => (
              <OfferRow
                key={p.id}
                name={p.name}
                price={p.price}
                oldPrice={p.oldPrice}
                onSave={(price, oldPrice) => {
                  setOffer(p.id, price, oldPrice);
                  toast.success("تم تحديث العرض");
                }}
              />
            ))}
          </TabsContent>
        </Tabs>

        <Button variant="outline" className="mt-4 w-full rounded-xl" onClick={logout}>
          <LogOut className="size-4" /> خروج من وضع الإدارة
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function AddProductForm({
  onAdd,
}: {
  onAdd: (p: {
    name: string;
    price: number;
    unit: string;
    category: CategoryId;
    image: string;
    isNew?: boolean;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("قطعة");
  const [category, setCategory] = useState<CategoryId>("dairy");
  const [image, setImage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = Number(price);
    if (name.trim().length < 2) return toast.error("اسم المنتج مطلوب");
    if (!Number.isFinite(p) || p <= 0) return toast.error("أدخل سعراً صحيحاً");
    onAdd({
      name: name.trim().slice(0, 80),
      price: p,
      unit: unit.trim() || "قطعة",
      category,
      image: image.trim() || fallbackImage,
      isNew: true,
    });
    toast.success("تمت إضافة المنتج");
    setName("");
    setPrice("");
    setImage("");
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor="p-name">اسم المنتج</Label>
        <Input id="p-name" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="p-price">السعر (ج.م)</Label>
          <Input
            id="p-price"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="p-unit">الوحدة</Label>
          <Input id="p-unit" value={unit} maxLength={20} onChange={(e) => setUnit(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="p-cat">القسم</Label>
        <select
          id="p-cat"
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryId)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="p-img">رابط صورة المنتج (اختياري)</Label>
        <Input
          id="p-img"
          dir="ltr"
          placeholder="https://..."
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>
      <Button type="submit" variant="brand" className="w-full">
        <Plus className="size-4" /> إضافة المنتج
      </Button>
    </form>
  );
}

function OfferRow({
  name,
  price,
  oldPrice,
  onSave,
}: {
  name: string;
  price: number;
  oldPrice?: number | undefined;
  onSave: (price: number, oldPrice?: number | undefined) => void;
}) {
  const [after, setAfter] = useState(String(price));
  const [before, setBefore] = useState(oldPrice ? String(oldPrice) : "");

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="mb-2 truncate font-bold text-foreground">{name}</p>
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-24 flex-1 space-y-1">
          <Label className="text-xs">السعر قبل الخصم</Label>
          <Input value={before} inputMode="decimal" onChange={(e) => setBefore(e.target.value)} />
        </div>
        <div className="min-w-24 flex-1 space-y-1">
          <Label className="text-xs">السعر بعد الخصم</Label>
          <Input value={after} inputMode="decimal" onChange={(e) => setAfter(e.target.value)} />
        </div>
        <Button
          variant="brand"
          onClick={() => {
            const a = Number(after);
            const b = before ? Number(before) : undefined;
            if (!Number.isFinite(a) || a <= 0) return toast.error("سعر غير صحيح");
            if (b !== undefined && (!Number.isFinite(b) || b <= a))
              return toast.error("السعر قبل الخصم يجب أن يكون أكبر");
            onSave(a, b);
          }}
        >
          حفظ
        </Button>
      </div>
    </div>
  );
}
