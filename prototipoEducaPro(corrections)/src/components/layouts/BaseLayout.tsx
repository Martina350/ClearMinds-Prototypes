import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { userService, notificationService } from '../../services/dataService'
import type { User, Notification } from '../../types'

export function BaseLayout() {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unread, setUnread] = useState<number>(0)
  const [toasts, setToasts] = useState<Notification[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
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

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (notificationsOpen && !target.closest('[data-notifications-dropdown]')) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [notificationsOpen])

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
    setNotificationsOpen(!notificationsOpen)
    
    if (!notificationsOpen) {
      // Cargar notificaciones al abrir
      const allNotifications = notificationService.getByUserId(user.id)
      setNotifications(allNotifications.slice(0, 10)) // Mostrar las últimas 10
      
      // Marcar como leídas todas las no leídas
      const unreadList = notificationService.getUnreadByUserId(user.id)
      unreadList.forEach(n => notificationService.markAsRead(n.id))
      setUnread(0)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Marcar como leída si no lo está
    if (!notification.read) {
      notificationService.markAsRead(notification.id)
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      )
    }
  }

  const handleLogout = () => {
    userService.logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--color-background-secondary)'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--color-primary-100)',
            borderTop: '4px solid var(--color-primary)',
            borderRadius: 'var(--radius-full)',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-sm)',
            margin: 0
          }}>
            Cargando...
          </p>
        </div>
      </div>
    )
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
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} 
           style={{ 
             width: sidebarOpen ? '280px' : '70px',
           }}>
        <div className="sidebar-header">
          {sidebarOpen && (
            <h5 style={{
              margin: 0,
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-inverse)'
            }}>
              EducaPro
            </h5>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-inverse)',
              fontSize: 'var(--font-size-lg)',
              cursor: 'pointer',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-md)',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-gray-700)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <i className={`bi bi-${sidebarOpen ? 'x-lg' : 'list'}`}></i>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {getNavigationItems(user.role).map((item, index) => (
            <Link
              key={`nav-${item.href}-${index}`}
              to={item.href}
              className={`sidebar-nav-item ${
                location.pathname.startsWith(item.href) ? 'active' : ''
              }`}
              title={item.label}
            >
              <i className={`bi bi-${item.icon}`} style={{ 
                width: '20px', 
                textAlign: 'center',
                fontSize: 'var(--font-size-base)'
              }}></i>
              {sidebarOpen && (
                <span style={{
                  marginLeft: 'var(--space-3)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minWidth: 0
      }}>
        {/* Top Navbar */}
        <nav className="navbar">
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 'var(--font-size-lg)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-fast)',
                  display: 'none'
                }}
                className="d-lg-none"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                  e.currentTarget.style.color = 'var(--color-text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }}
              >
                <i className="bi bi-list"></i>
              </button>

              {/* Notifications Bell - Moved to left */}
              <div style={{ position: 'relative' }} data-notifications-dropdown>
                <button 
                  onClick={handleBellClick} 
                  title="Notificaciones"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all var(--transition-fast)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                    e.currentTarget.style.color = 'var(--color-text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--color-text-secondary)'
                  }}
                >
                  <i className="bi bi-bell"></i>
                  {unread > 0 && (
                    <span className="notification-badge">
                      {unread}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    marginTop: 'var(--space-2)',
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-gray-200)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-xl)',
                    minWidth: '320px',
                    maxWidth: '400px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    <div style={{
                      padding: 'var(--space-4)',
                      borderBottom: '1px solid var(--color-gray-200)',
                      backgroundColor: 'var(--color-background-tertiary)'
                    }}>
                      <h6 style={{
                        margin: 0,
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)'
                      }}>
                        Notificaciones
                      </h6>
                    </div>
                    
                    <div style={{ padding: 'var(--space-2)' }}>
                      {notifications.length === 0 ? (
                        <div style={{
                          padding: 'var(--space-6)',
                          textAlign: 'center',
                          color: 'var(--color-text-secondary)'
                        }}>
                          <i className="bi bi-bell-slash" style={{
                            fontSize: 'var(--font-size-2xl)',
                            marginBottom: 'var(--space-2)',
                            display: 'block'
                          }}></i>
                          <p style={{
                            margin: 0,
                            fontSize: 'var(--font-size-sm)'
                          }}>
                            No hay notificaciones
                          </p>
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            style={{
                              padding: 'var(--space-3)',
                              borderBottom: '1px solid var(--color-gray-100)',
                              cursor: 'pointer',
                              transition: 'background-color var(--transition-fast)',
                              backgroundColor: notification.read ? 'transparent' : 'var(--color-primary-50)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = notification.read ? 'transparent' : 'var(--color-primary-50)'
                            }}
                          >
                            <div style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 'var(--space-3)'
                            }}>
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: notification.read ? 'transparent' : 'var(--color-primary)',
                                marginTop: 'var(--space-2)',
                                flexShrink: 0
                              }}></div>
                              <div style={{ flex: 1 }}>
                                <div style={{
                                  fontSize: 'var(--font-size-sm)',
                                  fontWeight: notification.read ? 'var(--font-weight-normal)' : 'var(--font-weight-semibold)',
                                  color: 'var(--color-text-primary)',
                                  marginBottom: 'var(--space-1)'
                                }}>
                                  {notification.title}
                                </div>
                                <div style={{
                                  fontSize: 'var(--font-size-xs)',
                                  color: 'var(--color-text-secondary)',
                                  marginBottom: 'var(--space-1)'
                                }}>
                                  {notification.message}
                                </div>
                                <div style={{
                                  fontSize: 'var(--font-size-xs)',
                                  color: 'var(--color-text-secondary)'
                                }}>
                                  {new Date(notification.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="navbar-nav" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              flexDirection: 'row'
            }}>
              <button 
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-danger)',
                  border: '1px solid var(--color-danger)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-danger)'
                  e.currentTarget.style.color = 'var(--color-text-inverse)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--color-danger)'
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span className="d-none d-md-inline">Cerrar Sesión</span>
              </button>
              
              <div style={{ position: 'relative' }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-3)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-secondary)',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                    e.currentTarget.style.color = 'var(--color-text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--color-text-secondary)'
                  }}
                >
                  <i className="bi bi-person-circle"></i>
                  <span className="d-none d-md-inline">{user.name}</span>
                  <i className="bi bi-chevron-down" style={{ fontSize: 'var(--font-size-xs)' }}></i>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main style={{ 
          flex: 1, 
          overflow: 'auto',
          backgroundColor: 'var(--color-background-secondary)'
        }}>
          <div style={{ width: '100%', height: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Toasts desde campana - Parte superior */}
      <div style={{
        position: 'fixed',
        top: 'var(--space-4)',
        right: 'var(--space-4)',
        zIndex: 'var(--z-modal)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)'
      }}>
        {toasts.map(n => (
          <div 
            key={n.id} 
            style={{
              backgroundColor: n.type === 'success' ? 'var(--color-success)' :
                              n.type === 'warning' ? 'var(--color-warning)' :
                              n.type === 'error' ? 'var(--color-danger)' : 'var(--color-info)',
              color: n.type === 'warning' ? 'var(--color-gray-800)' : 'var(--color-text-inverse)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              maxWidth: '400px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              animation: 'fadeIn 0.3s ease-out'
            }}
            role="alert"
          >
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-semibold)',
                textTransform: 'uppercase',
                marginBottom: 'var(--space-1)',
                opacity: 0.8
              }}>
                {n.type}
              </div>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                marginBottom: 'var(--space-1)'
              }}>
                {n.title}
              </div>
              <div style={{
                fontSize: 'var(--font-size-xs)',
                opacity: 0.8
              }}>
                {n.message}
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => handleToastClose(n.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: 'var(--space-1)',
                borderRadius: 'var(--radius-sm)',
                opacity: 0.7,
                transition: 'opacity var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.7'
              }}
            >
              <i className="bi bi-x-lg" style={{ fontSize: 'var(--font-size-sm)' }}></i>
            </button>
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
