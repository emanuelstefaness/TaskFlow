import type { Demanda } from "@/types/demanda";
import { normalizarListaDemandas } from "@/lib/demandas-utils";

export const STORAGE_KEY_DEMANDAS = "taskflow-demandas-v2";

export function parseDemandasArmazenadas(): Demanda[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DEMANDAS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return normalizarListaDemandas(parsed);
  } catch {
    return [];
  }
}

export function salvarDemandasArmazenadas(lista: Demanda[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_DEMANDAS, JSON.stringify(lista));
}
