import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { agencies, getAgencyBySlug } from "@/lib/agencies";
import { getCategoryName } from "@/lib/categories";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import CategoryBadge from "@/components/CategoryBadge";

type Params = { params: Promise<{ slug: string }> };

// Statically generate a page for every agency in the seed data at build time.
export function generateStaticParams() {
  return agencies.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const agency = getAgencyBySlug(slug);
  if (!agency) return { title: "Agency not found" };

  const title = `${agency.name} — ${getCategoryName(agency.category)} Agency`;
  const description = `${agency.tagline} ${agency.name} is a ${getCategoryName(
    agency.category
  )} agency based in ${agency.location.city}, ${agency.location.country}.`;
  const canonical = `/agencies/${agency.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "profile",
      url: `${SITE_URL}${canonical}`,
      title,
      description,
      siteName: SITE_NAME,
    },
  };
}

export default async function AgencyProfilePage({ params }: Params) {
  const { slug } = await params;
  const agency = getAgencyBySlug(slug);
  if (!agency) notFound();

  const canonical = `${SITE_URL}/agencies/${agency.slug}`;

  // Schema.org LocalBusiness structured data for rich results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": canonical,
    name: agency.name,
    description: agency.description,
    url: agency.website,
    foundingDate: String(agency.founded),
    address: {
      "@type": "PostalAddress",
      addressLocality: agency.location.city,
      addressCountry: agency.location.country,
    },
    areaServed: agency.location.country,
    knowsAbout: agency.services,
    slogan: agency.tagline,
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-zinc-800">
          Directory
        </Link>{" "}
        <span className="px-1">/</span>{" "}
        <Link
          href={`/category/${agency.category}`}
          className="hover:text-zinc-800"
        >
          {getCategoryName(agency.category)}
        </Link>{" "}
        <span className="px-1">/</span>{" "}
        <span className="text-zinc-700">{agency.name}</span>
      </nav>

      <header className="flex flex-col gap-4 border-b border-zinc-200 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={agency.category} />
          {agency.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-amber-950">
              ★ Featured
            </span>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          {agency.name}
        </h1>
        <p className="text-lg text-zinc-600">{agency.tagline}</p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-zinc-900">About</h2>
          <p className="mt-2 leading-7 text-zinc-700">{agency.description}</p>

          <h2 className="mt-8 text-lg font-semibold text-zinc-900">Services</h2>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {agency.services.map((service) => (
              <li
                key={service}
                className="flex items-start gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700"
              >
                <span className="mt-0.5 text-indigo-600">✓</span>
                {service}
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar facts */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="font-medium text-zinc-500">Location</dt>
                <dd className="text-zinc-900">
                  {agency.location.city}, {agency.location.country}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500">Founded</dt>
                <dd className="text-zinc-900">{agency.founded}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500">Team size</dt>
                <dd className="text-zinc-900">{agency.teamSize} people</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500">Category</dt>
                <dd className="text-zinc-900">{getCategoryName(agency.category)}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500">Website</dt>
                <dd>
                  <a
                    href={agency.website}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Visit website →
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
            <p className="text-sm font-semibold text-indigo-900">Is this your agency?</p>
            <p className="mt-1 text-sm text-indigo-800">
              Claim this profile or update your details to keep your listing accurate.
            </p>
            <Link
              href="/submit"
              className="mt-3 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Claim or Update This Listing
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
