'use server';

import { authOptions } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { handleError } from '@/lib/errors';
import { getServerSession } from 'next-auth';
import { NewCommand, newCommandSchema } from './schemas';

export async function create(newCommand: NewCommand) {
  try {
    const payload = await newCommandSchema.parseAsync(newCommand);
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        error: 'You must be signed in to create a command'
      };
    }

    const command = await db.botCommand.create({
      data: {
        ...payload,
        userId: session.user.id
      }
    });

    return {
      error: null,
      command
    };
  } catch (error) {
    const { message } = handleError(error, 'An error occurred while creating the command');
    return {
      error: message
    };
  }
}
