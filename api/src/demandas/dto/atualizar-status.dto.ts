import { StatusDemanda } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { LABEL_PARA_STATUS } from '../demandas.mapper';

export class AtualizarStatusDto {
  @Transform(({ value }: { value: string }) => LABEL_PARA_STATUS[value] ?? value)
  @IsEnum(StatusDemanda)
  status: StatusDemanda;
}
