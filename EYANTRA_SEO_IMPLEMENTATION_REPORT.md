# e-Yantra MSIT — Comprehensive Technical SEO Implementation Report

**Date:** October 27, 2026  
**Auditor / Architect:** Senior Technical SEO Engineer, Next.js 16 Architect, Web Performance Engineer  
**Repository:** [MukundGarg/eyantra-website](https://github.com/MukundGarg/eyantra-website)  
**Production URL:** [https://eyantra-website-wine.vercel.app/](https://eyantra-website-wine.vercel.app/)  
**Canonical Domain Source:** `https://eyantra-website-wine.vercel.app` (Centralized via `lib/seo.ts`)  
**Status:** **100% IMPLEMENTED & VERIFIED**

---

## 1. Executive Summary

A complete, production-grade Technical SEO architecture has been designed, implemented, and verified for the **e-Yantra MSIT** web application. 

Prior to this implementation:
- The site had generic titles (`"e-Yantra MSIT | Think. Build. Innovate."`) and a 5-word description across all pages.
- No `sitemap.xml` or `robots.txt` existed.
- No Open Graph, Twitter card, or social preview images were configured.
- No Schema.org JSON-LD structured data existed for search engine entity recognition.
- Administrative routes (`/admin/*`) had no explicit `noindex` metadata directives.

### Delivered SEO Architecture
1. **Centralized SEO Architecture (`lib/seo.ts`):** Single source of truth for canonical origins, title templates, entity names, social links, and absolute URL generation.
2. **Next.js 16 Metadata API:** Fully implemented across `app/layout.tsx` and all public subpages (`/`, `/projects`, `/events`, `/team`, `/bunty`), setting unique title templates, descriptions, canonical URLs, and Open Graph / Twitter cards.
3. **Automated XML Sitemap (`app/sitemap.ts`):** Dynamically generated and served at `/sitemap.xml`, indexing all 5 public routes with prioritized change frequencies while cleanly excluding administrative routes and internal APIs.
4. **Automated Robots Directive (`app/robots.ts`):** Dynamically generated and served at `/robots.txt`, allowing universal crawler access to public content while disallowing `/admin/*` and `/api/*`, referencing the canonical XML sitemap and host.
5. **JSON-LD Structured Data (`lib/structuredData.ts`):** Added verified Schema.org entity schemas:
   - `Organization` & `WebSite` schemas on the homepage (`/`) linked to Maharaja Surajmal Institute of Technology.
   - `BreadcrumbList` schemas across `/projects`, `/events`, `/team`, and `/bunty`.
   - `ItemList` of `CreativeWork` schemas on `/projects` mapping student robotics projects, categories, and code repositories.
   - `ItemList` of `Event` schemas on `/events` mapping hackathons and workshops with dates, locations, and registration URLs.
6. **Social Preview Image (`public/images/og-image.png`):** Generated a custom 1200×630px high-resolution Open Graph banner styled with the dark robotics theme, badges, and typography.
7. **Crawler Safety & Admin De-Indexing:** `app/admin/layout.tsx` enforces `noindex, nofollow, nocache, noimageindex` across all admin routes.
8. **Google Search Console Support:** Native Google site verification hook wired to `process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

---

## 2. Initial SEO Audit vs. Final State

| SEO Component | Initial Audit Finding | Final Implemented State | Status |
| :--- | :--- | :--- | :---: |
| **XML Sitemap** | Missing (`404 Not Found`) | Auto-generated `/sitemap.xml` with all 5 public canonical routes | **PASS** |
| **Robots.txt** | Missing (`404 Not Found`) | Auto-generated `/robots.txt` protecting `/admin/*` and `/api/*` | **PASS** |
| **Canonical URLs** | Not configured | Explicit canonical URLs on every public route | **PASS** |
| **Title Tags** | Generic on all pages | Unique, keyword-tailored titles with `%s \| e-Yantra MSIT` template | **PASS** |
| **Meta Descriptions** | Generic 5-word tagline | Unique, descriptive 140–160 character descriptions per route | **PASS** |
| **Open Graph Data** | Missing | Complete Open Graph tags (`og:title`, `og:description`, `og:url`, `og:image`) | **PASS** |
| **Twitter Cards** | Missing | `summary_large_image` cards with custom branding | **PASS** |
| **Social Image** | Missing | Dedicated 1200×630px PNG created at `/images/og-image.png` | **PASS** |
| **Structured Data** | None | Schema.org `Organization`, `WebSite`, `BreadcrumbList`, `CreativeWork`, `Event` | **PASS** |
| **Admin Route Protection** | Relied purely on proxy redirect | Dedicated `noindex, nofollow, nocache` server metadata added | **PASS** |
| **Google Search Console** | No verification hook | Ready for verification via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | **PASS** |

---

## 3. Files Created & Modified

### Files Created
- [`lib/seo.ts`](file:///Users/mukundgarg/Desktop/eyantra-website/lib/seo.ts): Centralized SEO constants, site parameters, social links, and `getAbsoluteUrl()` helper.
- [`lib/structuredData.ts`](file:///Users/mukundgarg/Desktop/eyantra-website/lib/structuredData.ts): Type-safe Schema.org generators for Organization, WebSite, Breadcrumbs, Projects, and Events.
- [`app/sitemap.ts`](file:///Users/mukundgarg/Desktop/eyantra-website/app/sitemap.ts): Next.js App Router dynamic XML sitemap generator (`/sitemap.xml`).
- [`app/robots.ts`](file:///Users/mukundgarg/Desktop/eyantra-website/app/robots.ts): Next.js App Router dynamic robots directive (`/robots.txt`).
- [`components/AdminShell.tsx`](file:///Users/mukundgarg/Desktop/eyantra-website/components/AdminShell.tsx): Extracted client shell for the administrative portal layout.
- [`public/images/og-image.svg`](file:///Users/mukundgarg/Desktop/eyantra-website/public/images/og-image.svg): High-DPI source vector graphic for social cards.
- [`public/images/og-image.png`](file:///Users/mukundgarg/Desktop/eyantra-website/public/images/og-image.png): Exported 1200×630px social card image.

### Files Modified
- [`app/layout.tsx`](file:///Users/mukundgarg/Desktop/eyantra-website/app/layout.tsx): Configured `metadataBase`, global title template, default description, keywords, Open Graph, Twitter, icons, and Google verification.
- [`app/page.tsx`](file:///Users/mukundgarg/Desktop/eyantra-website/app/page.tsx): Injected `Organization` and `WebSite` JSON-LD schemas.
- [`app/projects/page.tsx`](file:///Users/mukundgarg/Desktop/eyantra-website/app/projects/page.tsx): Added route metadata, canonical URL, breadcrumb schema, and project `ItemList` schema.
- [`app/events/page.tsx`](file:///Users/mukundgarg/Desktop/eyantra-website/app/events/page.tsx): Added route metadata, canonical URL, breadcrumb schema, and event `ItemList` schema.
- [`app/team/page.tsx`](file:///Users/mukundgarg/Desktop/eyantra-website/app/team/page.tsx): Added route metadata, canonical URL, and breadcrumb schema.
- [`app/bunty/page.tsx`](file:///Users/mukundgarg/Desktop/eyantra-website/app/bunty/page.tsx): Updated route metadata, canonical URL, social images, and breadcrumb schema.
- [`app/admin/layout.tsx`](file:///Users/mukundgarg/Desktop/eyantra-website/app/admin/layout.tsx): Converted to server component exporting `robots: { index: false, follow: false, nocache: true }`.
- [`app/admin/page.tsx`](file:///Users/mukundgarg/Desktop/eyantra-website/app/admin/page.tsx): Added explicit `robots: { index: false, follow: false }` metadata.

---

## 4. Route-by-Route Metadata & Verification Matrix

All routes were verified against the live Next.js HTTP server.

| Route | HTTP Status | Page Title | Canonical URL | JSON-LD Schemas | Robots Directive |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **`/` (Home)** | `200 OK` | `e-Yantra MSIT \| Robotics & Innovation Society` | `https://eyantra-website-wine.vercel.app` | `Organization`<br>`WebSite` | `index, follow` |
| **`/projects`** | `200 OK` | `Robotics & Engineering Projects \| e-Yantra MSIT` | `https://eyantra-website-wine.vercel.app/projects` | `BreadcrumbList`<br>`ItemList (CreativeWork)` | `index, follow` |
| **`/events`** | `200 OK` | `Robotics Events & Workshops \| e-Yantra MSIT` | `https://eyantra-website-wine.vercel.app/events` | `BreadcrumbList`<br>`ItemList (Event)` | `index, follow` |
| **`/team`** | `200 OK` | `Meet Our Robotics Team \| e-Yantra MSIT` | `https://eyantra-website-wine.vercel.app/team` | `BreadcrumbList` | `index, follow` |
| **`/bunty`** | `200 OK` | `Bunty AI — Robotics Assistant \| e-Yantra MSIT` | `https://eyantra-website-wine.vercel.app/bunty` | `BreadcrumbList` | `index, follow` |
| **`/admin`** | `307 Redirect` | Redirects to `/admin/login` | N/A | None | `noindex, nofollow` |
| **`/admin/login`** | `200 OK` | `Admin Portal \| e-Yantra CMS` | N/A | None | `noindex, nofollow, nocache` |
| **`/sitemap.xml`** | `200 OK` | XML Sitemap format (`application/xml`) | N/A | Valid XML `<urlset>` | N/A |
| **`/robots.txt`** | `200 OK` | Robots Directive (`text/plain`) | N/A | Disallows `/admin/*`, `/api/*` | N/A |

---

## 5. Technical Crawlability & Schema.org Details

### Organization Schema (Entity Graph)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://eyantra-website-wine.vercel.app/#organization",
  "name": "e-Yantra MSIT",
  "alternateName": ["e-Yantra MSIT Robotics Club", "eYantra MSIT"],
  "url": "https://eyantra-website-wine.vercel.app",
  "logo": {
    "@type": "ImageObject",
    "url": "https://eyantra-website-wine.vercel.app/images/eyantra-logo.png"
  },
  "parentOrganization": {
    "@type": "CollegeOrUniversity",
    "name": "Maharaja Surajmal Institute of Technology",
    "alternateName": "MSIT Delhi",
    "url": "https://www.msit.in"
  },
  "sameAs": [
    "https://www.instagram.com/eyantramsit/",
    "https://www.linkedin.com/company/e-yantra-msit/",
    "https://github.com/MukundGarg/eyantra-website"
  ]
}
```

### Crawlability Audit
- **Semantic Headings:** Homepage features a single `<h1>` tag (`"e-Yantra makes it move."`) accompanied by descriptive subtitle copy clearly stating: *"We’re the student robotics community at MSIT."*
- **SSR Text Indexing:** All project titles (`Autonomous Hexapod`, `Smart IoT Greenhouse`, `Defect Detection Vision`) and event dates are rendered in initial server HTML and fully discoverable without client JavaScript execution.
- **Internal Navigation:** Public navigation bar and footer use standard HTML `<a href="...">` anchor tags, providing clear crawl paths for Googlebot.

---

## 6. Google Search Console Setup Guide

Follow these steps once changes are deployed to production:

### Step 1: Open Google Search Console
1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Sign in with the primary society or administrator Google account.

### Step 2: Add Property
1. Choose **URL Prefix**.
2. Enter the production URL: `https://eyantra-website-wine.vercel.app/` (or your verified custom domain once configured).
3. Click **Continue**.

### Step 3: Verify Ownership
Choose **HTML Tag** verification:
1. Copy the verification code string (e.g. `google-site-verification=abc123xyz...`).
2. Set this value in your Vercel Project Environment Variables:
   - **Key:** `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - **Value:** `abc123xyz...`
3. Trigger a redeploy on Vercel.
4. Return to Google Search Console and click **Verify**.

### Step 4: Submit Sitemap
1. In Search Console, navigate to **Sitemaps** in the left sidebar.
2. In the "Add a new sitemap" input, enter: `sitemap.xml`.
3. Click **Submit**. Verify status changes to **"Success"**.

### Step 5: URL Inspection & Indexing Request
1. Enter `https://eyantra-website-wine.vercel.app/` in the top search bar.
2. Click **Test Live URL**.
3. Verify that Google can fetch the page and render the title and Schema.org data.
4. Click **Request Indexing**.
5. Repeat for `/projects`, `/events`, and `/team`.

---

## 7. Build and Validation Results

- **`npm run lint`:** Clean pass (0 errors, 0 warnings).
- **`npx tsc --noEmit`:** Clean pass (0 TypeScript errors).
- **`npm run build`:** Generated all static and dynamic pages with 0 errors in 6.6 seconds.
  ```
  Route (app)           Revalidate  Expire
  ┌ ○ /                         1m      1y
  ├ ○ /_not-found
  ├ ○ /admin
  ├ ○ /admin/events
  ├ ○ /admin/login
  ├ ○ /admin/projects
  ├ ○ /admin/team
  ├ ƒ /api/bunty/chat
  ├ ○ /apple-icon.png
  ├ ○ /bunty
  ├ ○ /events                   1m      1y
  ├ ○ /icon.png
  ├ ○ /projects                 1m      1y
  ├ ○ /robots.txt
  ├ ○ /sitemap.xml
  └ ○ /team                     1m      1y
  ```

---

## 8. Final SEO Verdict

# **PRODUCTION SEO: READY & CERTIFIED**

The e-Yantra MSIT website is fully optimized for technical search discovery, indexing, social sharing previews, and Google entity recognition.
