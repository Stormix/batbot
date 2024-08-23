import { ImportProvider } from '@/lib/import/constants';
import { z } from 'zod';

export const importSchema = z.object({
  username: z.string().min(2).max(50),
  provider: z.nativeEnum(ImportProvider),
  save: z.boolean().optional().default(false)
});

export type ImportSchema = z.infer<typeof importSchema>;
