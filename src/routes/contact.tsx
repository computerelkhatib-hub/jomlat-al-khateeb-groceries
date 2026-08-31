import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORE } from "@/data/products";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "تواصل معنا | جملة الخطيب" },
      {
        name: "description",
        content:
          "بيانات التواصل مع متجر جملة الخطيب: رقم الهاتف، العنوان، مواعيد العمل، والطلب المباشر عبر واتساب.",
      },
      { property: "og:title", content: "تواصل معنا | جملة الخطيب" },
      {
        property: "og:description",
        content: "اتصل بنا أو أرسل طلبك عبر واتساب مباشرة إلى متجر جملة الخطيب.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const items = [
    { icon: Phone, title: "رقم الهاتف", value: STORE.phone, href: `tel:${STORE.phone}` },
    { icon: MapPin, title: "العنوان", value: STORE.address },
    { icon: Clock, title: "مواعيد العمل", value: STORE.hours },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-foreground">تواصل معنا</h1>
      <p className="mt-2 text-muted-foreground">
        نسعد بخدمتك — يمكنك الاتصال بنا أو إرسال طلبك مباشرة عبر واتساب.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((i) => (
          <div
            key={i.title}
            className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-primary">
              <i.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-foreground">{i.title}</p>
              {i.href ? (
                <a href={i.href} dir="ltr" className="text-sm text-primary hover:underline">
                  {i.value}
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">{i.value}</p>
              )}
            </div>
          </div>
        ))}

        <div className="flex flex-col justify-center gap-3 rounded-2xl border border-border bg-brand-soft p-5">
          <p className="font-bold text-foreground">اطلب عبر واتساب</p>
          <p className="text-sm text-muted-foreground">
            أرسل لنا قائمة طلبك وسنقوم بتجهيزها فوراً.
          </p>
          <Button asChild variant="whatsapp" size="lg">
            <a
              href={`https://wa.me/${STORE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" /> محادثة واتساب
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
