import { useAuthStore } from "@/entities/user";
import { useMainStore } from "@/shared/model";
import { Spinner } from "@/shared/ui/spinner";

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
    <main className="mx-2 mb-12 pb-2 text-center max-md:pb-6 max-sm:pb-2">
      <title>Dashboard | Creact</title>
      <h1 className="pb-1">Dashboard</h1>
      {user && !loading && !error && (
        <div className="mx-auto flex max-w-[720px] flex-wrap text-center max-[905px]:mx-auto max-xl:w-auto max-xl:max-w-[660px] max-lg:mx-[200px] max-sm:w-full max-sm:flex-col"></div>
      )}
      {loading && <Spinner />}
      {error && (
        <div className="pt-4">
          <p>Error loading dashboard</p>
        </div>
      )}
    </main>
  );
}
