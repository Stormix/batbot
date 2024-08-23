'use server';

import { authOptions } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { handleError } from '@/lib/errors';
import { getImport } from '@/lib/import';
import { omit } from 'lodash';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { ImportSchema } from './schemas';

export async function importCommands(payload: ImportSchema) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        error: 'You must be signed in to create a command'
      };
    }

    const account = await db.account.findFirst({
      where: {
        userId: session.user.id,
        provider: payload.provider
      }
    });

    const importer = getImport(payload.provider);
    const commands = await importer.run({
      username: payload.username,
      account: account
    });

    if (payload.save) {
      // Save the commands to the database
      await db.botCommand.createMany({
        data: commands.map((command) => ({
          ...omit(command, 'id', 'createdAt', 'updatedAt', 'userId'),
          userId: session.user.id
        })),
        skipDuplicates: true
      });
    }

    if (payload.save) revalidatePath('/commands', 'layout');

    return {
      error: null,
      commands
    };
  } catch (error) {
    console.log('Failed to import commands', error);
    const { message } = handleError(error, 'An error occurred while creating the command');
    return {
      error: message
    };
  }
}
