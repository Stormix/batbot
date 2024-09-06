import type { Bot } from '@/bot';
import { db } from '@/db';
import env from '@/env';
import type { Context, TwitchContext } from '@/types/context';
import { Platform } from '@batbot/types';
import type { BaseMessage, PrivateMessage } from 'twitch-js';
import { Chat, ChatEvents, Commands } from 'twitch-js';
import fetchUtil from 'twitch-js/lib/utils/fetch';
import Adapter from '../adapter';

export default class TwitchAdapter extends Adapter<TwitchContext> {
  client: Chat | null = null;
  channels: string[] = [];

  constructor(bot: Bot) {
    super(bot, Platform.Twitch);
  }

  atAuthor(message: PrivateMessage | BaseMessage) {
    return `@${message.username}`;
  }

  isOwner(message: Context['message']) {
    const username = (message as PrivateMessage).username;
    return username.toLowerCase() === this.bot.user?.name?.toLowerCase();
  }

  createContext(message: PrivateMessage | BaseMessage): TwitchContext {
    return {
      atAuthor: this.atAuthor(message),
      atOwner: `@${env.TWITCH_USERNAME}`,
      message,
      adapter: this
    };
  }

  getClient() {
    if (!this.client) throw new Error('Twitch client is not initialized!');
    return this.client;
  }

  async send(message: string, context: Context) {
    if (!this.client) throw new Error('Twitch client is not initialized!');
    await this.client.say((context as TwitchContext).message.channel, message);
  }

  async message(message: string, context: Context) {
    if (!this.client) throw new Error('Twitch client is not initialized!');
    this.logger.debug(`Sending message to ${(context as TwitchContext).message.username}`);
    await this.client.whisper((context as TwitchContext).message.username, message); // DOESN'T WORK
  }

  async setup(channels: string[] = []) {
    this.channels = channels;
    const botTokens = {
      access_token: env.TWITCH_ACCESS_TOKEN,
      refresh_token: env.TWITCH_REFRESH_TOKEN
    };

    if (!botTokens) {
      this.logger.error('No twitch tokens found, generate new ones.');
      return;
    }

    this.client = new Chat({
      username: env.TWITCH_USERNAME,
      token: botTokens?.access_token,
      onAuthenticationFailure: () =>
        fetchUtil('https://id.twitch.tv/oauth2/token', {
          method: 'post',
          search: {
            grant_type: 'refresh_token',
            refresh_token: botTokens?.refresh_token,
            client_id: env.TWITCH_CLIENT_ID,
            client_secret: env.TWITCH_CLIENT_SECRET
          }
        }).then((response) => response.accessToken),
      log: { level: 'warn' }
    });

    this.logger.info('Twitch adapter is ready!');
  }

  async listenForCommands() {
    this.client?.on(ChatEvents.ALL, async (message) => {
      if (!message) return;
      if (message.command !== Commands.PRIVATE_MESSAGE) return;
      this.storeMessage(this.createContext(message as PrivateMessage));
      if (!message.message.startsWith(this.bot.config.commandPrefix)) return;
      const args = message.message.slice(this.bot.config.commandPrefix.length).trim().split(/ +/);
      const command = args.shift()?.toLowerCase();
      if (!command) return;

      await this.bot.processor.run(command, args, this.createContext(message as PrivateMessage));
    });
  }

  async listen() {
    if (!this.client) throw new Error('Twitch client is not initialized!');

    this.client.once(ChatEvents.CONNECTED, (c) => {
      this.bot.logger.debug(`Logged in to twitch as ${c.username}`);
    });

    await this.listenForCommands();
    await this.client.connect();

    console.log('Channels:', this.channels);
    await Promise.all([...this.channels].map((channel) => this.client?.join(channel)));
  }

  async stop() {
    if (!this.client) throw new Error('Twitch client is not initialized!');
    await this.client.disconnect();
  }

  async storeMessage(context: TwitchContext): Promise<void> {
    await db.chatMessage.create({
      data: {
        message: context.message.message,
        username: context.message.username,
        userId: this.bot.config.userId,
        platform: this.platform,
        timestamp: context.message.timestamp
      }
    });
  }
}
