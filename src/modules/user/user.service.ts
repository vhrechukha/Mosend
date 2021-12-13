import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult, LessThanOrEqual, Repository,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  getUsers({ skip = 0, take = 10 }) {
    return this.repository.find({
      skip,
      take,
    });
  }

  async save({ password, ...data }) {
    return this.repository.save({
      ...data,
      password: await bcrypt.hash(password, 10),
    });
  }

  async updateData(data) {
    return this.repository.save({ ...data });
  }

  async findOneByEmail(email) {
    return this.repository.findOne({ email });
  }

  async findOneById(id) {
    return this.repository.findOne(id);
  }

  deleteById(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  deleteMany(time: Date) {
    return this.repository.delete({
      suspended_at: LessThanOrEqual(time),
    });
  }
}
