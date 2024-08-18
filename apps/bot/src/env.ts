import { cleanEnv, port, str } from 'envalid';

const env = cleanEnv(process.env, {
  PORT: port({ default: 3001 }),
  DATABASE_URL: str({}),
  KICK_TOKEN: str({}),
  KICK_COOKIES: str({}),
  KICK_USERNAME: str({}),
  KICK_CHANNEL: str({}),
  BOT_SENTRY_DSN: str({})
});

export type Env = typeof env;

export default env;
