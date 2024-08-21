import type { Bot } from '@/bot';
import { db } from '@/db';
import type { Context } from '@/types/context';
import { checkCommandCooldown, checkCommandFlags } from '@/utils/commands';
import { loadModulesInDirectory } from '@/utils/loaders';
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
        `Evaluating command ${keyword} with args ${args.join(', ')} from ${context.atAuthor} on ${context.adapter.platform}`
      );

      // Check for built-in commands
      const commandInstance = this.get(keyword);

      if (commandInstance) {
        this.logger.debug(`Running built-in command ${keyword} from ${context.atAuthor}!`);
        // Store command usage
        await db.botCommandRuns.create({
          data: {
            command: keyword,
            userId: this.bot.config.userId,
            platform: context.adapter.platform,
            timestamp: new Date(),
          }
        });
        
        let error = checkCommandFlags(commandInstance, context);
        if (error) return context.adapter.send(error, context);
        error = await checkCommandCooldown(commandInstance, context);
        if (error) return context.adapter.send(error, context);
        
        return commandInstance.run(context, args);
      }


      this.logger.debug(`Running custom command ${keyword} from ${context.atAuthor}!`);

      // Check for custom commands
      const botCommand = await db.botCommand.findFirst({
        where: {
          command: keyword,
          userId: this.bot.config.userId
        }
      }); 

      if (!botCommand){
        this.logger.debug(`Command ${keyword} not found!`);
        return 
      }

      // Store command usage (TODO: refactor)
      await db.botCommandRuns.create({
        data: {
          command: keyword,
          userId: this.bot.config.userId,
          platform: context.adapter.platform,
          timestamp: new Date(),
        }
      });
      

      // Check for user level
      let error = checkCommandFlags(botCommand, context);
      if (error) return context.adapter.send(error, context);

      // Hash command and check for cool-down
      error = await checkCommandCooldown(botCommand, context);
      if (error) return context.adapter.send(error, context);

      return context.adapter.send(botCommand.response, context);
    } catch (error) {
      this.logger.error(error);
      this.logger.error(`Error while running command ${keyword} from ${context.atAuthor}!`);
    }
  }
}
