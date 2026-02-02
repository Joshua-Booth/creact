import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";

import { useLoginForm } from "../model/useLoginForm";

export function LoginPage() {
  const { t } = useTranslation();
  const { form, isSubmitting, onSubmit } = useLoginForm();

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <title>{t("pages.login.title", { appName: t("app.title") })}</title>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("auth.login.title")}</CardTitle>
          <CardDescription>{t("auth.login.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => void onSubmit(e)} noValidate>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t("auth.fields.email")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      placeholder={t("auth.fields.emailPlaceholder")}
                      data-testid="email"
                      disabled={isSubmitting}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      {t("auth.fields.password")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      placeholder={t("auth.fields.passwordPlaceholder")}
                      data-testid="password"
                      disabled={isSubmitting}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {form.formState.errors.root && (
                <FieldError data-testid="login-error">
                  {form.formState.errors.root.message}
                </FieldError>
              )}

              <Button
                type="submit"
                data-testid="login"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting
                  ? t("auth.login.submitting")
                  : t("auth.login.submit")}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 text-sm">
          <a
            href="/forgot-password"
            className="text-muted-foreground hover:text-foreground"
          >
            {t("auth.login.forgotPassword")}
          </a>
          <span className="text-muted-foreground">·</span>
          <a
            href="/signup"
            className="text-muted-foreground hover:text-foreground"
          >
            {t("auth.login.signUp")}
          </a>
        </CardFooter>
      </Card>
    </main>
  );
}
