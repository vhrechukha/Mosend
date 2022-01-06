import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisClient } from 'node_modules/@nestjs/microservices/external/redis.interface';

@Injectable()
export class RedisCacheService {
  private readonly redis: RedisClient;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    this.redis = cache.store.getClient();
  }

  async get<T>(key): Promise<T> {
    return this.cache.get(key);
  }

  async incrBy(key, value): Promise<number> {
    return this.redis.incrby(key, value);
  }
}
