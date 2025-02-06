import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export function buildLoggerOptions(configService: ConfigService): Params {
  return {
    pinoHttp: {
      level: configService.get('LOG_LEVEL', 'info'),
      transport: {
        target: 'pino-pretty',
        options: {
          singleLine: true,
        },
      },
    },
  };
}
