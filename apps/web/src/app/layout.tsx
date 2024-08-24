import { ThemeProvider } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils/styles';
import type { Metadata } from 'next';
import { Inter, Rajdhani } from 'next/font/google';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: '400'
});

export const metadata: Metadata = {
  title: 'Batbot',
  description: 'Best streaming chat bot'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, rajdhani.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
