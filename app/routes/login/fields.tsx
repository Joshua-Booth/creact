import React from "react";
import Input from "@/components/Input";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFieldsProps {
  register: UseFormRegister<LoginFormData>;
  errors?: FieldErrors<LoginFormData>;
}

export default function LoginFields({ register, errors }: LoginFieldsProps) {
  return (
    <>
      <Input
        type="email"
        name="email"
        label="Email"
        id="email"
        register={register("email", { required: "Email is required" })}
        error={errors?.email}
      />
      <Input
        type="password"
        name="password"
        label="Password"
        id="password"
        register={register("password", { required: "Password is required" })}
        error={errors?.password}
      />
    </>
  );
}
