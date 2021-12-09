import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  getUsers({ skip = 0, take = 10 }) {
    return this.usersRepository.find({
      skip,
      take,
    });
  }

  async save({ email, password, name }) {
    return this.usersRepository.save({
      email,
      name,
      password: await bcrypt.hash(password, 10),
    });
  }

  async updateData(data) {
    return this.usersRepository.save({ ...data });
  }

  async findOneByEmail(email) {
    return this.usersRepository.findOne({ email });
  }

  async findOneById(id) {
    return this.usersRepository.findOne(id);
  }
}
