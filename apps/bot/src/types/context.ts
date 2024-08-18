import KickAdapter from '@/lib/adapters/kick';
import type { KickMessage } from './kick';

export interface BaseContext {
  atOwner: string;
  atAuthor: string;
}

export interface KickContext extends BaseContext {
  adapter: KickAdapter;
  message: KickMessage;
}

export type Context = KickContext;
