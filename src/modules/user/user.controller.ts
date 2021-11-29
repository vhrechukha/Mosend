import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  getUsers(@Query('skip') skip: number, @Query('take') take: number) {
    return this.service.getUsers({ skip, take });
  }
}
