import { ImportPayload } from '@/types/import';
import { BotCommand } from '@prisma/client';
import { ImportProvider } from './constants';

export abstract class Import {
  abstract readonly provider: ImportProvider;

  abstract run(payload: ImportPayload): Promise<BotCommand[]>;
}
