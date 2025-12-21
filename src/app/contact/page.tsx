import { Metadata } from 'next'
import { Mail, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Sift team. We\'d love to hear from you.',
}

export default function ContactPage() {
  return (
    <div className="container px-4 md:px-6 py-12 md:py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-8">
        Have a question, suggestion, or want to work with us? We'd love to hear from you.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Us
            </CardTitle>
            <CardDescription>
              For general inquiries and support
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="mailto:hello@sift.tools"
              className="text-primary hover:underline font-medium"
            >
              hello@sift.tools
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Feedback
            </CardTitle>
            <CardDescription>
              Help us improve Sift
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Found a bug? Have a feature request? Email us or submit feedback through the site.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="text-xl font-semibold">Common Topics</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Submit a Tool</h3>
            <p className="text-sm text-muted-foreground">
              Want to list your AI tool on Sift?{' '}
              <a href="/submit/tool" className="text-primary hover:underline">Submit it here</a>.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Report a Deal</h3>
            <p className="text-sm text-muted-foreground">
              Found a great deal we should know about?{' '}
              <a href="/submit/deal" className="text-primary hover:underline">Submit it here</a>.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-1">Partnerships</h3>
            <p className="text-sm text-muted-foreground">
              Interested in partnering with Sift? Email us at{' '}
              <a href="mailto:partnerships@sift.tools" className="text-primary hover:underline">
                partnerships@sift.tools
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
