import './globals.css';
import { appConfig } from '@/lib/config';

export const metadata = {
  title: appConfig.app.name,
  description: appConfig.app.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
