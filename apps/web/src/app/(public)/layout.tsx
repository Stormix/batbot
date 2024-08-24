import Footer from '@/components/footer';
import PublicNavbar from '@/components/molecules/public-navbar';
import { Toaster } from '@/components/ui/sonner';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="flex flex-col h-screen">
        <PublicNavbar />
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex flex-col flex-grow">{children}</div>
          <Footer />
        </main>
      </div>
      <Toaster richColors />
    </main>
  );
}
