import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { buildConfigOptions, buildLoggerOptions, buildTypeormOptions } from './core/module-options';
import { buildValidationPipe } from './core/pipes';
import { migrations } from './db';
@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot(buildConfigOptions()),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => buildTypeormOptions(config, migrations),
    }),
    LoggerModule.forRootAsync({
      useFactory: (config: ConfigService) => buildLoggerOptions(config),
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Global Pipes
    {
      inject: [ConfigService],
      provide: APP_PIPE,
      useFactory: (config: ConfigService) => buildValidationPipe(config),
    },
  ],
})
export class AppModule {}
