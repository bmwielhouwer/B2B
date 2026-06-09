import Link from "next/link";
import type { Agency } from "@/types";
import CategoryBadge from "@/components/CategoryBadge";

// Reusable card used on the homepage and category pages. Featured agencies get a
// gold border and a "Featured" badge to stand out.
export default function AgencyCard({ agency }: { agency: Agency }) {
  return (
    <div
      className={`group relative flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
        agency.featured
          ? "border-amber-400 ring-1 ring-amber-300"
          : "border-zinc-200"
      }`}
    >
      {agency.featured && (
        <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-amber-950 shadow-sm">
          ★ Featured
        </span>
      )}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
          {agency.name}
        </h3>
      </div>
      <p className="mt-1 text-sm text-zinc-500">
        {agency.location.city}, {agency.location.country}
      </p>
      <p className="mt-3 flex-1 text-sm leading-6 text-zinc-700">{agency.tagline}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <CategoryBadge category={agency.category} />
        <Link
          href={`/agencies/${agency.slug}`}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          View Profile →
        </Link>
      </div>
    </div>
  );
}
