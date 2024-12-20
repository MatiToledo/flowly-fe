/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { fetchLogIn } from "@/api/endpoints/auth";
import { LoadingButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/ui/password";
import { useUser } from "@/hooks/context/user";
import { useToast } from "@/hooks/use-toast";
import { saveLSSubRole, saveLSToken } from "@/lib/localStorage";
import { useStore } from "@/lib/state";
import { UserRoleEnum } from "@/lib/types/enums";
import { useRouter } from "next/navigation";
import { useState } from "react";
const FormSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico no es válido",
  }),
  password: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres",
  }),
});

export default function LogInForm() {
  const { setSelectedBranchId } = useStore();
  const { push } = useRouter();
  const { mutateUser, resetUser } = useUser();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      const fetch = await fetchLogIn({ ...data, role: UserRoleEnum.PARTNER });
      saveLSToken(fetch.token);
      saveLSSubRole(fetch.subRole);
      setSelectedBranchId(fetch.BranchId);
      await resetUser();
      await mutateUser();
      push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Ingrese el email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Contraseña</FormLabel>
                <p
                  onClick={() => push("/recoveryPassword")}
                  className="text-sm text-blue-400 hover:text-blue-300 pointer">
                  ¿Olvidó su contraseña?
                </p>
              </div>
              <FormControl>
                <PasswordInput
                  placeholder="Ingrese su contraseña"
                  {...field}></PasswordInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={loading} disabled={!form.formState.isDirty}>
          Ingresar
        </LoadingButton>
      </form>
    </Form>
  );
}
