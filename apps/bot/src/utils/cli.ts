import type { Platform } from '@batbot/types';
import type { BotConfiguration } from '@prisma/client';

export const parseBotArgs = (args: string[]) => {
  let mode = '';
  let config = '';

  args.forEach((arg, index) => {
    if (arg === '--mode') {
      mode = args[index + 1];
    } else if (arg === '--config') {
      config = args[index + 1];
    }
  });

  return {
    mode,
    config: JSON.parse(config) as BotConfiguration & {
      channels: Partial<Record<Platform, string>>;
    }
  };
};
