import '@/instrument';

import type { Platform } from '@batbot/types';
import type { BotConfiguration } from '@prisma/client';
import { omit } from 'lodash';
import Adapter from './lib/adapter';
import KickAdapter from './lib/adapters/kick';
import TwitchAdapter from './lib/adapters/twitch';
import { Base } from './lib/base';
import Processor from './lib/processor';
import type { Context } from './types/context';
import { ManagerMode } from './types/manager';
import { parseBotArgs } from './utils/cli';

declare let self: Worker;

export class Bot extends Base {
  readonly config: BotConfiguration;
  readonly processor: Processor;
  readonly mode: ManagerMode;
  readonly channels: Partial<Record<Platform, string>> = {};

  adapters: Adapter<Context>[] = [];

  constructor(config: BotConfiguration, channels: Partial<Record<Platform, string>>, mode: ManagerMode) {
    super();

    this.config = config;
    this.processor = new Processor(this);
    this.mode = mode;
    this.channels = channels;
  }

  get prefix() {
    return this.config.commandPrefix;
  }

  async load_adapters() {
    const enabledAdapters = Object.keys(this.channels).filter((channel) => this.channels[channel as Platform]);
    this.logger.info('Loading adapters: ', enabledAdapters);

    this.adapters = [new TwitchAdapter(this), new KickAdapter(this)].filter((adapter) =>
      enabledAdapters.includes(adapter.platform)
    );

    // Setup adapters
    for (const adapter of this.adapters) {
      const channels = [this.channels[adapter.platform]].filter(Boolean) as string[];
      this.logger.debug(`Setting up adapter for ${adapter.platform} channel: ${channels}`);
      await adapter.setup(channels);
    }
  }

  async setup() {
    this.logger.debug('Setting up bot...');

    await this.processor.load(); // Load commands
    await this.load_adapters(); // Load adapters
  }

  async reload() {
    this.logger.info('Reloading bot...');
    await this.load_adapters();
  }

  async listen() {
    this.logger.info('Listening...');
    // Listen for adapter messages
    await Promise.all([...this.adapters.map(async (adapter) => adapter.listen())]);

    // Listen for parent messages
    switch (this.mode) {
      case 'worker':
        self.onmessage = (event) => {
          this.logger.debug('Received message from parent:', event.data);
          // this.handleMessage(event.data.type, event.data.payload);
        };
        break;
      case 'process':
        process.on('message', (message) => {
          this.logger.debug('Received message from parent:', message);
          try {
            const payload = JSON.parse(message as string);
            // this.handleMessage(payload.type, payload.payload);
          } catch (error) {
            this.logger.error('Error parsing message:', error);
          }
        });
        break;
    }
  }

  async shutdown() {
    this.logger.debug('Stopping...');
    await Promise.all([...this.adapters.map(async (adapter) => adapter.stop())]);
  }

  async sendParent(type: string, payload: unknown) {
    this.logger.debug('Sending message to parent...');
    switch (this.mode) {
      case 'worker':
        return postMessage({
          type,
          payload: payload
        });
      case 'process':
        return process.send!({
          type,
          payload: payload
        });
    }
  }

  async handleMessage(type: string, payload: unknown) {
    // TODO: Handle messages
  }
}

const main = async () => {
  const { mode, config } = parseBotArgs(Bun.argv);

  const botConfiguration = omit(config, 'channels');
  const channels = config.channels;
  const bot = new Bot(botConfiguration, channels, mode as ManagerMode);

  await bot.setup();
  await bot.listen();
};

main().catch((error) => {
  console.error('Error starting bot:', error);
});
