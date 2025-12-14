import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const footerLinks = {
  product: [
    { href: '/tools', label: 'Browse Tools' },
    { href: '/deals', label: 'Current Deals' },
    { href: '/vs', label: 'Compare Tools' },
    { href: '/submit', label: 'Submit a Tool' },
  ],
  categories: [
    { href: '/tools?category=writing', label: 'Writing' },
    { href: '/tools?category=image-generation', label: 'Image Generation' },
    { href: '/tools?category=coding', label: 'Coding' },
    { href: '/tools?category=productivity', label: 'Productivity' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Sift</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Sift through the noise. Discover the best AI tools and deals, curated for builders and creators.
            </p>

            {/* Newsletter Signup */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Get weekly deal alerts</p>
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="max-w-[240px] bg-secondary/50 border-0"
                />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-xs text-muted-foreground">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Sift. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Affiliate Disclosure: We may earn a commission when you click links on this site.
          </p>
        </div>
      </div>
    </footer>
  )
}
