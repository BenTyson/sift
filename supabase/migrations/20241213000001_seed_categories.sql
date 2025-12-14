-- Seed initial categories
INSERT INTO categories (slug, name, description, icon, display_order) VALUES
  ('writing', 'Writing', 'AI writing assistants, copywriting, and content generation tools', 'pen-tool', 1),
  ('image-generation', 'Image Generation', 'AI image generators, art creators, and visual design tools', 'image', 2),
  ('video', 'Video', 'AI video editing, generation, and enhancement tools', 'video', 3),
  ('audio', 'Audio', 'AI audio generation, music, voice, and sound tools', 'music', 4),
  ('coding', 'Coding', 'AI coding assistants, code generation, and developer tools', 'code', 5),
  ('productivity', 'Productivity', 'AI productivity tools, automation, and workflow optimization', 'zap', 6),
  ('marketing', 'Marketing', 'AI marketing tools, ads, campaigns, and analytics', 'megaphone', 7),
  ('sales', 'Sales', 'AI sales tools, CRM assistants, and lead generation', 'trending-up', 8),
  ('customer-support', 'Customer Support', 'AI chatbots, help desk, and customer service tools', 'headphones', 9),
  ('research', 'Research', 'AI research assistants, summarizers, and knowledge tools', 'search', 10),
  ('data', 'Data', 'AI data analysis, visualization, and business intelligence', 'bar-chart', 11),
  ('design', 'Design', 'AI design tools, UI/UX, and creative assistants', 'palette', 12),
  ('social-media', 'Social Media', 'AI social media management, scheduling, and content tools', 'share-2', 13),
  ('seo', 'SEO', 'AI SEO tools, keyword research, and optimization', 'globe', 14),
  ('automation', 'Automation', 'AI automation platforms, no-code, and integration tools', 'settings', 15);
