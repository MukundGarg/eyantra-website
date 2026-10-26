<p align="center">
  <img src="public/images/eyantra-logo.png" width="120" alt="e-Yantra MSIT logo" />
</p>

<h1 align="center">e-Yantra MSIT</h1>

<p align="center"><strong>Think. Build. Innovate.</strong></p>
<p align="center">An interactive home for the robotics and engineering community at Maharaja Surajmal Institute of Technology.</p>

<p align="center">
  <a href="https://eyantra-website-wine.vercel.app/"><strong>Explore the website</strong></a>
  &nbsp;·&nbsp;
  <a href="https://eyantra-website-wine.vercel.app/bunty">Meet Bunty</a>
  &nbsp;·&nbsp;
  <a href="#explore-the-experience">The experience</a>
  &nbsp;·&nbsp;
  <a href="#how-it-works">Architecture</a>
  &nbsp;·&nbsp;
  <a href="#run-locally">Get started</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-111214?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-111214?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vercel-Deployment-111214?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## Why this website?

Engineering communities are built through projects, workshops, experiments, and the people behind them. The e-Yantra MSIT website brings those activities into one place: visitors can discover the society's technical domains, explore showcased work, find events, meet the team, and ask Bunty for guidance.

The experience is designed to feel like a small engineering lab rather than a static noticeboard. Interactive Three.js visuals, circuit-inspired components, responsive layouts, and a shared light/dark color system bring the society's identity into the interface. Behind the scenes, an authenticated content-management area lets authorized admins maintain the content.

## Explore the experience

<details open>
<summary><strong>Visitors · Discover the community</strong></summary>

The homepage introduces the community through an interactive engineering-lab scene and technical-domain sections. Dedicated pages surface projects, events, and team information without requiring visitors to navigate an admin system.

| Destination | What you can explore |
| --- | --- |
| [Home](https://eyantra-website-wine.vercel.app/) | Interactive lab, technical domains, featured projects, and community highlights |
| [Projects](https://eyantra-website-wine.vercel.app/projects) | Project showcase and category-based browsing |
| [Events](https://eyantra-website-wine.vercel.app/events) | Workshops, competitions, and past or upcoming activities |
| [Team](https://eyantra-website-wine.vercel.app/team) | The people behind the community |
| [Bunty](https://eyantra-website-wine.vercel.app/bunty) | Conversational help through the society's AI assistant |

The interface supports both light and dark themes, with a consistent navigation bar across public pages.

</details>

<details>
<summary><strong>Bunty · Ask, learn, and explore</strong></summary>

Bunty is a separate AI service integrated into the website through a server-side Next.js API route. Visitors send questions in the interactive chat interface; the website validates the request, forwards it to Bunty's external API, and renders the returned reply.

The page includes an animated character, a thinking state, chat history for the current page session, and responsive message controls. The current proxy sends individual prompts; it does not send the full conversation history to the external service.

**Integration boundary:** The website owns the UI and secure request proxy. The upstream Bunty service owns the model and generated responses.

</details>

<details>
<summary><strong>Admins · Maintain the website</strong></summary>

An authenticated administration area supports management of content for projects, events, and team members. The app uses Supabase for database records, authentication, and uploaded media, with database authorization and row-level security configuration maintained under `supabase/`.

The admin interface is accessed at `/admin/login`. Admin access requires the appropriate Supabase account and authorization configuration; it is not a public editing interface.

</details>

## How it works

```mermaid
flowchart LR
    A[Visitor] --> B[Next.js website]
    B --> C[Projects / Events / Team]
    C --> D[(Supabase)]
    A --> E[Bunty chat]
    E --> F[Next.js API proxy]
    F --> G[External Bunty API]
    H[Authorized admin] --> I[Admin dashboard]
    I --> D
```

The public-facing pages and admin tools share the same Next.js application. Data-oriented content is backed by Supabase; the AI chat follows a separate request path so the Bunty API credential stays on the server rather than being shipped to browsers.

<details>
<summary><strong>Inside a Bunty request</strong></summary>

1. The visitor submits a prompt through the Bunty chat component.
2. The frontend posts `{ "prompt": "..." }` to `/api/bunty/chat`.
3. The server route checks the request shape and length, applies a per-instance rate limit, and reads `BUNTY_API_KEY` from the server environment.
4. The route forwards the prompt to the external Bunty API and handles upstream errors and timeouts.
5. The frontend displays the returned reply or an error message.

The application-side rate limiter is in memory; it is not a globally coordinated distributed rate limit.

</details>

## Design and interaction

The visual system uses warm white and graphite surfaces, with the e-Yantra red accent and corresponding dark-mode colors. The site combines animated circuit motifs and a 3D lab with simpler content views so visitors can browse the content without the visuals getting in the way.

| Area | Implementation |
| --- | --- |
| Interactive lab | Three.js with React-driven scene integration |
| Design system | Tailwind CSS 4, shared CSS variables, light/dark themes |
| Motion | CSS animations and custom React interactions |
| Chat character | State-aware Bunty visual and message interface |
| Responsive UI | Shared navigation and adaptable page layouts |

## Technology and data

| Layer | Stack |
| --- | --- |
| Application | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4, custom CSS tokens |
| 3D rendering | Three.js |
| Data, authentication, storage | Supabase (PostgreSQL, Auth, Storage) |
| AI integration | Server-side proxy to the external Bunty API |
| Hosting | Vercel |
| Quality checks | ESLint, TypeScript, Next.js production build |

## Run locally

### Requirements

Use a Node.js version compatible with the project's installed Next.js version. Node.js 22 LTS has been used successfully for local development.

```bash
# Clone the repository
git clone https://github.com/MukundGarg/eyantra-website.git
cd eyantra-website

# Install dependencies
npm install
```

Create `.env.local` in the repository root:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-or-anon-key
BUNTY_API_KEY=your-server-side-bunty-api-key
```

Do not commit `.env.local`. The Bunty API key must not have a `NEXT_PUBLIC_` prefix. API credentials used in earlier handoff materials should be rotated if exposed.

```bash
# Start the development server
npm run dev

# Check code quality
npm run lint
npx tsc --noEmit

# Create and run a production build
npm run build
npm run start
```

The local site is served at [http://localhost:3000](http://localhost:3000) by default.

### Supabase setup

The `supabase/` directory contains the schema, admin-authorization, row-level security, and seed SQL used by the project. Configure the database and storage policies for your own Supabase project before using the CMS.

Expected media bucket names referenced by the application are `team`, `projects`, and `events`. Admin access must be configured intentionally; never expose elevated Supabase service credentials in client code.

## Explore the codebase

<details>
<summary><strong>Repository map</strong></summary>

```text
app/
  page.tsx                 Homepage
  bunty/                   Bunty AI page
  events/                  Events page
  projects/                Projects page
  team/                    Team page
  admin/                   Authenticated content management
  api/bunty/chat/          Server-side external AI proxy
components/
  bunty/                   Chat panel, animated character, experience
  EngineeringLab3D.tsx    Interactive Three.js lab
  EngineeringLabHero.tsx  Lab hero section
  ...                      Shared navigation, sections, cards, UI
utils/
  supabase/                Supabase session and server/client helpers
  buntyApi.ts              Browser-side chat API wrapper
  storage.ts               Managed media storage helpers
data/                       Local fallback showcase data
supabase/                   SQL schema, auth policies, seed files
public/images/              Site logo and public image assets
proxy.ts                    Request/session middleware integration
```

</details>

## Scope and next steps

The current project includes the public website, an interactive 3D lab, projects/events/team views, the administrative CMS, light/dark theming, and the Bunty API integration.

Potential future improvements include stronger accessibility and device testing, richer project documentation, more complete society-specific knowledge for Bunty, conversational context support if its API evolves, and a clearer workflow for keeping events and team information current. These are opportunities, not claims of already-implemented functionality.

## Contributing

Contributions should preserve the site's existing design system and avoid exposing environment credentials. Work on a feature branch, explain user-facing changes, and run the lint, TypeScript, and build checks before proposing a merge.

---

<p align="center"><strong>Think. Build. Innovate.</strong></p>
<p align="center"><sub>Built for the e-Yantra MSIT engineering community.</sub></p>
