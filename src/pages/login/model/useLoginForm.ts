import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";

import { zodResolver } from "@/shared/lib/validation";

import type { LoginActionData } from "./action";
import type { LoginFormData } from "./schema";
import { loginSchema } from "./schema";

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
    void fetcher.submit(data, { method: "post" });
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
