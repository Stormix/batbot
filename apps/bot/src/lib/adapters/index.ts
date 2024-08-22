import KickAdapter from './kick';
import TwitchAdapter from './twitch';

export const ALL_ADAPTERS = [TwitchAdapter, KickAdapter];
export type Adapters = (typeof ALL_ADAPTERS)[number];
