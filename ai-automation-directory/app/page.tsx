import type { Metadata } from "next";
import Link from "next/link";
import { agenciesFeaturedFirst } from "@/lib/agencies";
import { CATEGORIES } from "@/lib/categories";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import AgencyBrowser from "@/components/AgencyBrowser";

export function generateMetadata(): Metadata {
  const title = `${SITE_NAME} — Find AI & Automation Agencies`;
  return {
    title,
    description: SITE_DESCRIPTION,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: SITE_DESCRIPTION,
      images: ["/og-image.png"],
    },
  };
}

export default function Home() {
  const featuredCount = agenciesFeaturedFirst.filter((a) => a.featured).length;

  return (
    <main className="pb-16">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="mb-3 inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
            {agenciesFeaturedFirst.length} vetted agencies · 7 specialties
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Find the right agency to implement{" "}
            <span className="text-indigo-600">AI &amp; automation</span> in your business
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
            A curated B2B directory of agencies that build marketing and sales automation,
            AI chatbots, data analytics, and end-to-end workflow and process automation.
            Browse by specialty, compare {featuredCount} featured partners, and connect
            directly.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="#directory"
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Browse the directory
            </Link>
            <Link
              href="/submit"
              className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
            >
              List your agency
            </Link>
          </div>
        </div>
      </section>

      {/* Directory browser (client-side search + filters) */}
      <div className="pt-12">
        <AgencyBrowser agencies={agenciesFeaturedFirst} categories={CATEGORIES} />
      </div>
    </main>
  );
}
