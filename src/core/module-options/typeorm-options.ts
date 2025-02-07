import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Environment } from '../enums';

export function buildTypeormOptions(
  config: ConfigService,
  migrations?: TypeOrmModuleOptions['migrations'],
): TypeOrmModuleOptions {
  return {
    type: 'sqlite',
    database: config.getOrThrow<string>('NODE_ENV') === Environment.TEST ? ':memory:' : 'db.sqlite',
    logging: config.getOrThrow<string>('NODE_ENV') === Environment.DEV,
    synchronize: false,
    migrationsRun: config.getOrThrow<string>('MIGRATIONS_RUN') === 'true',
    autoLoadEntities: true,
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    migrations,
  };
}
