import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Papeis } from '../auth/papeis.decorator';
import { PapeisGuard } from '../auth/papeis.guard';
import { CriarFuncionarioDto } from './dto/criar-funcionario.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, PapeisGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('funcionarios')
  @Papeis(Role.GESTOR)
  listarFuncionarios() {
    return this.usuariosService.listarFuncionarios();
  }

  @Post('funcionarios')
  @Papeis(Role.GESTOR)
  criarFuncionario(@Body() dto: CriarFuncionarioDto) {
    return this.usuariosService.criarFuncionario(dto);
  }
}
