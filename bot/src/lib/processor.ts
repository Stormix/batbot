import type { Context } from '@/types/context';
import { checkCommandCooldown, checkCommandFlags } from '@/utils/commands';
import { loadModulesInDirectory } from '@/utils/loaders';
import type { Bot } from '@/worker';
import * as Sentry from '@sentry/node';
import { Base } from './base';
import type BuiltinCommand from './command';

export default class Processor extends Base {
  private readonly bot: Bot;

  private commands: BuiltinCommand[] = [];

  constructor(bot: Bot) {
    super();
    this.bot = bot;
  }

  register(command: BuiltinCommand) {
    this.commands.push(command);
  }

  get(keyword: string) {
    return this.commands.find((c) => c.isCommand(keyword));
  }

  async load() {
    const commands = await loadModulesInDirectory<BuiltinCommand>('commands');
    for (const Command of commands) {
      this.register(new Command(this.bot));
    }
    this.logger.debug(`Loaded ${this.commands.length} bot commands.`);
  }

  async run<C extends Context>(keyword: string, args: string[], context: C) {
    try {
      if (this.commands.length === 0) await this.load();

      this.logger.debug(
        `Evaluating command ${keyword} with args ${args.join(', ')} from ${context.atAuthor} in ${context.adapter.name}`
      );

      // Check for built-in commands
      const commandInstance = this.get(keyword);

      if (commandInstance) {
        let error = checkCommandFlags(commandInstance, context);
        if (error) return context.adapter.send(error, context);
        error = await checkCommandCooldown(commandInstance, context);
        if (error) return context.adapter.send(error, context);
        return commandInstance.run(context, args);
      }

      // TODO: Check for custom commands

      // Command not found
      return context.adapter.send(`${context.atAuthor} Command \`${keyword}\` not found!`, context);

      // let error = checkCommandFlags(command, context);
      // if (error) return context.adapter.send(error, context);
      // // Hash command and check for cool-down
      // error = await checkCommandCooldown(command, context);
      // if (error) return context.adapter.send(error, context);

      // return context.adapter.send(command.response, context);
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          command: keyword
        }
      });
      this.logger.error(`Error while running command ${keyword} from ${context.atAuthor}!`);
      this.logger.error(error);
      await context.adapter.send(
        `${context.atAuthor} could not run this command! Ask ${context.atOwner} to check the logs!`,
        context
      );
    }
  }
}
