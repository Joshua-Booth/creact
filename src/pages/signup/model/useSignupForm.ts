import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useFetcher } from "react-router";
import { useAuthStore } from "@/entities/user";
import {
  type RegisterFormData,
  registerSchema,
  zodResolver,
} from "@/shared/lib/validation";
import type { SignupActionData } from "./action";

export function useSignupForm() {
  const fetcher = useFetcher<SignupActionData>();
  const login = useAuthStore((state) => state.login);

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

  // Handle successful signup
  useEffect(() => {
    if (actionData?.success) {
      login(actionData.token);
      window.location.href = "/dashboard";
    }
  }, [actionData, login]);

  // Set server error on form
  useEffect(() => {
    if (actionData && !actionData.success) {
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
