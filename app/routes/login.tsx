import { Form, redirect } from "react-router";
import { useForm } from "react-hook-form";
import LoginFields from "./fields";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return {
      errors: { email: "Email is required", password: "Password is required" },
    };
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_ROOT_URL}/auth/login/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    if (!response.ok) {
      return { errors: { root: "Email or password is incorrect" } };
    }

    await response.json();

    return redirect("/dashboard");
  } catch {
    return { errors: { root: "Login failed" } };
  }
}

export default function LoginPage() {
  const {
    register,
    formState: { errors },
  } = useForm();

  return (
    <main className="content-container">
      <h1 className="pb-5">Log In</h1>
      <Form method="post">
        {errors.root && <div className="alert-error">{errors.root}</div>}
        <LoginFields register={register} errors={errors} />
      </Form>
    </main>
  );
}
