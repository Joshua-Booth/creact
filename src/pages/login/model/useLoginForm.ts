import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFetcher } from "react-router";
import {
  type LoginFormData,
  loginSchema,
  zodResolver,
} from "@/shared/lib/validation";
import type { LoginActionData } from "./action";

export function useLoginForm() {
  const fetcher = useFetcher<LoginActionData>();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = fetcher.state === "submitting";
  const actionData = fetcher.data;

  useEffect(() => {
    if (actionData) {
      form.setError("root", { message: actionData.error });
    }
  }, [actionData, form]);

  function onSubmit(data: LoginFormData) {
    fetcher.submit(data, { method: "post" });
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
