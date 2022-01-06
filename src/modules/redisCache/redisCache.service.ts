import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  private redis: any;

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
