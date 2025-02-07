import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Environment } from '../enums';
import { buildTypeormOptions } from './typeorm-options';

describe('buildTypeormOptions', () => {
  let configService: DeepMocked<ConfigService>;

  beforeEach(() => {
    configService = createMock<ConfigService>();
  });

  it('should return TypeORM options for TEST environment', () => {
    configService.getOrThrow.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return Environment.TEST;
      if (key === 'MIGRATIONS_RUN') return 'false';
      return undefined;
    });

    const result: TypeOrmModuleOptions = buildTypeormOptions(configService);

    expect(configService.getOrThrow).toHaveBeenCalledWith('NODE_ENV');
    expect(configService.getOrThrow).toHaveBeenCalledWith('MIGRATIONS_RUN');
    expect(result).toEqual({
      type: 'sqlite',
      database: ':memory:',
      logging: false,
      synchronize: false,
      migrationsRun: false,
      autoLoadEntities: true,
      entities: [expect.stringContaining('/**/*.entity{.ts,.js}')],
      migrations: undefined,
    });
  });

  it('should return TypeORM options for DEV environment with logging enabled', () => {
    configService.getOrThrow.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return Environment.DEV;
      if (key === 'MIGRATIONS_RUN') return 'true';
      return undefined;
    });

    const result: TypeOrmModuleOptions = buildTypeormOptions(configService);

    expect(configService.getOrThrow).toHaveBeenCalledWith('NODE_ENV');
    expect(configService.getOrThrow).toHaveBeenCalledWith('MIGRATIONS_RUN');
    expect(result).toEqual({
      type: 'sqlite',
      database: 'db.sqlite',
      logging: true,
      synchronize: false,
      migrationsRun: true,
      autoLoadEntities: true,
      entities: [expect.stringContaining('/**/*.entity{.ts,.js}')],
      migrations: undefined,
    });
  });

  it('should return TypeORM options for PROD environment with logging disabled', () => {
    configService.getOrThrow.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return Environment.PROD;
      if (key === 'MIGRATIONS_RUN') return 'false';
      return undefined;
    });

    const result: TypeOrmModuleOptions = buildTypeormOptions(configService);

    expect(configService.getOrThrow).toHaveBeenCalledWith('NODE_ENV');
    expect(configService.getOrThrow).toHaveBeenCalledWith('MIGRATIONS_RUN');
    expect(result).toEqual({
      type: 'sqlite',
      database: 'db.sqlite',
      logging: false,
      synchronize: false,
      migrationsRun: false,
      autoLoadEntities: true,
      entities: [expect.stringContaining('/**/*.entity{.ts,.js}')],
      migrations: undefined,
    });
  });

  it('should correctly include migrations if provided', () => {
    configService.getOrThrow.mockImplementation((key: string) => {
      if (key === 'NODE_ENV') return Environment.DEV;
      if (key === 'MIGRATIONS_RUN') return 'true';
      return undefined;
    });

    const mockMigrations = ['migration1.ts', 'migration2.ts'];
    const result: TypeOrmModuleOptions = buildTypeormOptions(configService, mockMigrations);

    expect(result.migrations).toEqual(mockMigrations);
  });
});
