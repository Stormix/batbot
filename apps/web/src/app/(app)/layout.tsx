import Footer from '@/components/footer';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import NextAuthProvider from '@/lib/auth/Provider';
import { checkAuth } from '@/lib/auth/utils';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await checkAuth();
  return (
    <TooltipProvider>
      <NextAuthProvider>
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 pt-2 px-8 overflow-y-auto flex flex-col">
            <div className="flex flex-col flex-grow">
              <Navbar />
              {children}
            </div>
            <Footer />
          </main>
        </div>
      </NextAuthProvider>
      <Toaster richColors />
    </TooltipProvider>
  );
}
