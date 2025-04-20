import type { Metadata, Viewport } from 'next';
import { Lato } from 'next/font/google';
import { getURL } from '@/utils/helpers';
import { siteConfig } from '@/config/site';
import { ThemeProvider } from '@/components/theme-provider';
import { TRPCReactProvider } from '@/trpc/react';
import React, { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'Server Components',
    'Radix UI',
    'Shadcn',
  ],
  authors: [
    {
      name: 'antoineross',
      url: 'https://antoineross.com',
    },
  ],
  creator: 'antoineross',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: '@antoineross',
  },
  icons: {
    icon: '/logo.svg',
    // shortcut: '/favicon-16x16.png',
    // apple: '/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={lato.className}>
        <Suspense fallback={null}>
          <NextTopLoader color="#3B82F6" showSpinner={false} />
          <NuqsAdapter>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <TRPCReactProvider>
                {children}
                <Toaster />
              </TRPCReactProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </Suspense>
      </body>
    </html>
  );
}
