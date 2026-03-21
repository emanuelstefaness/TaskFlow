export interface Demanda {
  id: number;
  titulo: string;
  descricao?: string;
  responsavel: string;
  prioridade: "Baixa" | "Média" | "Alta";
  status: "Pendente" | "Em andamento" | "Concluída";
  prazo: string;
}

export const corStatus: Record<Demanda["status"], string> = {
  Pendente: "bg-orange-400",
  "Em andamento": "bg-blue-500",
  Concluída: "bg-green-500",
};

export const corPrioridade: Record<Demanda["prioridade"], string> = {
  Baixa: "bg-gray-400",
  Média: "bg-amber-500",
  Alta: "bg-red-500",
};

export function demandasDoUsuario(demandas: Demanda[], nomeUsuario: string): Demanda[] {
  const n = nomeUsuario.trim().toLowerCase();
  return demandas.filter((d) => d.responsavel.trim().toLowerCase() === n);
}

export function prazoDeInputDate(iso: string): string {
  if (!iso.trim()) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "—";
  return `${d}/${m}/${y}`;
}
