export const RESPONSAVEIS_OPCOES = ["Felipe Admin", "Manu"] as const;

export type NomeResponsavel = (typeof RESPONSAVEIS_OPCOES)[number];
