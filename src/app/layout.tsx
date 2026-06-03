import './globals.css';
import { appConfig } from '@/lib/config';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { PWAInstall } from '@/components/PWAInstall';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: appConfig.app.name,
  description: appConfig.app.description,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: appConfig.app.name,
  },
  formatDetection: {
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: appConfig.theme.primaryColor,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo_ridgewell_es.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ViveScript Solutions",
              "url": "https://www.vivescriptsolutions.com",
              "logo": "https://www.vivescriptsolutions.com/logo.png",
              "description": "Leading software development and digital transformation company specializing in custom web applications and enterprise solutions",
              "sameAs": [
                "https://www.vivescriptsolutions.com",
                "https://www.vivescriptsolutions.com/en/services",
                "https://www.vivescriptsolutions.com/en/contact"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "url": "https://www.vivescriptsolutions.com/en/contact"
              },
              "areaServed": "Global",
              "knowsAbout": [
                "Web Application Development",
                "Enterprise Solutions",
                "Digital Transformation",
                "Custom Software Development",
                "Business Process Automation",
                "Progressive Web Apps (PWA)"
              ]
            })
          }}
        />
      </head>
      <body className="antialiased">
        <PWAInstall />
        {children}
        <Toaster position="top-right" richColors />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
