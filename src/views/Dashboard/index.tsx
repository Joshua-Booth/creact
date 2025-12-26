import { useLoaderData } from 'react-router'
import { useAuthStore } from '@/stores/authStore'
import { useMainStore } from '@/stores/mainStore'
import Loader from '@/components/Loader'
import { setPageTitle } from '@/utils/page'

export default function Dashboard() {
  setPageTitle('Dashboard')
  const data = useLoaderData() as { stats?: { users: number; projects: number } }
  const { user, loading, error } = useAuthStore((state) => ({
    user: state.user,
    loading: state.loading,
    error: state.error,
  }))
  const { setError } = useMainStore()

  if (error) {
    setError(null)
  }

  return (
    <main className="content-container">
      <h1 className="pb-1">Dashboard</h1>
      {user && !loading && !error && (
        <div className="component-container">
          </div>
      )}
      {loading && <Loader />}
      {error && (
        <div className="pt-4">
          <p>Error loading dashboard</p>
        </div>
      )}
    </main>
  )
}
