import Footer from '@/components/footer';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import NextAuthProvider from '@/lib/auth/Provider';
import { getUserAuth } from '@/lib/auth/utils';
import { redirect } from 'next/navigation';
import PostHogClient from '../posthog';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { session } = await getUserAuth();

  if (!session) return redirect('/signin');

  const posthog = PostHogClient();

  posthog.capture({
    distinctId: session.user.id,
    event: 'Page was loaded'
  });

  await posthog.shutdown();

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
