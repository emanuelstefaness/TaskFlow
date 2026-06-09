import type { Demanda } from "@/types/demanda";

const STATUS_VALIDOS: Demanda["status"][] = [
  "Pendente",
  "Em andamento",
  "Concluída",
];
const PRIOR_VALIDAS: Demanda["prioridade"][] = ["Baixa", "Média", "Alta"];

function statusDeValor(bruto: unknown): Demanda["status"] {
  if (typeof bruto !== "string") return "Pendente";
  const s = bruto.trim();
  if ((STATUS_VALIDOS as string[]).includes(s)) return s as Demanda["status"];
  const sl = s.toLowerCase();
  if (sl.includes("conclu")) return "Concluída";
  if (sl.includes("andamento")) return "Em andamento";
  return "Pendente";
}

function prioridadeDeValor(bruto: unknown): Demanda["prioridade"] {
  if (typeof bruto !== "string") return "Média";
  const p = bruto.trim();
  if ((PRIOR_VALIDAS as string[]).includes(p)) return p as Demanda["prioridade"];
  return "Média";
}

export function normalizarListaDemandas(bruto: unknown[]): Demanda[] {
  const out: Demanda[] = [];
  for (const item of bruto) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const id = typeof r.id === "number" ? r.id : Number(r.id);
    if (!Number.isFinite(id)) continue;
    const titulo = typeof r.titulo === "string" ? r.titulo.trim() : "";
    if (!titulo) continue;
    const responsavel =
      typeof r.responsavel === "string" ? r.responsavel.trim() : "";
    const prazo = typeof r.prazo === "string" ? r.prazo : "—";
    const d: Demanda = {
      id,
      titulo,
      responsavel,
      prioridade: prioridadeDeValor(r.prioridade),
      status: statusDeValor(r.status),
      prazo,
    };
    if (typeof r.descricao === "string" && r.descricao.trim()) {
      d.descricao = r.descricao.trim();
    }
    out.push(d);
  }
  return out;
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

export function demandasDoUsuario(
  demandas: Demanda[],
  nomeUsuario: string,
): Demanda[] {
  const n = nomeUsuario.trim().toLowerCase();
  return demandas.filter(
    (d) => d.responsavel.trim().toLowerCase() === n,
  );
}

export function prazoDeInputDate(iso: string): string {
  if (!iso.trim()) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "—";
  return `${d}/${m}/${y}`;
}
