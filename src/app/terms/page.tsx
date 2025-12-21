import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for using Sift - the AI tools directory and deals platform.',
}

export default function TermsPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using Sift, you agree to be bound by these Terms of Service. If you
            do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p className="text-muted-foreground">
            Sift is a directory and discovery platform for AI tools. We aggregate information
            about AI tools, track deals, and provide comparison features. We also facilitate
            user submissions and community features.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>You must provide accurate information when creating an account</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You must not share your account credentials with others</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">4. User Submissions</h2>
          <p className="text-muted-foreground mb-4">When submitting tools or deals:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>You must have the right to submit the information</li>
            <li>Submissions must be accurate and not misleading</li>
            <li>We reserve the right to reject or remove submissions</li>
            <li>You grant us a license to display and use submitted content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Affiliate Links & Deals</h2>
          <p className="text-muted-foreground mb-4">
            Sift contains affiliate links. When you click these links and make purchases, we
            may earn a commission. Please note:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Deal information is provided for informational purposes</li>
            <li>We do not guarantee the accuracy of pricing or availability</li>
            <li>Deals may expire or change without notice</li>
            <li>Your purchase is between you and the third-party vendor</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Prohibited Conduct</h2>
          <p className="text-muted-foreground mb-4">You agree not to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Use the service for any illegal purpose</li>
            <li>Submit false or misleading information</li>
            <li>Attempt to access other users' accounts</li>
            <li>Scrape or harvest data from the site without permission</li>
            <li>Interfere with the proper operation of the service</li>
            <li>Use automated systems to access the service excessively</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground">
            Sift is provided "as is" without warranties of any kind. We do not guarantee that
            the service will be uninterrupted or error-free. Tool information and deals are
            provided for informational purposes and may not be accurate or current.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the maximum extent permitted by law, Sift shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of
            the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We may update these terms from time to time. Continued use of the service after
            changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact</h2>
          <p className="text-muted-foreground">
            Questions about these terms? Email us at{' '}
            <a href="mailto:legal@sift.tools" className="text-primary hover:underline">
              legal@sift.tools
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
