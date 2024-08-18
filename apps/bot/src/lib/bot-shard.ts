import { BotEvent, type Event } from '@/types/events';
import { ManagerMode } from '@/types/manager';
import type { BotConfiguration } from '@prisma/client';
import type { ErrorLike, Subprocess } from 'bun';
import worker from 'node:worker_threads';
import { BaseEmitter } from './base';
import { DEFAULT_DELAY, DEFAULT_TIMEOUT } from './constants';
import type BotManager from './manager';

class BotShard extends BaseEmitter {
  private _config: BotConfiguration;
  private _manager: BotManager;
  private _instance: Worker | Subprocess | null = null;

  constructor(config: BotConfiguration, manager: BotManager) {
    super();
    this._manager = manager;
    this._config = config;
  }

  async spawn(timeout = DEFAULT_TIMEOUT) {
    if (this._instance) {
      return;
    }

    const argv = ['--mode', 'worker', '--config', JSON.stringify(this._config)];
    switch (this._manager.mode) {
      case ManagerMode.PROCESS:
        this._instance = Bun.spawn(['bun', this._manager.file, ...argv], {
          ipc: this.handleMessage.bind(this),
          stdout: 'inherit',
          serialization: 'json',
          onExit: (
            proc: Subprocess,
            exitCode: number | null,
            signalCode: number | null,
            error: ErrorLike | undefined
          ) => {
            console.log('exit', exitCode, signalCode, error);
            this.handleExit(error as Error);
          }
        });
        this.logger.info('Spawned bot process', { pid: this._instance.pid });
        break;
      case ManagerMode.WORKER:
        this._instance = new Worker(this._manager.file, {
          smol: true,
          env: worker.SHARE_ENV,
          argv
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        this._instance.onmessage = (event) => this.handleMessage(event.data);
        this._instance.addEventListener('close', () => this.handleExit(null));
        this.logger.info('Spawned bot worker');
        break;
    }

    this.emit(BotEvent.SPAWNED);
  }

  async send<T>(event: Event<T>) {}

  async respawn(delay = DEFAULT_DELAY, timeout = DEFAULT_TIMEOUT) {
    await this.destroy();
    await new Promise((resolve) => setTimeout(resolve, delay));
    return this.spawn(timeout);
  }

  async destroy(timeout = DEFAULT_TIMEOUT) {
    if (!this._instance) {
      return;
    }

    switch (this._manager.mode) {
      case ManagerMode.PROCESS:
        (this._instance as Subprocess).kill();
        break;
      case ManagerMode.WORKER:
        (this._instance as Worker).terminate();
        break;
    }

    return this.handleExit(null);
  }

  async handleMessage(message: string) {
    console.log(message);
  }

  async handleExit(error: Error | null) {
    this._instance = null;
    this.emit(BotEvent.DESTROYED);
  }

  stats() {
    return {
      config: this._config,
      pid: this._manager.mode === ManagerMode.PROCESS ? (this._instance as Subprocess).pid : null,
      state: this._instance ? 'online' : 'offline'
    };
  }
}

export default BotShard;
