export enum Queue {
  MESSAGE_QUEUE = 'message_queue',
  BOT_QUEUE = 'bot_queue'
}

export enum MessageType {
  BOT_CONFIGURATION_UPDATED = 'bot_configuration_updated',
  BOT_CONFIGURATION_ADDED = 'bot_configuration_added'
}

export interface BotConfigurationUpdatedPayload {
  userId: string;
  id: string;
}

export interface BotConfigurationAddedPayload {
  userId: string;
  id: string;
}

interface MessagePayloadMap {
  [MessageType.BOT_CONFIGURATION_UPDATED]: BotConfigurationUpdatedPayload;
  [MessageType.BOT_CONFIGURATION_ADDED]: BotConfigurationAddedPayload;
}

export interface Message<T extends MessageType> {
  type: T;
  payload: MessagePayloadMap[T];
}
