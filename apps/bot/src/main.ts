import env from './env';
import Orchestrator from './lib/orchestrator';

const main = async () => {
  const orchestrator = new Orchestrator();
  await orchestrator.listen();

  orchestrator.logger.info('Orchestrator is listening on port:', env.PORT);
};

main();
