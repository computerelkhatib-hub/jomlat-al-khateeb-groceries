import dairy from "@/assets/p-dairy.jpg";
import canned from "@/assets/p-canned.jpg";
import oil from "@/assets/p-oil.jpg";
import sweets from "@/assets/p-sweets.jpg";
import grains from "@/assets/p-grains.jpg";
import spices from "@/assets/p-spices.jpg";
import drinks from "@/assets/p-drinks.jpg";
import clean from "@/assets/p-clean.jpg";

export type CategoryId =
  | "dairy"
  | "canned"
  | "oils"
  | "sweets"
  | "grains"
  | "spices"
  | "drinks"
  | "cleaning";

export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: CategoryId;
  image: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  oldPrice?: number;
};

export const categories: { id: CategoryId; label: string }[] = [
  { id: "dairy", label: "ألبان وأجبان" },
  { id: "canned", label: "معلبات" },
  { id: "oils", label: "زيوت وسمن" },
  { id: "sweets", label: "حلويات" },
  { id: "grains", label: "أرز ومعكرونة" },
  { id: "spices", label: "بهارات" },
  { id: "drinks", label: "مشروبات" },
  { id: "cleaning", label: "منظفات" },
];

export const categoryLabel = (id: CategoryId) =>
  categories.find((c) => c.id === id)?.label ?? "";

export const products: Product[] = [
  { id: "1", name: "جبنة بيضاء بلدية", price: 45, unit: "كيلو", category: "dairy", image: dairy, isBestSeller: true, isNew: true },
  { id: "2", name: "لبن زبادي طبيعي", price: 12, unit: "علبة", category: "dairy", image: dairy },
  { id: "3", name: "جبنة رومي مستوردة", price: 130, unit: "كيلو", category: "dairy", oldPrice: 150 },
  { id: "4", name: "تونة قطع طبيعية", price: 38, unit: "علبة", category: "canned", image: canned, isBestSeller: true },
  { id: "5", name: "فول مدمس معلب", price: 15, unit: "علبة", category: "canned", image: canned, isNew: true },
  { id: "6", name: "ذرة حلوة معلبة", price: 22, unit: "علبة", category: "canned", image: canned },
  { id: "7", name: "زيت زيتون بكر ممتاز", price: 210, unit: "لتر", category: "oils", image: oil, isBestSeller: true, oldPrice: 240 },
  { id: "8", name: "زيت عباد الشمس", price: 68, unit: "لتر", category: "oils", image: oil },
  { id: "9", name: "تشكيلة شوكولاتة", price: 55, unit: "عبوة", category: "sweets", image: sweets, isNew: true },
  { id: "10", name: "بسكويت سادة فاخر", price: 25, unit: "عبوة", category: "sweets", image: sweets },
  { id: "11", name: "أرز مصري فاخر", price: 42, unit: "كيلو", category: "grains", image: grains, isBestSeller: true },
  { id: "12", name: "مكرونة إسباجتي", price: 18, unit: "عبوة", category: "grains", image: grains, isNew: true },
  { id: "13", name: "بهارات مشكلة", price: 30, unit: "عبوة", category: "spices", image: spices },
  { id: "14", name: "فلفل أحمر مطحون", price: 28, unit: "عبوة", category: "spices", image: spices, isNew: true },
  { id: "15", name: "عصير برتقال طبيعي", price: 24, unit: "زجاجة", category: "drinks", image: drinks, isBestSeller: true },
  { id: "16", name: "مشروبات غازية متنوعة", price: 12, unit: "علبة", category: "drinks", image: drinks },
  { id: "17", name: "منظف أرضيات معطر", price: 35, unit: "لتر", category: "cleaning", image: clean },
  { id: "18", name: "سائل غسيل الأطباق", price: 27, unit: "لتر", category: "cleaning", image: clean, isNew: true },
];

// fallback image for items without a dedicated photo
products.forEach((p) => {
  if (!p.image) p.image = dairy;
});

export const STORE = {
  name: "جملة الخطيب",
  tagline: "مواد غذائية وبقالة بأسعار الجملة",
  phone: "01000000000",
  whatsapp: "201000000000",
  address: "شارع السوق الرئيسي، المنصورة، الدقهلية",
  hours: "يومياً من 9 صباحاً حتى 11 مساءً",
};
