import { useAuthStore } from "@/entities/user";
import { useMainStore } from "@/shared/model";
import { Loader } from "@/shared/ui";

export default function Dashboard() {
  const { user, loading, error } = useAuthStore((state) => ({
    user: state.user,
    loading: state.loading,
    error: state.error,
  }));
  const { setError } = useMainStore();

  if (error) {
    setError(null);
  }

  return (
    <main className="content-container">
      <title>Dashboard | Creact</title>
      <h1 className="pb-1">Dashboard</h1>
      {user && !loading && !error && (
        <div className="component-container"></div>
      )}
      {loading && <Loader />}
      {error && (
        <div className="pt-4">
          <p>Error loading dashboard</p>
        </div>
      )}
    </main>
  );
}
