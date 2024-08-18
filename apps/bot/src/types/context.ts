import type KickAdapter from '@/lib/adapters/kick';
import type TwitchAdapter from '@/lib/adapters/twitch';
import type { BaseMessage, PrivateMessage } from 'twitch-js';
import type { KickMessage } from './kick';

export interface BaseContext {
  atOwner: string;
  atAuthor: string;
}

export interface TwitchContext extends BaseContext {
  message: PrivateMessage | BaseMessage;
  adapter: TwitchAdapter;
}

export interface KickContext extends BaseContext {
  adapter: KickAdapter;
  message: KickMessage;
}

export type Context = TwitchContext | KickContext;
