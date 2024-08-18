import { PrismaClient } from '@prisma/client';

declare global {
  var db: PrismaClient | undefined;
}

export const db: PrismaClient = global.db || new PrismaClient({});

if (process.env.NODE_ENV !== 'production') global.db = db;