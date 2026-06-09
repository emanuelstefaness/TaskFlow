import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsuarioJwt } from '../auth/jwt-payload';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarStatusDto } from './dto/atualizar-status.dto';
import { CriarDemandaDto } from './dto/criar-demanda.dto';
import { prazoDeIso, toDemandaResponse } from './demandas.mapper';

@Injectable()
export class DemandasService {
  constructor(private readonly prisma: PrismaService) {}

  private podeEditar(demanda: { responsavel: { nome: string } }, user: UsuarioJwt) {
    if (user.role === Role.GESTOR) return true;
    return demanda.responsavel.nome === user.nome;
  }

  async listar() {
    const demandas = await this.prisma.demanda.findMany({
      include: { responsavel: { select: { nome: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return demandas.map(toDemandaResponse);
  }

  async criar(dto: CriarDemandaDto, criadoPorId: string) {
    const responsavel = await this.prisma.usuario.findFirst({
      where: { nome: dto.responsavel.trim() },
    });
    if (!responsavel) {
      throw new BadRequestException('Responsável não encontrado');
    }

    const demanda = await this.prisma.demanda.create({
      data: {
        titulo: dto.titulo.trim(),
        descricao: dto.descricao?.trim() || null,
        prioridade: dto.prioridade,
        prazo: prazoDeIso(dto.prazoISO),
        responsavelId: responsavel.id,
        criadoPorId,
      },
      include: { responsavel: { select: { nome: true } } },
    });

    return toDemandaResponse(demanda);
  }

  async atualizarStatus(id: string, dto: AtualizarStatusDto, user: UsuarioJwt) {
    const atual = await this.prisma.demanda.findUnique({
      where: { id },
      include: { responsavel: { select: { nome: true } } },
    });
    if (!atual) {
      throw new NotFoundException('Demanda não encontrada');
    }
    if (!this.podeEditar(atual, user)) {
      throw new ForbiddenException();
    }

    const demanda = await this.prisma.demanda.update({
      where: { id },
      data: { status: dto.status },
      include: { responsavel: { select: { nome: true } } },
    });
    return toDemandaResponse(demanda);
  }

  async excluir(id: string, user: UsuarioJwt) {
    const atual = await this.prisma.demanda.findUnique({
      where: { id },
      include: { responsavel: { select: { nome: true } } },
    });
    if (!atual) {
      throw new NotFoundException('Demanda não encontrada');
    }
    if (!this.podeEditar(atual, user)) {
      throw new ForbiddenException();
    }

    await this.prisma.demanda.delete({ where: { id } });
  }

  async listarPorResponsavel(nome: string) {
    const demandas = await this.prisma.demanda.findMany({
      where: { responsavel: { nome: { equals: nome.trim() } } },
      include: { responsavel: { select: { nome: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return demandas.map(toDemandaResponse);
  }
}
