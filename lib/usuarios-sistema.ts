import type { Usuario } from "@/types/usuario";

/** Única fonte da verdade: quem pode entrar no sistema (login usa esta lista). */
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

export type ContaSemSenha = Omit<Usuario, "senha">;

function semSenha(u: Usuario): ContaSemSenha {
  const { senha: _s, ...rest } = u;
  return rest;
}

/** Funcionários com login no sistema (exclui gestor). */
export function funcionariosComAcesso(): ContaSemSenha[] {
  return USUARIOS_COM_ACESSO.filter((u) => u.role === "funcionario").map(
    semSenha,
  );
}
