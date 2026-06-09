"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { USUARIOS_COM_ACESSO } from "@/lib/usuarios-sistema";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const usuario = USUARIOS_COM_ACESSO.find(
      (u) => u.email === email && u.senha === senha,
    );
    if (usuario) {
      sessionStorage.setItem("usuario", JSON.stringify(usuario));
      router.push("/dashboard");
    } else {
      setErro("E-mail ou senha incorretos.");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <div className="text-center mb-6">
          <h1 className="text-gray-800 text-xl font-bold">TaskFlow</h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
          {erro && (
            <p className="text-red-500 text-sm text-center">{erro}</p>
          )}
          <Button type="submit">Entrar</Button>
        </form>
      </div>
    </main>
  );
}
