import { Navigate } from 'react-router-dom'
import { userService } from '../services/dataService'

export function RoleBasedRedirect() {
  const currentUser = userService.getCurrentUser()
  
  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  // Redirigir según el rol del usuario
  switch (currentUser.role) {
    case 'admin':
      return <Navigate to="/app/admin" replace />
    case 'finanzas':
      return <Navigate to="/app/finanzas" replace />
    case 'padre':
      return <Navigate to="/app/padre" replace />
    case 'estudiante':
      return <Navigate to="/app/estudiante" replace />
    case 'docente':
      return <Navigate to="/app/docente" replace />
    default:
      return <Navigate to="/" replace />
  }
}
