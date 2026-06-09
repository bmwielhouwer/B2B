import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            AI
          </span>
          <span className="hidden sm:inline">{SITE_NAME}</span>
          <span className="sm:hidden">AI Directory</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/#categories" className="text-zinc-600 hover:text-zinc-900">
            Categories
          </Link>
          <Link
            href="/submit"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-white transition hover:bg-indigo-700"
          >
            Submit Your Agency
          </Link>
        </nav>
      </div>
    </header>
  );
}
