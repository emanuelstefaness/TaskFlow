"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Usuario } from "@/types/usuario";

export default function PerfilPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const dados = sessionStorage.getItem("usuario");
    if (dados) setUsuario(JSON.parse(dados));
  }, []);

  if (!usuario) return null;

  function handleLogout() {
    sessionStorage.removeItem("usuario");
    router.push("/");
  }

  return (
    <div className="max-w-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Meu Perfil</h1>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
            {usuario.nome[0]}
          </div>
          <div>
            <p className="text-gray-800 text-lg font-semibold">{usuario.nome}</p>
            <p className="text-gray-400 text-sm">{usuario.email}</p>
            <p className="text-gray-400 text-xs mt-0.5 capitalize">{usuario.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors">
          Sair da conta
        </button>
      </div>
    </div>
  );
}