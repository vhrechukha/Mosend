import { Injectable } from '@nestjs/common';
import { UserSeedService } from './user/user.service';

import * as faker from 'faker';

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
    for (let i = 0; i < 5; i++) {
      users.push({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: await faker.internet.password(),
      });
    }

    return Promise.all(this.userService.create(users)).catch((error) =>
      Promise.reject(error),
    );
  }
}
