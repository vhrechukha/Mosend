import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../modules/user/entities/user.entity';
import { Module } from '@nestjs/common';
import { UserSeedService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeederModule {}
