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
    id: string,
    status: Demanda["status"],
  ) => Promise<Demanda>;
  excluirDemanda: (id: string) => Promise<void>;
};

const DemandasContext = createContext<DemandasContextValue | null>(null);

export function DemandasProvider({ children }: { children: React.ReactNode }) {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarDemandas()
      .then(setDemandas)
      .catch(() => toast.error("Erro ao carregar demandas."))
      .finally(() => setCarregando(false));
  }, []);

  const adicionarDemanda = useCallback(
    async (input: NovaDemandaFormValues) => {
      const nova = await criarDemanda(input);
      setDemandas((prev) => [...prev, nova]);
    },
    [],
  );

  const atualizarStatusDemanda = useCallback(
    async (id: string, status: Demanda["status"]) => {
      const atualizada = await atualizarStatusDemandaApi(id, status);
      setDemandas((prev) =>
        prev.map((d) => (d.id === id ? atualizada : d)),
      );
      return atualizada;
    },
    [],
  );

  const excluirDemanda = useCallback(async (id: string) => {
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
    throw new Error("fora do DemandasProvider");
  }
  return ctx;
}
