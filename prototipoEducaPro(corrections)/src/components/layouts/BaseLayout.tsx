import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { userService, notificationService } from '../../services/dataService'
import type { User, Notification } from '../../types'

export function BaseLayout() {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unread, setUnread] = useState<number>(0)
  const [toasts, setToasts] = useState<Notification[]>([])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Obtener usuario actual
    const currentUser = userService.getCurrentUser()
    setUser(currentUser)
    
    // Si no hay usuario, redirigir al login
    if (!currentUser) {
      navigate('/')
      return
    }

    // Contador de notificaciones no leídas
    setUnread(notificationService.getUnreadByUserId(currentUser.id).length)
  }, [navigate])

  // Auto-hide de toasts y marcar como leídas
  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map(n => setTimeout(() => handleToastClose(n.id), 5000))
    return () => { timers.forEach(t => clearTimeout(t)) }
  }, [toasts])

  const handleToastClose = (id: string) => {
    notificationService.markAsRead(id)
    setToasts(prev => prev.filter(t => t.id !== id))
    if (user) setUnread(notificationService.getUnreadByUserId(user.id).length)
  }

  const handleBellClick = () => {
    if (!user) return
    const unreadList = notificationService.getUnreadByUserId(user.id)
    if (unreadList.length > 0) {
      setToasts(unreadList.slice(0, 4))
      // Marcar como leídas al instante al abrir
      unreadList.forEach(n => notificationService.markAsRead(n.id))
      setUnread(0)
    } else {
      const recent = notificationService.getByUserId(user.id).slice(0, 4)
      setToasts(recent)
      setUnread(0)
    }
  }

  const handleLogout = () => {
    userService.logout()
    navigate('/')
  }

  if (!user) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  }

  const typeToToastClass = (t?: Notification['type']) => {
    switch (t) {
      case 'success': return 'bg-success text-white'
      case 'warning': return 'bg-warning text-dark'
      case 'error': return 'bg-danger text-white'
      default: return 'bg-info text-white'
    }
  }

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className={`bg-dark text-white ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} 
           style={{ 
             width: sidebarOpen ? '250px' : '60px', 
             transition: 'width 0.3s ease',
             minHeight: '100vh'
           }}>
        <div className="p-3">
          <div className="d-flex align-items-center justify-content-between">
            {sidebarOpen && <h5 className="mb-0">EducaPro</h5>}
            <button 
              className="btn btn-link text-white p-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className={`bi bi-${sidebarOpen ? 'x' : 'list'}`}></i>
            </button>
          </div>
        </div>
        
        <nav className="nav flex-column px-3">
          {getNavigationItems(user.role).map((item, index) => (
            <Link
              key={`nav-${item.href}-${index}`}
              to={item.href}
              className={`nav-link text-white-50 d-flex align-items-center ${
                location.pathname.startsWith(item.href) ? 'active bg-primary' : ''
              }`}
              style={{ padding: '0.75rem 0.5rem' }}
              title={item.label}
            >
              <i className={`bi bi-${item.icon} me-2`} style={{ width: '20px' }}></i>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
          <div className="w-100 d-flex align-items-center justify-content-between px-3">
            <button 
              className="btn btn-link d-lg-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list"></i>
            </button>
            
            <div className="navbar-nav d-flex align-items-center gap-3 ms-auto">
              <button className="btn btn-link nav-link position-relative p-0" onClick={handleBellClick} title="Notificaciones">
                <i className="bi bi-bell fs-5"></i>
                {unread > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unread}
                  </span>
                )}
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>
                Cerrar Sesión
              </button>
              <div className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle d-flex align-items-center" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  <span className="d-none d-md-inline">{user.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i>Perfil</a></li>
                  <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i>Configuración</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-grow-1" style={{ overflow: 'auto', width: '100%' }}>
          <div style={{ width: '100%', height: '100%', maxWidth: 'none' }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Toasts desde campana - Parte superior */}
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 2000 }}>
        {toasts.map(n => (
          <div key={n.id} className={`toast show mb-2 ${typeToToastClass(n.type)}`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">
                <strong className="me-2 text-uppercase small">{n.type}</strong>
                {n.title}
                <div className="small opacity-75">{n.message}</div>
              </div>
              <button type="button" className="btn-close me-2 m-auto" aria-label="Close" onClick={() => handleToastClose(n.id)}></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getNavigationItems(role: string) {
  const commonItems = [
    { href: '/app', icon: 'house', label: 'Inicio' }
  ]

  switch (role) {
    case 'estudiante':
      return [
        ...commonItems,
        { href: '/app/estudiante/tareas', icon: 'journal-text', label: 'Mis Tareas' },
        { href: '/app/estudiante/calificaciones', icon: 'star', label: 'Mis Notas' },
        { href: '/app/estudiante/asistencia', icon: 'calendar-check', label: 'Asistencia' },
        { href: '/app/estudiante/materiales', icon: 'folder', label: 'Materiales' }
      ]
    
    case 'padre':
      return [
        ...commonItems,
        { href: '/app/padre/hijos', icon: 'people', label: 'Mis Hijos' },
        { href: '/app/padre/calificaciones', icon: 'star', label: 'Notas' },
        { href: '/app/padre/tareas', icon: 'journal-text', label: 'Tareas' },
        { href: '/app/padre/pagos', icon: 'credit-card', label: 'Pagos' },
        { href: '/app/padre/calificaciones-docentes', icon: 'star-fill', label: 'Calificar Docentes' }
      ]
    
    case 'docente':
      return [
        ...commonItems,
        { href: '/app/docente/clases', icon: 'book', label: 'Mis Clases' },
        { href: '/app/docente/tareas', icon: 'journal-plus', label: 'Gestionar Tareas' },
        { href: '/app/docente/asistencia', icon: 'calendar-check', label: 'Tomar Asistencia' },
        { href: '/app/docente/calificaciones', icon: 'star', label: 'Calificar' },
        { href: '/app/docente/estudiantes', icon: 'people', label: 'Estudiantes' },
        { href: '/app/docente/monitoreo', icon: 'eye', label: 'Monitoreo' }
      ]
    
    case 'admin':
      return [
        ...commonItems,
        { href: '/app/admin/usuarios', icon: 'people', label: 'Usuarios' },
        { href: '/app/admin/estudiantes', icon: 'person-badge', label: 'Estudiantes' },
        { href: '/app/admin/docentes', icon: 'person-workspace', label: 'Docentes' },
        { href: '/app/admin/clases', icon: 'book', label: 'Clases' },
        { href: '/app/admin/matriculas', icon: 'person-plus', label: 'Matrículas' },
        { href: '/app/admin/reportes', icon: 'graph-up', label: 'Reportes' }
      ]
    
    case 'finanzas':
      return [
        ...commonItems,
        { href: '/app/finanzas/pagos', icon: 'credit-card', label: 'Pagos' },
        { href: '/app/finanzas/ingresos', icon: 'graph-up', label: 'Ingresos' },
        { href: '/app/finanzas/reportes', icon: 'file-earmark-text', label: 'Reportes' },
        { href: '/app/finanzas/deudas', icon: 'exclamation-triangle', label: 'Deudas' }
      ]
    
    default:
      return commonItems
  }
}
