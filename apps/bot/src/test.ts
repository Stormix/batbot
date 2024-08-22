import { Platform } from '@batbot/types';
import { Bot } from './bot';
import { db } from './db';
import { ManagerMode } from './types/manager';

const USER_ID = 'user_41b9de86-3820-4fa6-b1ca-664699dadb5f';

const configuration = await db.botConfiguration.findFirst({
  where: {
    userId: USER_ID
  }
});

const accounts = await db.account.findMany({
  where: {
    userId: USER_ID,
    provider: {
      in: Object.values(Platform)
    }
  }
});

const channels = accounts.reduce(
  (acc, account) => {
    if (account.username) {
      acc[account.provider as Platform] = account.username;
    }
    return acc;
  },
  {} as Partial<Record<Platform, string>>
);

if (!configuration) {
  throw new Error('Bot configuration not found');
}

const bot = new Bot(configuration, channels, ManagerMode.STANDALONE);

await bot.setup();
await bot.listen();
