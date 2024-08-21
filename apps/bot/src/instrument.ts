import * as Sentry from '@sentry/bun';
import env from './env';

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: env.BOT_SENTRY_DSN,
  tracesSampleRate: 1,
  integrations: [Sentry.prismaIntegration()],
});

export default Sentry;
