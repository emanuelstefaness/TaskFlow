import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AtualizarStatusDto } from './dto/atualizar-status.dto';
import { CriarDemandaDto } from './dto/criar-demanda.dto';
import { prazoDeIso, toDemandaResponse } from './demandas.mapper';

@Injectable()
export class DemandasService {
  constructor(private readonly prisma: PrismaService) {}

  async listar() {
    const demandas = await this.prisma.demanda.findMany({
      include: { responsavel: { select: { nome: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return demandas.map(toDemandaResponse);
  }

  async criar(dto: CriarDemandaDto) {
    const responsavel = await this.prisma.usuario.findFirst({
      where: { nome: dto.responsavel.trim() },
    });
    if (!responsavel) {
      throw new BadRequestException('Responsável não encontrado');
    }

    const gestor = dto.criadoPorEmail
      ? await this.prisma.usuario.findUnique({
          where: { email: dto.criadoPorEmail },
        })
      : await this.prisma.usuario.findFirst({
          where: { role: Role.GESTOR },
        });

    if (!gestor || gestor.role !== Role.GESTOR) {
      throw new BadRequestException('Gestor não encontrado');
    }

    const demanda = await this.prisma.demanda.create({
      data: {
        titulo: dto.titulo.trim(),
        descricao: dto.descricao?.trim() || null,
        prioridade: dto.prioridade,
        prazo: prazoDeIso(dto.prazoISO),
        responsavelId: responsavel.id,
        criadoPorId: gestor.id,
      },
      include: { responsavel: { select: { nome: true } } },
    });

    return toDemandaResponse(demanda);
  }

  async atualizarStatus(id: string, dto: AtualizarStatusDto) {
    try {
      const demanda = await this.prisma.demanda.update({
        where: { id },
        data: { status: dto.status },
        include: { responsavel: { select: { nome: true } } },
      });
      return toDemandaResponse(demanda);
    } catch {
      throw new NotFoundException('Demanda não encontrada');
    }
  }

  async excluir(id: string) {
    try {
      await this.prisma.demanda.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Demanda não encontrada');
    }
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
