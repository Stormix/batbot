import { globSync } from 'glob';

export type Constructor<K> = { new (args?: unknown): K };

interface LoadModulesInDirectoryOptions {
  exclude?: string[];
}

export const loadModulesInDirectory = async <T>(directory: string, options: LoadModulesInDirectoryOptions = {}) => {
  const path = import.meta.dir + '/../' + directory;
  const modules = globSync('*.{js,ts}', { cwd: path });

  return Promise.all(
    modules
      .filter((module) => !(options.exclude ?? []).includes(module))
      .map(async (module) => {
        const { default: Module } = await import(path + '/' + module);
        return Module as Constructor<T>;
      })
  );
};
