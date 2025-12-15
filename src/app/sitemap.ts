import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://sift.tools'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Get all tools
  const { data: tools } = await supabase
    .from('tools')
    .select('slug, updated_at')
    .eq('status', 'active')
    .order('upvotes', { ascending: false }) as { data: { slug: string; updated_at: string }[] | null }

  // Get all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug') as { data: { slug: string }[] | null }

  // Get all deals
  const { data: deals } = await supabase
    .from('deals')
    .select('id, updated_at')
    .eq('is_active', true) as { data: { id: string; updated_at: string }[] | null }

  const sitemap: MetadataRoute.Sitemap = []

  // Static pages
  sitemap.push(
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/deals`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }
  )

  // Tool pages
  if (tools) {
    for (const tool of tools) {
      sitemap.push({
        url: `${BASE_URL}/tools/${tool.slug}`,
        lastModified: new Date(tool.updated_at),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }
  }

  // Alternative pages (one per tool)
  if (tools) {
    for (const tool of tools) {
      sitemap.push({
        url: `${BASE_URL}/alternatives/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  // Best category pages
  if (categories) {
    for (const category of categories) {
      sitemap.push({
        url: `${BASE_URL}/best/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  // Comparison pages (top tool combinations)
  if (tools && tools.length >= 2) {
    const topTools = tools.slice(0, 15) // Top 15 tools

    for (let i = 0; i < topTools.length; i++) {
      for (let j = i + 1; j < topTools.length; j++) {
        sitemap.push({
          url: `${BASE_URL}/vs/${topTools[i].slug}-vs-${topTools[j].slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  }

  return sitemap
}
