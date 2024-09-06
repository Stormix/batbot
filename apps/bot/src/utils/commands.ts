import type BuiltinCommand from '@/lib/command';
import type { Context } from '@/types/context';
import { Role } from '@batbot/types';
import type { BotCommand } from '@prisma/client';

export const checkCommandPermission = (command: BuiltinCommand | BotCommand, context: Context) => {
  switch (command.minRole) {
    case Role.Owner:
      return context.adapter.isOwner(context.message);

    default:
      return false;
  }
};

export const checkCommandFlags = (command: BuiltinCommand | BotCommand, context: Context) => {
  if (!checkCommandPermission(command, context)) {
    return `${context.atAuthor} you don't have permission to use this command!`;
  }

  return null;
};

export const checkCommandCooldown = async (command: BuiltinCommand | BotCommand, context: Context) => {
  // TODO: Implement cooldowns
  // if (!command.cooldown) return null;
  // const hash = `${context.adapter.name}:${context.atAuthor}:${command.name}`;

  // // Hash command and check for cooldown
  // const cooldown = await context.adapter.bot.storage.get(hash);

  // if (cooldown) {
  //   context.adapter.bot.logger.debug(`Command ${command.name} is on cooldown for ${context.atAuthor}`);
  //   const timeLeft = command.cooldown + differenceInSeconds(new Date(cooldown), new Date());
  //   return `${context.atAuthor} this command is on cooldown. Please wait **${timeLeft}** seconds.`;
  // }

  // // Set cooldown
  // await context.adapter.bot.storage.set(hash, new Date().toISOString(), command.cooldown);
  return null;
};
