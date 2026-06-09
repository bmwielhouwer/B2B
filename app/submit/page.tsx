import type { Metadata } from "next";
import SubmitForm from "@/components/SubmitForm";

export const metadata: Metadata = {
  title: "Submit Your Agency — Get Listed",
  description:
    "List your AI and automation agency in the directory. Choose a Standard ($49) or Featured ($99) one-time listing and reach businesses looking for help.",
  alternates: { canonical: "/submit" },
};

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Get your agency in front of buyers
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600">
          List your agency in the directory businesses use to find AI and automation
          partners. Pick a tier, pay once, and your profile is reviewed and live within 48
          hours. No subscriptions, no commissions.
        </p>
      </header>

      <div className="mt-10">
        <SubmitForm />
      </div>

      <p className="mt-8 text-center text-xs text-zinc-500">
        Payments are processed securely by Stripe. You&apos;ll receive a confirmation email
        once your payment is complete.
      </p>
    </main>
  );
}
