import type { Metadata } from "next";
import { getRedis, SUBMISSION_PREFIX, type StoredSubmission } from "@/lib/redis";

// Never cache — always read the latest submissions at request time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Submissions (Owner)",
  robots: { index: false, follow: false },
};

type LoadResult =
  | { ok: true; submissions: (StoredSubmission & { _key: string })[] }
  | { ok: false; error: string };

async function loadSubmissions(): Promise<LoadResult> {
  try {
    const redis = getRedis();
    const keys = await redis.keys(`${SUBMISSION_PREFIX}*`);
    if (keys.length === 0) return { ok: true, submissions: [] };

    const values = await redis.mget(keys);
    const submissions = keys
      .map((key, i) => {
        const raw = values[i];
        if (!raw) return null;
        try {
          return { ...(JSON.parse(raw) as StoredSubmission), _key: key };
        } catch {
          return null;
        }
      })
      .filter((s): s is StoredSubmission & { _key: string } => s !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return { ok: true, submissions };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to load submissions",
    };
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

export default async function AdminSubmissionsPage() {
  const result = await loadSubmissions();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Owner use only.</strong> This page is access-controlled by its obscure URL —
        don&apos;t share the link. It lists every paid submission received through Stripe.
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
        Paid submissions
      </h1>

      {!result.ok ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load submissions: {result.error}. Check that the <code>KV_URL</code>{" "}
          environment variable is set.
        </div>
      ) : result.submissions.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-500">
          No submissions yet. Paid submissions will appear here automatically once the
          Stripe webhook records a completed checkout.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-zinc-500">
            {result.submissions.length}{" "}
            {result.submissions.length === 1 ? "submission" : "submissions"}
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Agency</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Tier</th>
                  <th className="px-4 py-3 font-semibold">Website</th>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {result.submissions.map((s) => (
                  <tr key={s._key} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {s.agencyName || "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-700">{s.email || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          s.tier === "featured"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        {s.tier || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.website ? (
                        <a
                          href={s.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          {s.website}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{formatDate(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
