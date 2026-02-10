import { href, Link } from "react-router";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useHydrated } from "@/shared/lib/hydration";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import logoSvg from "@/shared/assets/images/logo.svg";

import { useSignupForm } from "../model/use-signup-form";

export function SignupPage() {
  const { t } = useTranslation();
  const hydrated = useHydrated();
  const { form, isSubmitting, onSubmit } = useSignupForm();
  const disabled = !hydrated || isSubmitting;

  return (
    <main
      className="bg-muted flex min-h-svh items-center justify-center p-6
        md:p-10"
    >
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form
              onSubmit={(e) => void onSubmit(e)}
              noValidate
              className="p-6 md:p-8"
            >
              <FieldGroup>
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    {t("auth.signUp.title")}
                  </h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    {t("auth.signUp.description")}
                  </p>
                </div>

                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor={field.name}>
                        {t("auth.fields.email")}
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="email"
                        disabled={disabled}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Controller
                      name="password"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid || undefined}>
                          <FieldLabel htmlFor={field.name}>
                            {t("auth.fields.password")}
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            type="password"
                            disabled={disabled}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="confirmPassword"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid || undefined}>
                          <FieldLabel htmlFor={field.name}>
                            {t("auth.fields.confirmPassword")}
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            type="password"
                            disabled={disabled}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <FieldDescription>
                    {t("auth.signUp.passwordHint")}
                  </FieldDescription>
                </Field>

                {form.formState.errors.root && (
                  <FieldError>{form.formState.errors.root.message}</FieldError>
                )}

                <Button type="submit" disabled={disabled} className="w-full">
                  {isSubmitting
                    ? t("auth.signUp.submitting")
                    : t("auth.signUp.submit")}
                </Button>

                <div className="text-muted-foreground text-center text-sm">
                  {t("auth.signUp.hasAccount")}{" "}
                  <Link
                    to={href("/login")}
                    className="hover:text-primary underline underline-offset-4"
                  >
                    {t("auth.signUp.signIn")}
                  </Link>
                </div>
              </FieldGroup>
            </form>
            <div className="relative hidden bg-[#5f51fc] md:block">
              <Link
                to={href("/")}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img
                  src={logoSvg}
                  alt="Logo"
                  className="size-24 object-contain brightness-0 invert"
                />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
