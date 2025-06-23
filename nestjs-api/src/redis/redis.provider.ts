import { Provider } from '@nestjs/common';
import { createClient } from 'redis';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),

      },
    });
    await client.connect();
    return client;
  },
};
