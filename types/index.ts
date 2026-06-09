export interface Agency {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  services: string[];
  location: {
    city: string;
    country: string;
  };
  website: string;
  founded: number;
  teamSize: string;
  featured: boolean;
}

export interface Category {
  slug: string;
  name: string;
}

export interface Submission {
  name: string;
  email: string;
  agencyName: string;
  website: string;
  description: string;
  category: string;
  tier: "standard" | "featured";
  createdAt: string;
}
