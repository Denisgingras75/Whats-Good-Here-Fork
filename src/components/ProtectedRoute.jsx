import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Route guard that redirects unauthenticated users to login
 * SECURITY: Prevents unauthorized access to protected pages at route level
 */
export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Show nothing while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full" style={{ background: 'var(--color-divider)' }} />
          <div className="h-4 w-24 mx-auto rounded" style={{ background: 'var(--color-divider)' }} />
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // For admin routes, the Admin page handles its own admin check
  // (RLS policies are the real security - this is just UX)
  return children
}
