import { cleanEnv, port, str } from 'envalid';

const env = cleanEnv(process.env, {
  PORT: port({ default: 3001 }),
  DATABASE_URL: str(),
  KICK_TOKEN: str(),
  KICK_COOKIES: str(),
  KICK_USERNAME: str(),
  KICK_CHANNEL: str(),
  BOT_SENTRY_DSN: str(),
  TWITCH_CLIENT_ID: str(),
  TWITCH_CLIENT_SECRET: str(),
  TWITCH_ACCESS_TOKEN: str(),
  TWITCH_REFRESH_TOKEN: str(),
  TWITCH_USERNAME: str({
    default: 'StormixBot'
  }),
  TWITCH_CHANNEL: str({
    default: 'stormix_dev'
  }),
  RABBITMQ_URI: str()
});

export type Env = typeof env;

export default env;
