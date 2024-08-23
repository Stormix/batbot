import { BotCommand } from '.prisma/client';
import { ImportPayload, StreamElementsCommand, StreamElementsProfile } from '@/types/import';
import { Role } from '@batbot/types';
import { Import } from './base';
import { ImportProvider } from './constants';

export class StreamElementsImport extends Import {
  readonly provider = ImportProvider.StreamElements;

  async run({ username }: ImportPayload): Promise<BotCommand[]> {
    if (!username) {
      throw new Error('Username is required');
    }

    const commands = await this.fetchCommands(username);
    return commands.map((command) => ({
      id: command._id,
      userId: 'imported',
      command: command.command,
      response: command.reply,
      enabled: command.enabled,
      aliases: command.aliases,
      createdAt: new Date(command.createdAt),
      cooldown: command.cooldown.global,
      minRole: Role.User, // TODO: map stream elements acces levels to Role enum
      updatedAt: new Date(command.updatedAt)
    }));
  }

  async fetchProfile(username: string) {
    const url = `https://api.streamelements.com/kappa/v2/channels/${username}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return response.json() as Promise<StreamElementsProfile>;
  }

  async fetchCommands(username: string) {
    const profile = await this.fetchProfile(username);
    const url = `https://api.streamelements.com/kappa/v2/bot/commands/${profile._id}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch commands');
    }

    return response.json() as Promise<Array<StreamElementsCommand>>;
  }
}
