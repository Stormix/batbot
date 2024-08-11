export interface Event<T> {
  name: string;
  payload: T;
}

export enum ManagerEvent {
  BOT_CREATED = 'botCreated'
}

export enum BotEvent {
  DESTROYED = 'destroyed',
  SPAWNED = 'spawned'
}
