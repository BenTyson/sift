export const CATEGORY_SLUGS = [
  'writing', 'image-generation', 'video', 'audio', 'coding',
  'productivity', 'marketing', 'sales', 'customer-support',
  'research', 'data', 'design', 'social-media', 'seo', 'automation',
] as const

export type CategorySlug = typeof CATEGORY_SLUGS[number]
