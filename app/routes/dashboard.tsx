import { useAuthStore } from "@/stores/authStore";
import Loader from "@/components/Loader";

export async function loader() {
  return { stats: { users: 150, projects: 45 } };
}

export default function Dashboard() {
  const { user, loading, error } = useAuthStore((state) => ({
    user: state.user,
    loading: state.loading,
    error: state.error,
  }));

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="content-container">
      <h1 className="pb-1">Dashboard</h1>
      {user && !error && (
        <div className="component-container">
          <p>Welcome, {user.first_name}!</p>
        </div>
      )}
      {(loading || !user || error) && <Loader />}
      {error && (
        <div className="pt-4">
          <div className="alert-error">
            {error.message || "Failed to load dashboard"}
          </div>
        </div>
      )}
    </main>
  );
}
