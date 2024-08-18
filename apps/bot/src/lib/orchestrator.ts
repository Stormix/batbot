import { db } from '@/db';
import env from '@/env';
import { ManagerMode } from '@/types/manager';
import server from 'bunrest';
import { join } from 'path';
import { Base } from './base';
import BotManager from './manager';

class Orchestrator extends Base {
  private _server: ReturnType<typeof server>;
  private _manager: BotManager;

  constructor() {
    super();
    this._server = server();
    this._manager = new BotManager(join(__dirname, '../bot.ts'), ManagerMode.PROCESS);
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
    return this._server.listen(env.PORT);
  }

  async poll() {
    // TODO: Poll the database for new bots
  }
}

export default Orchestrator;
