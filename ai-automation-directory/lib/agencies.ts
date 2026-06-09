import agenciesData from "@/data/agencies.json";
import type { Agency } from "@/types";

// Single source of truth for the agency list. To add or edit a listing, edit
// data/agencies.json and redeploy — no code changes required.
export const agencies = agenciesData as Agency[];

// Featured agencies surface first throughout the directory.
export const agenciesFeaturedFirst: Agency[] = [...agencies].sort(
  (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)
);

export function getAgencyBySlug(slug: string): Agency | undefined {
  return agencies.find((a) => a.slug === slug);
}

export function getAgenciesByCategory(categorySlug: string): Agency[] {
  return agenciesFeaturedFirst.filter((a) => a.category === categorySlug);
}
