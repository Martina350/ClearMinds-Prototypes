import { useState, useEffect } from 'react'
import { useNavigate, Outlet, Link } from 'react-router-dom'
import { parentService, studentService, gradeService, paymentService, teacherRatingService, getDashboardStats, userService } from '../../services/dataService'
import type { Parent, Student, Grade, Payment, TeacherRating, DashboardStats } from '../../types'

export function ParentDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [parent, setParent] = useState<Parent | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [ratings, setRatings] = useState<TeacherRating[]>([])

  const handleLogout = () => {
    userService.logout()
    navigate('/')
  }

  const handleViewStudents = () => {
    navigate('/app/padre/hijos')
  }

  const handleViewGrades = () => {
    navigate('/app/padre/calificaciones')
  }

  const handleViewPayments = () => {
    navigate('/app/padre/pagos')
  }

  const handleRateTeachers = () => {
    navigate('/app/padre/calificaciones-docentes')
  }

  const handleViewTasks = () => {
    navigate('/app/padre/tareas')
  }

  useEffect(() => {
    const parentId = '2' // ID del padre actual (simulado)
    const parentData = parentService.getById(parentId)
    setParent(parentData || null)
    
    if (parentData) {
      const studentsData = studentService.getByParentId(parentId)
      setStudents(studentsData)
      
      const allGrades = studentsData.flatMap(s => gradeService.getByStudentId(s.id))
      setGrades(allGrades)
      
      const paymentsData = paymentService.getByParentId(parentId)
      setPayments(paymentsData)
      
      const ratingsData = teacherRatingService.getByTeacherId('3') // Simulado
      setRatings(ratingsData)
    }
    
    const userStats = getDashboardStats(parentId, 'padre')
    setStats(userStats)
  }, [])

  if (!stats || !parent) {
    return <div className="d-flex justify-content-center"><div className="spinner-border"></div></div>
  }

  const pendingPayments = payments.filter(p => p.status === 'pending')
  const overduePayments = payments.filter(p => p.status === 'overdue')

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h3 fw-semibold text-dark mb-1">Dashboard Padre de Familia</h1>
          <p className="text-muted">Información de tus hijos y pagos</p>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="row g-4 mb-4">
        <div className="col-6 col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Mis Hijos</h6>
                  <h3 className="mb-0">{students.length}</h3>
                </div>
                <i className="bi bi-people display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Pagos Pendientes</h6>
                  <h3 className="mb-0">{pendingPayments.length}</h3>
                </div>
                <i className="bi bi-credit-card display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card bg-danger text-white">
          <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Pagos Vencidos</h6>
                  <h3 className="mb-0">{overduePayments.length}</h3>
                </div>
                <i className="bi bi-exclamation-triangle display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Promedio General</h6>
                  <h3 className="mb-0">{stats.averageGrade.toFixed(1)}</h3>
                </div>
                <i className="bi bi-star display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Acciones rápidas - Lado derecho */}
        <div className="col-12 col-xl-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Acciones Rápidas</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={handleViewStudents}>
                  <i className="bi bi-people me-2"></i>
                  Ver Mis Hijos
                </button>
                <button className="btn btn-success" onClick={handleViewGrades}>
                  <i className="bi bi-star me-2"></i>
                  Ver Calificaciones
                </button>
                <button className="btn btn-warning" onClick={handleViewPayments}>
                  <i className="bi bi-credit-card me-2"></i>
                  Ver Pagos
                </button>
                <button className="btn btn-info" onClick={handleViewTasks}>
                  <i className="bi bi-journal-text me-2"></i>
                  Ver Tareas
                </button>
                <button className="btn btn-secondary" onClick={handleRateTeachers}>
                  <i className="bi bi-star-fill me-2"></i>
                  Calificar Docentes
                </button>
              </div>
            </div>
          </div>

          {/* Calificar docentes */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Calificar Docentes</h5>
            </div>
            <div className="card-body">
              <p className="text-muted small mb-3">Califica el desempeño de los docentes de tus hijos</p>
              
              {ratings.length > 0 ? (
                <div className="mb-3">
                  <h6>Calificaciones anteriores:</h6>
                  {ratings.map(rating => (
                    <div key={rating.id} className="border rounded p-2 mb-2">
                      <div className="d-flex justify-content-between">
                        <span>María Rodríguez</span>
                        <div>
                          {[...Array(5)].map((_, i) => (
                            <i key={`star-${rating.id}-${i}`} className={`bi bi-star${i < rating.rating ? '-fill text-warning' : ''}`}></i>
                          ))}
                        </div>
                      </div>
                      <small className="text-muted">{rating.review}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">No hay calificaciones registradas</p>
              )}
              
              <button className="btn btn-outline-primary btn-sm w-100" onClick={handleRateTeachers}>
                <i className="bi bi-star me-1"></i>
                Nueva Calificación
              </button>
            </div>
          </div>
        </div>

        {/* Contenido principal - Lado izquierdo */}
        <div className="col-12 col-xl-9">
          <div className="row g-4">
            {/* Información de estudiantes */}
            <div className="col-12 col-lg-6">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Mis Hijos</h5>
                  <button className="btn btn-sm btn-outline-primary" onClick={handleViewStudents}>
                    Ver todos
                  </button>
                </div>
                <div className="card-body">
                  {students.length === 0 ? (
                    <p className="text-muted text-center py-4">No hay estudiantes registrados</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {students.map(student => (
                        <div key={student.id} className="list-group-item">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{student.name}</h6>
                            <span className="badge bg-primary">{student.grade}</span>
                          </div>
                          <p className="mb-1 text-muted">{student.email}</p>
                          <small className="text-muted">
                            <i className="bi bi-book me-1"></i>
                            {student.classIds.length} clases inscritas
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pagos */}
            <div className="col-12 col-lg-6">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Estado de Pagos</h5>
                  <Link to="/app/padre/pagos" className="btn btn-sm btn-outline-primary">Ver todos</Link>
                </div>
                <div className="card-body">
                  {payments.length === 0 ? (
                    <p className="text-muted text-center py-4">No hay pagos registrados</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {payments.slice(0, 3).map(payment => (
                        <div key={payment.id} className="list-group-item">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{payment.description}</h6>
                            <span className={`badge ${
                              payment.status === 'paid' ? 'bg-success' :
                              payment.status === 'overdue' ? 'bg-danger' : 'bg-warning'
                            }`}>
                              {payment.status === 'paid' ? 'Pagado' :
                               payment.status === 'overdue' ? 'Vencido' : 'Pendiente'}
                            </span>
                          </div>
                          <p className="mb-1">
                            <strong>${payment.amount.toLocaleString()}</strong>
                          </p>
                          <small className="text-muted">
                            Vence: {new Date(payment.dueDate).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Notas de estudiantes */}
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Notas de Mis Hijos</h5>
                  <button className="btn btn-sm btn-outline-primary" onClick={handleViewGrades}>
                    Ver todas
                  </button>
                </div>
                <div className="card-body">
                  {grades.length === 0 ? (
                    <p className="text-muted text-center py-4">No hay notas registradas</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Estudiante</th>
                            <th>Materia</th>
                            <th>Tipo</th>
                            <th>Nota</th>
                            <th>Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grades.map(grade => {
                            const student = students.find(s => s.id === grade.studentId)
                            return (
                              <tr key={grade.id}>
                                <td>{student?.name || 'N/A'}</td>
                                <td>Matemáticas</td>
                                <td>
                                  <span className="badge bg-secondary">
                                    {grade.type === 'homework' ? 'Tarea' : 
                                     grade.type === 'exam' ? 'Examen' : 'Participación'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${grade.value >= 7 ? 'bg-success' : 'bg-warning'}`}>
                                    {grade.value}/{grade.maxValue}
                                  </span>
                                </td>
                                <td>{new Date(grade.createdAt).toLocaleDateString()}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Renderizar las rutas anidadas */}
      <Outlet />
    </div>
  )
}
