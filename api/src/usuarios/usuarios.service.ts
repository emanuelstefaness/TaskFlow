import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async listarFuncionarios() {
    return this.prisma.usuario.findMany({
      where: { role: Role.FUNCIONARIO },
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true, email: true, role: true },
    });
  }

  async buscarPorEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  async buscarPorNome(nome: string) {
    return this.prisma.usuario.findFirst({
      where: { nome: { equals: nome } },
    });
  }
}
