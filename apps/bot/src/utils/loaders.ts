import { globSync } from 'glob';

export type Constructor<K> = { new (args?: unknown): K };

export const loadModulesInDirectory = async <T>(directory: string) => {
  const path = import.meta.dir + '/../' + directory;
  const commands = globSync('*.{js,ts}', { cwd: path });
  return Promise.all(
    commands.map(async (command) => {
      const { default: Command } = await import(path + '/' + command);
      return Command as Constructor<T>;
    })
  );
};
