import { Prioridade } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { LABEL_PARA_PRIORIDADE } from '../demandas.mapper';

export class CriarDemandaDto {
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  titulo: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descricao?: string;

  @IsString()
  @IsNotEmpty()
  responsavel: string;

  @Transform(({ value }: { value: string }) => LABEL_PARA_PRIORIDADE[value] ?? value)
  @IsEnum(Prioridade)
  prioridade: Prioridade;

  @IsDateString()
  prazoISO: string;

  @IsOptional()
  @IsString()
  criadoPorEmail?: string;
}
