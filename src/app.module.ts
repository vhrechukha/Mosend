import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app.config.module';
import { DbProviderModule } from './providers/db.provider';

@Module({
  imports: [AppConfigModule, DbProviderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
