import { href, Link } from "react-router";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Mail } from "lucide-react";

import { useHydrated } from "@/shared/lib/hydration";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import logoSvg from "@/shared/assets/images/logo.svg";

import { useForgotPasswordForm } from "../model/use-forgot-password-form";

/**
 * Password reset request page with email-only form.
 * @returns Full-viewport centered card with email field and submit button, or success confirmation.
 */
export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const hydrated = useHydrated();
  const { form, isSubmitting, isSuccess, onSubmit } = useForgotPasswordForm();
  const disabled = !hydrated || isSubmitting;

  return (
    <main
      className="bg-muted flex min-h-svh items-center justify-center p-6
        md:p-10"
    >
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="p-6 md:p-8">
              {isSuccess ? (
                <FieldGroup>
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="bg-primary/10 text-primary mb-2 flex size-12
                        items-center justify-center rounded-full"
                    >
                      <Mail className="size-6" />
                    </div>
                    <h1 className="text-2xl font-bold">
                      {t("auth.forgotPassword.successTitle")}
                    </h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      {t("auth.forgotPassword.successDescription")}
                    </p>
                  </div>

                  <Link
                    to={href("/login")}
                    className="hover:text-primary text-center text-sm underline
                      underline-offset-4"
                  >
                    {t("auth.forgotPassword.backToLogin")}
                  </Link>
                </FieldGroup>
              ) : (
                <form onSubmit={(e) => void onSubmit(e)} noValidate>
                  <FieldGroup>
                    <div className="flex flex-col items-center text-center">
                      <h1 className="text-2xl font-bold">
                        {t("auth.forgotPassword.title")}
                      </h1>
                      <p className="text-muted-foreground text-sm text-balance">
                        {t("auth.forgotPassword.description")}
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
                            autoComplete="email"
                            disabled={disabled}
                            aria-invalid={fieldState.invalid}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    {form.formState.errors.root && (
                      <FieldError>
                        {form.formState.errors.root.message}
                      </FieldError>
                    )}

                    <Button
                      type="submit"
                      disabled={disabled}
                      className="w-full"
                    >
                      {isSubmitting
                        ? t("auth.forgotPassword.submitting")
                        : t("auth.forgotPassword.submit")}
                    </Button>

                    <div className="text-center">
                      <Link
                        to={href("/login")}
                        className="text-muted-foreground hover:text-primary
                          text-sm underline-offset-4 hover:underline"
                      >
                        {t("auth.forgotPassword.backToLogin")}
                      </Link>
                    </div>
                  </FieldGroup>
                </form>
              )}
            </div>
            <div className="relative hidden bg-[#5f51fc] md:block">
              <Link
                to={href("/")}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img
                  src={logoSvg}
                  alt={t("app.title")}
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
