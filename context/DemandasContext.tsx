"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";
import {
  listarDemandas,
  criarDemanda,
  atualizarStatusDemanda as atualizarStatusDemandaApi,
  excluirDemanda as excluirDemandaApi,
} from "@/lib/api/demandas-api";
import type { NovaDemandaFormValues } from "@/schemas/nova-demanda";
import type { Demanda } from "@/types/demanda";

type DemandasContextValue = {
  demandas: Demanda[];
  carregando: boolean;
  adicionarDemanda: (input: NovaDemandaFormValues) => Promise<void>;
  atualizarStatusDemanda: (
    id: number,
    status: Demanda["status"],
  ) => Promise<Demanda>;
  excluirDemanda: (id: number) => Promise<void>;
};

const DemandasContext = createContext<DemandasContextValue | null>(null);

export function DemandasProvider({ children }: { children: React.ReactNode }) {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    listarDemandas()
      .then((lista) => {
        if (ativo) setDemandas(lista);
      })
      .catch(() => {
        toast.error("Não foi possível carregar as demandas.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const adicionarDemanda = useCallback(
    async (input: NovaDemandaFormValues) => {
      const nova = await criarDemanda(input);
      setDemandas((prev) => [...prev, nova]);
    },
    [],
  );

  const atualizarStatusDemanda = useCallback(
    async (id: number, status: Demanda["status"]) => {
      const atualizada = await atualizarStatusDemandaApi(id, status);
      setDemandas((prev) =>
        prev.map((d) => (d.id === id ? atualizada : d)),
      );
      return atualizada;
    },
    [],
  );

  const excluirDemanda = useCallback(async (id: number) => {
    await excluirDemandaApi(id);
    setDemandas((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return (
    <DemandasContext.Provider
      value={{
        demandas,
        carregando,
        adicionarDemanda,
        atualizarStatusDemanda,
        excluirDemanda,
      }}
    >
      {children}
    </DemandasContext.Provider>
  );
}

export function useDemandas() {
  const ctx = useContext(DemandasContext);
  if (!ctx) {
    throw new Error("useDemandas deve ser usado dentro de DemandasProvider");
  }
  return ctx;
}
