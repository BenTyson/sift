# Component Architecture

## Component Tree

```
Layout (src/app/layout.tsx)
├── Header
│   ├── Logo + Nav links (Tools, Deals)
│   ├── SearchBox (compact)
│   └── UserMenu (auth dropdown) / Login button
└── Footer
    ├── Nav links
    └── NewsletterForm

Pages
├── HomePage (src/app/page.tsx)
│   ├── Hero + SearchBox (large)
│   ├── FeaturedTools -> ToolGrid -> ToolCard[]
│   ├── LatestDeals -> DealGrid -> DealCard[]
│   ├── CategoryGrid
│   └── Newsletter CTA
│
├── ToolsPage (src/app/tools/page.tsx)
│   ├── Filters (category, pricing)
│   └── ToolGrid -> ToolCard[]
│
├── ToolDetailPage (src/app/tools/[slug]/page.tsx)
│   ├── Tool info + VoteButton + DealAlertButton
│   ├── Features, pricing, use cases
│   ├── Active deals -> DealCard[]
│   └── Related tools -> ToolCard[]
│
├── DealsPage (src/app/deals/page.tsx)
│   ├── Filters (type, source)
│   └── DealGrid -> DealCard[]
│
├── SEO Pages
│   ├── /vs/[comparison] - side-by-side comparison
│   ├── /alternatives/[tool] - ranked alternatives list
│   └── /best/[category] - top tools per category
│
├── Auth: /login, /signup, /forgot-password, /auth/callback
├── Profile: /profile, /profile/alerts, /profile/settings, /profile/submissions
├── Submit: /submit, /submit/tool, /submit/deal
├── Admin: /admin (submission review dashboard)
└── Legal: /about, /contact, /privacy, /terms
```

## Custom Components

| Component | Path | Type | Purpose |
|-----------|------|------|---------|
| Header | `components/layout/Header.tsx` | Client | Nav, search, auth menu |
| Footer | `components/layout/Footer.tsx` | Server | Nav, newsletter |
| ToolCard | `components/tools/ToolCard.tsx` | Server | Tool display in grids |
| ToolGrid | `components/tools/ToolGrid.tsx` | Server | Grid layout for tools |
| VoteButton | `components/tools/VoteButton.tsx` | Client | Upvote with optimistic UI |
| DealCard | `components/deals/DealCard.tsx` | Server | Deal display with pricing |
| DealGrid | `components/deals/DealGrid.tsx` | Server | Grid layout for deals |
| DealAlertButton | `components/alerts/DealAlertButton.tsx` | Client | Subscribe to tool/category alerts |
| UserMenu | `components/auth/UserMenu.tsx` | Client | Auth dropdown (profile, logout) |
| NewsletterForm | `components/newsletter/NewsletterForm.tsx` | Client | Email signup form |
| SearchBox | `components/search/SearchBox.tsx` | Client | Meilisearch instant search |

## shadcn/ui Components (src/components/ui/)

badge, button, card, dialog, dropdown-menu, input, label, scroll-area, select, separator, sheet, skeleton, tabs, textarea

## Design Tokens

### Colors (OKLch - Dark Theme Default)

```css
/* Background */
--background: oklch(0.16 0.01 200);     /* Soft dark with cool tint */
--card: oklch(0.20 0.01 200);           /* Elevated surfaces */

/* Primary - Aqua/Teal (hue 180) */
--primary: oklch(0.70 0.12 180);        /* Main brand color */
--primary-foreground: oklch(0.15 0.02 180);

/* Neutral */
--foreground: oklch(0.92 0.01 200);
--muted: oklch(0.24 0.01 200);
--muted-foreground: oklch(0.58 0.01 200);
--border: oklch(0.28 0.01 200);

/* Accent = Primary for unified look */
--accent: oklch(0.70 0.12 180);
```

Light theme variables exist in `.light` class (purple primary at hue 285, green accent at hue 145). Not yet togglable - dark is default.

### Design Notes
- Outlined button style (not filled) for distinctive look
- Cards with subtle elevation, cool-tinted backgrounds
- Lucide icons throughout, never emoji
- 8.5/10 UI assessment - distinctive, not generic
