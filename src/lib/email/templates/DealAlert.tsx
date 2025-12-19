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

interface DealAlertEmailProps {
  userName?: string
  deals: {
    id: string
    title: string
    toolName: string
    discountPercent?: number
    dealPrice?: number
    originalPrice?: number
    dealUrl: string
  }[]
  alertType: 'tool' | 'category'
  alertTarget: string // tool name or category name
  unsubscribeUrl: string
}

export function DealAlertEmail({
  userName = 'there',
  deals,
  alertType,
  alertTarget,
  unsubscribeUrl,
}: DealAlertEmailProps) {
  const previewText = `New ${alertType === 'tool' ? alertTarget : alertTarget + ' tool'} deal${deals.length > 1 ? 's' : ''} on SIFT`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>SIFT</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hey {userName},</Text>
            <Text style={intro}>
              {deals.length === 1
                ? `A new deal just dropped for ${alertTarget}!`
                : `${deals.length} new deals just dropped for ${alertTarget}!`}
            </Text>

            {/* Deals */}
            {deals.map((deal) => (
              <Section key={deal.id} style={dealCard}>
                <Text style={dealTitle}>{deal.title}</Text>
                <Text style={dealTool}>{deal.toolName}</Text>
                {deal.discountPercent && (
                  <Text style={dealDiscount}>{deal.discountPercent}% OFF</Text>
                )}
                <Section style={priceRow}>
                  {deal.dealPrice && (
                    <Text style={dealPrice}>${deal.dealPrice}</Text>
                  )}
                  {deal.originalPrice && (
                    <Text style={originalPrice}>${deal.originalPrice}</Text>
                  )}
                </Section>
                <Button style={ctaButton} href={deal.dealUrl}>
                  Get This Deal
                </Button>
              </Section>
            ))}

            <Text style={cta}>
              <Link href="https://sift.tools/deals" style={link}>
                View all deals on SIFT →
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You received this email because you set up a deal alert for {alertTarget}.
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe from this alert
              </Link>
              {' · '}
              <Link href="https://sift.tools/profile/alerts" style={footerLink}>
                Manage all alerts
              </Link>
            </Text>
            <Text style={footerText}>
              SIFT - AI Tool Deals & Directory
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
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

const dealCard = {
  backgroundColor: '#333333',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px',
}

const dealTitle = {
  color: '#e5e5e5',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const dealTool = {
  color: '#a3a3a3',
  fontSize: '14px',
  margin: '0 0 12px',
}

const dealDiscount = {
  color: '#5eead4',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const priceRow = {
  marginBottom: '16px',
}

const dealPrice = {
  color: '#e5e5e5',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  display: 'inline',
}

const originalPrice = {
  color: '#737373',
  fontSize: '16px',
  textDecoration: 'line-through',
  margin: '0 0 0 8px',
  display: 'inline',
}

const ctaButton = {
  backgroundColor: 'transparent',
  border: '2px solid #5eead4',
  borderRadius: '6px',
  color: '#5eead4',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '10px 20px',
  display: 'block',
}

const cta = {
  textAlign: 'center' as const,
  margin: '24px 0 0',
}

const link = {
  color: '#5eead4',
  textDecoration: 'none',
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

const footerLink = {
  color: '#737373',
  textDecoration: 'underline',
}

export default DealAlertEmail
