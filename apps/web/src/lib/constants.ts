import { Role } from '@/types/roles';
import { BotCommand } from '@prisma/client';

export const builtinCommands: BotCommand[] = [
  {
    id: 'builtin:commands',
    userId: 'builtin',
    command: 'commands',
    response: 'Here are the commands I know: !commands, !help, !ping, !uptime, !version',
    cooldown: 5,
    enabled: true,
    minRole: Role.User,
    aliases: ['help']
  }
];
