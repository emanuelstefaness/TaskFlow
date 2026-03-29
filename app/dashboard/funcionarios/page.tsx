import { funcionariosComAcesso } from "@/lib/usuarios-sistema";

export default function FuncionariosPage() {
  const contas = funcionariosComAcesso();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Funcionários</h1>
      <p className="text-gray-400 mb-6">
        Quem da equipe tem conta para entrar no TaskFlow (cadastro em{" "}
        <code className="text-gray-500 bg-gray-100 px-1 rounded text-xs">
          lib/usuarios-sistema.ts
        </code>
        ).
      </p>

      <div className="bg-white rounded-xl shadow overflow-hidden max-w-3xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3 font-medium">Nome</th>
              <th className="px-6 py-3 font-medium">E-mail</th>
            </tr>
          </thead>
          <tbody>
            {contas.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Nenhum funcionário com acesso cadastrado.
                </td>
              </tr>
            ) : (
              contas.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/80"
                >
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {u.nome}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
