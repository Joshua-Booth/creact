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
    <main className="mx-2 mb-12 pb-2 text-center max-md:pb-6 max-sm:pb-2">
      <title>Dashboard | Creact</title>
      <h1 className="pb-1">Dashboard</h1>
      {user && !loading && !error && (
        <div className="flex flex-wrap mx-auto max-w-[720px] text-center max-xl:max-w-[660px] max-xl:w-auto max-lg:mx-[200px] max-[905px]:mx-auto max-sm:flex-col max-sm:w-full"></div>
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
