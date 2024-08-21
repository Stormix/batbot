import { Bot } from './bot';
import { db } from './db';
import { ManagerMode } from './types/manager';

const configuration = await db.botConfiguration.findFirst({
  where: {
    userId: 'user_41b9de86-3820-4fa6-b1ca-664699dadb5f'
  }
});

if (!configuration) {
  throw new Error('Bot configuration not found');
}

const bot = new Bot(configuration, ManagerMode.STANDALONE);

await bot.setup();
await bot.listen();
