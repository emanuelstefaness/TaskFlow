"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/atoms/Button";
import { NovaDemandaForm } from "@/components/molecules/NovaDemandaForm";
import type { Usuario } from "@/types/usuario";
import { useDemandas } from "@/context/DemandasContext";
import type { NovaDemandaFormValues } from "@/schemas/nova-demanda";
import type { Demanda } from "@/types/demanda";
import { listarFuncionarios } from "@/lib/api/usuarios-api";
import { corPrioridade, corStatus } from "@/lib/demandas-utils";

const STATUS_OPCOES: Demanda["status"][] = [
  "Pendente",
  "Em andamento",
  "Concluída",
];

function podeGestorOuResponsavel(usuario: Usuario, d: Demanda): boolean {
  if (usuario.role === "gestor") return true;
  return (
    d.responsavel.trim().toLowerCase() === usuario.nome.trim().toLowerCase()
  );
}

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
  const {
    adicionarDemanda,
    carregando,
    atualizarStatusDemanda,
    excluirDemanda,
  } = useDemandas();
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<string>("Todos");
  const [novaDemandaAberta, setNovaDemandaAberta] = useState(false);
  const [enviandoDemanda, setEnviandoDemanda] = useState(false);
  const [demandaVisualizar, setDemandaVisualizar] = useState<Demanda | null>(
    null,
  );
  const [salvandoStatus, setSalvandoStatus] = useState(false);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [responsaveis, setResponsaveis] = useState<string[]>([]);

  useEffect(() => {
    if (usuario.role !== "gestor") return;
    listarFuncionarios()
      .then((lista) => setResponsaveis(lista.map((f) => f.nome)))
      .catch(() => {});
  }, [usuario.role]);

  function fecharModal() {
    setNovaDemandaAberta(false);
  }

  function abrirModal() {
    setNovaDemandaAberta(true);
  }

  async function handleExcluirDemanda(d: Demanda) {
    if (
      !window.confirm(
        `Excluir "${d.titulo}"?`,
      )
    ) {
      return;
    }
    setExcluindoId(d.id);
    try {
      await excluirDemanda(d.id);
      toast.success("Demanda excluída.");
      setDemandaVisualizar((cur) => (cur?.id === d.id ? null : cur));
    } catch {
      toast.error("Não foi possível excluir a demanda.");
    } finally {
      setExcluindoId(null);
    }
  }

  async function handleCriarDemanda(data: NovaDemandaFormValues) {
    setEnviandoDemanda(true);
    try {
      await adicionarDemanda(data);
      toast.success("Demanda criada.");
      fecharModal();
    } catch {
      toast.error("Não foi possível criar a demanda. Tente de novo.");
    } finally {
      setEnviandoDemanda(false);
    }
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

  const emAberto = useMemo(
    () => filtradas.filter((d) => d.status !== "Concluída"),
    [filtradas],
  );
  const concluidasLista = useMemo(
    () => filtradas.filter((d) => d.status === "Concluída"),
    [filtradas],
  );

  const total = filtradas.length;
  const pendentes = filtradas.filter((d) => d.status === "Pendente").length;
  const andamento = filtradas.filter((d) => d.status === "Em andamento").length;
  const concluidas = concluidasLista.length;

  if (carregando) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
        Carregando demandas…
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">{titulo}</h1>
      <p className="text-gray-400 mb-6">{subtitulo}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-600 text-white rounded-xl p-4">
          <p className="text-sm opacity-80">Total (no filtro)</p>
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

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por título"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none w-full sm:w-auto"
        >
          <option value="Todos">Todos (em aberto + concluídas)</option>
          <option value="Pendente">Pendente</option>
          <option value="Em andamento">Em andamento</option>
          <option value="Concluída">Só concluídas</option>
        </select>
        {mostrarNovaDemanda && usuario.role === "gestor" && (
          <Button type="button" onClick={abrirModal}>
            + Nova Demanda
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-800">{tituloTabela}</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setBusca("");
              setStatusFiltro("Todos");
            }}
            className="text-sm text-gray-400 hover:text-gray-600 shrink-0"
          >
            Limpar
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-gray-100">
                <th className="px-4 sm:px-6 py-3 font-medium">Título</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Responsável</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Prioridade</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Prazo</th>
                <th className="px-4 sm:px-6 py-3 font-medium"></th>
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
              ) : emAberto.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    Nenhuma em aberto.
                  </td>
                </tr>
              ) : (
                emAberto.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-800">
                      {d.titulo}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      {d.responsavel}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-full ${corPrioridade[d.prioridade]}`}
                      >
                        {d.prioridade}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-full ${corStatus[d.status]}`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      {d.prazo}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setDemandaVisualizar(d)}
                          className="text-sm text-blue-600 hover:underline font-medium"
                        >
                          Ver
                        </button>
                        {podeGestorOuResponsavel(usuario, d) && (
                          <button
                            type="button"
                            disabled={excluindoId === d.id}
                            onClick={() => void handleExcluirDemanda(d)}
                            className="text-sm text-red-600 hover:underline font-medium disabled:opacity-50"
                          >
                            {excluindoId === d.id ? "…" : "Excluir"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {rodape && (
          <div className="px-6 py-3 text-right border-t border-gray-50">
            <Link
              href={rodape.href}
              className="text-sm text-blue-600 hover:underline"
            >
              {rodape.label}
            </Link>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow mt-6">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">Concluídas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-gray-100">
                <th className="px-4 sm:px-6 py-3 font-medium">Título</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Responsável</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Prioridade</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
                <th className="px-4 sm:px-6 py-3 font-medium">Prazo</th>
                <th className="px-4 sm:px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {concluidasLista.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    Nenhuma demanda concluída neste filtro.
                  </td>
                </tr>
              ) : (
                concluidasLista.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-gray-50 hover:bg-gray-50 bg-green-50/30"
                  >
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-800">
                      {d.titulo}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      {d.responsavel}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-full ${corPrioridade[d.prioridade]}`}
                      >
                        {d.prioridade}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-full ${corStatus[d.status]}`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      {d.prazo}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setDemandaVisualizar(d)}
                          className="text-sm text-blue-600 hover:underline font-medium"
                        >
                          Ver
                        </button>
                        {podeGestorOuResponsavel(usuario, d) && (
                          <button
                            type="button"
                            disabled={excluindoId === d.id}
                            onClick={() => void handleExcluirDemanda(d)}
                            className="text-sm text-red-600 hover:underline font-medium disabled:opacity-50"
                          >
                            {excluindoId === d.id ? "…" : "Excluir"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {demandaVisualizar && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 overflow-y-auto"
          role="presentation"
          onClick={(ev) => {
            if (ev.target === ev.currentTarget) setDemandaVisualizar(null);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg my-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalhe-demanda-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="detalhe-demanda-titulo"
              className="text-lg font-bold text-gray-800 mb-1"
            >
              {demandaVisualizar.titulo}
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Demanda #{demandaVisualizar.id}
            </p>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 font-medium">Descrição</dt>
                <dd className="text-gray-800 mt-0.5 whitespace-pre-wrap">
                  {demandaVisualizar.descricao?.trim() || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 font-medium">Responsável</dt>
                <dd className="text-gray-800 mt-0.5">
                  {demandaVisualizar.responsavel}
                </dd>
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <dt className="text-gray-500 font-medium">Prioridade</dt>
                  <dd className="mt-1">
                    <span
                      className={`text-white text-xs px-3 py-1 rounded-full inline-block ${corPrioridade[demandaVisualizar.prioridade]}`}
                    >
                      {demandaVisualizar.prioridade}
                    </span>
                  </dd>
                </div>
                <div className="min-w-[12rem]">
                  <dt className="text-gray-500 font-medium">Status</dt>
                  <dd className="mt-1">
                    {podeGestorOuResponsavel(usuario, demandaVisualizar) ? (
                      <div>
                        <select
                          value={demandaVisualizar.status}
                          disabled={salvandoStatus}
                          onChange={async (e) => {
                            const novo = e.target
                              .value as Demanda["status"];
                            if (novo === demandaVisualizar.status) return;
                            setSalvandoStatus(true);
                            try {
                              const d = await atualizarStatusDemanda(
                                demandaVisualizar.id,
                                novo,
                              );
                              setDemandaVisualizar(d);
                              toast.success("Status atualizado.");
                            } catch {
                              toast.error(
                                "Não foi possível atualizar o status.",
                              );
                            } finally {
                              setSalvandoStatus(false);
                            }
                          }}
                          className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                        >
                          {STATUS_OPCOES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span
                        className={`text-white text-xs px-3 py-1 rounded-full inline-block ${corStatus[demandaVisualizar.status]}`}
                      >
                        {demandaVisualizar.status}
                      </span>
                    )}
                  </dd>
                </div>
              </div>
              <div>
                <dt className="text-gray-500 font-medium">Prazo</dt>
                <dd className="text-gray-800 mt-0.5">{demandaVisualizar.prazo}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              {podeGestorOuResponsavel(usuario, demandaVisualizar) && (
                <button
                  type="button"
                  disabled={excluindoId === demandaVisualizar.id}
                  onClick={() => void handleExcluirDemanda(demandaVisualizar)}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {excluindoId === demandaVisualizar.id
                    ? "Excluindo…"
                    : "Excluir demanda"}
                </button>
              )}
              <Button type="button" onClick={() => setDemandaVisualizar(null)}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {novaDemandaAberta && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 overflow-y-auto"
          role="presentation"
          onClick={(ev) => {
            if (ev.target === ev.currentTarget && !enviandoDemanda) fecharModal();
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg my-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="nova-demanda-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="nova-demanda-titulo"
              className="text-lg font-bold text-gray-800 mb-4"
            >
              Nova Demanda
            </h2>
            <NovaDemandaForm
              responsaveis={responsaveis}
              onSubmit={handleCriarDemanda}
              onCancel={fecharModal}
              enviando={enviandoDemanda}
            />
          </div>
        </div>
      )}
    </div>
  );
}
