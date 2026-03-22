import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const GA_ID = 'G-849LG7SR5K';

export const metadata: Metadata = {
  title: 'QRgen - Create Custom QR Codes',
  description: 'Generate and customize QR codes for websites, text, WiFi, contacts, and more — free, no sign-up.',
  metadataBase: new URL('https://qrgen.meetsid.dev'),
  openGraph: {
    title: 'QRgen - QR Code Generator',
    description: 'Generate and customize QR codes for websites, text, WiFi, contacts, and more — free, no sign-up.',
    url: 'https://qrgen.meetsid.dev',
    type: 'website',
    images: [{ url: '/assets/thumbnail.png', width: 1200, height: 630, alt: 'QRgen QR Code Generator' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QRgen - QR Code Generator',
    description: 'Generate and customize QR codes for websites, text, WiFi, contacts, and more — free, no sign-up.',
    images: ['/assets/thumbnail.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-dvh overflow-x-hidden font-body antialiased">
        {children}
        <Toaster />

        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
