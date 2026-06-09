"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";

type Tier = "standard" | "featured";

const TIERS: {
  id: Tier;
  name: string;
  price: string;
  blurb: string;
  perks: string[];
  highlight: boolean;
}[] = [
  {
    id: "standard",
    name: "Standard Listing",
    price: "$49",
    blurb: "One-time payment",
    perks: [
      "Permanent profile page",
      "Listed in your category",
      "Schema.org rich-result markup",
      "Reviewed and live within 48 hours",
    ],
    highlight: false,
  },
  {
    id: "featured",
    name: "Featured Listing",
    price: "$99",
    blurb: "One-time payment",
    perks: [
      "Everything in Standard",
      "Gold border + Featured badge",
      "Surfaced first on the homepage",
      "Priority placement in your category",
    ],
    highlight: true,
  },
];

export default function SubmitForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    agencyName: "",
    website: "",
    category: CATEGORIES[0].slug,
    description: "",
  });
  const [loadingTier, setLoadingTier] = useState<Tier | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function checkout(tier: Tier) {
    setError(null);
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tier }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout. Please try again.");
      }
      window.location.assign(data.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoadingTier(null);
    }
  }

  return (
    <div className="space-y-10">
      {/* Details form */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Your agency details</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Tell us about your agency. These details are attached to your payment and used to
          build your listing.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Your name"
            value={form.name}
            onChange={(v) => update("name", v)}
            placeholder="Jane Doe"
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => update("email", v)}
            placeholder="jane@agency.com"
          />
          <Field
            label="Agency name"
            value={form.agencyName}
            onChange={(v) => update("agencyName", v)}
            placeholder="Acme Automation"
          />
          <Field
            label="Website"
            value={form.website}
            onChange={(v) => update("website", v)}
            placeholder="https://www.youragency.com"
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700">Category</label>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-sm font-medium text-zinc-700">Short description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="What does your agency do, and who do you help?"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`flex flex-col rounded-2xl border p-6 shadow-sm ${
              tier.highlight
                ? "border-amber-400 ring-1 ring-amber-300"
                : "border-zinc-200"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold text-zinc-900">{tier.name}</h3>
              {tier.highlight && (
                <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-amber-950">
                  ★ Best value
                </span>
              )}
            </div>
            <p className="mt-2">
              <span className="text-3xl font-bold text-zinc-900">{tier.price}</span>{" "}
              <span className="text-sm text-zinc-500">{tier.blurb}</span>
            </p>
            <ul className="mt-4 flex-1 space-y-2 text-sm text-zinc-700">
              {tier.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2">
                  <span className="mt-0.5 text-indigo-600">✓</span>
                  {perk}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => checkout(tier.id)}
              disabled={loadingTier !== null}
              className={`mt-6 rounded-lg px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${
                tier.highlight
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loadingTier === tier.id
                ? "Redirecting to checkout…"
                : `Get ${tier.name} — ${tier.price}`}
            </button>
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-zinc-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
    </div>
  );
}
