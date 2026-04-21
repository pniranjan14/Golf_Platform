import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export const AdminProtectedRoute = () => {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0d0d18]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    )
  }

  // Strictly block non-admins or unauthenticated users from admin routes
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
