import type { Bot } from '@/bot';
import { db } from '@/db';
import env from '@/env';
import type { KickContext } from '@/types/context';
import type { KickMessage, RawKickMessage } from '@/types/kick';
import { Platform } from '@batbot/types';
import type { Context } from 'vm';
import Adapter from '../adapter';
import { KickClient } from '../kick/client';

export default class KickAdapter extends Adapter<KickContext> {
  client: KickClient | null = null;

  constructor(bot: Bot) {
    super(bot, Platform.Kick);
  }

  atAuthor(message: KickMessage) {
    return `@${message.sender.username}`;
  }

  isOwner(message: KickMessage): boolean {
    return message.sender.username === env.KICK_CHANNEL || message.sender.username === env.KICK_USERNAME;
  }

  createContext(message: KickMessage): KickContext {
    return {
      adapter: this,
      message,
      atAuthor: this.atAuthor(message),
      atOwner: `@${env.KICK_CHANNEL}`
    };
  }

  getClient() {
    if (!this.client) throw new Error('Kick client is not initialized!');
    return this.client;
  }

  async send(message: string, context: Context) {
    if (!this.client) throw new Error('Kick client is not initialized!');
    this.logger.debug(`Sending ${message} to ${(context as KickContext).message.chatroom_id}`);
    await this.client.say((context as KickContext).message.chatroom_id, message);
  }

  async message(message: string, context: Context) {
    if (!this.client) throw new Error('Kick client is not initialized!');
    this.logger.debug(`Sending message to ${(context as KickContext).message.sender.username}`);
  }

  async listenForCommands(): Promise<void> {
    this.client?.ws.on('message', async (event) => {
      const raw = JSON.parse(event.toString()) as RawKickMessage;
      const message = JSON.parse(raw.data) as KickMessage;
      if (!message.content) return;
      if (!message.content.startsWith(this.bot.config.commandPrefix)) return;
      const args = message.content.slice(this.bot.config.commandPrefix.length).trim().split(/ +/);
      const command = args.shift()?.toLowerCase();
      if (!command) return;

      await this.bot.processor.run(command, args, this.createContext(message as KickMessage));
    });
  }

  async setup() {
    this.client = new KickClient(this.bot);
    await this.client.setup();
    this.logger.info('Kick adapter is ready!');
  }

  async listen() {
    if (!this.client) throw new Error('Kick client is not initialized!');

    await this.listenForCommands();

    await this.client.connect();
    await this.client.join(env.KICK_CHANNEL);
  }

  async stop() {
    if (!this.client) throw new Error('Kick client is not initialized!');
    this.client.destroy();
  }

  async storeMessage(context: KickContext): Promise<void> {
    await db.chatMessage.create({
      data: {
        message: context.message.content,
        username: context.message.sender.username,
        userId: this.bot.config.userId,
        platform: this.platform,
        timestamp: context.message.created_at
      }
    });
  }
}
