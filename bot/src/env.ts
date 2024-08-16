import { cleanEnv, port, str } from 'envalid';

const env = cleanEnv(process.env, {
  PORT: port({ default: 3001 }),

  KICK_TOKEN: str({}),
  KICK_COOKIES: str({}),
  KICK_USERNAME: str({}),
  KICK_CHANNEL: str({})
});

export type Env = typeof env;

export default env;
