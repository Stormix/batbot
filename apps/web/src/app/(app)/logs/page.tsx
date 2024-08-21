import PageBreadcrumbs from '@/components/molecules/page-breadcrumbs';
import ChatLogs from '@/components/organisms/chat-logs';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { subDays } from 'date-fns';

const Logs = async () => {
  const { session } = await getUserAuth();

  const messages = await db.chatMessage.findMany({
    where: {
      userId: session!.user.id,
      timestamp: {
        gte: subDays(new Date(), 30)
      }
    },
    take: 1000,
    orderBy: {
      timestamp: 'desc'
    }
  });

  return (
    <main className="flex flex-col gap-2">
      <h3 className="text-2xl font-semibold">Logs</h3>
      <PageBreadcrumbs path={['chatbot', 'logs']} />
      <section className="space-y-4 mt-8">
        <ChatLogs messages={messages} />
      </section>
    </main>
  );
};

export default Logs;
