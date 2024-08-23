import env from '@/env';
import { ManagerMode } from '@/types/manager';
import { getConfigurations } from '@/utils/bot';
import { MessageType, Queue, RabbitMQConnection } from '@batbot/core';
import type { Platform } from '@batbot/types';
import server from 'bunrest';
import { omit } from 'lodash';
import { join } from 'path';
import { Base } from './base';
import BotManager from './manager';

class Orchestrator extends Base {
  private _server: ReturnType<typeof server>;
  private _manager: BotManager;

  readonly connection: RabbitMQConnection;

  constructor() {
    super();
    this._server = server();
    this._manager = new BotManager(join(__dirname, '../bot.ts'), ManagerMode.PROCESS);
    this.connection = new RabbitMQConnection(env.RABBITMQ_URI);
  }

  async init() {
    this._server.get('/', (req, res) => res.json({ name: 'BatBot Orchestrator', version: '1.0.0' }));
    this._server.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });
    this._server.get('/stats', async (req, res) => {
      res.json(await this._manager.stats());
    });
  }

  async getConfigurations() {
    const configuration = await getConfigurations();
    return configuration.map((config) => ({
      ...omit(config, 'user'),
      channels: config.user?.accounts.reduce(
        (acc, account) => {
          if (account?.username && config.enabledPlatforms.includes(account.provider)) {
            acc[account.provider as Platform] = account.username;
          }
          return acc;
        },
        {} as Record<Platform, string>
      )
    }));
  }

  async listen() {
    await this.init();
    const configurations = await this.getConfigurations();
    console.log('Spawning bots:', configurations);
    await this._manager.spawn(configurations ?? []);
    await this.poll();
    return this._server.listen(env.PORT);
  }

  async poll() {
    await this.connection.consume(Queue.BOT_QUEUE, async (message) => {
      console.log('Received message:', message);
      switch (message.type) {
        case MessageType.BOT_CONFIGURATION_UPDATED:
          // TODO: respawn bot
          this._manager.respawn(message.payload.id);
          break;
      }
    });
  }
}

export default Orchestrator;
