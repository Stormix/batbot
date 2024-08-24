import PageBreadcrumbs from '@/components/molecules/page-breadcrumbs';
import BotConfiguration from '@/components/organisms/bot-configuration';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { NON_STREAMING_PLATFORMS } from '@batbot/types';

export const metadata = {
  title: 'Chatbot Settings | Batbot',
  description: 'Configure your chatbot settings.'
};

export default async function ChatBot() {
  const { session } = await getUserAuth();
  const botConfiguration = await db.botConfiguration.findUnique({
    where: {
      userId: session!.user.id
    }
  });

  const accounts = await db.account.findMany({
    where: {
      userId: session?.user.id
    }
  });

  const platforms = accounts
    .map((account) => account.provider)
    .filter((provider) => !NON_STREAMING_PLATFORMS.includes(provider));

  return (
    <main className="flex flex-col gap-2">
      <h3 className="text-2xl font-semibold">Bot settings</h3>
      <PageBreadcrumbs path={['chatbot', 'settings']} />
      <section className="space-y-4 mt-8">
        <BotConfiguration initialValues={botConfiguration} platforms={platforms} />
      </section>
    </main>
  );
}
