/** Nomes disponíveis para atribuir demandas. */
export const RESPONSAVEIS_OPCOES = [
  "Felipe Admin",
  "Manu",
  "Gabriel",
  "Jhonny",
  "Moreno",
] as const;

export type NomeResponsavel = (typeof RESPONSAVEIS_OPCOES)[number];
