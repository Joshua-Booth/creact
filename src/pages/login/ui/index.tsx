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

export default function Login() {
  const { form, isLoading, onSubmit } = useLoginForm();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <title>Login | Creact</title>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email and password to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form method="post" onSubmit={onSubmit}>
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
                  placeholder="Enter your password"
                  data-testid="password"
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <FieldError errors={[errors.password]} />
              </Field>

              {errors.root && (
                <FieldError data-testid="login-error">
                  {errors.root.message}
                </FieldError>
              )}

              <Button
                type="submit"
                data-testid="login"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 text-sm">
          <a
            href="/forgot-password"
            className="text-muted-foreground hover:text-foreground"
          >
            Forgot password?
          </a>
          <span className="text-muted-foreground">·</span>
          <a
            href="/signup"
            className="text-muted-foreground hover:text-foreground"
          >
            Sign up
          </a>
        </CardFooter>
      </Card>
    </main>
  );
}
