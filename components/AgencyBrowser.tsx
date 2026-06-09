"use client";

import { useMemo, useState } from "react";
import type { Agency, Category } from "@/types";
import AgencyCard from "@/components/AgencyCard";

export default function AgencyBrowser({
  agencies,
  categories,
}: {
  agencies: Agency[];
  categories: Category[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agencies.filter((a) => {
      if (activeCategory && a.category !== activeCategory) return false;
      if (!q) return true;
      const categoryName =
        categories.find((c) => c.slug === a.category)?.name ?? a.category;
      return (
        a.name.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        categoryName.toLowerCase().includes(q)
      );
    });
  }, [agencies, categories, query, activeCategory]);

  return (
    <section id="directory" className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Search */}
      <div className="mx-auto max-w-2xl">
        <label htmlFor="agency-search" className="sr-only">
          Search agencies
        </label>
        <input
          id="agency-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, specialty, or category…"
          className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {/* Category filters */}
      <div id="categories" className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeCategory === null
              ? "bg-indigo-600 text-white"
              : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() =>
              setActiveCategory((prev) => (prev === c.slug ? null : c.slug))
            }
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === c.slug
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="mt-6 text-center text-sm text-zinc-500">
        Showing {filtered.length} of {agencies.length} agencies
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <AgencyCard key={a.id} agency={a} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-zinc-500">
          No agencies match your search. Try a different term or category.
        </div>
      )}
    </section>
  );
}
