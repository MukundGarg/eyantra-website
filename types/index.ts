export interface TeamMember {
  id: string;
  name: string;
  category: string;
  department: string | null;
  role: string | null;
  designation: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  email: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category: string | null;
  tech_stack: string[] | null;
  cover_image: string | null;
  github_url: string | null;
  demo_url: string | null;
  year: number;
  status: string | null;
  featured: boolean;
  display_order: number;
  published: boolean;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  event_type: string | null;
  short_description: string | null;
  description: string | null;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  cover_image: string | null;
  registration_url: string | null;
  status: string | null;
  featured: boolean;
  display_order: number;
  published: boolean;
  created_at: string;
}
