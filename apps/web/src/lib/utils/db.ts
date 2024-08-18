import { db } from '@/lib/db';
import { Maybe } from '@/types/generics';
import { BotConfiguration } from '@prisma/client';

export const getConfiguration = async (userId: string) => {
  return await db.botConfiguration.findUnique({
    where: {
      userId
    }
  });
};

export const parseConfiguration = (config: Maybe<BotConfiguration>) =>
  config
    ? {
        ...config,
        enabledPlatforms: JSON.parse(config.enabledPlatforms)
      }
    : config;
