export * from './database'

// UI-specific types
export interface PricingDetails {
  free_tier?: boolean
  starting_price?: number
  currency?: string
  billing_period?: 'monthly' | 'yearly' | 'one_time'
  enterprise_pricing?: boolean
}

export interface AlertPreferences {
  deals: boolean
  digest: 'daily' | 'weekly' | 'never'
}

// Component prop types
export interface ToolCardVariant {
  variant?: 'default' | 'compact' | 'featured'
}

export interface DealCardVariant {
  variant?: 'default' | 'compact'
}

// Search/Filter types
export interface ToolFilters {
  category?: string
  pricing?: string[]
  search?: string
  featured?: boolean
}

export interface DealFilters {
  type?: string[]
  category?: string
  minDiscount?: number
  active?: boolean
}

// Pagination
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  totalPages: number
}
