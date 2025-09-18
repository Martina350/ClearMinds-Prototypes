import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Outlet, Link } from 'react-router-dom'
import { taskService, gradeService, getDashboardStats, classService } from '../../services/dataService'
import type { Task, Grade, DashboardStats, Class } from '../../types'

export function StudentDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [subjectFilter, setSubjectFilter] = useState<string>('')

  const handleViewTasks = () => navigate('/app/estudiante/tareas')
  const handleViewGrades = () => navigate('/app/estudiante/calificaciones')
  const handleViewAttendance = () => navigate('/app/estudiante/asistencia')
  const handleViewMaterials = () => navigate('/app/estudiante/materiales')

  useEffect(() => {
    const userId = '1'
    setStats(getDashboardStats(userId, 'estudiante'))
    setTasks(taskService.getByStudentId(userId))
    setGrades(gradeService.getByStudentId(userId))
    setClasses(classService.getByStudentId(userId))
  }, [])

  const classIdToSubject = useMemo(() => {
    const map = new Map<string, string>()
    classes.forEach(c => map.set(c.id, c.subject))
    return map
  }, [classes])

  const subjects = useMemo(() => {
    const set = new Set<string>()
    tasks.forEach(t => {
      const s = classIdToSubject.get(t.classId)
      if (s) set.add(s)
    })
    return Array.from(set)
  }, [tasks, classIdToSubject])

  const filteredTasks = useMemo(() => {
    if (!subjectFilter) return tasks
    return tasks.filter(t => classIdToSubject.get(t.classId) === subjectFilter)
  }, [tasks, subjectFilter, classIdToSubject])

  if (!stats) {
    return <div className="d-flex justify-content-center"><div className="spinner-border"></div></div>
  }

  const now = new Date().getTime()
  const upcoming = [...tasks]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3)

  const weeklyProgress = (() => {
    const total = stats.totalTasks || stats.pendingTasks + stats.completedTasks
    return total ? Math.round((stats.completedTasks / total) * 100) : 0
  })()

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">Dashboard Estudiante</h1>
              <small className="text-muted">Resumen general</small>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs 2x2 (Promedio destacado) */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-lg-6">
          <div className="row g-3">
            <div className="col-6">
              <div className="card bg-primary text-white h-100">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title mb-1">Pendientes</h6>
                    <div className="display-6 fw-bold">{stats.pendingTasks}</div>
                  </div>
                  <i className="bi bi-journal-text fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card bg-success text-white h-100">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title mb-1">Completadas</h6>
                    <div className="display-6 fw-bold">{stats.completedTasks}</div>
                  </div>
                  <i className="bi bi-check-circle fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card bg-warning text-white h-100">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title mb-1">Promedio General</h6>
                    <div className="display-4 fw-bold">{stats.averageGrade.toFixed(1)}</div>
                  </div>
                  <i className="bi bi-star fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="row g-3">
            <div className="col-12">
              <div className="card bg-info text-white h-100">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title mb-1">Asistencia</h6>
                    <div className="display-5 fw-bold">{stats.attendanceRate}%</div>
                  </div>
                  <i className="bi bi-calendar-check fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card h-100">
                <div className="card-body d-flex align-items-center gap-3">
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: `conic-gradient(#198754 ${weeklyProgress}%, #e9ecef 0)` }} className="position-relative">
                    <div className="position-absolute top-50 start-50 translate-middle small fw-bold">{weeklyProgress}%</div>
                  </div>
                  <div>
                    <div className="fw-semibold">Progreso semanal</div>
                    <small className="text-muted">Tareas completadas esta semana</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Acciones Rápidas */}
      <div className="card mb-3">
        <div className="card-body d-flex flex-wrap gap-2">
          <button className="btn btn-outline-primary" onClick={handleViewTasks}><i className="bi bi-journal-text me-2"></i>Mis Tareas</button>
          <button className="btn btn-outline-primary" onClick={handleViewGrades}><i className="bi bi-star me-2"></i>Calificaciones</button>
          <button className="btn btn-outline-primary" onClick={handleViewAttendance}><i className="bi bi-calendar-check me-2"></i>Asistencia</button>
          <button className="btn btn-outline-primary" onClick={handleViewMaterials}><i className="bi bi-book me-2"></i>Materiales</button>
        </div>
      </div>

      <div className="row g-3">
        {/* Sección central: Mis Tareas */}
        <div className="col-12 col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Mis Tareas</h5>
              <div className="d-flex align-items-center gap-2">
                <select className="form-select form-select-sm" style={{ minWidth: 180 }} value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                  <option value="">Todas las materias</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <Link to="/app/estudiante/tareas" className="btn btn-sm btn-outline-primary">Ver todas</Link>
              </div>
            </div>
            <div className="card-body">
              {filteredTasks.length === 0 ? (
                <p className="text-muted text-center py-4">No hay tareas para mostrar</p>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredTasks.slice(0, 8).map(task => {
                    const due = new Date(task.dueDate).getTime()
                    const isOverdue = due < now
                    const subject = classIdToSubject.get(task.classId) || 'General'
                    const statusBadge = isOverdue ? 'bg-danger' : 'bg-warning'
                    const statusText = isOverdue ? 'Atrasada' : 'Pendiente'
                    return (
                      <div key={task.id} className="list-group-item d-flex justify-content-between align-items-start">
                        <div className="ms-2 me-auto">
                          <div className="d-flex align-items-center gap-2">
                            <h6 className="mb-0">{task.title}</h6>
                            <span className="badge text-bg-light border">{subject}</span>
                          </div>
                          <small className="text-muted"><i className="bi bi-calendar me-1"></i>Vence: {new Date(task.dueDate).toLocaleDateString()}</small>
                        </div>
                        <span className={`badge ${statusBadge} rounded-pill`}>{statusText}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha: Notas recientes + Próximos eventos */}
        <div className="col-12 col-lg-4">
          <div className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Notas Recientes</h6>
              <button className="btn btn-sm btn-outline-primary" onClick={handleViewGrades}>Ver todas</button>
            </div>
            <div className="card-body">
              {grades.length === 0 ? (
                <p className="text-muted text-center py-3 mb-0">Sin notas</p>
              ) : (
                <div className="list-group list-group-flush">
                  {grades.slice(0, 3).map(grade => (
                    <div key={grade.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge text-bg-secondary">{grade.type === 'homework' ? 'Tarea' : grade.type === 'exam' ? 'Examen' : 'Participación'}</span>
                        <span className="small text-muted">{new Date(grade.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`badge ${grade.value >= 7 ? 'bg-success' : 'bg-warning'}`}>{grade.value}/{grade.maxValue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Próximos eventos</h6>
              <Link to="/app/estudiante/tareas" className="btn btn-sm btn-outline-primary">Ver todas</Link>
            </div>
            <div className="card-body">
              {upcoming.length === 0 ? (
                <p className="text-muted text-center py-3 mb-0">Sin próximos eventos</p>
              ) : (
                <div className="list-group list-group-flush">
                  {upcoming.map(task => (
                    <div key={task.id} className="list-group-item d-flex justify-content-between align-items-start">
                      <div className="ms-2 me-auto">
                        <div className="fw-semibold">{task.title}</div>
                        <small className="text-muted"><i className="bi bi-calendar me-1"></i>{new Date(task.dueDate).toLocaleDateString()}</small>
                      </div>
                      <span className="badge text-bg-light border">{classIdToSubject.get(task.classId) || 'General'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  )
}
