import "./globals.css"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata, Viewport } from "next"
import { Toaster } from "sonner"
import { DockWrapper } from "./components/DockWrapper"
import { Footer } from "./components/Footer"
import { ScrollToTop } from "./components/ScrollToTop"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const viewport: Viewport = {
  themeColor: "#0052FF",
}

export const metadata: Metadata = {
  title: "Based List",
  description: "A directory of people building on Base",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: "Based List",
    statusBarStyle: "default",
    capable: true,
  },
  openGraph: {
    title: "Based List",
    description: "A directory of people building on Base",
    url: "https://basedlist.xyz",
    siteName: "Based List",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Based List - A directory of people building on Base",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Based List",
    description: "A directory of people building on Base",
    images: ["/og-image.png"],
    creator: "@navigate_ai",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={`${inter.variable} antialiased bg-[#fafafa] text-[#393939] min-h-screen flex flex-col`}>
          <DockWrapper />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}