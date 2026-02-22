import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";

import { zodResolver } from "@/shared/lib/validation";

import type { ForgotPasswordActionData } from "./action";
import type { ForgotPasswordFormData } from "./schema";
import { forgotPasswordSchema } from "./schema";

export function useForgotPasswordForm() {
  const fetcher = useFetcher<ForgotPasswordActionData>();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema()),
    defaultValues: {
      email: "",
    },
  });

  const isSubmitting = fetcher.state === "submitting";
  const actionData = fetcher.data;
  const isSuccess = actionData?.success === true;

  useEffect(() => {
    if (actionData?.error) {
      form.setError("root", { message: actionData.error });
    }
  }, [actionData, form]);

  function onSubmit(data: ForgotPasswordFormData) {
    form.clearErrors("root");
    void fetcher.submit(data, { method: "post" });
  }

  return {
    form,
    isSubmitting,
    isSuccess,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
