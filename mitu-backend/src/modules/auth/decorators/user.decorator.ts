import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * Decorator to get user
 * @export
 * @param data
 * @param ctx
 * @returns
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
