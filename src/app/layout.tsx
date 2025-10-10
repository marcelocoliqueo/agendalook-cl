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
  title: 'Agendalook | Agenda online para belleza, salud y bienestar',
  description: 'Agenda, cobra y confirma tus citas con facilidad. Agendalook conecta tu negocio con tus clientes: recordatorios por WhatsApp, pagos online y prueba gratis de 30 días.',
  keywords: 'agenda online, agendamiento, reservas, belleza, salud, bienestar, psicólogos, spas, clínicas, peluquerías, agendamiento Chile, WhatsApp, MercadoPago',
  authors: [{ name: 'Agendalook' }],
  creator: 'Agendalook',
  publisher: 'Agendalook',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.jpeg', type: 'image/jpeg' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/logo-compact.png', sizes: '180x180' }
    ]
  },
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
    title: 'Agendalook | Agenda online para belleza, salud y bienestar',
    description: 'Simplifica tus reservas, recordatorios y pagos en un solo lugar. 30 días gratis sin tarjeta.',
    url: 'https://agendalook.cl',
    siteName: 'Agendalook',
    images: [
      {
        url: 'https://agendalook.cl/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Agendalook - Agenda online para belleza, salud y bienestar'
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agendalook | Agenda online para belleza, salud y bienestar',
    description: 'Gestiona tus reservas, recordatorios y pagos. Prueba gratis 30 días.',
    images: ['https://agendalook.cl/og-cover.jpg'],
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
