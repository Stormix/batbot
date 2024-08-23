import { Import } from './base';
import { ImportProvider } from './constants';
import { NightbotImport } from './nightbot';
import { StreamElementsImport } from './streamelements';

export const getImport = (provider: ImportProvider): Import => {
  switch (provider) {
    case ImportProvider.StreamElements:
      return new StreamElementsImport();
    case ImportProvider.NightBot:
      return new NightbotImport();
    default:
      throw new Error('Invalid import provider');
  }
};
