import * as path from 'path';
import { buildConfigOptions } from './config-options';

describe('buildConfigOptions', () => {
  const baseConfigDir = path.join(__dirname, '..', '..', 'config');

  beforeEach(() => {
    jest.resetModules(); // Reset module cache before each test
  });

  it('should return the correct default configuration paths', () => {
    delete process.env.NODE_ENV; // Ensure NODE_ENV is undefined
    const config = buildConfigOptions();

    expect(config).toEqual({
      isGlobal: true,
      envFilePath: ['.env', path.join(baseConfigDir, 'undefined.env')],
    });
  });

  it('should return correct paths when NODE_ENV is set to "development"', () => {
    process.env.NODE_ENV = 'development';

    const config = buildConfigOptions();

    expect(config).toEqual({
      isGlobal: true,
      envFilePath: ['.env', path.join(baseConfigDir, 'development.env')],
    });
  });

  it('should return correct paths when NODE_ENV is set to "production"', () => {
    process.env.NODE_ENV = 'production';

    const config = buildConfigOptions();

    expect(config).toEqual({
      isGlobal: true,
      envFilePath: ['.env', path.join(baseConfigDir, 'production.env')],
    });
  });
});
