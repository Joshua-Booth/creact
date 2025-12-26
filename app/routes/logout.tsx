import { useAuthStore } from "@/stores/authStore";

export default function LogoutPage() {
  const { logout } = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
  };

  return (
    <main className="content-container">
      <h1 className="pb-5">Logging out...</h1>
      <button onClick={handleLogout}>Logout</button>
    </main>
  );
}
