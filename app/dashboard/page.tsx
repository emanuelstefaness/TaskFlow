"use client";

import { useEffect, useState } from "react";
import { DemandasPainel } from "@/components/organisms/DemandasPainel";
import type { Usuario } from "@/types/usuario";
import { useDemandas } from "@/context/DemandasContext";
import { buscarCitacaoAleatoria } from "@/lib/api/citacao-publica";

export default function DashboardPage() {
  const { demandas } = useDemandas();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [citacao, setCitacao] = useState<string | null>(null);

  useEffect(() => {
    const dados = sessionStorage.getItem("usuario");
    if (dados) setUsuario(JSON.parse(dados));
  }, []);

  useEffect(() => {
    let ativo = true;
    buscarCitacaoAleatoria()
      .then((c) => {
        if (ativo) setCitacao(`“${c.content}” — ${c.author}`);
      })
      .catch(() => {
        if (ativo) setCitacao(null);
      });
    return () => {
      ativo = false;
    };
  }, []);

  if (!usuario) return null;

  return (
    <div>
      {citacao && (
        <p className="text-xs text-gray-500 mb-4 max-w-2xl italic border-l-2 border-blue-200 pl-3">
          {citacao}
        </p>
      )}
      <DemandasPainel
        usuario={usuario}
        demandas={demandas}
        titulo={`Olá, ${usuario.nome} 👋`}
        subtitulo="Visão geral de todas as demandas da equipe."
        tituloTabela="Todas as demandas"
        rodape={{
          href: "/dashboard/demandas",
          label: "Ver demandas atribuídas a mim",
        }}
        mostrarNovaDemanda
      />
    </div>
  );
}
