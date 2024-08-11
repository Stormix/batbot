import EventEmitter from 'events';
import Logger from './logger';

class Base {
  logger: Logger;

  constructor(name?: string) {
    this.logger = new Logger().getSubLogger({ name: name ?? this.constructor.name });
  }
}

class BaseEmitter extends EventEmitter {
  logger: Logger;

  constructor(name?: string) {
    super();
    this.logger = new Logger().getSubLogger({ name: name ?? this.constructor.name });
  }
}

export { Base, BaseEmitter };
