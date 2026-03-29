/** API pública de exemplo (sem autenticação). */

export type CitacaoJson = {
  content: string;
  author: string;
};

export async function buscarCitacaoAleatoria(): Promise<CitacaoJson> {
  const res = await fetch("https://api.quotable.io/random");
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json() as Promise<CitacaoJson>;
}
