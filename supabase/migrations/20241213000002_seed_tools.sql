-- Seed initial AI tools
-- These are real tools with actual website URLs

INSERT INTO tools (slug, name, tagline, description, website_url, affiliate_url, pricing_model, pricing_details, features, is_featured, is_verified, status, upvotes) VALUES

-- Writing Tools
('jasper', 'Jasper', 'AI writing assistant for marketing teams', 'Create high-quality content 10x faster with AI. Jasper helps marketing teams generate blog posts, ads, social media content, and more.', 'https://jasper.ai', 'https://jasper.ai', 'paid', '{"starting_price": 49, "currency": "USD"}', ARRAY['Blog posts', 'Ad copy', 'Social media', 'Email marketing', 'SEO content'], true, true, 'active', 234),

('copy-ai', 'Copy.ai', 'AI-powered copywriting made simple', 'Generate marketing copy in seconds. Copy.ai helps you create compelling copy for ads, websites, emails, and social media.', 'https://copy.ai', 'https://copy.ai', 'freemium', '{"starting_price": 49, "currency": "USD", "free_tier": true}', ARRAY['Marketing copy', 'Blog posts', 'Product descriptions', 'Social media', 'Emails'], true, true, 'active', 189),

('writesonic', 'Writesonic', 'AI writer for creating SEO-optimized content', 'Create SEO-optimized and plagiarism-free content for your blogs, ads, emails, and website 10X faster.', 'https://writesonic.com', 'https://writesonic.com', 'freemium', '{"starting_price": 19, "currency": "USD", "free_tier": true}', ARRAY['Blog posts', 'Landing pages', 'Ads', 'Product descriptions'], true, true, 'active', 156),

('grammarly', 'Grammarly', 'AI writing assistant for clear communication', 'Grammarly helps you write mistake-free in Gmail, Facebook, Twitter, LinkedIn, and any other app.', 'https://grammarly.com', NULL, 'freemium', '{"starting_price": 12, "currency": "USD", "free_tier": true}', ARRAY['Grammar check', 'Spelling', 'Tone detection', 'Plagiarism checker'], false, true, 'active', 445),

-- Image Generation
('midjourney', 'Midjourney', 'Create stunning AI-generated images', 'Generate beautiful images from text prompts. Midjourney creates art, illustrations, and photorealistic images.', 'https://midjourney.com', NULL, 'paid', '{"starting_price": 10, "currency": "USD"}', ARRAY['Image generation', 'Art styles', 'Variations', 'Upscaling'], true, true, 'active', 567),

('dall-e', 'DALL-E 3', 'OpenAI image generation model', 'Create realistic images and art from natural language descriptions. DALL-E 3 understands significantly more nuance and detail.', 'https://openai.com/dall-e-3', NULL, 'paid', '{"starting_price": 20, "currency": "USD"}', ARRAY['Image generation', 'Text in images', 'Photorealistic', 'Illustrations'], true, true, 'active', 489),

('stable-diffusion', 'Stable Diffusion', 'Open-source image generation', 'Generate images with open-source AI models. Run locally or use cloud services.', 'https://stability.ai', NULL, 'open_source', '{}', ARRAY['Image generation', 'Open source', 'Local deployment', 'Fine-tuning'], false, true, 'active', 345),

('leonardo-ai', 'Leonardo.ai', 'AI image generation for game assets', 'Create production-quality visual assets for your projects with AI-driven speed and style-consistency.', 'https://leonardo.ai', NULL, 'freemium', '{"starting_price": 12, "currency": "USD", "free_tier": true}', ARRAY['Game assets', 'Image generation', 'Texture generation', 'Consistency'], false, true, 'active', 234),

-- Coding
('github-copilot', 'GitHub Copilot', 'Your AI pair programmer', 'Code faster with AI-powered code suggestions. GitHub Copilot helps you write code in your editor.', 'https://github.com/features/copilot', NULL, 'freemium', '{"starting_price": 10, "currency": "USD", "free_tier": true}', ARRAY['Code completion', 'Chat', 'Code explanation', 'Test generation'], true, true, 'active', 678),

('cursor', 'Cursor', 'The AI-first code editor', 'Build software faster with AI. Cursor is a fork of VS Code with built-in AI assistance.', 'https://cursor.sh', NULL, 'freemium', '{"starting_price": 20, "currency": "USD", "free_tier": true}', ARRAY['AI code editor', 'Chat', 'Code generation', 'Codebase understanding'], true, true, 'active', 456),

('replit', 'Replit', 'Build software collaboratively with AI', 'Replit is an AI-powered software development platform. Build, deploy, and ship software faster.', 'https://replit.com', NULL, 'freemium', '{"starting_price": 7, "currency": "USD", "free_tier": true}', ARRAY['Online IDE', 'AI assistance', 'Deployment', 'Collaboration'], false, true, 'active', 345),

('codeium', 'Codeium', 'Free AI code completion', 'The modern coding superpower. Free AI-powered code acceleration toolkit.', 'https://codeium.com', NULL, 'free', '{"free_tier": true}', ARRAY['Code completion', 'Free', 'Multi-language', 'IDE integrations'], false, true, 'active', 289),

-- Productivity
('notion-ai', 'Notion AI', 'AI writing assistant built into Notion', 'Write, edit, and brainstorm in Notion with AI. Summarize, translate, and generate content.', 'https://notion.so', NULL, 'freemium', '{"starting_price": 10, "currency": "USD"}', ARRAY['Writing', 'Summarization', 'Translation', 'Brainstorming'], true, true, 'active', 423),

('otter-ai', 'Otter.ai', 'AI meeting assistant', 'Capture and share insights from your meetings. AI-powered transcription and note-taking.', 'https://otter.ai', NULL, 'freemium', '{"starting_price": 16.99, "currency": "USD", "free_tier": true}', ARRAY['Transcription', 'Meeting notes', 'Summaries', 'Action items'], false, true, 'active', 312),

('mem', 'Mem', 'AI-powered note-taking', 'The self-organizing workspace. Mem uses AI to organize your notes automatically.', 'https://mem.ai', NULL, 'freemium', '{"starting_price": 15, "currency": "USD", "free_tier": true}', ARRAY['Note-taking', 'AI organization', 'Search', 'Knowledge base'], false, true, 'active', 198),

-- Video
('descript', 'Descript', 'AI-powered video and podcast editing', 'Edit video like editing a doc. Descript makes video editing as easy as word processing.', 'https://descript.com', 'https://descript.com', 'freemium', '{"starting_price": 12, "currency": "USD", "free_tier": true}', ARRAY['Video editing', 'Transcription', 'Screen recording', 'AI voices'], true, true, 'active', 378),

('runway', 'Runway', 'AI video generation and editing', 'Advancing creativity with artificial intelligence. Generate and edit video with AI.', 'https://runwayml.com', NULL, 'freemium', '{"starting_price": 12, "currency": "USD", "free_tier": true}', ARRAY['Video generation', 'Image to video', 'Video editing', 'Gen-2'], true, true, 'active', 445),

('pictory', 'Pictory', 'AI video creation from text', 'Turn long-form content into short, branded videos. Create videos from scripts and articles.', 'https://pictory.ai', 'https://pictory.ai', 'paid', '{"starting_price": 19, "currency": "USD"}', ARRAY['Text to video', 'Blog to video', 'Auto-captions', 'Branding'], false, true, 'active', 234),

('synthesia', 'Synthesia', 'AI video generation with avatars', 'Create professional videos with AI avatars. No cameras, studios, or actors needed.', 'https://synthesia.io', NULL, 'paid', '{"starting_price": 22, "currency": "USD"}', ARRAY['AI avatars', 'Video generation', 'Multi-language', 'Templates'], false, true, 'active', 289),

-- Chat/Assistants
('chatgpt', 'ChatGPT', 'Conversational AI by OpenAI', 'The most popular conversational AI assistant. Chat, code, analyze, and create with GPT-4.', 'https://chat.openai.com', NULL, 'freemium', '{"starting_price": 20, "currency": "USD", "free_tier": true}', ARRAY['Chat', 'Code', 'Analysis', 'Image generation', 'Plugins'], true, true, 'active', 890),

('claude', 'Claude', 'AI assistant by Anthropic', 'Helpful, harmless, and honest AI assistant. Claude excels at analysis, writing, and coding.', 'https://claude.ai', NULL, 'freemium', '{"starting_price": 20, "currency": "USD", "free_tier": true}', ARRAY['Chat', 'Analysis', 'Coding', 'Long context', 'Artifacts'], true, true, 'active', 567),

('perplexity', 'Perplexity', 'AI-powered search engine', 'Ask anything. Get instant answers with cited sources. AI search that understands you.', 'https://perplexity.ai', NULL, 'freemium', '{"starting_price": 20, "currency": "USD", "free_tier": true}', ARRAY['AI search', 'Citations', 'Real-time info', 'Follow-up questions'], true, true, 'active', 456),

('poe', 'Poe', 'Access multiple AI chatbots', 'Fast, helpful AI chat. Access GPT-4, Claude, and other models in one place.', 'https://poe.com', NULL, 'freemium', '{"starting_price": 19.99, "currency": "USD", "free_tier": true}', ARRAY['Multiple models', 'Chat', 'Custom bots', 'API access'], false, true, 'active', 234),

-- Audio
('elevenlabs', 'ElevenLabs', 'AI voice generation and cloning', 'Create natural-sounding voiceovers and clone voices with AI. High-quality text-to-speech.', 'https://elevenlabs.io', NULL, 'freemium', '{"starting_price": 5, "currency": "USD", "free_tier": true}', ARRAY['Text to speech', 'Voice cloning', 'Multiple languages', 'API'], true, true, 'active', 398),

('murf', 'Murf AI', 'AI voice generator for professionals', 'Create studio-quality voiceovers in minutes. AI voice generator with 120+ voices.', 'https://murf.ai', 'https://murf.ai', 'freemium', '{"starting_price": 19, "currency": "USD", "free_tier": true}', ARRAY['Text to speech', 'Voice over', 'Multiple voices', 'Video sync'], false, true, 'active', 267),

('suno', 'Suno', 'AI music generation', 'Make any song you can imagine. Create music with AI from text prompts.', 'https://suno.ai', NULL, 'freemium', '{"starting_price": 10, "currency": "USD", "free_tier": true}', ARRAY['Music generation', 'Lyrics', 'Multiple genres', 'Full songs'], false, true, 'active', 345),

-- Design
('canva', 'Canva', 'Design platform with AI features', 'Design anything with AI-powered tools. Create graphics, presentations, and videos.', 'https://canva.com', NULL, 'freemium', '{"starting_price": 12.99, "currency": "USD", "free_tier": true}', ARRAY['Graphic design', 'AI image generation', 'Templates', 'Collaboration'], false, true, 'active', 567),

('figma', 'Figma', 'Collaborative design with AI', 'Design, prototype, and gather feedback all in one place. Now with AI features.', 'https://figma.com', NULL, 'freemium', '{"starting_price": 15, "currency": "USD", "free_tier": true}', ARRAY['UI design', 'Prototyping', 'Collaboration', 'Dev mode'], false, true, 'active', 489),

('looka', 'Looka', 'AI logo maker', 'Design a logo and brand you love. AI-powered logo and brand identity generator.', 'https://looka.com', NULL, 'paid', '{"starting_price": 20, "currency": "USD"}', ARRAY['Logo design', 'Brand kit', 'AI generation', 'Templates'], false, true, 'active', 178),

-- Marketing
('jasper-art', 'Jasper Art', 'AI image generation for marketing', 'Create stunning images for your marketing campaigns. Part of the Jasper platform.', 'https://jasper.ai/art', 'https://jasper.ai', 'paid', '{"starting_price": 49, "currency": "USD"}', ARRAY['Marketing images', 'Ad creatives', 'Social media graphics'], false, true, 'active', 156),

('hubspot', 'HubSpot AI', 'AI-powered CRM and marketing', 'Grow better with HubSpot AI. AI tools for marketing, sales, and customer service.', 'https://hubspot.com', NULL, 'freemium', '{"starting_price": 20, "currency": "USD", "free_tier": true}', ARRAY['CRM', 'Email marketing', 'Content assistant', 'Chatbots'], false, true, 'active', 289);

-- Associate tools with categories
INSERT INTO tool_categories (tool_id, category_id, is_primary)
SELECT t.id, c.id, true
FROM tools t, categories c
WHERE (t.slug = 'jasper' AND c.slug = 'writing')
   OR (t.slug = 'copy-ai' AND c.slug = 'writing')
   OR (t.slug = 'writesonic' AND c.slug = 'writing')
   OR (t.slug = 'grammarly' AND c.slug = 'writing')
   OR (t.slug = 'midjourney' AND c.slug = 'image-generation')
   OR (t.slug = 'dall-e' AND c.slug = 'image-generation')
   OR (t.slug = 'stable-diffusion' AND c.slug = 'image-generation')
   OR (t.slug = 'leonardo-ai' AND c.slug = 'image-generation')
   OR (t.slug = 'github-copilot' AND c.slug = 'coding')
   OR (t.slug = 'cursor' AND c.slug = 'coding')
   OR (t.slug = 'replit' AND c.slug = 'coding')
   OR (t.slug = 'codeium' AND c.slug = 'coding')
   OR (t.slug = 'notion-ai' AND c.slug = 'productivity')
   OR (t.slug = 'otter-ai' AND c.slug = 'productivity')
   OR (t.slug = 'mem' AND c.slug = 'productivity')
   OR (t.slug = 'descript' AND c.slug = 'video')
   OR (t.slug = 'runway' AND c.slug = 'video')
   OR (t.slug = 'pictory' AND c.slug = 'video')
   OR (t.slug = 'synthesia' AND c.slug = 'video')
   OR (t.slug = 'chatgpt' AND c.slug = 'productivity')
   OR (t.slug = 'claude' AND c.slug = 'productivity')
   OR (t.slug = 'perplexity' AND c.slug = 'research')
   OR (t.slug = 'poe' AND c.slug = 'productivity')
   OR (t.slug = 'elevenlabs' AND c.slug = 'audio')
   OR (t.slug = 'murf' AND c.slug = 'audio')
   OR (t.slug = 'suno' AND c.slug = 'audio')
   OR (t.slug = 'canva' AND c.slug = 'design')
   OR (t.slug = 'figma' AND c.slug = 'design')
   OR (t.slug = 'looka' AND c.slug = 'design')
   OR (t.slug = 'jasper-art' AND c.slug = 'marketing')
   OR (t.slug = 'hubspot' AND c.slug = 'marketing');
