import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";

import type { RegisterFormData } from "@/shared/lib/validation";
import { registerSchema, zodResolver } from "@/shared/lib/validation";

import type { SignupActionData } from "./action";

export function useSignupForm() {
  const fetcher = useFetcher<SignupActionData>();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = fetcher.state === "submitting";
  const actionData = fetcher.data;

  useEffect(() => {
    if (actionData) {
      form.setError("root", { message: actionData.error });
    }
  }, [actionData, form]);

  function onSubmit(data: RegisterFormData) {
    fetcher.submit(
      { email: data.email, password: data.password },
      { method: "post" }
    );
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
