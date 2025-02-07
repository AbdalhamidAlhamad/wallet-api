import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './src/app.module';

/**
 * Getting data source through NestJS app helps in getting entities dynamically with "autoLoadEntities" NestJS feature
 * as well as keeping migrations config in sync with what is configured in the app.
 */
async function getTypeOrmDataSource() {
  process.env.MIGRATIONS_RUN = 'false';

  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);
  await app.close();

  return dataSource;
}

export default getTypeOrmDataSource();
