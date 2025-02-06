import 'tsconfig-paths/register';
import { Environment } from '~/core/enums';

export default function globalSetup() {
  process.env = {
    ...process.env,
    NODE_ENV: Environment.TEST,
    // override env vars
  };
}
