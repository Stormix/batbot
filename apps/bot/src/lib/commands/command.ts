import type { Bot } from '@/bot';
import { db } from '@/db';
import BuiltinCommand from '@/lib/command';
import type { Context } from '@/types/context';
import type { KickMessage } from '@/types/kick';
import { Platform, Role } from '@batbot/types';
import type { PrivateMessage } from 'twitch-js';
const parseArgs = (context: Context) => {
  let messageText = null;

  switch (context.adapter.platform) {
    case Platform.Twitch:
      messageText = (context.message as PrivateMessage).message;
      break;
    case Platform.Kick:
      messageText = (context.message as KickMessage).content;
      break;
    default:
      break;
  }

  if (!messageText) {
    return [];
  }

  return messageText.split(' ');
};

export class InvalidSyntax extends Error {
  constructor() {
    super('Invalid syntax');
    this.name = 'InvalidSyntax';
  }
}

export default class ArtisanCommand extends BuiltinCommand {
  name = 'command';

  constructor(bot: Bot) {
    super(bot, {
      minRole: Role.Owner
    });
  }

  async run(context: Context) {
    // TODO: Implement the command
    const message = context.message;

    try {
      const args = parseArgs(context);
      const command = args.shift();
      const commandArgs = args;

      switch (commandArgs?.[0]) {
        case 'add': {
          const [name, ...response] = commandArgs.slice(1);

          if (!name || !response) {
            throw new InvalidSyntax();
          }

          // Check if command already exists
          const existingCommand = await db.botCommand.findFirst({
            where: {
              command: name,
              userId: this.bot.config.userId
            }
          });

          if (existingCommand) {
            await context.adapter.send(
              `Command already exists, did you mean: !command edit ${name} ${response}`,
              context
            );
            return;
          }

          await db.botCommand.create({
            data: {
              command: name,
              response: response.join(' '),
              userId: this.bot.config.userId
            }
          });

          await context.adapter.send(`Command ${name} added!`, context);

          return;
        }
        case 'remove':
        case 'delete':
        case 'rm':
          const name = commandArgs[1];

          if (!name) {
            throw new InvalidSyntax();
          }

          // Check if command already exists
          const existingCommand = await db.botCommand.findFirst({
            where: {
              command: name,
              userId: this.bot.config.userId
            }
          });

          if (!existingCommand) {
            await context.adapter.send(
              `Command does not exist, did you mean: !command add ${name} <response>`,
              context
            );
            return;
          }

          await db.botCommand.delete({
            where: {
              id: existingCommand.id
            }
          });

          await context.adapter.send(`Command ${name} removed!`, context);

          return;
        case 'update':
        case 'edit': {
          const [name, ...response] = commandArgs.slice(1);

          if (!name || !response) {
            throw new InvalidSyntax();
          }

          // Check if command already exists
          const existingCommand = await db.botCommand.findFirst({
            where: {
              command: name,
              userId: this.bot.config.userId
            }
          });

          if (!existingCommand) {
            await context.adapter.send(
              `Command does not exist, did you mean: !command add ${name} ${response}`,
              context
            );
            return;
          }

          await db.botCommand.update({
            where: {
              id: existingCommand.id
            },
            data: {
              response: response.join(' ')
            }
          });
          await context.adapter.send(`Command ${name} updated!`, context);
          return;
        }
        case 'list': {
          // Fetch username
          const user = await db.user.findUnique({
            where: {
              id: this.bot.config.userId
            }
          });

          if (!user) {
            return;
          }

          return context.adapter.send(
            `List of commands can be found here: https://batbot.live/${user.name}/commands`,
            context
          );
        }
        default:
          await context.adapter.send('Invalid syntax', context);
      }
    } catch (error) {
      if (error instanceof InvalidSyntax) {
        await context.adapter.send('Invalid syntax', context);
        return;
      }

      await context.adapter.send('An error occurred', context);
      this.logger.error(error);
    }
  }
}
