import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SegurancaMiddleware } from './auth/seguranca.middleware';
import { DemandasController } from './demandas/demandas.controller';
import { DemandasModule } from './demandas/demandas.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [PrismaModule, AuthModule, UsuariosModule, DemandasModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SegurancaMiddleware)
      .forRoutes(DemandasController, UsuariosController);
  }
}
