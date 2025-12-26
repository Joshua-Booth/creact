import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY || '', {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (ph) => {
        console.log('PostHog loaded', ph)
      },
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
