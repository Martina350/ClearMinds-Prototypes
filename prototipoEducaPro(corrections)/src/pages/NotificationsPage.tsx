import { useEffect, useState } from 'react'
import { notificationService, userService } from '../services/dataService'
import type { Notification } from '../types'

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  // const [user, setUser] = useState<User | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const currentUser = userService.getCurrentUser()
    // setUser(currentUser)
    
    if (currentUser) {
      const userNotifications = notificationService.getByUserId(currentUser.id)
      setNotifications(userNotifications)
    }
  }, [])

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter)

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'bi-info-circle'
      case 'warning':
        return 'bi-exclamation-triangle'
      case 'success':
        return 'bi-check-circle'
      case 'error':
        return 'bi-x-circle'
      default:
        return 'bi-bell'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'text-info'
      case 'warning':
        return 'text-warning'
      case 'success':
        return 'text-success'
      case 'error':
        return 'text-danger'
      default:
        return 'text-primary'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Notificaciones</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            style={{ width: 'auto' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="info">Información</option>
            <option value="warning">Advertencias</option>
            <option value="success">Éxito</option>
            <option value="error">Errores</option>
          </select>
          {unreadCount > 0 && (
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={markAllAsRead}
            >
              <i className="bi bi-check-all me-1"></i>
              Marcar todas como leídas
            </button>
          )}
        </div>
      </div>

      {/* Contador de notificaciones */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h6>Total</h6>
              <h3>{notifications.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h6>No Leídas</h6>
              <h3>{unreadCount}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h6>Leídas</h6>
              <h3>{notifications.filter(n => n.read).length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h6>Información</h6>
              <h3>{notifications.filter(n => n.type === 'info').length}</h3>
            </div>
          </div>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bell display-1 text-muted"></i>
          <h4 className="mt-3">No hay notificaciones</h4>
          <p className="text-muted">
            {filter === 'all' 
              ? 'No tienes notificaciones por el momento'
              : `No hay notificaciones de tipo ${filter}`
            }
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Lista de Notificaciones</h5>
          </div>
          <div className="card-body">
            <div className="list-group list-group-flush">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`list-group-item ${!notification.read ? 'bg-light' : ''}`}
                >
                  <div className="d-flex align-items-start">
                    <div className="me-3">
                      <i className={`bi ${getTypeIcon(notification.type)} ${getTypeColor(notification.type)}`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className={`mb-1 ${!notification.read ? 'fw-bold' : ''}`}>
                          {notification.title}
                        </h6>
                        <small className="text-muted">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-1">{notification.message}</p>
                      {!notification.read && (
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <i className="bi bi-check me-1"></i>
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
