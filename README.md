# 🤖 e-Yantra MSIT — Official Website

> **Think. Build. Innovate.**
> The official digital presence of the **e-Yantra Robotics Lab & Engineering Community** at Maharaja Surajmal Institute of Technology (MSIT), affiliated with GGSIPU, New Delhi.

Production Website: [https://eyantra-website-wine.vercel.app/](https://eyantra-website-wine.vercel.app/)

---

## 📖 Overview

The e-Yantra MSIT website showcases the society's robotics projects, research domains, upcoming and past workshops/hackathons, core engineering team, and an interactive AI guide named **Bunty**. It includes an administrative content management system powered by Supabase for dynamic project, event, and member updates.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
- **Language:** TypeScript 5
- **UI & Styling:** React 19, Tailwind CSS 4, CSS variables & design tokens
- **3D Graphics & Animations:** [Three.js](https://threejs.org/) for interactive lab visuals, custom canvas animations, and CSS keyframe telemetry
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth, Storage buckets)
- **Icons:** [Iconify](https://iconify.design/)
- **AI Assistant:** Bunty AI (Gemini Flash Lite backend proxy)
- **Hosting & Deployment:** [Vercel](https://vercel.com/)

---

## 📂 Repository Structure

```
eyantra-website/
├── app/                        # Next.js App Router routes
│   ├── admin/                  # Protected CMS (events, projects, team, login)
│   ├── api/bunty/chat/         # Secure Bunty AI proxy route handler
│   ├── bunty/                  # Interactive Bunty AI chat experience page
│   ├── events/                 # Events & workshops showcase page
│   ├── projects/               # Robotics & engineering projects showcase page
│   ├── team/                   # Society mentors, leads & core team page
│   ├── globals.css             # Design tokens, typography, and aesthetic utilities
│   ├── layout.tsx              # Root HTML layout with providers and fonts
│   └── page.tsx                # Homepage featuring interactive 3D Lab and telemetry
├── components/                 # Reusable UI & Feature components
│   ├── bunty/                  # Bunty visual avatar, chat panel & experience
│   ├── AdminImageUpload.tsx    # Secure Supabase storage image uploader
│   ├── AnimationProvider.tsx   # Global scroll and viewport animation observer
│   ├── CircuitFlow.tsx         # Interactive signal pipeline motherboard module
│   ├── DomainsSection.tsx      # Engineering domains showcase
│   ├── EngineeringLab3D.tsx    # Interactive Three.js 3D workbench canvas
│   ├── EngineeringLabHero.tsx  # Hero banner combining telemetry and 3D lab
│   ├── EventCard.tsx           # Event display card
│   ├── EventShowcaseSection.tsx# Homepage events carousel
│   ├── EventsList.tsx          # Filterable event directory
│   ├── FeaturedProjectsSection.tsx # Homepage projects showcase
│   ├── Footer.tsx              # Global footer with social links and branding
│   ├── Iconify.tsx             # Universal SVG icon component
│   ├── IntroSection.tsx        # Society philosophy and circuit flow section
│   ├── Navbar.tsx              # Responsive navigation with dark mode toggle
│   ├── ProjectCard.tsx         # Project showcase card
│   ├── ProjectsList.tsx        # Filterable project portfolio
│   ├── SectionHeading.tsx      # Consistent section titles and badges
│   ├── TeamMemberCard.tsx      # Team profile card with social handles
│   └── ThemeProvider.tsx       # Dark/light theme state provider
├── data/                       # Fallback datasets and filter configurations
│   ├── events.ts               # Local event seeds & filter categories
│   └── projects.ts             # Local project seeds & filter categories
├── public/                     # Static assets (favicons, images, logos)
├── supabase/                   # Database schemas, migrations & RLS policies
│   ├── admin_allowlist.sql     # Admin RBAC allowlist functions
│   ├── admin_rls.sql           # Row Level Security policies
│   ├── schema.sql              # Core tables (events, projects, team_members)
│   └── seed.sql                # Initial seed data
├── utils/                      # Helper libraries & client wrappers
│   ├── supabase/               # Supabase SSR & session middleware
│   ├── buntyApi.ts             # Frontend client for Bunty chat
│   ├── storage.ts              # Supabase storage upload/deletion helpers
│   ├── supabase.ts             # Supabase client singleton
│   └── validation.ts           # URL and input validators
└── proxy.ts                    # Next.js route proxy / session update hook
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Bunty AI Backend (Server-Side Only)
BUNTY_API_KEY="your-bunty-api-key"
```

> **Security Note:** `BUNTY_API_KEY` is loaded exclusively by the server-side route handler in `app/api/bunty/chat/route.ts`. Never prefix it with `NEXT_PUBLIC_`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v20.x or v22.x LTS (Recommended: Node 22 via `nvm use 22`)
- **Package Manager:** `npm` (included with Node.js)

### Installation

```bash
git clone https://github.com/MukundGarg/eyantra-website.git
cd eyantra-website
npm install
```

### Running Locally

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 🔒 Admin & Supabase Configuration

1. **Database Setup:**
   Run the SQL scripts in `supabase/` via the Supabase SQL Editor:
   - `supabase/schema.sql` (Creates `projects`, `events`, `team_members` tables)
   - `supabase/admin_allowlist.sql` (Sets up admin allowlist and authorization)
   - `supabase/admin_rls.sql` (Applies security policies)
   - `supabase/seed.sql` (Optional default data)

2. **Storage Buckets:**
   Create three public buckets in Supabase Storage:
   - `projects`
   - `events`
   - `team`

3. **Admin Dashboard Access:**
   Navigate to `/admin/login` to authenticate. Only users present in the `admin_users` table will be granted access to modify projects, events, and team members.

---

## 🤖 Bunty AI Integration

Bunty is an interactive AI companion trained to guide visitors through e-Yantra projects, domains, and society activities.
- **Client component:** `components/bunty/BuntyChatPanel.tsx` communicates with `/api/bunty/chat`.
- **Server proxy:** `app/api/bunty/chat/route.ts` validates incoming payloads (max 4000 characters, rate limited to 15 req/min per IP) and securely forwards requests to the external Bunty API using `BUNTY_API_KEY`.

---

## 🧪 Quality & Verification Scripts

```bash
# Type-check TypeScript files without emitting output
npx tsc --noEmit

# Lint code with ESLint
npm run lint

# Create production build
npm run build

# Start production server locally
npm run start
```

---

## 🤝 Contribution Guidelines

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Follow Next.js App Router conventions and maintain dark/light theme consistency.
3. Verify that `npx tsc --noEmit` and `npm run lint` pass without errors before committing.
4. Submit a Pull Request describing your changes and test verification steps.
