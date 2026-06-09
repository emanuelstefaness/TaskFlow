import { Demanda, Prioridade, StatusDemanda } from '@prisma/client';

const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
};

const STATUS_LABEL: Record<StatusDemanda, string> = {
  PENDENTE: 'Pendente',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluída',
};

export type DemandaComResponsavel = Demanda & {
  responsavel: { nome: string };
};

export type DemandaResponse = {
  id: string;
  titulo: string;
  descricao?: string;
  responsavel: string;
  prioridade: string;
  status: string;
  prazo: string;
};

function formatarPrazo(date: Date): string {
  const d = String(date.getUTCDate()).padStart(2, '0');
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const y = date.getUTCFullYear();
  return `${d}/${m}/${y}`;
}

export function toDemandaResponse(demanda: DemandaComResponsavel): DemandaResponse {
  const response: DemandaResponse = {
    id: demanda.id,
    titulo: demanda.titulo,
    responsavel: demanda.responsavel.nome,
    prioridade: PRIORIDADE_LABEL[demanda.prioridade],
    status: STATUS_LABEL[demanda.status],
    prazo: formatarPrazo(demanda.prazo),
  };

  if (demanda.descricao?.trim()) {
    response.descricao = demanda.descricao.trim();
  }

  return response;
}

export function prazoDeIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

export const LABEL_PARA_PRIORIDADE: Record<string, Prioridade> = {
  Baixa: Prioridade.BAIXA,
  Média: Prioridade.MEDIA,
  Alta: Prioridade.ALTA,
};

export const LABEL_PARA_STATUS: Record<string, StatusDemanda> = {
  Pendente: StatusDemanda.PENDENTE,
  'Em andamento': StatusDemanda.EM_ANDAMENTO,
  Concluída: StatusDemanda.CONCLUIDA,
};
