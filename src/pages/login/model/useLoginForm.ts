import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormData } from "@/shared/lib/validation";
import { useAuthStore } from "@/entities/user";
import { navigate } from "@/shared/lib/navigation";
import { loginApi, parseLoginError } from "../api/login";

export function useLoginForm() {
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await loginApi(data);
      login(response.key);
      navigate("/dashboard");
    } catch (error) {
      const message = await parseLoginError(error);
      form.setError("root", { message });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
