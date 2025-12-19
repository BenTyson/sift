'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle } from 'lucide-react'
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
import { submitDeal } from '@/lib/actions/submissions'

interface DealSubmissionFormProps {
  tools: { id: string; name: string; slug: string }[]
}

const dealTypes = [
  { value: 'ltd', label: 'Lifetime Deal' },
  { value: 'discount', label: 'Discount' },
  { value: 'coupon', label: 'Coupon Code' },
  { value: 'trial', label: 'Free Trial' },
  { value: 'free', label: 'Free' },
]

export function DealSubmissionForm({ tools }: DealSubmissionFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [toolId, setToolId] = useState('')
  const [isNewTool, setIsNewTool] = useState(false)
  const [toolName, setToolName] = useState('')
  const [toolUrl, setToolUrl] = useState('')
  const [dealType, setDealType] = useState('discount')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [dealPrice, setDealPrice] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [dealUrl, setDealUrl] = useState('')
  const [expiresAt, setExpiresAt] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await submitDeal({
        tool_id: isNewTool ? undefined : toolId || undefined,
        tool_name: isNewTool ? toolName : undefined,
        tool_url: isNewTool ? toolUrl : undefined,
        deal_type: dealType,
        title,
        description: description || undefined,
        original_price: originalPrice ? parseFloat(originalPrice) : undefined,
        deal_price: dealPrice ? parseFloat(dealPrice) : undefined,
        discount_percent: discountPercent ? parseInt(discountPercent) : undefined,
        coupon_code: couponCode || undefined,
        deal_url: dealUrl,
        expires_at: expiresAt || undefined,
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
        <h3 className="text-xl font-semibold mb-2">Deal Submitted!</h3>
        <p className="text-muted-foreground mb-6">
          Thank you for sharing this deal. We&apos;ll review it and publish it if verified.
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

      {/* Tool Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant={!isNewTool ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsNewTool(false)}
          >
            Existing Tool
          </Button>
          <Button
            type="button"
            variant={isNewTool ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsNewTool(true)}
          >
            New Tool
          </Button>
        </div>

        {!isNewTool ? (
          <div className="space-y-2">
            <Label htmlFor="tool_id">Select Tool *</Label>
            <Select value={toolId} onValueChange={setToolId}>
              <SelectTrigger>
                <SelectValue placeholder="Search for a tool..." />
              </SelectTrigger>
              <SelectContent>
                {tools.map((tool) => (
                  <SelectItem key={tool.id} value={tool.id}>
                    {tool.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="tool_name">Tool Name *</Label>
              <Input
                id="tool_name"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="e.g., New AI Tool"
                required={isNewTool}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tool_url">Tool Website</Label>
              <Input
                id="tool_url"
                type="url"
                value={toolUrl}
                onChange={(e) => setToolUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </>
        )}
      </div>

      {/* Deal Type */}
      <div className="space-y-2">
        <Label htmlFor="deal_type">Deal Type *</Label>
        <Select value={dealType} onValueChange={setDealType}>
          <SelectTrigger>
            <SelectValue placeholder="Select deal type" />
          </SelectTrigger>
          <SelectContent>
            {dealTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Deal Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., 50% off annual plan"
          required
          maxLength={200}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any additional details about the deal..."
          rows={3}
          maxLength={1000}
        />
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="original_price">Original Price ($)</Label>
          <Input
            id="original_price"
            type="number"
            step="0.01"
            min="0"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="99.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deal_price">Deal Price ($)</Label>
          <Input
            id="deal_price"
            type="number"
            step="0.01"
            min="0"
            value={dealPrice}
            onChange={(e) => setDealPrice(e.target.value)}
            placeholder="49.00"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discount_percent">Discount %</Label>
          <Input
            id="discount_percent"
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coupon_code">Coupon Code</Label>
          <Input
            id="coupon_code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="SAVE50"
          />
        </div>
      </div>

      {/* Deal URL */}
      <div className="space-y-2">
        <Label htmlFor="deal_url">Deal URL *</Label>
        <Input
          id="deal_url"
          type="url"
          value={dealUrl}
          onChange={(e) => setDealUrl(e.target.value)}
          placeholder="https://example.com/deal"
          required
        />
        <p className="text-xs text-muted-foreground">
          Direct link to the deal or landing page
        </p>
      </div>

      {/* Expiration */}
      <div className="space-y-2">
        <Label htmlFor="expires_at">Expiration Date</Label>
        <Input
          id="expires_at"
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Deal'
        )}
      </Button>
    </form>
  )
}
