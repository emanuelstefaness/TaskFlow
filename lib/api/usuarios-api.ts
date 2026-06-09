import type { Usuario } from "@/types/usuario";
import { apiFetch } from "./client";

type FuncionarioApi = {
  id: string;
  nome: string;
  email: string;
  role: string;
};

function mapFuncionario(u: FuncionarioApi): Usuario {
  return {
    id: u.id,
    nome: u.nome,
    email: u.email,
    role: "funcionario",
  };
}

export async function listarFuncionarios(): Promise<Usuario[]> {
  const lista = await apiFetch<FuncionarioApi[]>("/usuarios/funcionarios");
  return lista.map(mapFuncionario);
}

export async function criarFuncionario(dados: {
  nome: string;
  email: string;
  senha: string;
}): Promise<Usuario> {
  const u = await apiFetch<FuncionarioApi>("/usuarios/funcionarios", {
    method: "POST",
    body: JSON.stringify(dados),
  });
  return mapFuncionario(u);
}
