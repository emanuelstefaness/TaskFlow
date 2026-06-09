import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PapeisGuard } from './papeis.guard';
import { SegurancaMiddleware } from './seguranca.middleware';

@Global()
@Module({
  imports: [
    UsuariosModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'taskflow-dev',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PapeisGuard, SegurancaMiddleware],
  exports: [JwtModule, PapeisGuard, SegurancaMiddleware],
})
export class AuthModule {}
