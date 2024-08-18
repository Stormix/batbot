'use server';

import { authOptions } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { env } from '@/lib/env.mjs';
import { handleError } from '@/lib/errors';
import { queue } from '@batbot/core';
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

    const configuration: Omit<BotConfiguration, 'id'> = {
      ...validatedPayload,
      userId: session.user.id
    };

    const newConfiguration = await db.botConfiguration.upsert({
      where: {
        userId: session.user.id
      },
      create: configuration,
      update: configuration
    });

    const mqConnection = new queue.RabbitMQConnection(env.RABBITMQ_URI);
    await mqConnection.sendToQueue(queue.constants.Queue.BOT_QUEUE, {
      type: queue.constants.MessageType.BOT_CONFIGURATION_UPDATED,
      payload: {
        userId: session.user.id,
        id: newConfiguration.id
      }
    });

    await mqConnection.close();

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
