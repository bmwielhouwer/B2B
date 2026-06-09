// Central place for site-wide constants. The canonical base URL is read from
// NEXT_PUBLIC_SITE_URL so it can be set per-environment in Vercel.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.aiautomationdirectory.com";

export const SITE_NAME = "AI Automation Agency Directory";

export const SITE_DESCRIPTION =
  "The curated B2B directory of agencies that help businesses implement AI and automation workflows — from marketing and sales automation to AI chatbots, data analytics, and process automation.";
