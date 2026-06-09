import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UsuarioJwt } from './jwt-payload';

export const UsuarioLogado = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UsuarioJwt => {
    return ctx.switchToHttp().getRequest().user;
  },
);
