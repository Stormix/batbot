import { db } from '@/db';

export const queryBotConfiguration = (filters = {}) => ({
  where: { enabled: true, ...filters },
  include: {
    user: {
      include: {
        accounts: {
          select: {
            provider: true,
            username: true
          }
        }
      }
    }
  }
});

export const getConfiguration = (configuration_id: string) => {
  return db?.botConfiguration.findFirst({
    ...queryBotConfiguration({ id: configuration_id })
  });
};

export const getConfigurations = () => {
  return db?.botConfiguration.findMany(queryBotConfiguration());
};
