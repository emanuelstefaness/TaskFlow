import type { Usuario } from "@/types/usuario";

export const USUARIOS_COM_ACESSO: Usuario[] = [
  {
    id: 1,
    nome: "Felipe Admin",
    email: "gestor@taskflow.com",
    senha: "123",
    role: "gestor",
  },
  {
    id: 2,
    nome: "Manu",
    email: "manu@taskflow.com",
    senha: "123",
    role: "funcionario",
  },
];

export function funcionariosComAcesso() {
  return USUARIOS_COM_ACESSO.filter((u) => u.role === "funcionario").map(
    ({ senha: _, ...rest }) => rest,
  );
}
