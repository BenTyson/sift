# Component Architecture

## Component Hierarchy

```
Layout
├── Header
│   ├── Logo
│   ├── SearchBox (compact)
│   └── Navigation
│       ├── NavLink (Tools)
│       ├── NavLink (Deals)
│       └── AuthButton
└── Footer
    ├── FooterLinks
    ├── NewsletterSignup
    └── SocialLinks

Pages
├── HomePage
│   ├── HeroSection
│   │   └── SearchBox (large)
│   ├── FeaturedTools
│   │   └── ToolGrid
│   │       └── ToolCard[]
│   ├── LatestDeals
│   │   └── DealFeed
│   │       └── DealCard[]
│   └── CategoryGrid
│       └── CategoryCard[]
│
├── ToolsPage
│   ├── SearchBox
│   ├── Filters
│   │   ├── CategoryFilter
│   │   └── PricingFilter
│   └── ToolGrid
│       └── ToolCard[]
│
├── ToolDetailPage
│   ├── ToolHero
│   │   ├── Logo
│   │   ├── Title/Tagline
│   │   └── AffiliateButton
│   ├── FeaturesList
│   ├── PricingSection
│   ├── ActiveDeals
│   │   └── DealCard[]
│   └── RelatedTools
│       └── ToolCard[]
│
├── DealsPage
│   ├── DealFilters
│   └── DealFeed
│       └── DealCard[]
│
└── SEOPages
    ├── ComparisonPage (/vs/)
    │   ├── ComparisonHero
    │   ├── ComparisonTable
    │   └── FeatureMatrix
    └── AlternativesPage (/alternatives/)
        ├── AlternativesHero
        └── AlternativesList
            └── ToolCard[]
```

## Core Components

### ToolCard

Displays a tool in grid/list views.

```typescript
interface ToolCardProps {
  tool: Tool
  variant?: 'default' | 'compact' | 'featured'
  showCategory?: boolean
}
```

**Variants:**
- `default`: Logo, name, tagline, pricing badge, primary category
- `compact`: Logo, name, pricing badge only
- `featured`: Larger card with gradient border, featured badge

### DealCard

Displays a deal with pricing and urgency.

```typescript
interface DealCardProps {
  deal: Deal
  variant?: 'default' | 'compact'
  showTool?: boolean
}
```

**Features:**
- Discount badge (e.g., "60% OFF")
- Price comparison (was $99, now $39)
- Source badge (AppSumo, StackSocial)
- Countdown timer if expires within 7 days
- Tool link if `showTool` is true

### AffiliateButton

CTA button with click tracking.

```typescript
interface AffiliateButtonProps {
  tool: Tool
  deal?: Deal
  variant?: 'default' | 'large' | 'outline'
  children?: React.ReactNode
}
```

**Behavior:**
1. On click, POST to `/api/click` with tool_id
2. Redirect to affiliate_url (or website_url as fallback)
3. Open in new tab with `rel="noopener sponsored"`

### SearchBox

Meilisearch-powered instant search.

```typescript
interface SearchBoxProps {
  variant?: 'compact' | 'large'
  placeholder?: string
  autoFocus?: boolean
}
```

**Features:**
- Instant results dropdown
- Keyboard navigation
- Recent searches (localStorage)
- Category suggestions

## Design Tokens

### Colors (CSS Variables)

```css
/* Dark Theme (Default) */
--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;
--card: 222.2 84% 6%;
--card-foreground: 210 40% 98%;
--primary: 262.1 83.3% 57.8%;      /* Purple */
--primary-foreground: 210 40% 98%;
--secondary: 217.2 32.6% 17.5%;
--accent: 142.1 76.2% 36.3%;       /* Green - deals */
--destructive: 0 62.8% 30.6%;
--muted: 217.2 32.6% 17.5%;
--border: 217.2 32.6% 17.5%;
```

### Spacing

Use Tailwind's default spacing scale (4px base).

### Border Radius

- `rounded-sm`: 4px (small elements)
- `rounded-md`: 6px (buttons, inputs)
- `rounded-lg`: 8px (cards)
- `rounded-xl`: 12px (large cards, modals)

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.3);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3);
```

## Animation Patterns

### Hover Effects

```css
/* Card hover */
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Button hover */
.button:hover {
  opacity: 0.9;
}
```

### Loading States

- Use shadcn Skeleton for placeholders
- Maintain layout dimensions to prevent CLS
- 3 skeleton cards minimum in grids

### Transitions

```css
/* Default transition */
transition: all 150ms ease;

/* Cards */
transition: transform 200ms ease, box-shadow 200ms ease;
```

## Accessibility

- All interactive elements have focus states
- Color contrast meets WCAG AA
- Images have alt text
- Forms have proper labels
- Keyboard navigation works throughout
