import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '@prisma/client';
import { UsuarioJwt } from './jwt-payload';

type TokenPayload = {
  sub: string;
  email: string;
  nome: string;
  role: Role;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'taskflow-dev',
    });
  }

  validate(payload: TokenPayload): UsuarioJwt {
    return {
      id: payload.sub,
      email: payload.email,
      nome: payload.nome,
      role: payload.role,
    };
  }
}
