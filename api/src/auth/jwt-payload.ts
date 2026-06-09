import { Role } from '@prisma/client';

export type UsuarioJwt = {
  id: string;
  email: string;
  nome: string;
  role: Role;
};
