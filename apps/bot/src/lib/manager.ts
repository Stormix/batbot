import { db } from '@/db';
import type { Event } from '@/types/events';
import { ManagerMode } from '@/types/manager';
import type { BotConfiguration } from '@prisma/client';
import { BaseEmitter } from './base';
import BotShard from './bot-shard';
import { DEFAULT_DELAY, DEFAULT_TIMEOUT } from './constants';
class BotManager extends BaseEmitter {
  mode: ManagerMode;
  bots: Map<string, BotShard> = new Map();
  file: string;

  constructor(file: string, mode = ManagerMode.PROCESS) {
    super();
    this.file = file;
    this.mode = mode;
  }

  async createBot(config: BotConfiguration): Promise<BotShard> {
    const bot = new BotShard(config, this);

    this.bots.set(config.id, bot);
    this.emit('botCreated', bot);

    return bot;
  }

  async spawn(
    configurations: BotConfiguration[],
    delay = DEFAULT_DELAY,
    timeout = DEFAULT_TIMEOUT
  ): Promise<BotShard[]> {
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

  async stats() {
    return {
      mode: this.mode,
      bots: [...this.bots.values()].map((bot) => bot.stats())
    };
  }

  async respawn(configuration_id: string) {
    const bot = this.bots.get(configuration_id);
    if (bot) {
      this.logger.info(`Bot(${configuration_id}) found, respawning...`);
      await bot.destroy();
      await bot.spawn();
      this.logger.info(`Bot(${configuration_id}) respawned successfully!`);
      return;
    } else {
      this.logger.info(`Bot(${configuration_id}) not found, attempting to create it...`);
      const configuration = await db.botConfiguration.findUnique({
        where: { id: configuration_id }
      });
      if (configuration) {
        await this.createBot(configuration);
        this.logger.info(`Bot(${configuration_id}) created successfully!`);
        return;
      }
    }
  }
}

export default BotManager;
