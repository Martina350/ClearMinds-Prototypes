import { useEffect, useState } from 'react'
import { notificationService } from '../../services/dataService'
import type { Notification } from '../../types'

export function StudentNotificationsPage() {
  const userId = '1'
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    setNotifications(notificationService.getByUserId(userId))
  }, [])

  function markAsRead(id: string) {
    notificationService.markAsRead(id)
    setNotifications(notificationService.getByUserId(userId))
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Notificaciones</h2>
        <span className="badge bg-primary">{notifications.filter(n => !n.read).length} sin leer</span>
      </div>
      <div className="list-group list-group-flush">
        {notifications.map(n => (
          <div key={n.id} className={`list-group-item d-flex justify-content-between align-items-start ${!n.read ? 'notification-item' : ''}`}>
            <div className="ms-2 me-auto">
              <div className="fw-semibold">{n.title}</div>
              <div className="text-muted small">{n.message}</div>
            </div>
            <div className="btn-group btn-group-sm">
              <a className="btn btn-outline-primary" href={n.actionUrl || '#'}>Abrir</a>
              {!n.read && <button className="btn btn-outline-success" onClick={() => markAsRead(n.id)}>Marcar</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


