export default {
  app: {
    title: "creact",
  },
  seo: {
    siteName: "creact",
    defaultDescription: "A modern React frontend template with SSR support.",
    pages: {
      home: {
        title: "Home",
        description: "Welcome to creact - A modern React frontend template.",
      },
      login: {
        title: "Login",
        description: "Sign in to your account.",
      },
      signup: {
        title: "Sign Up",
        description: "Create a new account.",
      },
      dashboard: {
        title: "Dashboard",
        description: "Your personal dashboard.",
      },
      notFound: {
        title: "Page Not Found",
        description: "The page you're looking for doesn't exist.",
      },
    },
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
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      submit: "Sign in",
      submitting: "Signing in...",
      title: "Sign in to your account",
    },
    signUp: {
      description: "Enter your email and password to get started",
      hasAccount: "Already have an account?",
      passwordHint:
        "Must be at least 8 characters with uppercase, lowercase, and a number.",
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
  nav: {
    login: "Login",
    signUp: "Sign Up",
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
    dashboard: {
      heading: "Dashboard",
      error: "Error loading dashboard",
    },
    logout: {
      heading: "Logout",
      loggingOut: "Logging out...",
    },
  },
} as const;
