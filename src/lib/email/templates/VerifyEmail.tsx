import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Button,
  Hr,
  Preview,
} from '@react-email/components'

interface VerifyEmailProps {
  verifyUrl: string
}

export function VerifyEmail({ verifyUrl }: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your SIFT newsletter subscription</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>SIFT</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Welcome to SIFT!</Text>
            <Text style={intro}>
              Thanks for subscribing to our newsletter. Click the button below to confirm your
              email and start receiving weekly AI tool deals.
            </Text>

            <Section style={ctaSection}>
              <Button style={ctaButton} href={verifyUrl}>
                Confirm Subscription
              </Button>
            </Section>

            <Text style={fallback}>
              Or copy and paste this link into your browser:{' '}
              <Link href={verifyUrl} style={link}>
                {verifyUrl}
              </Link>
            </Text>

            <Text style={expiry}>
              This link expires in 7 days. If you didn&apos;t sign up for SIFT, you can safely
              ignore this email.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              SIFT - AI Tool Deals & Directory
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles (matching existing email templates)
const main = {
  backgroundColor: '#1a1a1a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const header = {
  padding: '20px 0',
}

const logo = {
  color: '#5eead4',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0',
}

const content = {
  backgroundColor: '#262626',
  borderRadius: '8px',
  padding: '32px 24px',
}

const greeting = {
  color: '#e5e5e5',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px',
}

const intro = {
  color: '#a3a3a3',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 24px',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const ctaButton = {
  backgroundColor: 'transparent',
  border: '2px solid #5eead4',
  borderRadius: '6px',
  color: '#5eead4',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 32px',
  display: 'inline-block',
}

const fallback = {
  color: '#737373',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '16px 0 0',
  wordBreak: 'break-all' as const,
}

const link = {
  color: '#5eead4',
  textDecoration: 'none',
}

const expiry = {
  color: '#737373',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '16px 0 0',
}

const hr = {
  borderColor: '#404040',
  margin: '32px 0',
}

const footer = {
  padding: '0 24px',
}

const footerText = {
  color: '#737373',
  fontSize: '12px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '0 0 8px',
}

export default VerifyEmail
