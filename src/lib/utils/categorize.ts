import type { CategorySlug } from '@/lib/constants/categories'

const CATEGORY_KEYWORDS: Record<CategorySlug, string[]> = {
  writing: [
    'writing', 'writer', 'copywriting', 'content creation', 'blog',
    'article', 'essay', 'grammar', 'paraphrase', 'text generation',
    'copywriter', 'content generator', 'storytelling', 'proofreading',
  ],
  'image-generation': [
    'image generation', 'image generator', 'ai art', 'text to image',
    'illustration', 'art generator', 'photo generation', 'picture',
    'visual generation', 'diffusion', 'image creator',
  ],
  video: [
    'video', 'video editing', 'video generation', 'text to video',
    'animation', 'video creator', 'clip', 'footage', 'film',
    'video maker', 'screen recording',
  ],
  audio: [
    'audio', 'voice', 'text to speech', 'speech', 'music',
    'voice cloning', 'sound', 'podcast', 'transcription',
    'voice generator', 'tts', 'speech synthesis',
  ],
  coding: [
    'coding', 'code', 'programming', 'developer', 'software development',
    'code generation', 'code completion', 'ide', 'debugging',
    'code review', 'pair programming', 'code assistant',
  ],
  productivity: [
    'productivity', 'workflow', 'note', 'notes', 'task management',
    'project management', 'organization', 'calendar', 'assistant',
    'workspace', 'collaboration', 'meeting',
  ],
  marketing: [
    'marketing', 'ad', 'ads', 'campaign', 'brand',
    'digital marketing', 'email marketing', 'advertising',
    'marketing automation', 'growth', 'conversion',
  ],
  sales: [
    'sales', 'crm', 'lead generation', 'leads', 'outreach',
    'pipeline', 'prospecting', 'cold email', 'sales automation',
    'revenue', 'deal',
  ],
  'customer-support': [
    'customer support', 'chatbot', 'help desk', 'customer service',
    'live chat', 'ticketing', 'support agent', 'knowledge base',
    'FAQ', 'helpdesk',
  ],
  research: [
    'research', 'search', 'summarize', 'summarizer', 'knowledge',
    'analysis', 'insights', 'literature', 'academic',
    'information retrieval', 'fact-checking',
  ],
  data: [
    'data', 'analytics', 'data analysis', 'visualization',
    'business intelligence', 'dashboard', 'spreadsheet', 'database',
    'reporting', 'data science', 'machine learning',
  ],
  design: [
    'design', 'ui', 'ux', 'graphic design', 'logo',
    'prototype', 'wireframe', 'layout', 'creative',
    'visual design', 'ui design',
  ],
  'social-media': [
    'social media', 'social', 'instagram', 'twitter', 'linkedin',
    'tiktok', 'scheduling', 'social management', 'influencer',
    'content calendar', 'social post',
  ],
  seo: [
    'seo', 'search engine', 'keyword', 'backlink', 'ranking',
    'search optimization', 'serp', 'meta tags', 'organic traffic',
    'keyword research',
  ],
  automation: [
    'automation', 'automate', 'workflow automation', 'no-code',
    'integration', 'zapier', 'api', 'rpa', 'bot',
    'process automation', 'low-code',
  ],
}

interface CategorizeInput {
  name: string
  tagline?: string | null
  description?: string | null
  features?: string[] | null
}

interface CategorizeResult {
  categories: CategorySlug[]
  scores: Record<string, number>
}

export function categorize(input: CategorizeInput): CategorizeResult {
  // Build weighted text: name 3x, tagline 2x, description + features 1x
  const parts: string[] = []
  const name = input.name.toLowerCase()
  parts.push(name, name, name)
  if (input.tagline) {
    const tagline = input.tagline.toLowerCase()
    parts.push(tagline, tagline)
  }
  if (input.description) parts.push(input.description.toLowerCase())
  if (input.features) parts.push(input.features.join(' ').toLowerCase())

  const text = parts.join(' ')

  const scores: Record<string, number> = {}

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
      const matches = text.match(regex)
      if (matches) {
        // Multi-word phrases get 1.5x weight
        const weight = keyword.includes(' ') ? 1.5 : 1
        score += matches.length * weight
      }
    }
    if (score > 0) {
      scores[category] = score
    }
  }

  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)

  const threshold = 2
  const categories = sorted
    .filter(([, score]) => score >= threshold)
    .slice(0, 3)
    .map(([cat]) => cat as CategorySlug)

  if (categories.length === 0) {
    return { categories: ['productivity'], scores }
  }

  return { categories, scores }
}
