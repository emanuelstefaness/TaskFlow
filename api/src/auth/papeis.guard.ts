import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { PAPEIS_KEY } from './papeis.decorator';
import { UsuarioJwt } from './jwt-payload';

@Injectable()
export class PapeisGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const papeis = this.reflector.getAllAndOverride<Role[]>(PAPEIS_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!papeis?.length) return true;

    const user = ctx.switchToHttp().getRequest().user as UsuarioJwt;
    return papeis.includes(user.role);
  }
}
