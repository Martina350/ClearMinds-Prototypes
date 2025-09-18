import { useEffect, useState } from 'react'
// import { classService } from '../../services/dataService'
import type { Attendance } from '../../types'

export function StudentAttendancePage() {
  const [attendance] = useState<Attendance[]>([
    { id: 'att1', studentId: '1', classId: 'class1', date: '2024-01-15', status: 'present' },
    { id: 'att2', studentId: '1', classId: 'class2', date: '2024-01-14', status: 'present' },
    { id: 'att3', studentId: '1', classId: 'class1', date: '2024-01-13', status: 'late' },
    { id: 'att4', studentId: '1', classId: 'class3', date: '2024-01-12', status: 'present' },
    { id: 'att5', studentId: '1', classId: 'class2', date: '2024-01-11', status: 'absent' },
  ])
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null)

  useEffect(() => {}, [])

  const handleViewDetails = (attendance: Attendance) => {
    setSelectedAttendance(attendance)
    setShowDetailsModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailsModal(false)
    setSelectedAttendance(null)
  }

  const getAttendanceStats = () => {
    const total = attendance.length
    const present = attendance.filter(a => a.status === 'present').length
    const late = attendance.filter(a => a.status === 'late').length
    const absent = attendance.filter(a => a.status === 'absent').length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0
    
    return { total, present, late, absent, percentage }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Presente'
      case 'late': return 'Tarde'
      case 'absent': return 'Ausente'
      default: return 'Desconocido'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present': return 'bg-success'
      case 'late': return 'bg-warning'
      case 'absent': return 'bg-danger'
      default: return 'bg-secondary'
    }
  }

  const stats = getAttendanceStats()

  return (
    <div className="page-container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="h4 mb-0">Mi Asistencia</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="all">Todo el período</option>
          </select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h6>Asistencia</h6>
              <h3>{stats.percentage}%</h3>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h6>Presente</h6>
              <h3>{stats.present}</h3>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h6>Tarde</h6>
              <h3>{stats.late}</h3>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h6>Ausente</h6>
              <h3>{stats.absent}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Clase</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(a => (
              <tr key={a.id}>
                <td>{new Date(a.date).toLocaleDateString()}</td>
                <td>{a.classId}</td>
                <td>
                  <span className={`badge ${getStatusBadge(a.status)}`}>
                    {getStatusText(a.status)}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleViewDetails(a)}
                  >
                    <i className="bi bi-eye me-1"></i>Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para ver detalles de asistencia */}
      {showDetailsModal && selectedAttendance && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles de Asistencia</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Información</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha:</span>
                        <span>{new Date(selectedAttendance.date).toLocaleDateString()}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Clase:</span>
                        <span>{selectedAttendance.classId}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Estado:</span>
                        <span className={`badge ${getStatusBadge(selectedAttendance.status)}`}>
                          {getStatusText(selectedAttendance.status)}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <i className={`bi ${selectedAttendance.status === 'present' ? 'bi-check-circle text-success' : selectedAttendance.status === 'late' ? 'bi-clock text-warning' : 'bi-x-circle text-danger'} display-4 mb-3`}></i>
                        <h6>Estado de Asistencia</h6>
                        <p className="small text-muted">
                          {selectedAttendance.status === 'present' ? 'Asististe a clase' : 
                           selectedAttendance.status === 'late' ? 'Llegaste tarde' : 
                           'No asististe a clase'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


