import z from 'zod';

const envSchema = z.object({
    VITE_API_URL: z.string().url(),
})

// import.meta.env é (é o process do Node) de onde vêm as variáveis de ambiente no Vite
// Parse vai validar se o import tem a mesma estrutura que o envSchema que criamos
export const env = envSchema.parse(import.meta.env)