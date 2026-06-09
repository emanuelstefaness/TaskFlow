import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.usuariosService.buscarPorEmail(dto.email);
    if (!usuario) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const ok = await bcrypt.compare(dto.senha, usuario.senhaHash);
    if (!ok) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const role = usuario.role === 'GESTOR' ? 'gestor' : 'funcionario';

    const access_token = this.jwtService.sign({
      sub: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
    });

    return {
      access_token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role,
      },
    };
  }
}
