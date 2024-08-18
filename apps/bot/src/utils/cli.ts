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
    config: parseConfig(JSON.parse(values.config as string))
  };
};

export const parseConfig = (config: BotConfiguration) => {
  return {
    ...config,
    enabledPlatforms: JSON.parse(config.enabledPlatforms)
  };
};
