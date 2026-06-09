import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const PAPEIS_KEY = 'papeis';
export const Papeis = (...papeis: Role[]) => SetMetadata(PAPEIS_KEY, papeis);
