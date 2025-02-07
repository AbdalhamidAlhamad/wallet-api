// authenticated-user.decorator.spec.ts
import { ExecutionContext } from '@nestjs/common';
import { getAuthenticatedUser } from './authenticated-user.decorator';

describe('getAuthenticatedUser', () => {
  it('should return the user from request', () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user: mockUser }),
      }),
    };

    const result = getAuthenticatedUser(undefined, mockExecutionContext as ExecutionContext);
    expect(result).toEqual(mockUser);
  });

  it('should return undefined if user is not set in request', () => {
    const mockExecutionContext: Partial<ExecutionContext> = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
    };

    const result = getAuthenticatedUser(undefined, mockExecutionContext as ExecutionContext);
    expect(result).toBeUndefined();
  });
});
