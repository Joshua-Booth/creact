import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, type RegisterFormData } from "@/shared/lib/validation";
import { useAuthStore } from "@/entities/user";
import { navigate } from "@/shared/lib/navigation";
import { signupApi, parseSignupError } from "../api/signup";

export function useSignupForm() {
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await signupApi({
        email: data.email,
        password: data.password,
      });
      login(response.key);
      navigate("/dashboard");
    } catch (error) {
      const message = await parseSignupError(error);
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
