import { Account } from '@prisma/client';

export interface StreamElementsProfile {
  profile: {
    title: string;
    headerImage: string;
  };

  _id: string;
  providerId: string;
  provider: string;
  avatar: string;
  broadcasterType: string;
  username: string;
  alias: string;
  displayName: string;
  suspended: boolean;
  inactive: boolean;
  isPartner: boolean;
}

export interface StreamElementsCommand {
  cooldown: {
    user: number;
    global: number;
  };
  _id: string;
  aliases: Array<string>;
  keywords: Array<string>;
  enabled: boolean;
  enabledOnline: boolean;
  enabledOffline: boolean;
  hidden: boolean;
  cost: number;
  type: string;
  accessLevel: number;
  command: string;
  reply: string;
  channel: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  startsAt?: string;
  titleKeywords: Array<string>;
  regex?: string;
}

export interface NightBotCommand {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  message: string;
  coolDown: number;
  count: number;
  userLevel: string;
}

export interface ImportPayload {
  username?: string;
  account?: Account;
}
