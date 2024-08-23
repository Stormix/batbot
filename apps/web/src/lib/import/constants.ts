export enum ImportProvider {
  StreamElements = 'streamelements',
  NightBot = 'nightbot',
  Botrix = 'botrix'
}

export const providerName = {
  [ImportProvider.StreamElements]: 'StreamElements',
  [ImportProvider.NightBot]: 'NightBot',
  [ImportProvider.Botrix]: 'Botrix'
};
