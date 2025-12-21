import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Sift - your trusted source for discovering the best AI tools and deals.',
}

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">About Sift</h1>

      <div className="prose prose-invert max-w-none space-y-6">
        <p className="text-lg text-muted-foreground">
          Sift helps you discover the best AI tools and never miss a deal. We curate, compare, and track
          hundreds of AI tools so you can make informed decisions.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p className="text-muted-foreground">
          The AI tools landscape is overwhelming. New tools launch daily, deals come and go, and it's
          hard to know which tools actually deliver value. Sift exists to cut through the noise.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">What We Do</h2>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li><strong>Curate AI Tools</strong> - We catalog the best AI tools across categories like writing, image generation, coding, and more.</li>
          <li><strong>Track Deals</strong> - We monitor deal sites and alert you when tools you care about go on sale.</li>
          <li><strong>Compare Features</strong> - Side-by-side comparisons help you choose the right tool for your needs.</li>
          <li><strong>Community Driven</strong> - Users can submit tools and deals, vote on favorites, and set up personalized alerts.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">Affiliate Disclosure</h2>
        <p className="text-muted-foreground">
          Some links on Sift are affiliate links. When you purchase through these links, we may earn a
          commission at no extra cost to you. This helps us keep the site running and free to use.
          We only recommend tools we believe provide genuine value.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Contact</h2>
        <p className="text-muted-foreground">
          Have questions, feedback, or want to partner with us? Reach out at{' '}
          <a href="mailto:hello@sift.tools" className="text-primary hover:underline">
            hello@sift.tools
          </a>
        </p>
      </div>
    </div>
  )
}
