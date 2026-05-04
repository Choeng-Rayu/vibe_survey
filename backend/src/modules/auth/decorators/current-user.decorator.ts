import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Requirement 3.8: Decorator to extract current user from request
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
