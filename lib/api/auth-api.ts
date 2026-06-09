import type { Usuario } from "@/types/usuario";
import { API_URL } from "./config";

type LoginResposta = {
  access_token: string;
  usuario: Usuario;
};

export async function loginApi(
  email: string,
  senha: string,
): Promise<LoginResposta> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  if (!res.ok) {
    throw new Error("E-mail ou senha incorretos");
  }

  return res.json();
}
