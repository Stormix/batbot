import type { Platform } from '@batbot/types';
import type { BotConfiguration } from '@prisma/client';
import { parseArgs } from 'util';

export const parseBotArgs = (args: string[]) => {
  const { values, positionals } = parseArgs({
    args: args,
    options: {
      mode: {
        type: 'string'
      },
      config: {
        type: 'string'
      }
    },
    strict: true,
    allowPositionals: true
  });

  return {
    mode: values.mode as string,
    config: JSON.parse(values.config as string) as BotConfiguration & {
      channels: Partial<Record<Platform, string>>;
    }
  };
};
