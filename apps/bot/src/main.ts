import { test } from '@batbot/core';
import env from './env';
import Orchestrator from './lib/orchestrator';

const main = async () => {
  test();
  const orchestrator = new Orchestrator();
  await orchestrator.listen();
  await orchestrator.logger.info('Orchestrator is listening on port:', env.PORT);
};

main();
