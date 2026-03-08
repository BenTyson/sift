# SIFT - Project Instructions

## Quick Context
AI tools directory with deal aggregation. See `docs/AGENT-START.md` for full project status.

## Session Start
1. Read `docs/AGENT-START.md` (current state, what works, what doesn't)
2. Check `docs/roadmap.md` for active phase
3. Only read deeper docs if your task requires it

## Conventions
- **Stack**: Next.js 16 (App Router) + Supabase + Tailwind CSS 4 + shadcn/ui
- **Icons**: Lucide only, never emoji in UI
- **Components**: Server components for data, client for interactivity
- **Supabase**: `createClient()` (cookie-based), `createAdminClient()` (service role)
- **Styles**: OKLch color system in `src/app/globals.css`, aqua primary (hue 180)
- **ISR**: Tools 24h, deals 1h, SEO pages 24h

## Do Not
- Add console.logs unless debugging
- Add comments that restate what code does
- Create README/docs files unless asked
- Refactor adjacent code unless asked
- Re-debate locked tech stack decisions (see AGENT-START.md)
- Add error handling for impossible scenarios
- Commit or push without being asked

## Key Commands
```bash
npm run dev      # Dev server
npm run build    # Production build (run before considering work done)
npm run lint     # Lint check
```
