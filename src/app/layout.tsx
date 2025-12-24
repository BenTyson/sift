import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import { Header, Footer } from "@/components/layout"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Sift - Discover the Best AI Tools & Deals",
    template: "%s | Sift",
  },
  description:
    "Sift through the noise. Find the best AI tools, compare features, and never miss a deal. 500+ tools, daily deal alerts, and side-by-side comparisons.",
  keywords: [
    "AI tools",
    "AI deals",
    "AI software",
    "AI comparison",
    "lifetime deals",
    "AppSumo deals",
    "AI writing tools",
    "AI image generators",
  ],
  authors: [{ name: "Sift" }],
  creator: "Sift",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Sift",
    title: "Sift - Discover the Best AI Tools & Deals",
    description:
      "Sift through the noise. Find the best AI tools, compare features, and never miss a deal.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sift - Discover the Best AI Tools & Deals",
    description:
      "Sift through the noise. Find the best AI tools, compare features, and never miss a deal.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Plausible Analytics */}
        <Script
          src="https://plausible.io/js/pa-IgVVLHi9hJQvevJzXrrRI.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>
      </body>
    </html>
  )
}
