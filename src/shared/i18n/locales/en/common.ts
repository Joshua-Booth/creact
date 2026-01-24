export default {
  app: {
    title: "Creact",
  },
  auth: {
    fields: {
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      createPasswordPlaceholder: "Create a password",
      email: "Email",
      emailPlaceholder: "you@example.com",
      password: "Password",
      passwordPlaceholder: "Enter your password",
    },
    login: {
      description: "Enter your email and password to access your dashboard",
      forgotPassword: "Forgot password?",
      signUp: "Sign up",
      submit: "Sign in",
      submitting: "Signing in...",
      title: "Sign in to your account",
    },
    signUp: {
      description: "Enter your email and password to get started",
      hasAccount: "Already have an account?",
      signIn: "Sign in",
      submit: "Create account",
      submitting: "Creating account...",
      title: "Create your account",
    },
  },
  errors: {
    notFoundDescription: "Sorry, the page you are looking for does not exist.",
  },
  language: {
    select: "Select language",
  },
  pages: {
    landing: {
      heading: "React Frontend",
      subheading: "A project template for creating awesome React web apps.",
    },
    login: {
      title: "Login | {{appName}}",
    },
    notFound: {
      heading: "404 - Page Not Found",
    },
    signUp: {
      title: "Sign Up | {{appName}}",
    },
  },
} as const;
