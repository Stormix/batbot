import PageBreadcrumbs from '@/components/molecules/page-breadcrumbs';
import { getUserAuth } from '@/lib/auth/utils';

export default async function Home() {
  const { session } = await getUserAuth();
  return (
    <main className="space-y-4">
      <h3 className="text-2xl font-semibold">Dashboard</h3>
      <PageBreadcrumbs path={['dashboard']} />

      <section className="space-y-4">TODO !</section>
    </main>
  );
}
