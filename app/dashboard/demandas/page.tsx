"use client";

import { useEffect, useMemo, useState } from "react";
import { DemandasPainel } from "@/components/organisms/DemandasPainel";
import type { Usuario } from "@/types/usuario";
import { useDemandas } from "@/context/DemandasContext";
import { demandasDoUsuario } from "@/lib/demandas-utils";

export default function DemandasPage() {
  const { demandas } = useDemandas();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const dados = sessionStorage.getItem("usuario");
    if (dados) setUsuario(JSON.parse(dados));
  }, []);

  const minhasDemandas = useMemo(() => {
    if (!usuario) return [];
    return demandasDoUsuario(demandas, usuario.nome);
  }, [usuario, demandas]);

  if (!usuario) return null;

  return (
    <DemandasPainel
      usuario={usuario}
      demandas={minhasDemandas}
      titulo="Demandas atribuídas a mim"
      subtitulo="Somente o que está sob sua responsabilidade."
      tituloTabela="Minhas demandas"
      rodape={{ href: "/dashboard", label: "Ver todas as demandas" }}
      mensagemVazia="Nenhuma demanda atribuída a você."
    />
  );
}
