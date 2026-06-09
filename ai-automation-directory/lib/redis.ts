import Redis from "ioredis";

// Upstash Redis (or Vercel KV) connection. The connection string is read from
// KV_URL by name only. The client is created lazily and reused across calls.
let client: Redis | null = null;

export function getRedis(): Redis {
  const url = process.env.KV_URL;
  if (!url) {
    throw new Error("KV_URL is not configured");
  }
  if (!client) {
    // ioredis enables TLS automatically for rediss:// connection strings.
    client = new Redis(url, { maxRetriesPerRequest: 3, lazyConnect: false });
  }
  return client;
}

export const SUBMISSION_PREFIX = "submission:";

export type StoredSubmission = {
  name: string;
  email: string;
  agencyName: string;
  website: string;
  description: string;
  category: string;
  tier: string;
  amountTotal: number | null;
  createdAt: string;
};
