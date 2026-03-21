"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import type { Usuario } from "@/components/types/usuario";
import { useDemandas } from "@/context/DemandasContext";
import type { Demanda } from "@/lib/demandas";
import { corPrioridade, corStatus } from "@/lib/demandas";
import { RESPONSAVEIS_OPCOES } from "@/lib/responsaveis";

interface DemandasPainelProps {
  usuario: Usuario;
  demandas: Demanda[];
  titulo: string;
  subtitulo: string;
  tituloTabela: string;
  rodape?: { href: string; label: string };
  mostrarNovaDemanda?: boolean;
  mensagemVazia?: string;
}

export function DemandasPainel({
  usuario,
  demandas,
  titulo,
  subtitulo,
  tituloTabela,
  rodape,
  mostrarNovaDemanda = false,
  mensagemVazia = "Nenhuma demanda nesta lista.",
}: DemandasPainelProps) {
  const { adicionarDemanda } = useDemandas();
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string>("Todos");
  const [novaDemandaAberta, setNovaDemandaAberta] = useState(false);

  const [formTitulo, setFormTitulo] = useState("");
  const [formDescricao, setFormDescricao] = useState("");
  const [formResponsavel, setFormResponsavel] = useState("");
  const [formPrioridade, setFormPrioridade] =
    useState<Demanda["prioridade"]>("Média");
  const [formPrazo, setFormPrazo] = useState("");
  const [erroTitulo, setErroTitulo] = useState(false);
  const [erroResponsavel, setErroResponsavel] = useState(false);
  const [erroPrazo, setErroPrazo] = useState(false);

  function fecharModal() {
    setNovaDemandaAberta(false);
    setFormTitulo("");
    setFormDescricao("");
    setFormResponsavel("");
    setFormPrioridade("Média");
    setFormPrazo("");
    setErroTitulo(false);
    setErroResponsavel(false);
    setErroPrazo(false);
  }

  function abrirModal() {
    fecharModal();
    setNovaDemandaAberta(true);
  }

  function handleCriarDemanda(e: React.FormEvent) {
    e.preventDefault();
    const semTitulo = !formTitulo.trim();
    const semResp = !formResponsavel.trim();
    const semPrazo = !formPrazo.trim();
    setErroTitulo(semTitulo);
    setErroResponsavel(semResp);
    setErroPrazo(semPrazo);
    if (semTitulo || semResp || semPrazo) return;

    adicionarDemanda({
      titulo: formTitulo,
      descricao: formDescricao,
      responsavel: formResponsavel,
      prioridade: formPrioridade,
      prazoISO: formPrazo,
    });
    fecharModal();
  }

  const filtradas = useMemo(() => {
    return demandas.filter((d) => {
      const okBusca =
        !busca.trim() ||
        d.titulo.toLowerCase().includes(busca.trim().toLowerCase());
      const okStatus =
        statusFiltro === "Todos" || d.status === statusFiltro;
      return okBusca && okStatus;
    });
  }, [demandas, busca, statusFiltro]);

  const total = filtradas.length;
  const pendentes = filtradas.filter((d) => d.status === "Pendente").length;
  const andamento = filtradas.filter((d) => d.status === "Em andamento").length;
  const concluidas = filtradas.filter((d) => d.status === "Concluída").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">{titulo}</h1>
      <p className="text-gray-400 mb-6">{subtitulo}</p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-600 text-white rounded-xl p-4">
          <p className="text-sm opacity-80">Total</p>
          <p className="text-3xl font-bold mt-1">{total}</p>
        </div>
        <div className="bg-orange-400 text-white rounded-xl p-4">
          <p className="text-sm opacity-80">Pendentes</p>
          <p className="text-3xl font-bold mt-1">{pendentes}</p>
        </div>
        <div className="bg-purple-500 text-white rounded-xl p-4">
          <p className="text-sm opacity-80">Em andamento</p>
          <p className="text-3xl font-bold mt-1">{andamento}</p>
        </div>
        <div className="bg-green-500 text-white rounded-xl p-4">
          <p className="text-sm opacity-80">Concluídas</p>
          <p className="text-3xl font-bold mt-1">{concluidas}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por título"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option>Todos</option>
          <option>Pendente</option>
          <option>Em andamento</option>
          <option>Concluída</option>
        </select>
        {mostrarNovaDemanda && usuario.role === "gestor" && (
          <Button type="button" onClick={abrirModal}>
            + Nova Demanda
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{tituloTabela}</h2>
          <button
            type="button"
            onClick={() => {
              setBusca("");
              setStatusFiltro("Todos");
            }}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Limpar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Título</th>
                <th className="px-6 py-3 font-medium">Responsável</th>
                <th className="px-6 py-3 font-medium">Prioridade</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Prazo</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    {mensagemVazia}
                  </td>
                </tr>
              ) : (
                filtradas.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {d.titulo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {d.responsavel}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-full ${corPrioridade[d.prioridade]}`}
                      >
                        {d.prioridade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-full ${corStatus[d.status]}`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {d.prazo}
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600 cursor-pointer hover:underline">
                      Ver
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {rodape && (
          <div className="px-6 py-3 text-right">
            <Link
              href={rodape.href}
              className="text-sm text-blue-600 hover:underline"
            >
              {rodape.label}
            </Link>
          </div>
        )}
      </div>

      {novaDemandaAberta && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          role="presentation"
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) fecharModal();
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg"
            role="dialog"
            aria-labelledby="nova-demanda-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="nova-demanda-titulo"
              className="text-lg font-bold text-gray-800 mb-4"
            >
              Nova Demanda
            </h2>
            <form onSubmit={handleCriarDemanda} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Título <span className="text-red-500">*</span>
                </label>
                <input
                  value={formTitulo}
                  onChange={(e) => {
                    setFormTitulo(e.target.value);
                    setErroTitulo(false);
                  }}
                  className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    erroTitulo ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="Ex.: Revisar documento do cliente"
                />
                {erroTitulo && (
                  <p className="text-red-500 text-xs mt-1">Informe o título.</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Descrição (opcional)
                </label>
                <textarea
                  value={formDescricao}
                  onChange={(e) => setFormDescricao(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Atribuir a <span className="text-red-500">*</span>
                </label>
                <select
                  value={formResponsavel}
                  onChange={(e) => {
                    setFormResponsavel(e.target.value);
                    setErroResponsavel(false);
                  }}
                  className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    erroResponsavel ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecione o responsável</option>
                  {RESPONSAVEIS_OPCOES.map((nome) => (
                    <option key={nome} value={nome}>
                      {nome}
                    </option>
                  ))}
                </select>
                {erroResponsavel && (
                  <p className="text-red-500 text-xs mt-1">
                    Escolha quem vai executar a demanda.
                  </p>
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Prioridade
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(["Baixa", "Média", "Alta"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormPrioridade(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        formPrioridade === p
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Prazo <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formPrazo}
                  onChange={(e) => {
                    setFormPrazo(e.target.value);
                    setErroPrazo(false);
                  }}
                  className={`mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                    erroPrazo ? "border-red-400" : "border-gray-300"
                  }`}
                />
                {erroPrazo && (
                  <p className="text-red-500 text-xs mt-1">Defina o prazo.</p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={fecharModal}>
                  Cancelar
                </Button>
                <Button type="submit">Criar demanda</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
