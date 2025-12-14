-- Seed sample deals
-- These are example deals - in production, these will be scraped from AppSumo, StackSocial, etc.

INSERT INTO deals (tool_id, source, source_id, source_url, deal_type, title, description, original_price, deal_price, discount_percent, currency, coupon_code, affiliate_url, expires_at, is_active) VALUES

-- Lifetime Deals
((SELECT id FROM tools WHERE slug = 'jasper' LIMIT 1), 'appsumo', 'jasper-ltd-001', 'https://appsumo.com/products/jasper/', 'ltd', 'Jasper AI - Lifetime Deal', 'Get lifetime access to Jasper AI writing assistant. Create marketing copy, blog posts, and more with AI.', 588, 69, 88, 'USD', NULL, 'https://appsumo.com/products/jasper/', NOW() + INTERVAL '14 days', true),

((SELECT id FROM tools WHERE slug = 'copy-ai' LIMIT 1), 'appsumo', 'copyai-ltd-001', 'https://appsumo.com/products/copy-ai/', 'ltd', 'Copy.ai Lifetime Access', 'Unlimited AI copywriting for a one-time payment. Generate marketing copy, emails, and social posts.', 432, 59, 86, 'USD', NULL, 'https://appsumo.com/products/copy-ai/', NOW() + INTERVAL '7 days', true),

((SELECT id FROM tools WHERE slug = 'writesonic' LIMIT 1), 'pitchground', 'writesonic-ltd-001', 'https://pitchground.com/products/writesonic', 'ltd', 'Writesonic - One-Time Purchase', 'SEO-optimized AI content writer. Blog posts, landing pages, and ad copy with one payment.', 348, 49, 86, 'USD', NULL, 'https://pitchground.com/products/writesonic', NOW() + INTERVAL '21 days', true),

((SELECT id FROM tools WHERE slug = 'descript' LIMIT 1), 'appsumo', 'descript-ltd-001', 'https://appsumo.com/products/descript/', 'ltd', 'Descript Pro - Lifetime', 'Professional video and podcast editing with AI transcription. Edit video like a document.', 480, 89, 81, 'USD', NULL, 'https://appsumo.com/products/descript/', NOW() + INTERVAL '10 days', true),

-- Discounts
((SELECT id FROM tools WHERE slug = 'midjourney' LIMIT 1), 'direct', 'mj-annual-001', 'https://midjourney.com/pricing', 'discount', 'Midjourney Annual Plan - 20% Off', 'Save 20% when you subscribe to Midjourney annual plan. Unlimited image generations.', 120, 96, 20, 'USD', NULL, 'https://midjourney.com/pricing', NOW() + INTERVAL '30 days', true),

((SELECT id FROM tools WHERE slug = 'elevenlabs' LIMIT 1), 'direct', 'eleven-annual-001', 'https://elevenlabs.io/pricing', 'discount', 'ElevenLabs Creator Plan - 30% Off', 'Get 30% off ElevenLabs Creator plan. Professional voice cloning and text-to-speech.', 264, 185, 30, 'USD', 'VOICE30', 'https://elevenlabs.io/pricing', NOW() + INTERVAL '5 days', true),

((SELECT id FROM tools WHERE slug = 'runway' LIMIT 1), 'direct', 'runway-annual-001', 'https://runwayml.com/pricing', 'discount', 'Runway Pro - First Month 50% Off', 'Half off your first month of Runway Pro. AI video generation and editing tools.', 35, 18, 50, 'USD', 'RUNWAY50', 'https://runwayml.com/pricing', NOW() + INTERVAL '3 days', true),

((SELECT id FROM tools WHERE slug = 'notion-ai' LIMIT 1), 'direct', 'notion-team-001', 'https://notion.so/pricing', 'discount', 'Notion Team - 25% Off Annual', 'Notion Team with AI features at 25% off when billed annually.', 120, 90, 25, 'USD', NULL, 'https://notion.so/pricing', NOW() + INTERVAL '14 days', true),

-- Coupons
((SELECT id FROM tools WHERE slug = 'chatgpt' LIMIT 1), 'direct', 'chatgpt-edu-001', 'https://chat.openai.com/pricing', 'coupon', 'ChatGPT Plus - Student Discount', 'Students get $5 off ChatGPT Plus monthly subscription with valid .edu email.', 20, 15, 25, 'USD', 'STUDENT25', 'https://chat.openai.com/pricing', NOW() + INTERVAL '60 days', true),

((SELECT id FROM tools WHERE slug = 'cursor' LIMIT 1), 'direct', 'cursor-oss-001', 'https://cursor.sh/pricing', 'coupon', 'Cursor Pro - Open Source Maintainer', 'Free Cursor Pro for verified open source maintainers. Apply on their website.', 240, 0, 100, 'USD', 'OPENSOURCE', 'https://cursor.sh/pricing', NOW() + INTERVAL '90 days', true),

((SELECT id FROM tools WHERE slug = 'claude' LIMIT 1), 'direct', 'claude-first-001', 'https://claude.ai/pricing', 'coupon', 'Claude Pro - 20% First Month', 'Get 20% off your first month of Claude Pro subscription.', 20, 16, 20, 'USD', 'FIRST20', 'https://claude.ai/pricing', NOW() + INTERVAL '30 days', true),

-- Free Trials
((SELECT id FROM tools WHERE slug = 'github-copilot' LIMIT 1), 'direct', 'copilot-trial-001', 'https://github.com/features/copilot', 'trial', 'GitHub Copilot - 30 Day Free Trial', 'Try GitHub Copilot free for 30 days. AI pair programming in your editor.', 10, 0, 100, 'USD', NULL, 'https://github.com/features/copilot', NOW() + INTERVAL '90 days', true),

((SELECT id FROM tools WHERE slug = 'perplexity' LIMIT 1), 'direct', 'perplexity-trial-001', 'https://perplexity.ai/pro', 'trial', 'Perplexity Pro - 7 Day Trial', 'Try Perplexity Pro free for 7 days. Unlimited Pro searches with GPT-4.', 20, 0, 100, 'USD', NULL, 'https://perplexity.ai/pro', NOW() + INTERVAL '60 days', true),

((SELECT id FROM tools WHERE slug = 'grammarly' LIMIT 1), 'direct', 'grammarly-trial-001', 'https://grammarly.com/premium', 'trial', 'Grammarly Premium - 7 Day Trial', 'Try all Grammarly Premium features free for 7 days.', 12, 0, 100, 'USD', NULL, 'https://grammarly.com/premium', NOW() + INTERVAL '45 days', true);
