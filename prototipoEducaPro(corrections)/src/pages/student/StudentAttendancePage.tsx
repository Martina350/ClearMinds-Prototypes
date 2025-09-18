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
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {}, [])

  const handleViewDetails = (attendance: Attendance) => {
    setSelectedAttendance(attendance)
    setShowDetailsModal(true)
  }

  const handleMouseMove = (e: React.MouseEvent, segment: string) => {
    const containerRect = e.currentTarget.parentElement?.getBoundingClientRect()
    
    if (containerRect) {
      setTooltipPosition({
        x: e.clientX - containerRect.left,
        y: -50 // Posición fija arriba de la barra
      })
    }
    setHoveredSegment(segment)
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

      {/* Barra de Progreso de Asistencia */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div className="card" style={{
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: 'var(--space-6)',
            borderBottom: '1px solid var(--color-gray-200)',
            backgroundColor: 'var(--color-background-tertiary)'
          }}>
            <h5 style={{
              margin: 0,
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <i className="bi bi-graph-up"></i>
              Progreso de Asistencia
            </h5>
          </div>
          <div style={{ padding: 'var(--space-6)' }}>
            {/* Porcentaje Total */}
            <div style={{
              textAlign: 'center',
              marginBottom: 'var(--space-6)'
            }}>
              <div style={{
                fontSize: 'var(--font-size-4xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-primary)',
                marginBottom: 'var(--space-2)'
              }}>
                {stats.percentage}%
              </div>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-base)',
                margin: 0
              }}>
                Asistencia Total
              </p>
            </div>

            {/* Barra de Progreso */}
            <div style={{ marginBottom: 'var(--space-6)', position: 'relative' }}>
              <div style={{
                display: 'flex',
                height: '24px',
                backgroundColor: 'var(--color-gray-200)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}>
                {/* Presente */}
                {stats.present > 0 && (
                  <div 
                    style={{
                      width: `${(stats.present / stats.total) * 100}%`,
                      backgroundColor: 'var(--color-success)',
                      transition: 'all 0.3s ease-in-out',
                      transform: hoveredSegment === 'present' ? 'scaleY(1.2)' : 'scaleY(1)',
                      transformOrigin: 'center'
                    }}
                    onMouseMove={(e) => handleMouseMove(e, 'present')}
                    onMouseLeave={() => setHoveredSegment(null)}
                    title={`Presente: ${stats.present} clases (${Math.round((stats.present / stats.total) * 100)}%)`}
                  ></div>
                )}
                {/* Tarde */}
                {stats.late > 0 && (
                  <div 
                    style={{
                      width: `${(stats.late / stats.total) * 100}%`,
                      backgroundColor: 'var(--color-warning)',
                      transition: 'all 0.3s ease-in-out',
                      transform: hoveredSegment === 'late' ? 'scaleY(1.2)' : 'scaleY(1)',
                      transformOrigin: 'center'
                    }}
                    onMouseMove={(e) => handleMouseMove(e, 'late')}
                    onMouseLeave={() => setHoveredSegment(null)}
                    title={`Tarde: ${stats.late} clases (${Math.round((stats.late / stats.total) * 100)}%)`}
                  ></div>
                )}
                {/* Ausente */}
                {stats.absent > 0 && (
                  <div 
                    style={{
                      width: `${(stats.absent / stats.total) * 100}%`,
                      backgroundColor: 'var(--color-danger)',
                      transition: 'all 0.3s ease-in-out',
                      transform: hoveredSegment === 'absent' ? 'scaleY(1.2)' : 'scaleY(1)',
                      transformOrigin: 'center'
                    }}
                    onMouseMove={(e) => handleMouseMove(e, 'absent')}
                    onMouseLeave={() => setHoveredSegment(null)}
                    title={`Ausente: ${stats.absent} clases (${Math.round((stats.absent / stats.total) * 100)}%)`}
                  ></div>
                )}
              </div>

              {/* Tooltip */}
              {hoveredSegment && (
                <div style={{
                  position: 'absolute',
                  top: `${tooltipPosition.y}px`,
                  left: `${tooltipPosition.x}px`,
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--color-gray-800)',
                  color: 'var(--color-text-inverse)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 1000,
                  whiteSpace: 'nowrap',
                  animation: 'fadeIn 0.2s ease-out',
                  pointerEvents: 'none'
                }}>
                  {hoveredSegment === 'present' && (
                    <>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                          Presente
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>
                          {stats.present} clases • {Math.round((stats.present / stats.total) * 100)}%
                        </div>
                      </div>
                    </>
                  )}
                  {hoveredSegment === 'late' && (
                    <>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                          Tarde
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>
                          {stats.late} clases • {Math.round((stats.late / stats.total) * 100)}%
                        </div>
                      </div>
                    </>
                  )}
                  {hoveredSegment === 'absent' && (
                    <>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)' }}>
                          Ausente
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8 }}>
                          {stats.absent} clases • {Math.round((stats.absent / stats.total) * 100)}%
                        </div>
                      </div>
                    </>
                  )}
                  {/* Flecha del tooltip */}
                  <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid var(--color-gray-800)'
                  }}></div>
                </div>
              )}
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
                  {a.status !== 'present' && (
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleViewDetails(a)}
                    >
                      <i className="bi bi-eye me-1"></i>Ver Detalles
                    </button>
                  )}
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
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <i className={`bi ${selectedAttendance.status === 'present' ? 'bi-check-circle text-success' : selectedAttendance.status === 'late' ? 'bi-clock text-warning' : 'bi-x-circle text-danger'} display-4 mb-3`}></i>
                        <h6>Estado de Asistencia</h6>
                        <p className="small text-muted">
                          {selectedAttendance.status === 'present' ? 'Asististe a clase' : 
                           selectedAttendance.status === 'late' ? 'Llegaste tarde' : 
                           'No asististe a clase'}
                        </p>
                        
                        {/* Descripción de razones para estados específicos */}
                        {selectedAttendance.status === 'late' && (
                          <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--color-warning-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-warning-100)' }}>
                            <h6 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-warning-800)', marginBottom: 'var(--space-2)' }}>
                              Razón del retraso:
                            </h6>
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-warning-700)', margin: 0, textAlign: 'left' }}>
                              Tráfico pesado en la avenida principal. El estudiante se comunicó con el docente para informar el retraso.
                            </p>
                          </div>
                        )}
                        
                        {selectedAttendance.status === 'absent' && (
                          <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--color-danger-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger-100)' }}>
                            <h6 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-danger-800)', marginBottom: 'var(--space-2)' }}>
                              Razón de la ausencia:
                            </h6>
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger-700)', margin: 0, textAlign: 'left' }}>
                              Enfermedad del estudiante. Se presentó justificación médica y se coordinó la recuperación del contenido.
                            </p>
                          </div>
                        )}
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


