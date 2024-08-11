import type { Event } from '@/types/events';
import { ManagerMode } from '@/types/manager';
import type { BotConfiguration } from '@prisma/client';
import { BaseEmitter } from './base';
import Bot from './bot';
import { DEFAULT_DELAY, DEFAULT_TIMEOUT } from './constants';

class BotManager extends BaseEmitter {
  mode: ManagerMode;
  bots: Map<string, Bot> = new Map();
  file: string;

  constructor(file: string, mode = ManagerMode.PROCESS) {
    super();
    this.file = file;
    this.mode = mode;
  }

  async createBot(config: BotConfiguration): Promise<Bot> {
    const bot = new Bot(config, this);

    this.bots.set(config.id, bot);
    this.emit('botCreated', bot);

    return bot;
  }

  async spawn(configurations: BotConfiguration[], delay = DEFAULT_DELAY, timeout = DEFAULT_TIMEOUT): Promise<Bot[]> {
    return Promise.all(
      configurations.map(async (config) => {
        const bot = await this.createBot(config);
        await bot.spawn(timeout);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return bot;
      })
    );
  }

  async broadcast<T>(event: Event<T>): Promise<void[]> {
    return Promise.all(
      [...this.bots.values()].map(async (bot) => {
        await bot.send(event);
      })
    );
  }

  async destroy(delay = DEFAULT_DELAY, timeout = DEFAULT_TIMEOUT): Promise<void> {
    await Promise.all(
      [...this.bots.values()].map(async (bot) => {
        await bot.destroy(timeout);
        await new Promise((resolve) => setTimeout(resolve, delay));
      })
    );
    this.bots.clear();
  }
}

export default BotManager;
