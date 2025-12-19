'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { submitTool } from '@/lib/actions/submissions'

interface ToolSubmissionFormProps {
  categories: { id: string; name: string; slug: string }[]
}

const pricingModels = [
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'open_source', label: 'Open Source' },
]

export function ToolSubmissionForm({ categories }: ToolSubmissionFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [pricingModel, setPricingModel] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')

  function addFeature() {
    if (newFeature.trim() && features.length < 10) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
    }
  }

  function removeFeature(index: number) {
    setFeatures(features.filter((_, i) => i !== index))
  }

  function toggleCategory(categoryId: string) {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await submitTool({
        name,
        tagline,
        description,
        website_url: websiteUrl,
        logo_url: logoUrl || undefined,
        pricing_model: pricingModel || undefined,
        features,
        category_ids: selectedCategories,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSubmitted(true)
      }
    })
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Tool Submitted!</h3>
        <p className="text-muted-foreground mb-6">
          Thank you for your submission. We&apos;ll review it and add it to the directory if approved.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push('/submit')}>
            Submit Another
          </Button>
          <Button onClick={() => router.push('/profile/submissions')}>
            View Submissions
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Tool Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., ChatGPT"
          required
          maxLength={100}
        />
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline *</Label>
        <Input
          id="tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="A short description (e.g., AI-powered assistant)"
          required
          maxLength={150}
        />
        <p className="text-xs text-muted-foreground">{tagline.length}/150 characters</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what the tool does, its key features, and who it's for..."
          required
          rows={4}
          maxLength={2000}
        />
        <p className="text-xs text-muted-foreground">{description.length}/2000 characters</p>
      </div>

      {/* Website URL */}
      <div className="space-y-2">
        <Label htmlFor="website_url">Website URL *</Label>
        <Input
          id="website_url"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>

      {/* Logo URL */}
      <div className="space-y-2">
        <Label htmlFor="logo_url">Logo URL (optional)</Label>
        <Input
          id="logo_url"
          type="url"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://example.com/logo.png"
        />
        <p className="text-xs text-muted-foreground">Direct link to a square logo image</p>
      </div>

      {/* Pricing Model */}
      <div className="space-y-2">
        <Label htmlFor="pricing_model">Pricing Model</Label>
        <Select value={pricingModel} onValueChange={setPricingModel}>
          <SelectTrigger>
            <SelectValue placeholder="Select pricing model" />
          </SelectTrigger>
          <SelectContent>
            {pricingModels.map((model) => (
              <SelectItem key={model.value} value={model.value}>
                {model.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label>Categories (select up to 3)</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleCategory(category.id)}
            >
              {category.name}
              {selectedCategories.includes(category.id) && (
                <X className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-2">
        <Label>Key Features (up to 10)</Label>
        <div className="flex gap-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="e.g., Natural language processing"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addFeature()
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addFeature} disabled={features.length >= 10}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {feature}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeFeature(index)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Tool'
        )}
      </Button>
    </form>
  )
}
