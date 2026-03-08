# Deployment - Railway

## Overview

SIFT is deployed on Railway with Nixpacks auto-detection. Auto-deploys on push to `main`.

**Production URL**: https://sift-production.up.railway.app
**Custom domain**: Owned but not yet configured.

## Environment Variables

### Required (Railway dashboard -> Variables)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://sift-production.up.railway.app
APP_URL=https://sift-production.up.railway.app
CRON_SECRET=<secure-random-string>
```

### Optional (for full functionality)

```env
# Search
NEXT_PUBLIC_MEILISEARCH_HOST=
MEILISEARCH_ADMIN_KEY=
NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY=

# Email (NOT YET CONFIGURED)
RESEND_API_KEY=
FROM_EMAIL=SIFT <noreply@sift.tools>

# Affiliate (NOT YET CONFIGURED)
APPSUMO_AFFILIATE_ID=
```

**Note**: `NEXT_PUBLIC_*` vars are baked at build time. `APP_URL` is the runtime equivalent for server actions.

## Custom Domain Setup (TODO)

1. Railway dashboard -> Settings -> Domains -> Add custom domain
2. Configure DNS: CNAME record pointing to Railway
3. SSL auto-provisioned by Railway (Let's Encrypt)
4. Update env vars: `APP_URL`, `NEXT_PUBLIC_APP_URL`
5. Update Supabase auth redirect URLs
6. Update Google OAuth redirect URIs in Google Cloud Console

## Cron Jobs

Scheduled via [cron-job.org](https://cron-job.org) (external service).

| Endpoint | Schedule | Purpose |
|----------|----------|---------|
| `POST /api/cron/scrape-deals` | Daily | Run deal scrapers |
| `POST /api/cron/expire-deals` | Daily | Mark expired deals inactive |
| `POST /api/cron/send-deal-alerts` | On new deals | Email alerts to subscribers |
| `POST /api/cron/send-weekly-digest` | Weekly (Sunday) | Newsletter digest |

All cron endpoints require `Authorization: Bearer <CRON_SECRET>` header.

```bash
# Manual trigger example
curl -X POST https://sift-production.up.railway.app/api/cron/scrape-deals \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Build & Deploy

```bash
# Local build
npm run build

# Railway CLI (manual deploy)
railway up

# View logs
railway logs
```

Railway auto-detects Next.js via Nixpacks:
- Build: `npm run build`
- Start: `npm run start`

## Monitoring

- **Logs**: Railway dashboard -> Deployments -> Logs (or `railway logs`)
- **Metrics**: CPU, memory, network in Railway dashboard
- **Analytics**: Plausible (privacy-friendly, integrated in layout.tsx)
- **Error monitoring**: Not yet configured (using Railway logs)
