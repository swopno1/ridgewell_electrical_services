import './globals.css';
import { appConfig } from '@/lib/config';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { PWAInstall } from '@/components/PWAInstall';

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
      <body className="antialiased">
        <PWAInstall />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
