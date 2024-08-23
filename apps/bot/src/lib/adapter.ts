import type { Bot } from '@/bot';
import type { Context as AnyContext } from '@/types/context';
import { Platform } from '@batbot/types';
import type Logger from './logger';

export interface AdapterOptions {
  allowedEnvironments?: string[];
  enabled?: boolean;
}

abstract class Adapter<Context = AnyContext> {
  readonly bot: Bot;
  logger: Logger;
  options: AdapterOptions;
  platform: Platform;

  constructor(
    bot: Bot,
    platform: Platform,
    options: AdapterOptions = {
      enabled: true
    }
  ) {
    this.bot = bot;
    this.logger = this.bot.logger.getSubLogger({ name: this.name });
    this.options = options;
    this.platform = platform;
  }

  abstract getClient(): unknown;
  abstract setup(channels: string[]): Promise<void>;
  abstract listen(): Promise<void>;
  abstract listenForCommands(): Promise<void>;
  abstract atAuthor(message: unknown): string;

  abstract createContext(message: unknown): Context;
  abstract send(message: string, context: Context): Promise<void>;
  abstract message(message: string, context: Context): Promise<void>;

  abstract isOwner(message: unknown): boolean;
  abstract stop(): Promise<void>;

  abstract storeMessage(context: Context): Promise<void>;
}

export default Adapter;
