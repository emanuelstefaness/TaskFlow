import { z } from "zod";

const hojeMeiaNoite = () => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
};

export const novaDemandaSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(3, "Título precisa ter pelo menos 3 caracteres")
    .max(120, "Título muito longo (máx. 120)"),
  descricao: z.string().max(500, "Descrição muito longa (máx. 500)"),
  responsavel: z.string().min(1, "Selecione quem vai executar"),
  prioridade: z.enum(["Baixa", "Média", "Alta"]),
  prazoISO: z
    .string()
    .min(1, "Defina o prazo")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Data inválida")
    .refine((val) => {
      const limite = new Date(val + "T12:00:00");
      return limite >= hojeMeiaNoite();
    }, "Prazo não pode ser anterior a hoje"),
});

export type NovaDemandaFormValues = z.infer<typeof novaDemandaSchema>;
