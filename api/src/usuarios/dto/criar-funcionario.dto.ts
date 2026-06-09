import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CriarFuncionarioDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  senha: string;
}
