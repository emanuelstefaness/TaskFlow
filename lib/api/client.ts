import { API_URL } from "./config";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 && typeof window !== "undefined") {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    window.location.href = "/";
    throw new Error("Sessão expirada");
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Erro na requisição");
  }

  const texto = await res.text();
  if (!texto) return undefined as T;
  return JSON.parse(texto) as T;
}
