import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CriarFuncionarioDto } from './dto/criar-funcionario.dto';

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

  async criarFuncionario(dto: CriarFuncionarioDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
    });
    if (existe) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);

    return this.prisma.usuario.create({
      data: {
        nome: dto.nome.trim(),
        email: dto.email.trim().toLowerCase(),
        senhaHash,
        role: Role.FUNCIONARIO,
      },
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
