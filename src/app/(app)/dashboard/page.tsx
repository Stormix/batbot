import PageBreadcrumbs from '@/components/molecules/page-breadcrumbs';
import CommandsStats from '@/components/organisms/charts/commands-stats';
import MessageStats from '@/components/organisms/charts/message-stats';
import PlatformStats from '@/components/organisms/charts/platform-stats';
import { getUserAuth } from '@/lib/auth/utils';

export default async function Home() {
  const { session } = await getUserAuth();

  return (
    <main className="space-y-4">
      <h3 className="text-2xl font-semibold">Dashboard</h3>
      <PageBreadcrumbs path={['dashboard']} />
      <section className="grid grid-cols-4 grid-rows-2 gap-8 pt-8">
        <MessageStats className="flex flex-col col-span-3 row-span-2" />
        <CommandsStats />
        <PlatformStats />
      </section>
    </main>
  );
}
