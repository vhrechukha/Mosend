import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {AppConfigService} from "./config/app.config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig: AppConfigService = await Promise.resolve(
      app.resolve(AppConfigService),
  );

  await app.listen(appConfig.get('APP_PORT'));
}
bootstrap();
