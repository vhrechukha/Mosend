import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  private redis: any;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    this.redis = cache.store.getClient();
  }

  async get(key) {
    return this.cache.get(key);
  }

  async incrBy(key, value) {
    return this.redis.incrby(key, value);
  }
}
