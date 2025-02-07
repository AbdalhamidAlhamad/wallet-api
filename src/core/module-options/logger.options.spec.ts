import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import { buildLoggerOptions } from './logger-options';

describe('buildLoggerOptions', () => {
  let configService: DeepMocked<ConfigService>;

  beforeEach(() => {
    configService = createMock<ConfigService>();
  });

  it('should return logger options with log level "debug"', () => {
    configService.get.mockReturnValue('debug'); // Simulate LOG_LEVEL is set to "debug"

    const result: Params = buildLoggerOptions(configService);

    expect(configService.get).toHaveBeenCalledWith('LOG_LEVEL', 'info');
    expect(result).toEqual({
      pinoHttp: {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    });
  });

  it('should return logger options with log level "error"', () => {
    configService.get.mockReturnValue('error'); // Simulate LOG_LEVEL is set to "error"

    const result: Params = buildLoggerOptions(configService);

    expect(configService.get).toHaveBeenCalledWith('LOG_LEVEL', 'info');
    expect(result).toEqual({
      pinoHttp: {
        level: 'error',
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    });
  });
});
