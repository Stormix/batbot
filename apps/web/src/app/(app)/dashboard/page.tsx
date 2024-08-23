import PageBreadcrumbs from '@/components/molecules/page-breadcrumbs';
import CommandsStats from '@/components/organisms/charts/commands-stats';
import MessageStats from '@/components/organisms/charts/message-stats';
import PlatformStats from '@/components/organisms/charts/platform-stats';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { Platform } from '@batbot/types';
import { sub } from 'date-fns';

const Dashboard = async () => {
  const { session } = await getUserAuth();
  if (!session) {
    return null;
  }

  // Last 3 months
  const startDate = sub(new Date(), { months: 3 });
  const endDate = new Date();

  const range = {
    startDate,
    endDate
  };

  // RAW DOGGING IT
  const messagesStats = (await db.$queryRaw`
      SELECT 
        DATE("timestamp") as date,
        COUNT(*)::integer as messages
      FROM 
        "ChatMessage"
      WHERE
        "userId" = ${session!.user.id}
        AND "timestamp" >= ${startDate}
        AND "timestamp" <= ${endDate}
      GROUP BY 
        DATE("timestamp")
      ORDER BY 
        date ASC;
    `) satisfies Array<{
    date: string;
    messages: number;
  }>;

  const commandsStats = await db.botCommandRuns.groupBy({
    by: ['command'],
    _count: {
      _all: true
    },
    where: {
      userId: session!.user.id,
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    },
    take: 5,
    orderBy: {
      _count: {
        command: 'desc'
      }
    }
  });

  const formattedCommandsStats = commandsStats
    .map((stat) => ({
      command: `!${stat.command}`,
      messages: stat._count._all
    }))
    .sort((a, b) => b.messages - a.messages) satisfies Array<{ command: string; messages: number }>;

  const popularPlatforms = await db.botCommandRuns.groupBy({
    by: ['platform'],
    _count: {
      _all: true
    },
    where: {
      userId: session!.user.id,
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  const platformStats = popularPlatforms.map((stat) => ({
    platform: stat.platform as Platform,
    messages: stat._count._all
  }));

  return (
    <main className="space-y-4">
      <h3 className="text-2xl font-semibold">Dashboard</h3>
      <PageBreadcrumbs path={['dashboard']} />
      <section className="grid grid-cols-4 grid-rows-2 gap-8 pt-8">
        <MessageStats className="flex flex-col col-span-3 row-span-2" stats={messagesStats} range={range} />
        <CommandsStats stats={formattedCommandsStats} range={range} />
        <PlatformStats stats={platformStats} range={range} />
      </section>
    </main>
  );
};

export default Dashboard;
