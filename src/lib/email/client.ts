import { Resend } from 'resend'

// Initialize Resend client
// Will be null if RESEND_API_KEY is not set (graceful degradation)
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Default from address
export const FROM_EMAIL = process.env.FROM_EMAIL || 'SIFT <noreply@sift.tools>'

// Check if email is configured
export function isEmailConfigured(): boolean {
  return resend !== null
}
