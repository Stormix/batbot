import type { BotCommand } from '@prisma/client';

export type BuiltinCommandOptions = Partial<Omit<BotCommand, 'id' | 'user_id' | 'user'>>;
