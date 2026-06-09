export interface Demanda {
  id: string;
  titulo: string;
  descricao?: string;
  responsavel: string;
  prioridade: "Baixa" | "Média" | "Alta";
  status: "Pendente" | "Em andamento" | "Concluída";
  prazo: string;
}
