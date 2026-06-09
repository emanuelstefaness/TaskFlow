import type { Demanda } from "@/types/demanda";
import type { NovaDemandaFormValues } from "@/schemas/nova-demanda";
import { apiFetch } from "./client";

export async function listarDemandas(): Promise<Demanda[]> {
  return apiFetch<Demanda[]>("/demandas");
}

export async function criarDemanda(
  input: NovaDemandaFormValues,
): Promise<Demanda> {
  return apiFetch<Demanda>("/demandas", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function atualizarStatusDemanda(
  id: string,
  status: Demanda["status"],
): Promise<Demanda> {
  return apiFetch<Demanda>(`/demandas/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function excluirDemanda(id: string): Promise<void> {
  await apiFetch(`/demandas/${id}`, { method: "DELETE" });
}
