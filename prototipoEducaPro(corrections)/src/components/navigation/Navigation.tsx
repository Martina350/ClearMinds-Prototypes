import { Link, useLocation, useNavigate } from 'react-router-dom'
import { userService } from '../../services/dataService'

export function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = userService.getCurrentUser()

  const handleLogout = () => {
    userService.logout()
    navigate('/')
  }

  const getRoleRoutes = () => {
    if (!currentUser) return []

    const baseRoutes = {
      admin: [
        { path: '/admin/usuarios', label: 'Usuarios', icon: 'bi-people' },
        { path: '/admin/estudiantes', label: 'Estudiantes', icon: 'bi-person-badge' },
        { path: '/admin/docentes', label: 'Docentes', icon: 'bi-person-workspace' },
        { path: '/admin/clases', label: 'Clases', icon: 'bi-book' },
        { path: '/admin/matriculas', label: 'Matrículas', icon: 'bi-clipboard-check' },
        { path: '/admin/reportes', label: 'Reportes', icon: 'bi-graph-up' }
      ],
      finanzas: [
        { path: '/finanzas/pagos', label: 'Pagos', icon: 'bi-credit-card' },
        { path: '/finanzas/ingresos', label: 'Ingresos', icon: 'bi-arrow-up-circle' },
        { path: '/finanzas/deudas', label: 'Deudas', icon: 'bi-exclamation-triangle' },
        { path: '/finanzas/reportes', label: 'Reportes', icon: 'bi-graph-up' }
      ],
      padre: [
        { path: '/padre/hijos', label: 'Mis Hijos', icon: 'bi-people' },
        { path: '/padre/calificaciones', label: 'Calificaciones', icon: 'bi-star' },
        { path: '/padre/tareas', label: 'Tareas', icon: 'bi-journal-text' },
        { path: '/padre/pagos', label: 'Pagos', icon: 'bi-credit-card' },
        { path: '/padre/calificaciones-docentes', label: 'Calificar Docentes', icon: 'bi-star-fill' }
      ],
      estudiante: [
        { path: '/estudiante/tareas', label: 'Tareas', icon: 'bi-journal-text' },
        { path: '/estudiante/calificaciones', label: 'Calificaciones', icon: 'bi-star' },
        { path: '/estudiante/asistencia', label: 'Asistencia', icon: 'bi-calendar-check' },
        { path: '/estudiante/materiales', label: 'Materiales', icon: 'bi-file-earmark-text' },
        { path: '/estudiante/notificaciones', label: 'Notificaciones', icon: 'bi-bell' }
      ],
      docente: [
        { path: '/docente/estudiantes', label: 'Estudiantes', icon: 'bi-people' },
        { path: '/docente/clases', label: 'Clases', icon: 'bi-book' },
        { path: '/docente/calificaciones', label: 'Calificaciones', icon: 'bi-star' },
        { path: '/docente/tareas', label: 'Tareas', icon: 'bi-journal-text' },
        { path: '/docente/asistencia', label: 'Asistencia', icon: 'bi-calendar-check' },
        { path: '/docente/monitoreo', label: 'Monitoreo', icon: 'bi-eye' }
      ]
    }

    return baseRoutes[currentUser.role as keyof typeof baseRoutes] || []
  }

  const routes = getRoleRoutes()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-mortarboard me-2"></i>
          EducaPro
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === `/app/${currentUser?.role}` ? 'active' : ''}`}
                to={`/app/${currentUser?.role}`}
              >
                <i className="bi bi-house me-1"></i>
                Inicio
              </Link>
            </li>
            {routes.map((route) => (
              <li className="nav-item" key={route.path}>
                <Link 
                  className={`nav-link ${location.pathname === route.path ? 'active' : ''}`}
                  to={route.path}
                >
                  <i className={`bi ${route.icon} me-1`}></i>
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/notificaciones">
                <i className="bi bi-bell me-1"></i>
                Notificaciones
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle me-1"></i>
                {currentUser?.name || 'Usuario'}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-person me-2"></i>
                    Perfil
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-gear me-2"></i>
                    Configuración
                  </a>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
