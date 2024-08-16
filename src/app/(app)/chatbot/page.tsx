import PageBreadcrumbs from '@/components/molecules/page-breadcrumbs';
import BotConfiguration from '@/components/organisms/bot-configuration';
import { getUserAuth } from '@/lib/auth/utils';

export default async function Home() {
  const { session } = await getUserAuth();
  return (
    <main className="flex flex-col gap-2">
      <h3 className="text-2xl font-semibold">Chat Bot settings</h3>
      <PageBreadcrumbs path={['chatbot']} />

      <section className="space-y-4 mt-8">
        <BotConfiguration />
      </section>
    </main>
  );
}
