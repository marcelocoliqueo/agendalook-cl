import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '@/contexts/SupabaseContext';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Agendalook — Agenda simple y profesional',
  description: 'Agenda online simple para psicólogos, estilistas, coaches y más. Recordatorios por WhatsApp, reservas y gestión de clientes.',
  keywords: 'agenda online, reservas, citas, psicólogos, estilistas, coaches, recordatorios, WhatsApp, gestión de clientes',
  authors: [{ name: 'Agendalook Team' }],
  creator: 'Agendalook',
  publisher: 'Agendalook',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://agendalook.cl'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Agendalook — Agenda simple y profesional',
    description: 'Agenda online simple para psicólogos, estilistas, coaches y más. Recordatorios por WhatsApp, reservas y gestión de clientes.',
    url: 'https://agendalook.cl',
    siteName: 'Agendalook',
    images: [
      {
        url: '/logo-main.png',
        width: 200,
        height: 200,
        alt: 'Agendalook Logo',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agendalook — Agenda simple y profesional',
    description: 'Agenda online simple para psicólogos, estilistas, coaches y más.',
    images: ['/logo-main.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  other: {
    'theme-color': '#0ea5e9',
    'msapplication-TileColor': '#0ea5e9',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Agendalook',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.jpeg" type="image/jpeg" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo-compact.png" />
      </head>
      <body className={`${inter.variable} font-inter`}>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
