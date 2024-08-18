import { BotCommand } from '@prisma/client';

export enum Platform {
  Twitch = 'twitch',
  Discord = 'discord',
  Kick = 'kick',
  Youtube = 'youtube'
}

export enum CommandCategory {
  BuiltIn = 'system',
  Custom = 'custom'
}

export interface Command extends Omit<BotCommand, 'userId' | 'user'> {
  category: CommandCategory;
}
