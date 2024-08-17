import { Role } from '@/types/roles';
import { z } from 'zod';

export const newCommandSchema = z.object({
  command: z.string().min(1, 'Command name must be at least 1 character long.'),
  response: z.string().min(1, 'Response must be at least 1 character long.'),
  cooldown: z.number().int().min(0, 'Cooldown must be a positive number.'),
  aliases: z.array(z.string()).default([]),
  minRole: z.coerce.number().default(Role.User),
  enabled: z.boolean().default(true)
});

export type NewCommand = z.infer<typeof newCommandSchema>;
