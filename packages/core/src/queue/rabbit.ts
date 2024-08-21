import client, { type Channel, type Connection } from 'amqplib';
import type { Message, MessageType, Queue } from './constants';

export class RabbitMQConnection {
  connection: Connection | null;
  channel: Channel | null;

  private _uri: string;
  private _connected: boolean;

  constructor(uri: string) {
    this._uri = uri;
    this._connected = false;
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (this._connected && this.channel) return;
    else this._connected = true;

    console.log(`⌛️ Connecting to Rabbit-MQ Server`);
    this.connection = await client.connect(this._uri);

    console.log(`✅ Rabbit MQ Connection is ready`);
    this.channel = await this.connection.createChannel();

    console.log(`🛸 Created RabbitMQ Channel successfully`);
  }

  async sendToQueue<T extends MessageType>(queue: Queue, message: Message<T>) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      this.channel!.assertQueue(queue, { durable: true });
      this.channel!.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async consume<T extends MessageType>(queue: Queue, callback: (message: Message<T>) => void) {
    try {
      if (!this.channel) {
        await this.connect();
      }
      this.channel!.assertQueue(queue, { durable: true });
      this.channel!.consume(queue, (message) => {
        if (message) {
          callback(JSON.parse(message.content.toString()));
          this.channel!.ack(message);
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }

    if (this.connection) {
      await this.connection.close();
    }
  }
}
