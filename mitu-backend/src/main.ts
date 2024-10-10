import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MieszkamTu API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [],
  });
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: 10, // for model schemas
      defaultModelExpandDepth: 10, // for model-example schemas
      docExpansion: 'list',
    },
  });
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
