import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";

import { zodResolver } from "@/shared/lib/validation";

import type { SignupActionData } from "./action";
import type { SignupFormData } from "./schema";
import { signupSchema } from "./schema";

export function useSignupForm() {
  const fetcher = useFetcher<SignupActionData>();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
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

  function onSubmit(data: SignupFormData) {
    form.clearErrors("root");
    void fetcher.submit(
      {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      { method: "post" }
    );
  }

  return {
    form,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
