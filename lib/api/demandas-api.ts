import type { Demanda } from "@/types/demanda";
import { prazoDeInputDate } from "@/lib/demandas-utils";
import {
  parseDemandasArmazenadas,
  salvarDemandasArmazenadas,
} from "@/lib/demandas-storage";
import type { NovaDemandaFormValues } from "@/schemas/nova-demanda";

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Simula chamada HTTP: lista demandas persistidas no navegador. */
export async function listarDemandas(): Promise<Demanda[]> {
  await delay(280);
  return parseDemandasArmazenadas();
}

/** Simula POST: grava nova demanda e devolve o registro criado. */
export async function criarDemanda(
  input: NovaDemandaFormValues,
): Promise<Demanda> {
  await delay(450);
  const lista = parseDemandasArmazenadas();
  const ids = lista.map((d) => d.id);
  const id = ids.length === 0 ? 1 : Math.max(...ids) + 1;

  const desc = (input.descricao ?? "").trim();
  const nova: Demanda = {
    id,
    titulo: input.titulo.trim(),
    ...(desc ? { descricao: desc } : {}),
    responsavel: input.responsavel,
    prioridade: input.prioridade,
    status: "Pendente",
    prazo: prazoDeInputDate(input.prazoISO),
  };

  salvarDemandasArmazenadas([...lista, nova]);
  return nova;
}

/** Atualiza o status de uma demanda existente. */
export async function atualizarStatusDemanda(
  id: number,
  status: Demanda["status"],
): Promise<Demanda> {
  await delay(320);
  const lista = parseDemandasArmazenadas();
  const idx = lista.findIndex((d) => d.id === id);
  if (idx === -1) {
    throw new Error("Demanda não encontrada");
  }
  const atualizada: Demanda = { ...lista[idx], status };
  const novaLista = [...lista];
  novaLista[idx] = atualizada;
  salvarDemandasArmazenadas(novaLista);
  return atualizada;
}

/** Remove uma demanda do armazenamento local. */
export async function excluirDemanda(id: number): Promise<void> {
  await delay(280);
  const lista = parseDemandasArmazenadas();
  if (!lista.some((d) => d.id === id)) {
    throw new Error("Demanda não encontrada");
  }
  salvarDemandasArmazenadas(lista.filter((d) => d.id !== id));
}
