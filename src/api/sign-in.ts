import { api } from "@/lib/axios.ts";

// Usa o TypeScript para tipar as rotas que enviamos ao Backend
export interface signInBody {
  email: string;
}

// Nada mais do que uma função que está encapsulando o axios e também tipando de entrada.
// Não precisamos tipar o tipo de retorno porque esta função não tem retorno.
export async function signIn({ email }: signInBody) {
  await api.post("/authenticate", { email }); // Enviar para esta requisição o email do usuário que queremos autenticar
}
