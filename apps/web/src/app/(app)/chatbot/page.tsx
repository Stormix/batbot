import PageBreadcrumbs from '@/components/molecules/page-breadcrumbs';
import BotConfiguration from '@/components/organisms/bot-configuration';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';

export default async function ChatBot() {
  const { session } = await getUserAuth();
  const botConfiguration = await db.botConfiguration.findUnique({
    where: {
      userId: session!.user.id
    }
  });

  return (
    <main className="flex flex-col gap-2">
      <h3 className="text-2xl font-semibold">Bot settings</h3>
      <PageBreadcrumbs path={['chatbot', 'settings']} />

      <section className="space-y-4 mt-8">
        <BotConfiguration initialValues={botConfiguration} />
      </section>
    </main>
  );
}
