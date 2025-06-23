import { Module, Global } from '@nestjs/common';
import { RedisProvider } from './redis.provider';

@Global()  // Important: make it Global so it's available everywhere
@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
