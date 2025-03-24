import './globals.css';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import Footer from '@/components/Footer';
import CookieNotice from '@/components/CookieNotice';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lucky Logic',
  description: 'Customer Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} flex flex-col min-h-screen bg-black text-white`}>
        {children}
        <Footer />
        <CookieNotice />
      </body>
    </html>
  );
} 