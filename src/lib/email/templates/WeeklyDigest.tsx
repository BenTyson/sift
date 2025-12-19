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

interface WeeklyDigestEmailProps {
  userName?: string
  topDeals: {
    id: string
    title: string
    toolName: string
    discountPercent?: number
    dealUrl: string
  }[]
  newTools: {
    id: string
    name: string
    tagline: string
    slug: string
  }[]
  stats: {
    totalDeals: number
    totalSavings: number
  }
  unsubscribeUrl: string
}

export function WeeklyDigestEmail({
  userName = 'there',
  topDeals,
  newTools,
  stats,
  unsubscribeUrl,
}: WeeklyDigestEmailProps) {
  const previewText = `This week: ${stats.totalDeals} deals, $${stats.totalSavings.toLocaleString()} in savings`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>SIFT</Text>
            <Text style={tagline}>Weekly AI Tool Digest</Text>
          </Section>

          {/* Stats Banner */}
          <Section style={statsBanner}>
            <Text style={statsText}>
              This week: <strong>{stats.totalDeals} deals</strong> · <strong>${stats.totalSavings.toLocaleString()}</strong> in potential savings
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Hey {userName},</Text>
            <Text style={intro}>
              Here&apos;s your weekly roundup of the best AI tool deals and new additions to SIFT.
            </Text>

            {/* Top Deals */}
            {topDeals.length > 0 && (
              <>
                <Text style={sectionTitle}>🔥 Top Deals This Week</Text>
                {topDeals.map((deal) => (
                  <Section key={deal.id} style={dealRow}>
                    <Text style={dealRowTitle}>{deal.title}</Text>
                    <Text style={dealRowMeta}>
                      {deal.toolName}
                      {deal.discountPercent && ` · ${deal.discountPercent}% off`}
                    </Text>
                    <Link href={deal.dealUrl} style={dealRowLink}>
                      View deal →
                    </Link>
                  </Section>
                ))}
                <Button style={ctaButton} href="https://sift.tools/deals">
                  See All Deals
                </Button>
              </>
            )}

            {/* New Tools */}
            {newTools.length > 0 && (
              <>
                <Text style={sectionTitle}>✨ New Tools Added</Text>
                {newTools.map((tool) => (
                  <Section key={tool.id} style={toolRow}>
                    <Text style={toolRowTitle}>{tool.name}</Text>
                    <Text style={toolRowTagline}>{tool.tagline}</Text>
                    <Link href={`https://sift.tools/tools/${tool.slug}`} style={dealRowLink}>
                      Learn more →
                    </Link>
                  </Section>
                ))}
                <Button style={secondaryButton} href="https://sift.tools/tools">
                  Browse All Tools
                </Button>
              </>
            )}

            {/* No content fallback */}
            {topDeals.length === 0 && newTools.length === 0 && (
              <Text style={noContent}>
                Quiet week! Check back soon for new deals and tools.
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              You&apos;re receiving this because you subscribed to the SIFT weekly digest.
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={footerLink}>
                Unsubscribe
              </Link>
              {' · '}
              <Link href="https://sift.tools/profile/settings" style={footerLink}>
                Email preferences
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
  textAlign: 'center' as const,
}

const logo = {
  color: '#5eead4',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
}

const tagline = {
  color: '#737373',
  fontSize: '14px',
  margin: '4px 0 0',
}

const statsBanner = {
  backgroundColor: '#5eead4',
  borderRadius: '8px',
  padding: '12px 20px',
  marginBottom: '20px',
}

const statsText = {
  color: '#1a1a1a',
  fontSize: '14px',
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

const sectionTitle = {
  color: '#e5e5e5',
  fontSize: '16px',
  fontWeight: '600',
  margin: '24px 0 16px',
}

const dealRow = {
  borderBottom: '1px solid #404040',
  paddingBottom: '16px',
  marginBottom: '16px',
}

const dealRowTitle = {
  color: '#e5e5e5',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const dealRowMeta = {
  color: '#a3a3a3',
  fontSize: '13px',
  margin: '0 0 8px',
}

const dealRowLink = {
  color: '#5eead4',
  fontSize: '13px',
  textDecoration: 'none',
}

const toolRow = {
  borderBottom: '1px solid #404040',
  paddingBottom: '16px',
  marginBottom: '16px',
}

const toolRowTitle = {
  color: '#e5e5e5',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const toolRowTagline = {
  color: '#a3a3a3',
  fontSize: '13px',
  margin: '0 0 8px',
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
  marginTop: '16px',
}

const secondaryButton = {
  backgroundColor: 'transparent',
  border: '1px solid #525252',
  borderRadius: '6px',
  color: '#a3a3a3',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '10px 20px',
  display: 'block',
  marginTop: '16px',
}

const noContent = {
  color: '#737373',
  fontSize: '14px',
  textAlign: 'center' as const,
  padding: '20px 0',
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

export default WeeklyDigestEmail
