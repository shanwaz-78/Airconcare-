import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export interface DecodedUser {
  sub: string;
  email: string;
  role: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): DecodedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
