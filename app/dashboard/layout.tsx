"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/organisms/Sidebar";
import type { Usuario } from "@/types/usuario";
import { DemandasProvider } from "@/context/DemandasContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const dados = sessionStorage.getItem("usuario");
    if (!dados) router.push("/");
    else setUsuario(JSON.parse(dados));
  }, []);

  if (!usuario) return <div className="min-h-screen bg-gray-100" />;

  function encerrarSessao() {
    sessionStorage.removeItem("usuario");
    router.push("/");
  }

  return (
    <DemandasProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar usuario={usuario} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="min-h-14 bg-white border-b border-gray-200 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-600" />
              <span className="text-blue-600 font-bold">TaskFlow</span>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              <div className="flex items-center gap-2 mr-1">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {usuario.nome[0]}
                </div>
                <span className="text-gray-700 text-sm max-w-[140px] sm:max-w-[200px] truncate">
                  {usuario.nome}
                </span>
              </div>
              <button
                type="button"
                onClick={encerrarSessao}
                className="text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded-lg hover:bg-gray-100"
              >
                Trocar perfil
              </button>
              <button
                type="button"
                onClick={encerrarSessao}
                className="text-sm font-medium text-red-600 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50"
              >
                Sair
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </DemandasProvider>
  );
}