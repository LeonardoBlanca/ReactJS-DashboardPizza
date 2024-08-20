import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {signIn} from "@/api/sign-in.ts";

// Configurando o Zod
const signInForm = z.object({
  email: z.string().email(),
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>();

  // Todo Post, Put e Delete é uma mutação. Todo Get é uma query
  const {mutateAsync: authenticate} = useMutation({
    mutationFn: signIn,
  });

  async function handleSignIn(data: SignInForm) {
    console.log(data);
    await authenticate({email: data.email});
    toast.success("Enviamos um link de autenticação para o seu e-mail.", {
      action: {
        label: "Reenviar",
        onClick: () => handleSignIn(data),
      },
    });
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <Button variant={"ghost"} asChild className="absolute right-8 top-8">
          <Link to="/sign-up">Novo estabelecimento</Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar Painel
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas vendas pelo painel do parceiro!
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
            <div className="space-y-2">
              <Label htmlFor="email">Seu Email</Label>
              <Input id="email" type="email" {...register("email")} />
            </div>
            <Button disabled={isSubmitting} className="w-full" type="submit">
              Acessar Painel
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
