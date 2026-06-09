import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AtualizarStatusDto } from './dto/atualizar-status.dto';
import { CriarDemandaDto } from './dto/criar-demanda.dto';
import { DemandasService } from './demandas.service';

@Controller('demandas')
export class DemandasController {
  constructor(private readonly demandasService: DemandasService) {}

  @Get()
  listar(@Query('responsavel') responsavel?: string) {
    if (responsavel?.trim()) {
      return this.demandasService.listarPorResponsavel(responsavel);
    }
    return this.demandasService.listar();
  }

  @Post()
  criar(@Body() dto: CriarDemandaDto) {
    return this.demandasService.criar(dto);
  }

  @Patch(':id/status')
  atualizarStatus(@Param('id') id: string, @Body() dto: AtualizarStatusDto) {
    return this.demandasService.atualizarStatus(id, dto);
  }

  @Delete(':id')
  excluir(@Param('id') id: string) {
    return this.demandasService.excluir(id);
  }
}
