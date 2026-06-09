"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import {
  criarFuncionario,
  listarFuncionarios,
} from "@/lib/api/usuarios-api";
import type { Usuario } from "@/types/usuario";

export default function FuncionariosPage() {
  const [contas, setContas] = useState<Usuario[]>([]);
  const [erro, setErro] = useState("");
  const [formAberto, setFormAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [salvando, setSalvando] = useState(false);

  function carregar() {
    listarFuncionarios()
      .then(setContas)
      .catch(() => setErro("Não foi possível carregar."));
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      const novo = await criarFuncionario({ nome, email, senha });
      setContas((prev) => [...prev, novo].sort((a, b) => a.nome.localeCompare(b.nome)));
      setNome("");
      setEmail("");
      setSenha("");
      setFormAberto(false);
      toast.success("Funcionário cadastrado.");
    } catch {
      toast.error("Não foi possível cadastrar. Verifique o e-mail.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Funcionários</h1>
        <Button type="button" onClick={() => setFormAberto((v) => !v)}>
          {formAberto ? "Cancelar" : "+ Novo"}
        </Button>
      </div>

      {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}

      {formAberto && (
        <form
          onSubmit={handleCriar}
          className="bg-white rounded-xl shadow p-6 mb-6 max-w-md flex flex-col gap-3"
        >
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
          />
          <Input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
          />
          <Button type="submit" disabled={salvando}>
            {salvando ? "Salvando…" : "Cadastrar"}
          </Button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden max-w-3xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 font-medium">Nome</th>
              <th className="px-6 py-3 font-medium">E-mail</th>
            </tr>
          </thead>
          <tbody>
            {contas.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Nenhum funcionário cadastrado.
                </td>
              </tr>
            ) : (
              contas.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80"
                >
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {u.nome}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
