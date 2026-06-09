import { getCategoryName } from "@/lib/categories";

// Consistent per-category badge colors used on cards and profiles.
const CATEGORY_STYLES: Record<string, string> = {
  "marketing-automation": "bg-pink-50 text-pink-700 ring-pink-200",
  "sales-automation": "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "data-analytics": "bg-sky-50 text-sky-700 ring-sky-200",
  "workflow-automation": "bg-amber-50 text-amber-700 ring-amber-200",
  "ai-chatbots": "bg-violet-50 text-violet-700 ring-violet-200",
  "process-automation": "bg-teal-50 text-teal-700 ring-teal-200",
  "ai-consulting": "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

export default function CategoryBadge({ category }: { category: string }) {
  const style = CATEGORY_STYLES[category] ?? "bg-zinc-100 text-zinc-700 ring-zinc-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {getCategoryName(category)}
    </span>
  );
}
