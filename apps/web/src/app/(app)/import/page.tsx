import PageBreadcrumbs from '@/components/molecules/page-breadcrumbs';
import ImportCard from '@/components/organisms/import-card';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { ImportProvider } from '@/lib/import/constants';

const Import = async () => {
  const { session } = await getUserAuth();
  const botConfiguration = await db.botConfiguration.findUnique({
    where: {
      userId: session!.user.id
    }
  });
  const commands = await db.botCommand.findMany({
    where: {
      userId: session!.user.id
    }
  });

  const accounts = await db.account.findMany({
    where: {
      userId: session!.user.id
    }
  });

  const nightbot = accounts.find((account) => account.provider === 'nightbot');

  return (
    <main className="flex flex-col gap-2">
      <h3 className="text-2xl font-semibold">Import</h3>
      <PageBreadcrumbs path={['chatbot', 'import']} />
      <section className="space-y-4 mt-8">
        <ImportCard provider={ImportProvider.StreamElements} configuration={botConfiguration} commands={commands} />
        <ImportCard
          provider={ImportProvider.NightBot}
          configuration={botConfiguration}
          commands={commands}
          providerAccount={nightbot ? { id: nightbot.providerAccountId, username: nightbot.username } : undefined}
          requireAccount
        />
      </section>
    </main>
  );
};

export default Import;
