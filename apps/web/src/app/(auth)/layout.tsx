import Logo from '@/components/logo';
import BackButton from '@/components/molecules/back';
import { Separator } from '@/components/ui/separator';
import { getUserAuth } from '@/lib/auth/utils';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Batbot - Sign in',
  description: 'Sign in to your Batbot account'
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getUserAuth();
  if (session?.session) redirect('/dashboard');

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center [&>div]:w-full bg-background">
      <header className="absolute top-0 flex w-full items-center justify-between px-8 py-8">
        <BackButton />
      </header>
      <div className="container relative flex flex-col items-center justify-center lg:max-w-none lg:px-0">
        <div className="flex w-full flex-col lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col items-center gap-4 text-center">
              <Logo variant="withText" className="w-24 h-24 flex-col" />
              <Separator className="my-4 max-w-[100px] bg-muted-foreground/50" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
