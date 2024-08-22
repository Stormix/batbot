import BuiltinCommand from '@/lib/command';
import type { Context, KickContext, TwitchContext } from '@/types/context';
import { Platform } from '@batbot/types';

export default class PingCommand extends BuiltinCommand {
  name = 'ping';

  async run(context: Context) {
    switch (context.adapter.platform) {
      case Platform.Twitch: {
        const c = context as TwitchContext;
        const time = new Date(c.message.timestamp).getTime();
        const now = new Date().getTime();
        const diff = Math.abs(time - now);
        return c.adapter.send(`Pong! Took ${diff}ms`, c);
      }
      case Platform.Kick: {
        const c = context as KickContext;
        return c.adapter.send('Pong!', c);
      }
      default: {
        return;
      }
    }
  }
}
