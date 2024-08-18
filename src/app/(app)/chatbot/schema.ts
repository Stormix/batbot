import { z } from 'zod';

export const configurationSchema = z.object({
  enabled: z.boolean().default(false),
  commandPrefix: z.string().min(1).default('!'),
  enabledPlatforms: z.array(z.string()).default([])
});

export type Configuration = z.infer<typeof configurationSchema>;
