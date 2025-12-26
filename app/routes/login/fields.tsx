import React from "react";

interface LoginFieldsProps {
  register: any;
  errors?: any;
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
