'use server';

import { authOptions } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { handleError } from '@/lib/errors';
import { BotConfiguration } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { Configuration, configurationSchema } from './schema';

export async function upsert(newCommand: Configuration) {
  try {
    const validatedPayload = await configurationSchema.parseAsync(newCommand);
    const session = await getServerSession(authOptions);

    if (!session) {
      return {
        error: 'You must be signed in to create a command'
      };
    }
    // TODO: Implement the upsert function
    const configuration: Omit<BotConfiguration, 'id'> = {
      ...validatedPayload,
      userId: session.user.id,
      enabledPlatforms: JSON.stringify(validatedPayload.enabledPlatforms)
    };

    await db.botConfiguration.upsert({
      where: {
        userId: session.user.id
      },
      create: configuration,
      update: configuration
    });

    revalidatePath('/commands');

    return {
      error: null,
      configuration: validatedPayload
    };
  } catch (error) {
    const { message } = handleError(error, 'An error occurred while creating the command');
    return {
      error: message
    };
  }
}
