import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const handlePrismaError = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return {
          error,
          message: 'There is a unique constraint violation'
        };
    }
  }

  return {
    error,
    message: null
  };
};

export const handleZodError = (error: unknown) => {
  if (error instanceof z.ZodError) {
    return {
      error,
      message: error.errors
    };
  }

  return {
    error,
    message: null
  };
};

export const handleError = (error: unknown, defaultMessage = 'An unknown error has occured.') => {
  const prismaError = handlePrismaError(error);
  if (prismaError.message) {
    return prismaError;
  }

  const zodError = handleZodError(error);
  if (zodError.message) {
    return zodError;
  }

  return {
    error,
    message: defaultMessage
  };
};
