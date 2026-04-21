import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export const AdminProtectedRoute = () => {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050508]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-sm border-2 border-red-500 border-t-transparent" />
          <div className="text-[10px] text-red-500/60 font-mono tracking-[0.3em] uppercase animate-pulse">Checking Permissions...</div>
        </div>
      </div>
    )
  }

  // Strictly block non-admins or unauthenticated users from admin routes
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
