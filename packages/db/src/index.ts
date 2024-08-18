import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var db: PrismaClient | undefined;
}

let db: PrismaClient;

if (typeof window === 'undefined') {
  db = global.db || new PrismaClient({});
  if (process.env.NODE_ENV !== 'production') global.db = db;
}

export { db };
