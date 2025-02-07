// authenticated-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export function getAuthenticatedUser(data: unknown, ctx: ExecutionContext) {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
}

export const AuthenticatedUser = createParamDecorator(getAuthenticatedUser);
