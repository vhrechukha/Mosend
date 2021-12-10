import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../modules/user/entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  create(users: any): Array<Promise<User>> {
    return users.map(async (user) => this.repository
      .save(user)
      .catch((error) => Promise.reject(error)));
  }
}
