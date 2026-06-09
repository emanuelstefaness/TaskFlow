"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/atoms/Button";
import {
  novaDemandaSchema,
  type NovaDemandaFormValues,
} from "@/schemas/nova-demanda";

type NovaDemandaFormProps = {
  responsaveis: string[];
  onSubmit: (data: NovaDemandaFormValues) => Promise<void>;
  onCancel: () => void;
  enviando: boolean;
};

const prioridades = ["Baixa", "Média", "Alta"] as const;

export function NovaDemandaForm({
  responsaveis,
  onSubmit,
  onCancel,
  enviando,
}: NovaDemandaFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NovaDemandaFormValues>({
    resolver: zodResolver(novaDemandaSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      responsavel: "",
      prioridade: "Média",
      prazoISO: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      <div>
        <label htmlFor="nova-demanda-titulo" className="text-sm font-medium text-gray-600">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          id="nova-demanda-titulo"
          autoComplete="off"
          {...register("titulo")}
          className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.titulo ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.titulo && (
          <p className="text-red-500 text-xs mt-1">{errors.titulo.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="nova-demanda-desc" className="text-sm font-medium text-gray-600">
          Descrição
        </label>
        <textarea
          id="nova-demanda-desc"
          {...register("descricao")}
          className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none ${
            errors.descricao ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.descricao && (
          <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="nova-demanda-resp" className="text-sm font-medium text-gray-600">
          Atribuir a <span className="text-red-500">*</span>
        </label>
        <select
          id="nova-demanda-resp"
          {...register("responsavel")}
          className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
            errors.responsavel ? "border-red-400" : "border-gray-300"
          }`}
        >
          <option value="">Selecione</option>
          {responsaveis.map((nome) => (
            <option key={nome} value={nome}>
              {nome}
            </option>
          ))}
        </select>
        {errors.responsavel && (
          <p className="text-red-500 text-xs mt-1">
            {errors.responsavel.message}
          </p>
        )}
      </div>

      <div>
        <span className="text-sm font-medium text-gray-600">Prioridade</span>
        <Controller
          name="prioridade"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2 mt-2">
              {prioridades.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => field.onChange(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    field.value === p
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <div>
        <label htmlFor="nova-demanda-prazo" className="text-sm font-medium text-gray-600">
          Prazo <span className="text-red-500">*</span>
        </label>
        <input
          id="nova-demanda-prazo"
          type="date"
          {...register("prazoISO")}
          className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
            errors.prazoISO ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.prazoISO && (
          <p className="text-red-500 text-xs mt-1">{errors.prazoISO.message}</p>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          {enviando ? "Salvando…" : "Criar demanda"}
        </Button>
      </div>
    </form>
  );
}
