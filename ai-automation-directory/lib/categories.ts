import type { Category } from "@/types";

// The seven fixed categories used across the directory. Order here is the order
// shown in filter buttons and on category pages.
export const CATEGORIES: Category[] = [
  { slug: "marketing-automation", name: "Marketing Automation" },
  { slug: "sales-automation", name: "Sales Automation" },
  { slug: "data-analytics", name: "Data Analytics" },
  { slug: "workflow-automation", name: "Workflow Automation" },
  { slug: "ai-chatbots", name: "AI Chatbots" },
  { slug: "process-automation", name: "Process Automation" },
  { slug: "ai-consulting", name: "AI Consulting" },
];

// SEO-oriented descriptions shown at the top of each category landing page.
export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "marketing-automation":
    "Marketing automation agencies build the systems that turn raw audiences into pipeline. These teams design lifecycle email programs, lead scoring, campaign orchestration, and end-to-end nurture flows so your marketing runs as one connected machine — generating and qualifying demand around the clock without adding headcount.",
  "sales-automation":
    "Sales automation agencies hand selling time back to your reps. They automate outbound sequences, lead routing, CRM hygiene, follow-up, and proposal workflows so every deal keeps moving and no opportunity slips through the cracks. The result is a faster, more predictable pipeline driven by repeatable, automated sales motions.",
  "data-analytics":
    "Data analytics agencies turn fragmented, messy data into decisions you can trust. From data warehouse design and ETL pipelines to business intelligence dashboards and predictive models, these teams build the analytics infrastructure that lets every stakeholder act on reliable, decision-ready numbers.",
  "workflow-automation":
    "Workflow automation agencies connect your software stack so work flows without friction. They map your processes, then eliminate the manual handoffs, copy-paste, and approvals that slow teams down — using no-code platforms and custom integrations to give back hours every week and reduce costly human error.",
  "ai-chatbots":
    "AI chatbot agencies build conversational assistants that actually resolve customer questions instead of deflecting them. Grounded in your own knowledge base, these multilingual, always-on assistants handle support, sales, and onboarding across every channel — with clear guardrails and seamless handoff to human agents when it matters.",
  "process-automation":
    "Process automation agencies retire the tedious, high-volume back-office work nobody enjoys. Using robotic process automation (RPA) and custom software, they automate finance, HR, and operations workflows end to end — cutting cost, slashing error rates, and dramatically speeding up turnaround on your most repetitive processes.",
  "ai-consulting":
    "AI consulting agencies turn AI ambition into shipped, value-generating products. They help leadership identify the highest-impact use cases, prototype quickly, deploy responsibly, and build the MLOps and governance foundations to scale — cutting through the hype to deliver measurable returns.",
};

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategory(slug)?.name ?? slug;
}
