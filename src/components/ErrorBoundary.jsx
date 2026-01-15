import * as Sentry from '@sentry/react'

function ErrorFallback({ error, resetError }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-2xl">😵</span>
        </div>
        <h1 className="text-xl font-bold text-neutral-800 mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-neutral-600 mb-6">
          We've been notified and are working on it. Try refreshing the page.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-3 text-white font-semibold rounded-xl"
            style={{ background: 'var(--color-primary)' }}
          >
            Refresh Page
          </button>
          <button
            onClick={resetError}
            className="w-full px-4 py-3 text-neutral-700 font-medium rounded-xl border border-neutral-200"
          >
            Try Again
          </button>
        </div>
        {import.meta.env.DEV && (
          <details className="mt-6 text-left">
            <summary className="text-xs text-neutral-500 cursor-pointer">
              Error details (dev only)
            </summary>
            <pre className="mt-2 p-3 bg-neutral-100 rounded-lg text-xs text-red-600 overflow-auto">
              {error?.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

export const ErrorBoundary = Sentry.withErrorBoundary(
  ({ children }) => children,
  {
    fallback: ({ error, resetError }) => (
      <ErrorFallback error={error} resetError={resetError} />
    ),
    showDialog: false, // Don't show Sentry's dialog
  }
)
