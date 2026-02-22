import type { Decorator } from "@storybook/react-vite";

import { useAuthStore } from "@/entities/user";

export const withAuthenticated: Decorator = (Story) => {
  useAuthStore.getState().login("mock-token");
  return <Story />;
};

export const withUnauthenticated: Decorator = (Story) => {
  useAuthStore.setState({ token: null });
  return <Story />;
};
