import type { BotConfiguration } from '@prisma/client';
import type { Context } from 'vm';
import type Adapter from './lib/adapter';
import KickAdapter from './lib/adapters/kick';
import { Base } from './lib/base';
import Processor from './lib/processor';
import { ManagerMode } from './types/manager';
import { parseBotArgs } from './utils/cli';

export class Bot extends Base {
  readonly config: BotConfiguration;
  readonly processor: Processor;
  readonly mode: ManagerMode;

  adapters: Adapter<Context>[] = [];

  constructor(config: BotConfiguration, mode: ManagerMode) {
    super();

    this.config = config;
    this.processor = new Processor(this);
    this.mode = mode;
  }

  get prefix() {
    return this.config.commandPrefix;
  }

  async load_adapters() {
    // Load adapters
    this.logger.info('Loading adapters...');
    this.adapters = [new KickAdapter(this)];

    // Setup adapters
    for (const adapter of this.adapters) {
      await adapter.setup();
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
        postMessage({
          type,
          payload: payload
        });
        break;
      case 'process':
        process.send!({
          type,
          payload: payload
        });
        break;
    }
  }

  async handleMessage(type: string, payload: unknown) {
    // TODO: Handle messages
  }
}

const main = async () => {
  const { mode, config } = parseBotArgs(Bun.argv);
  const bot = new Bot(config, mode as ManagerMode);

  await bot.setup();
  await bot.listen();
};

main();
