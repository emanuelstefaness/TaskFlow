"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Demanda } from "@/lib/demandas";
import { prazoDeInputDate } from "@/lib/demandas";

const STORAGE_KEY = "taskflow-demandas-v2";

export type NovaDemandaInput = {
  titulo: string;
  descricao: string;
  responsavel: string;
  prioridade: Demanda["prioridade"];
  prazoISO: string;
};

type DemandasContextValue = {
  demandas: Demanda[];
  adicionarDemanda: (input: NovaDemandaInput) => void;
};

const DemandasContext = createContext<DemandasContextValue | null>(null);

function parseArmazenado(): Demanda[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Demanda[];
  } catch {
    return [];
  }
}

export function DemandasProvider({ children }: { children: React.ReactNode }) {
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDemandas(parseArmazenado());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demandas));
  }, [demandas, hydrated]);

  const adicionarDemanda = useCallback((input: NovaDemandaInput) => {
    setDemandas((prev) => {
      const ids = prev.map((d) => d.id);
      const id = ids.length === 0 ? 1 : Math.max(...ids) + 1;
      const desc = input.descricao.trim();
      const nova: Demanda = {
        id,
        titulo: input.titulo.trim(),
        ...(desc ? { descricao: desc } : {}),
        responsavel: input.responsavel.trim(),
        prioridade: input.prioridade,
        status: "Pendente",
        prazo: prazoDeInputDate(input.prazoISO),
      };
      return [...prev, nova];
    });
  }, []);

  return (
    <DemandasContext.Provider value={{ demandas, adicionarDemanda }}>
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
