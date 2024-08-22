import { Role } from '@batbot/types';
import type { BotCommand } from '@prisma/client';

export const builtinCommands: BotCommand[] = [
  {
    id: 'builtin:commands',
    userId: 'builtin',
    command: 'ping',
    response: 'Pong!',
    cooldown: 5,
    enabled: true,
    minRole: Role.User,
    aliases: ['pong']
  }
];
