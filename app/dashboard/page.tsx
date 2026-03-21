"use client";

import { useEffect, useState } from "react";
import { DemandasPainel } from "@/components/organisms/DemandasPainel";
import type { Usuario } from "@/components/types/usuario";
import { useDemandas } from "@/context/DemandasContext";

export default function DashboardPage() {
  const { demandas } = useDemandas();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const dados = sessionStorage.getItem("usuario");
    if (dados) setUsuario(JSON.parse(dados));
  }, []);

  if (!usuario) return null;

  return (
    <DemandasPainel
      usuario={usuario}
      demandas={demandas}
      titulo={`Olá, ${usuario.nome} 👋`}
      subtitulo="Visão geral de todas as demandas da equipe."
      tituloTabela="Todas as demandas"
      rodape={{ href: "/dashboard/demandas", label: "Ver demandas atribuídas a mim" }}
      mostrarNovaDemanda
    />
  );
}
