import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You — Submission Received",
  description: "Your payment was received. Your listing will be reviewed and added soon.",
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">
        ✓
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900">
        Payment received — thank you!
      </h1>
      <p className="mt-4 text-lg leading-8 text-zinc-600">
        We&apos;ve got your submission. Our team will review your details and your listing
        will be added to the directory within 48 hours. A confirmation email is on its way
        to your inbox.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Back to directory
        </Link>
        <Link
          href="/submit"
          className="rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
        >
          Submit another agency
        </Link>
      </div>
    </main>
  );
}
