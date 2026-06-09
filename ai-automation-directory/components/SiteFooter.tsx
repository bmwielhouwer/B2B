import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { SITE_NAME } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="text-lg font-semibold tracking-tight">{SITE_NAME}</p>
            <p className="mt-2 text-sm text-zinc-600">
              The curated B2B directory of agencies that help businesses implement AI and
              automation workflows.
            </p>
            <Link
              href="/submit"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Submit Your Agency →
            </Link>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Categories
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="text-sm text-zinc-600 hover:text-zinc-900"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
