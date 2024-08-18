import { db } from '@/db';
import env from '@/env';
import { ManagerMode } from '@/types/manager';
import { queue } from '@batbot/core';
import server from 'bunrest';
import { join } from 'path';
import { Base } from './base';
import BotManager from './manager';

class Orchestrator extends Base {
  private _server: ReturnType<typeof server>;
  private _manager: BotManager;

  readonly connection: queue.RabbitMQConnection;

  constructor() {
    super();
    this._server = server();
    this._manager = new BotManager(join(__dirname, '../bot.ts'), ManagerMode.PROCESS);
    this.connection = new queue.RabbitMQConnection(env.RABBITMQ_URI);
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

  async listen() {
    await this.init();
    const bots = await db?.botConfiguration.findMany({
      where: { enabled: true }
    });

    await this._manager.spawn(bots ?? []);
    await this.poll();
    return this._server.listen(env.PORT);
  }

  async poll() {
    await this.connection.consume(queue.constants.Queue.BOT_QUEUE, async (message) => {
      console.log('Received message:', message);
      switch (message.type) {
        case queue.constants.MessageType.BOT_CONFIGURATION_UPDATED:
          // TODO: respawn bot
          this._manager.respawn(message.payload.id);
          break;
      }
    });
  }
}

export default Orchestrator;
