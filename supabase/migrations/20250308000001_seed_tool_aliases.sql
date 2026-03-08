-- Seed common aliases for existing tools
INSERT INTO tool_aliases (tool_id, alias) VALUES
  -- ChatGPT aliases
  ((SELECT id FROM tools WHERE slug = 'chatgpt'), 'gpt'),
  ((SELECT id FROM tools WHERE slug = 'chatgpt'), 'gpt-4'),
  ((SELECT id FROM tools WHERE slug = 'chatgpt'), 'gpt-4o'),
  ((SELECT id FROM tools WHERE slug = 'chatgpt'), 'gpt4'),
  ((SELECT id FROM tools WHERE slug = 'chatgpt'), 'openai chat'),
  -- Claude aliases
  ((SELECT id FROM tools WHERE slug = 'claude'), 'anthropic'),
  ((SELECT id FROM tools WHERE slug = 'claude'), 'claude ai'),
  -- Midjourney aliases
  ((SELECT id FROM tools WHERE slug = 'midjourney'), 'mj'),
  ((SELECT id FROM tools WHERE slug = 'midjourney'), 'mid journey'),
  -- Stable Diffusion aliases
  ((SELECT id FROM tools WHERE slug = 'stable-diffusion'), 'sd'),
  ((SELECT id FROM tools WHERE slug = 'stable-diffusion'), 'stability ai'),
  ((SELECT id FROM tools WHERE slug = 'stable-diffusion'), 'stablediffusion'),
  -- DALL-E aliases
  ((SELECT id FROM tools WHERE slug = 'dall-e'), 'dalle'),
  ((SELECT id FROM tools WHERE slug = 'dall-e'), 'dall-e 3'),
  ((SELECT id FROM tools WHERE slug = 'dall-e'), 'dalle3'),
  -- GitHub Copilot aliases
  ((SELECT id FROM tools WHERE slug = 'github-copilot'), 'copilot'),
  ((SELECT id FROM tools WHERE slug = 'github-copilot'), 'gh copilot'),
  -- ElevenLabs aliases
  ((SELECT id FROM tools WHERE slug = 'elevenlabs'), '11labs'),
  ((SELECT id FROM tools WHERE slug = 'elevenlabs'), 'eleven labs'),
  -- Notion AI aliases
  ((SELECT id FROM tools WHERE slug = 'notion-ai'), 'notion'),
  -- Otter.ai aliases
  ((SELECT id FROM tools WHERE slug = 'otter-ai'), 'otter'),
  -- Copy.ai aliases
  ((SELECT id FROM tools WHERE slug = 'copy-ai'), 'copyai'),
  -- Leonardo.ai aliases
  ((SELECT id FROM tools WHERE slug = 'leonardo-ai'), 'leonardo'),
  -- Murf AI aliases
  ((SELECT id FROM tools WHERE slug = 'murf'), 'murf ai'),
  -- HubSpot aliases
  ((SELECT id FROM tools WHERE slug = 'hubspot'), 'hubspot ai'),
  -- Jasper aliases
  ((SELECT id FROM tools WHERE slug = 'jasper'), 'jasper ai');
