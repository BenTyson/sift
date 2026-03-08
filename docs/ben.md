# Ben's Manual Action Items

Things Claude cannot do -- requires human action (account signups, dashboards, DNS, env vars, etc).

## Revenue Pipeline (Phase A)

### A3. Affiliate Program Signups
- [ ] Sign up for AppSumo affiliate program (or Partners program)
- [ ] Get your AppSumo affiliate ID
- [ ] Sign up for StackSocial affiliate program
- [ ] Sign up for PitchGround affiliate program
- [ ] Check Impact.com / PartnerStack for additional AI tool affiliate programs
- [ ] Set `APPSUMO_AFFILIATE_ID` env var in Railway dashboard
- [ ] Set `APPSUMO_AFFILIATE_ID` in `.env.local` for dev
- [ ] Set `STACKSOCIAL_AFFILIATE_ID` env var in Railway dashboard and `.env.local`
- [ ] Set `PITCHGROUND_AFFILIATE_ID` env var in Railway dashboard and `.env.local`

### A4. Resend Email Configuration
- [ ] Create Resend account at resend.com (if not already done)
- [ ] Get API key from Resend dashboard
- [ ] Set `RESEND_API_KEY` in Railway dashboard
- [ ] Set `RESEND_API_KEY` in `.env.local` for dev
- [ ] Add DNS records for sender domain (SPF, DKIM, DMARC) -- Resend dashboard will provide these
- [ ] Set `FROM_EMAIL` env var if using custom domain sender (default: `SIFT <noreply@sift.tools>`)
- [ ] Send a test email to yourself to verify deliverability

## SEO & Domain (Phase D)

### D1. Custom Domain
- [ ] Point domain DNS to Railway (CNAME or A record -- Railway dashboard provides this)
- [ ] Add custom domain in Railway project settings
- [ ] Update `NEXT_PUBLIC_APP_URL` env var in Railway to use custom domain
- [ ] Update Supabase Auth redirect URLs (Supabase dashboard > Auth > URL Configuration)
- [ ] Update Google OAuth redirect URI (Google Cloud Console) to use custom domain
- [ ] Verify HTTPS is working on custom domain

### D2. Google Search Console
- [ ] Add property in Google Search Console for your domain
- [ ] Verify ownership (DNS TXT record or HTML meta tag)
- [ ] Submit sitemap URL: `https://yourdomain.com/sitemap.xml`
- [ ] Monitor crawl errors after a few days

## Monitoring & Analytics

### Plausible Analytics
- [ ] Verify Plausible is receiving data (already integrated in code)
- [ ] Set up any custom goals (e.g., newsletter signup, affiliate click)

### Railway
- [ ] Verify cron jobs are configured and running (scrape-deals, expire-deals, send-deal-alerts, send-weekly-digest)
- [ ] Set `CRON_SECRET` env var if not already set

## Payment Infrastructure (Phase F -- future)

### F1. Stripe
- [ ] Create Stripe account
- [ ] Get API keys
- [ ] Set up products/prices for sponsored listings (when ready)
