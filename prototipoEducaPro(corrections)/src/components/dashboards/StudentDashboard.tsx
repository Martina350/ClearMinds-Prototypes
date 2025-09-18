import { useState, useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { getDashboardStats } from '../../services/dataService'
import type { DashboardStats } from '../../types'

export function StudentDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const handleViewTasks = () => navigate('/app/estudiante/tareas')
  const handleViewGrades = () => navigate('/app/estudiante/calificaciones')
  const handleViewAttendance = () => navigate('/app/estudiante/asistencia')
  const handleViewMaterials = () => navigate('/app/estudiante/materiales')

  useEffect(() => {
    const userId = '1'
    setStats(getDashboardStats(userId, 'estudiante'))
  }, [])

  if (!stats) {
    return <div className="d-flex justify-content-center"><div className="spinner-border"></div></div>
  }

  const weeklyProgress = (() => {
    const total = stats.totalTasks || stats.pendingTasks + stats.completedTasks
    return total ? Math.round((stats.completedTasks / total) * 100) : 0
  })()

  return (
    <div className="container-fluid p-4">
      {/* Header simplificado */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h3 fw-semibold text-dark mb-1">Dashboard Estudiante</h1>
          <p className="text-muted">Resumen general de tu progreso académico</p>
        </div>
      </div>

      {/* Resumen General - KPIs estilo horizontal */}
      <div className="row g-3 mb-4">
        {/* Tareas Pendientes */}
        <div className="col-6 col-lg-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-title mb-1 fw-semibold">Tareas Pendientes</h6>
                <div className="display-5 fw-bold mb-0">{stats.pendingTasks}</div>
              </div>
              <i className="bi bi-journal-text fs-1 opacity-75"></i>
            </div>
          </div>
        </div>

        {/* Tareas Completadas */}
        <div className="col-6 col-lg-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-title mb-1 fw-semibold">Tareas Completadas</h6>
                <div className="display-5 fw-bold mb-0">{stats.completedTasks}</div>
              </div>
              <i className="bi bi-check-circle fs-1 opacity-75"></i>
            </div>
          </div>
        </div>

        {/* Promedio General */}
        <div className="col-6 col-lg-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-title mb-1 fw-semibold">Promedio General</h6>
                <div className="display-4 fw-bold mb-0">{stats.averageGrade.toFixed(1)}</div>
              </div>
              <i className="bi bi-star-fill fs-1 opacity-75"></i>
            </div>
          </div>
        </div>

        {/* Asistencia */}
        <div className="col-6 col-lg-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body p-3 d-flex align-items-center justify-content-between">
              <div>
                <h6 className="card-title mb-1 fw-semibold">Asistencia</h6>
                <div className="display-5 fw-bold mb-0">{stats.attendanceRate}%</div>
              </div>
              <i className="bi bi-calendar-check fs-1 opacity-75"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Progreso Semanal */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Progreso Semanal
              </h5>
            </div>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="d-flex align-items-center gap-4">
                    <div className="position-relative">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          background: `conic-gradient(#198754 ${weeklyProgress}%, #e9ecef 0)`,
                          fontSize: '1.2rem',
                          fontWeight: 'bold'
                        }}
                      >
                        <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                          {weeklyProgress}%
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2">Progreso de la Semana</h4>
                      <p className="text-muted mb-3">Tareas completadas esta semana</p>
                      <div className="d-flex gap-2">
                        <span className="badge bg-success">Completadas: {stats.completedTasks}</span>
                        <span className="badge bg-secondary">Total: {stats.totalTasks || stats.pendingTasks + stats.completedTasks}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row g-3">
                    <div className="col-6">
                      <div className="text-center p-3 border rounded">
                        <i className="bi bi-journal-text text-primary fs-2 mb-2"></i>
                        <div className="fw-bold text-primary">{stats.pendingTasks}</div>
                        <small className="text-muted">Pendientes</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-center p-3 border rounded">
                        <i className="bi bi-check-circle text-success fs-2 mb-2"></i>
                        <div className="fw-bold text-success">{stats.completedTasks}</div>
                        <small className="text-muted">Completadas</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Acciones Rápidas
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6 col-lg-3">
                  <button 
                    className="btn btn-outline-primary w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                    onClick={handleViewTasks}
                    style={{ minHeight: '120px' }}
                  >
                    <i className="bi bi-journal-text fs-1 mb-2"></i>
                    <h6 className="mb-1">Mis Tareas</h6>
                    <small className="text-muted">Ver y gestionar tareas</small>
                  </button>
                </div>
                <div className="col-6 col-lg-3">
                  <button 
                    className="btn btn-outline-success w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                    onClick={handleViewGrades}
                    style={{ minHeight: '120px' }}
                  >
                    <i className="bi bi-star fs-1 mb-2"></i>
                    <h6 className="mb-1">Calificaciones</h6>
                    <small className="text-muted">Ver notas y promedios</small>
                  </button>
                </div>
                <div className="col-6 col-lg-3">
                  <button 
                    className="btn btn-outline-info w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                    onClick={handleViewAttendance}
                    style={{ minHeight: '120px' }}
                  >
                    <i className="bi bi-calendar-check fs-1 mb-2"></i>
                    <h6 className="mb-1">Asistencia</h6>
                    <small className="text-muted">Consultar asistencia</small>
                  </button>
                </div>
                <div className="col-6 col-lg-3">
                  <button 
                    className="btn btn-outline-warning w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3"
                    onClick={handleViewMaterials}
                    style={{ minHeight: '120px' }}
                  >
                    <i className="bi bi-book fs-1 mb-2"></i>
                    <h6 className="mb-1">Materiales</h6>
                    <small className="text-muted">Acceder a recursos</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  )
}