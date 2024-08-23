import type { BotConfiguration } from '@prisma/client';

export enum Platform {
  Twitch = 'twitch',
  Discord = 'discord',
  Kick = 'kick',
  Youtube = 'youtube'
}

export enum Role {
  User,
  Follower,
  Subscriber,
  Moderator,
  Editor,
  Owner
}

export const RoleLabels = {
  [Role.User]: 'User',
  [Role.Follower]: 'Follower',
  [Role.Subscriber]: 'Subscriber',
  [Role.Moderator]: 'Moderator',
  [Role.Editor]: 'Editor',
  [Role.Owner]: 'Owner'
};

export type BotConfigurationWithChannels = BotConfiguration & {
  channels: Partial<Record<Platform, string>>;
};
