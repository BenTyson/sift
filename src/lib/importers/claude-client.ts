import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
// Will be null if ANTHROPIC_API_KEY is not set (graceful degradation)
export const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

// Check if Claude API is configured
export function isClaudeConfigured(): boolean {
  return anthropic !== null
}
