import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DemandasModule } from './demandas/demandas.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [PrismaModule, AuthModule, UsuariosModule, DemandasModule],
})
export class AppModule {}
