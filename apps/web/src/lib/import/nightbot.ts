import { NightBotCommand } from '@/types/import';
import { Role } from '@batbot/types';
import { Account, BotCommand } from '@prisma/client';
import { Import } from './base';
import { ImportProvider } from './constants';

export class NightbotImport extends Import {
  readonly provider = ImportProvider.NightBot;

  async run({ account }: { account: Account }): Promise<BotCommand[]> {
    const { commands } = await this.fetchCommands(account);

    return commands.map((command) => ({
      id: command._id,
      userId: 'imported',
      command: command.name.replace(/[^a-zA-Z0-9]/g, ''),
      response: command.message,
      enabled: true,
      aliases: [],
      createdAt: new Date(command.createdAt),
      cooldown: command.coolDown,
      minRole: Role.User, // TODO: map nightbot acces levels to Role enum
      updatedAt: new Date(command.updatedAt)
    }));
  }

  async fetchCommands(account: Account) {
    const url = 'https://api.nightbot.tv/1/commands';
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${account.access_token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch commands');
    }

    return response.json() as Promise<{
      status: string;
      _total: number;
      commands: NightBotCommand[];
    }>;
  }
}
