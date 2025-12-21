import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Sift - how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-4">We collect information you provide directly:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>Account Information:</strong> Email address when you sign up</li>
            <li><strong>Profile Information:</strong> Username and preferences you set</li>
            <li><strong>Submissions:</strong> Tools and deals you submit for review</li>
            <li><strong>Newsletter:</strong> Email address if you subscribe to our newsletter</li>
          </ul>

          <p className="text-muted-foreground mt-4 mb-4">We automatically collect:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li><strong>Usage Data:</strong> Pages visited, tools viewed, clicks on affiliate links</li>
            <li><strong>Device Information:</strong> Browser type, operating system</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Provide and improve our services</li>
            <li>Send deal alerts and newsletters you've subscribed to</li>
            <li>Process tool and deal submissions</li>
            <li>Track affiliate link clicks for commission purposes</li>
            <li>Analyze usage to improve the site</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-muted-foreground">
            We do not sell your personal information. We may share data with:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
            <li><strong>Service Providers:</strong> Hosting, email delivery, analytics</li>
            <li><strong>Affiliate Networks:</strong> Click tracking for commission attribution</li>
            <li><strong>Legal Requirements:</strong> When required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p className="text-muted-foreground">
            We use industry-standard security measures to protect your data. Your account is
            protected by authentication, and we use HTTPS encryption for all data transmission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          <p className="text-muted-foreground mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Access your personal data</li>
            <li>Update or correct your information</li>
            <li>Delete your account and associated data</li>
            <li>Unsubscribe from marketing emails</li>
            <li>Opt out of deal alerts</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Cookies</h2>
          <p className="text-muted-foreground">
            We use essential cookies for authentication and site functionality. We may use
            analytics cookies to understand how visitors use our site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
          <p className="text-muted-foreground">
            Questions about this privacy policy? Email us at{' '}
            <a href="mailto:privacy@sift.tools" className="text-primary hover:underline">
              privacy@sift.tools
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
