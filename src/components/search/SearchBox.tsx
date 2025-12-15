'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, X, Loader2, ArrowRight, Tag, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  slug: string
  tagline: string
  pricing_model: string
  category_names: string[]
}

interface SearchBoxProps {
  placeholder?: string
  className?: string
  onSelect?: () => void
}

export function SearchBox({ placeholder = 'Search AI tools...', className, onSelect }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.hits || [])
        setIsOpen(true)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && results[selectedIndex]) {
          router.push(`/tools/${results[selectedIndex].slug}`)
          setIsOpen(false)
          setQuery('')
          onSelect?.()
        } else if (query.trim()) {
          router.push(`/tools?search=${encodeURIComponent(query)}`)
          setIsOpen(false)
          onSelect?.()
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }, [isOpen, results, selectedIndex, query, router, onSelect])

  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        ) : query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {results.length > 0 ? (
            <>
              <div className="max-h-80 overflow-y-auto">
                {results.map((result, index) => (
                  <Link
                    key={result.id}
                    href={`/tools/${result.slug}`}
                    onClick={() => {
                      setIsOpen(false)
                      setQuery('')
                      onSelect?.()
                    }}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors',
                      selectedIndex === index && 'bg-secondary/50'
                    )}
                  >
                    <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {result.pricing_model}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {result.tagline}
                      </p>
                      {result.category_names.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {result.category_names.slice(0, 2).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                  </Link>
                ))}
              </div>
              <div className="border-t border-border px-4 py-2 bg-secondary/30">
                <Link
                  href={`/tools?search=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setIsOpen(false)
                    onSelect?.()
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
                >
                  <Search className="h-3 w-3" />
                  View all results for &quot;{query}&quot;
                </Link>
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No tools found for &quot;{query}&quot;</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
