import type { BotConfiguration } from '@prisma/client';
import { join } from 'path';
import BotManager from './lib/manager';
import { ManagerMode } from './types/manager';

const main = async () => {
  const manager = new BotManager(join(__dirname, './worker.ts'), ManagerMode.WORKER);
  const configurations: BotConfiguration[] = [
    {
      enabled: true,
      id: '1',
      userId: '1234'
    },
    {
      enabled: true,
      id: '2',
      userId: '4567'
    },
    {
      enabled: true,
      id: '2',
      userId: '4567'
    }
  ];

  await manager.spawn(configurations);
};

main();
