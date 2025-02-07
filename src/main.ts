import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';
const DEFAULT_PORT = 3000;
async function bootstrap() {
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));
  const config = app.get(ConfigService);
  const swaggerDocument = await createSwagger(app);

  if (config.getOrThrow<string>('NODE_ENV') === 'dev') {
    SwaggerModule.setup(config.getOrThrow<string>('SWAGGER_API_DOCS_PATH'), app, swaggerDocument, {
      swaggerOptions: {
        tagsSorter: 'alpha',
        docExpansion: 'none',
      },
    });
  }
  await app.listen(process.env.PORT ?? DEFAULT_PORT);
}

function createSwagger(app: INestApplication) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Wallet API')
    .setDescription('API documentation for wallet app')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  return SwaggerModule.createDocument(app, swaggerConfig);
}

bootstrap();
