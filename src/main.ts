import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSame from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(require('dayjs/plugin/isBetween'));
dayjs.extend(require('dayjs/plugin/isSameOrBefore'));

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, logger: ['log','debug'] }); // new MyLogger()

  const config = new DocumentBuilder()
    .setTitle('Swagger')
    .addBearerAuth()
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
