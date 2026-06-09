import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgenciesByCategory } from "@/lib/agencies";
import {
  CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  getCategory,
} from "@/lib/categories";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import AgencyCard from "@/components/AgencyCard";

type Params = { params: Promise<{ slug: string }> };

// Statically generate a page for all 7 categories.
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Category not found" };

  const count = getAgenciesByCategory(slug).length;
  const title = `${category.name} Agencies — Top ${count} Firms`;
  const description =
    CATEGORY_DESCRIPTIONS[slug] ??
    `Browse ${count} ${category.name} agencies in the directory.`;
  const canonical = `/category/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${canonical}`,
      title,
      description,
      siteName: SITE_NAME,
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const list = getAgenciesByCategory(slug);
  const description = CATEGORY_DESCRIPTIONS[slug];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-800">
          Directory
        </Link>{" "}
        <span className="px-1">/</span>{" "}
        <span className="text-zinc-700">{category.name}</span>
      </nav>

      <header className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          {category.name} Agencies
        </h1>
        <p className="mt-4 leading-7 text-zinc-600">{description}</p>
        <p className="mt-4 text-sm font-medium text-zinc-500">
          {list.length} {list.length === 1 ? "agency" : "agencies"} listed
        </p>
      </header>

      {/* Other categories */}
      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              c.slug === slug
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <AgencyCard key={a.id} agency={a} />
        ))}
      </div>
    </main>
  );
}
