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

import { useSignupForm } from "../model/use-signup-form";

export function SignupPage() {
  const { t } = useTranslation();
  const { form, isSubmitting, onSubmit } = useSignupForm();

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("auth.signUp.title")}</CardTitle>
          <CardDescription>{t("auth.signUp.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => void onSubmit(e)} noValidate>
            <FieldGroup>
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
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor={field.name}>
                      {t("auth.fields.password")}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      placeholder={t("auth.fields.createPasswordPlaceholder")}
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
                      placeholder={t("auth.fields.confirmPasswordPlaceholder")}
                      data-testid="confirm-password"
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
                <FieldError data-testid="signup-error">
                  {form.formState.errors.root.message}
                </FieldError>
              )}

              <Button
                type="submit"
                data-testid="signup"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting
                  ? t("auth.signUp.submitting")
                  : t("auth.signUp.submit")}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <span className="text-muted-foreground">
            {t("auth.signUp.hasAccount")}
          </span>
          <a
            href="/login"
            className="text-muted-foreground hover:text-foreground ml-1"
          >
            {t("auth.signUp.signIn")}
          </a>
        </CardFooter>
      </Card>
    </main>
  );
}
