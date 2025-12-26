import { useAuthStore } from "@/entities/user";
import { useMainStore } from "@/shared/model";
import { Loader } from "@/shared/ui";
import { setPageTitle } from "@/shared/lib/page";

export default function Dashboard() {
  setPageTitle("Dashboard");
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
