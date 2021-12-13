import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
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

  async save({ password, ...data }) {
    return this.usersRepository.save({
      ...data,
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

  deleteById(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
