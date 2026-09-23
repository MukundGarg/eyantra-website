-- Create team_members table
CREATE TABLE team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text,
  category text, -- e.g., 'mentors', 'core', 'departments'
  department text, -- e.g., 'technical', 'management'
  image_url text,
  linkedin_url text,
  github_url text,
  display_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create projects table
CREATE TABLE projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE,
  short_description text,
  description text,
  category text,
  tech_stack text[],
  cover_image text,
  github_url text,
  demo_url text,
  year integer,
  status text,
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create events table
CREATE TABLE events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE,
  event_type text, -- e.g., 'Workshops', 'Competitions'
  short_description text,
  description text,
  event_date date,
  event_time text,
  location text,
  cover_image text,
  registration_url text, -- external link only
  status text,
  featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public users can view active team members"
  ON team_members FOR SELECT
  USING (active = true);

CREATE POLICY "Public users can view published projects"
  ON projects FOR SELECT
  USING (published = true);

CREATE POLICY "Public users can view published events"
  ON events FOR SELECT
  USING (published = true);
