# Deployment - Railway

## Overview

SIFT is deployed on Railway with Nixpacks for automatic builds.

## Setup

### 1. Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize in project directory
railway init
```

### 2. Link to GitHub

In Railway dashboard:
1. Create new project
2. Select "Deploy from GitHub repo"
3. Choose the `sift` repository
4. Railway auto-detects Next.js and configures build

### 3. Configure Environment Variables

In Railway dashboard → Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
CRON_SECRET=generate-a-secure-random-string
RESEND_API_KEY=re_xxx
```

### 4. Deploy

Railway deploys automatically on push to `main`. Manual deploy:

```bash
railway up
```

## Configuration

### railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### Build Settings

Railway uses Nixpacks which auto-detects:
- Node.js version from `package.json` engines (or defaults to LTS)
- `npm run build` for build command
- `npm run start` for start command

## Domains

### Custom Domain

1. Railway dashboard → Settings → Domains
2. Add custom domain (e.g., `sift.tools`)
3. Configure DNS:
   - Add CNAME record pointing to `*.railway.app`
   - Or use Railway's suggested DNS settings

### SSL

Railway provides automatic SSL via Let's Encrypt.

## Cron Jobs

Railway has limited cron support. Options:

### Option 1: External Cron Service

Use [cron-job.org](https://cron-job.org) or similar:

```
URL: https://your-app.railway.app/api/cron/scrape-deals
Method: POST
Headers: Authorization: Bearer YOUR_CRON_SECRET
Schedule: 0 6,18 * * * (6am and 6pm UTC)
```

### Option 2: Supabase pg_cron

Use Supabase's PostgreSQL cron extension to call Edge Functions.

### Option 3: Separate Worker Service

Create a second Railway service with a cron process:

```dockerfile
# Dockerfile.worker
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "scripts/cron-worker.js"]
```

## Monitoring

### Logs

```bash
railway logs
```

Or view in Railway dashboard → Deployments → Logs

### Metrics

Railway provides:
- CPU usage
- Memory usage
- Network I/O

## Scaling

Railway auto-scales based on usage. For manual control:

1. Dashboard → Settings → Instance
2. Adjust vCPU and RAM
3. Enable/disable auto-sleep

## Costs

Railway pricing (as of 2024):
- Hobby: $5/month (includes $5 usage credit)
- Pro: $20/month (includes $20 credit, more features)

Typical SIFT usage:
- ~$5-15/month depending on traffic
- Puppeteer scraping may require more RAM

## Troubleshooting

### Build Failures

```bash
# Check build logs
railway logs --build

# Rebuild
railway up --force
```

### Memory Issues

If Puppeteer causes OOM:
1. Increase instance RAM in settings
2. Use Cheerio where possible
3. Consider separate scraper service

### Cold Starts

Railway may sleep inactive services:
- Enable "Always On" in settings (Pro plan)
- Or accept ~1s cold start delay
