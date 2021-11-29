import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app.config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig: AppConfigService = await Promise.resolve(
    app.resolve(AppConfigService),
  );

  const config = new DocumentBuilder()
    .setTitle('Mosend example')
    .setDescription('The mosend API description')
    .setVersion('1.0')
    .addTag('mosend')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.get('APP_PORT'));
}
bootstrap();
