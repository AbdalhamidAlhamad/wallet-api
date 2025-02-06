import { ConfigModuleOptions } from '@nestjs/config';
import * as path from 'path';

const baseConfigDir = path.join(__dirname, '..', '..', 'config');

export function buildConfigOptions(): ConfigModuleOptions {
  return {
    isGlobal: true,
    envFilePath: [
      // Dev (sensitive + overridden default env vars)
      '.env',
      path.join(baseConfigDir, `${process.env.NODE_ENV}.env`),
    ],
  };
}
