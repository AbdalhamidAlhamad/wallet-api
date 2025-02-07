import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { buildConfigOptions, buildLoggerOptions, buildTypeormOptions } from './core/module-options';
import { buildValidationPipe } from './core/pipes';
import { migrations } from './db';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
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
    AuthModule,
    UserModule,
    AccountModule,
    TransactionModule,
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
