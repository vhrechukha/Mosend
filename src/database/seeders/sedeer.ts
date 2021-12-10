import { Injectable } from '@nestjs/common';
import * as faker from 'faker';
import { UserSeedService } from './user/user.service';

@Injectable()
export class Seeder {
  constructor(private readonly userService: UserSeedService) {}

  async seed() {
    await this.users().catch((error) => {
      Promise.reject(error);
    });
  }

  async users() {
    const users = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 5; i++) {
      users.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        // eslint-disable-next-line no-await-in-loop
        password: await faker.internet.password(),
      });
    }

    return Promise.all(this.userService.create(users)).catch((error) => Promise.reject(error));
  }
}
