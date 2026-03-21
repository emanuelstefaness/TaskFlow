"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/organisms/Sidebar";
import type { Usuario } from "@/components/types/usuario";
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

  return (
    <DemandasProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar usuario={usuario} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-600" />
              <span className="text-blue-600 font-bold">TaskFlow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {usuario.nome[0]}
              </div>
              <span className="text-gray-700 text-sm">{usuario.nome}</span>
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