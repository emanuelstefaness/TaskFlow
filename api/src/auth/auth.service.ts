import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usuariosService: UsuariosService) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.buscarPorEmail(dto.email);
    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senhaHash);
    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role === 'GESTOR' ? 'gestor' : 'funcionario',
    };
  }
}
