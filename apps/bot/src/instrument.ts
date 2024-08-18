import * as Sentry from '@sentry/bun';

// Ensure to call this before importing any other modules!
Sentry.init({
  dsn: '',
  tracesSampleRate: 0.1
});

export default Sentry;
