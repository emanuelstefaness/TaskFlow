import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Papeis } from '../auth/papeis.decorator';
import { PapeisGuard } from '../auth/papeis.guard';
import { UsuarioLogado } from '../auth/usuario.decorator';
import type { UsuarioJwt } from '../auth/jwt-payload';
import { AtualizarStatusDto } from './dto/atualizar-status.dto';
import { CriarDemandaDto } from './dto/criar-demanda.dto';
import { DemandasService } from './demandas.service';

@Controller('demandas')
@UseGuards(JwtAuthGuard, PapeisGuard)
export class DemandasController {
  constructor(private readonly demandasService: DemandasService) {}

  @Get()
  listar(
    @UsuarioLogado() user: UsuarioJwt,
    @Query('responsavel') responsavel?: string,
  ) {
    if (user.role === Role.FUNCIONARIO) {
      return this.demandasService.listarPorResponsavel(user.nome);
    }
    if (responsavel?.trim()) {
      return this.demandasService.listarPorResponsavel(responsavel);
    }
    return this.demandasService.listar();
  }

  @Post()
  @Papeis(Role.GESTOR)
  criar(@UsuarioLogado() user: UsuarioJwt, @Body() dto: CriarDemandaDto) {
    return this.demandasService.criar(dto, user.id);
  }

  @Patch(':id/status')
  atualizarStatus(
    @UsuarioLogado() user: UsuarioJwt,
    @Param('id') id: string,
    @Body() dto: AtualizarStatusDto,
  ) {
    return this.demandasService.atualizarStatus(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  excluir(@UsuarioLogado() user: UsuarioJwt, @Param('id') id: string) {
    return this.demandasService.excluir(id, user);
  }
}
