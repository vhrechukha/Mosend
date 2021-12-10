import { Module } from '@nestjs/common';
import { DbProviderModule } from '../../providers/db.provider';
import { Seeder } from './sedeer';
import { UserSeederModule } from './user/user.module';

@Module({
  imports: [DbProviderModule, UserSeederModule],
  providers: [Seeder],
})
export class SeederModule {}
