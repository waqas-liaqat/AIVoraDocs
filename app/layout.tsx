import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aivora DocFlow | Agency Document Studio & E-Sign Platform',
  description: 'Create, share, track and sign professional client documents for Aivora Automations.',
  icons: {
    icon: '/logo.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0b0f19] text-slate-100 antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
