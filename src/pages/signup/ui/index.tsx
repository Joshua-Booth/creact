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
import { useSignupForm } from "../model/useSignupForm";

export default function Signup() {
  const { form, isLoading, onSubmit } = useSignupForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <title>Sign Up | Creact</title>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your email and password to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  data-testid="email"
                  disabled={isLoading}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  data-testid="password"
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <FieldError errors={[errors.password]} />
              </Field>

              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  data-testid="confirm-password"
                  disabled={isLoading}
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                />
                <FieldError errors={[errors.confirmPassword]} />
              </Field>

              {errors.root && (
                <FieldError data-testid="signup-error">
                  {errors.root.message}
                </FieldError>
              )}

              <Button
                type="submit"
                data-testid="signup"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?
          </span>
          <a
            href="/login"
            className="text-muted-foreground hover:text-foreground ml-1"
          >
            Sign in
          </a>
        </CardFooter>
      </Card>
    </main>
  );
}
