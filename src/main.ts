import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AppConfigService } from './config/app.config.service';
import { AllExceptionsFilter } from './common/errors/all-exceptions.filter';
import { TypeoremFilter } from './common/errors/typeorem.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(bodyParser.json({ limit: '5000mb' }));
  app.use(bodyParser.urlencoded({ limit: '5000mb', extended: true }));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new TypeoremFilter());

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const appConfig: AppConfigService = await Promise.resolve(
    app.resolve(AppConfigService),
  );

  const config = new DocumentBuilder()
    .setTitle('Mosend example')
    .setDescription('The mosend API description')
    .setVersion('1.0')
    .addTag('mosend')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.get('APP_PORT'));
}
bootstrap();
