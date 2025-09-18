import { useState, useEffect } from 'react'
import { useNavigate, Outlet, Link } from 'react-router-dom'
import { teacherService, classService, taskService, studentService, getDashboardStats, userService } from '../../services/dataService'
import type { Teacher, Class, Task, Student } from '../../types'

export function TeacherDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = () => {
    userService.logout()
    navigate('/')
  }

  const handleNewTask = () => {
    navigate('/app/docente/tareas')
  }

  const handleTakeAttendance = () => {
    navigate('/app/docente/asistencia')
  }

  const handleGradeWork = () => {
    navigate('/app/docente/calificaciones')
  }

  const handleSendNotification = () => {
    navigate('/app/notificaciones')
  }

  const handleVirtualMonitoring = () => {
    navigate('/app/docente/monitoreo')
  }

  const handleViewStudent = () => {
    navigate(`/app/docente/estudiantes`)
  }

  const handleGradeStudent = () => {
    navigate('/app/docente/calificaciones')
  }

  const handleTakeStudentAttendance = () => {
    navigate('/app/docente/asistencia')
  }

  useEffect(() => {
    console.log('[TeacherDashboard] useEffect iniciado')
    const teacherId = '3' // ID del docente actual (simulado)
    console.log('[TeacherDashboard] buscando docente con ID:', teacherId)
    
    try {
      const teacherData = teacherService.getById(teacherId)
      console.log('[TeacherDashboard] docente encontrado:', teacherData)
      
      if (teacherData) {
        console.log('[TeacherDashboard] cargando datos del docente...')
        const classesData = classService.getByTeacherId(teacherId)
        console.log('[TeacherDashboard] clases del docente:', classesData.length)
        setClasses(classesData)
        
        const tasksData = classesData.flatMap(c => taskService.getByClassId(c.id))
        console.log('[TeacherDashboard] tareas encontradas:', tasksData.length)
        setTasks(tasksData)
        
        const studentsData = classesData.flatMap(c => 
          c.studentIds.map(id => studentService.getById(id)).filter(Boolean) as Student[]
        )
        console.log('[TeacherDashboard] estudiantes encontrados:', studentsData.length)
        setStudents(studentsData)
        
        setTeacher(teacherData)
      } else {
        console.log('[TeacherDashboard] ERROR: No se encontró el docente con ID:', teacherId)
        // Intentar con el primer docente disponible
        const allTeachers = teacherService.getAll()
        console.log('[TeacherDashboard] docentes disponibles:', allTeachers.length)
        if (allTeachers.length > 0) {
          const firstTeacher = allTeachers[0]
          console.log('[TeacherDashboard] usando primer docente disponible:', firstTeacher.id)
          setTeacher(firstTeacher)
          
          const classesData = classService.getByTeacherId(firstTeacher.id)
          setClasses(classesData)
          
          const tasksData = classesData.flatMap(c => taskService.getByClassId(c.id))
          setTasks(tasksData)
          
          const studentsData = classesData.flatMap(c => 
            c.studentIds.map(id => studentService.getById(id)).filter(Boolean) as Student[]
          )
          setStudents(studentsData)
        } else {
          setError('No se encontraron docentes en el sistema')
        }
      }
      
      const userStats = getDashboardStats(teacherId, 'docente')
      console.log('[TeacherDashboard] estadísticas:', userStats)
      setStats(userStats)
      setLoading(false)
    } catch (err) {
      console.error('[TeacherDashboard] Error cargando datos:', err)
      setError('Error cargando datos del docente')
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border mb-3"></div>
          <p>Cargando datos del docente...</p>
          <small className="text-muted">Si esto tarda mucho, verifica la consola para errores</small>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="alert alert-danger">
            <h5>Error cargando datos</h5>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!stats || !teacher) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="alert alert-warning">
            <h5>No se encontraron datos</h5>
            <p>No se pudieron cargar los datos del docente</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totalStudents = students.length
  const pendingTasks = tasks.filter(t => new Date(t.dueDate) > new Date()).length
  // const completedTasks = tasks.filter(t => new Date(t.dueDate) <= new Date()).length

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">Dashboard Docente</h1>
              <p className="text-muted">Panel de control para docentes</p>
            </div>
            <button 
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="row g-4 mb-4">
        <div className="col-6 col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Mis Clases</h6>
                  <h3 className="mb-0">{classes.length}</h3>
                </div>
                <i className="bi bi-book display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Estudiantes</h6>
                  <h3 className="mb-0">{totalStudents}</h3>
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
                  <h6 className="card-title">Tareas Activas</h6>
                  <h3 className="mb-0">{pendingTasks}</h3>
                </div>
                <i className="bi bi-journal-text display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Materia</h6>
                  <h6 className="mb-0">{teacher.subject}</h6>
                </div>
                <i className="bi bi-mortarboard display-4 opacity-50"></i>
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
                <button className="btn btn-primary" onClick={handleNewTask}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Nueva Tarea
                </button>
                <button className="btn btn-success" onClick={handleTakeAttendance}>
                  <i className="bi bi-calendar-check me-2"></i>
                  Tomar Asistencia
                </button>
                <button className="btn btn-warning" onClick={handleGradeWork}>
                  <i className="bi bi-star me-2"></i>
                  Calificar Trabajos
                </button>
                <button className="btn btn-info" onClick={handleSendNotification}>
                  <i className="bi bi-bell me-2"></i>
                  Enviar Notificación
                </button>
                <button className="btn btn-secondary" onClick={handleVirtualMonitoring}>
                  <i className="bi bi-eye me-2"></i>
                  Monitoreo Virtual
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal - Lado izquierdo */}
        <div className="col-12 col-xl-9">
          <div className="row g-4">
            {/* Mis clases */}
            <div className="col-12 col-lg-6">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Mis Clases</h5>
                  <Link to="/app/docente/clases" className="btn btn-sm btn-outline-primary">Gestionar</Link>
                </div>
                <div className="card-body">
                  {classes.length === 0 ? (
                    <p className="text-muted text-center py-4">No tienes clases asignadas</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {classes.map(cls => (
                        <div key={cls.id} className="list-group-item">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{cls.name}</h6>
                            <span className="badge bg-primary">{cls.studentIds.length} estudiantes</span>
                          </div>
                          <p className="mb-1 text-muted">{cls.subject}</p>
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {cls.schedule} - {cls.room}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tareas recientes */}
            <div className="col-12 col-lg-6">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Tareas Recientes</h5>
                  <Link to="/app/docente/tareas" className="btn btn-sm btn-outline-primary">Ver todas</Link>
                </div>
                <div className="card-body">
                  {tasks.length === 0 ? (
                    <p className="text-muted text-center py-4">No hay tareas creadas</p>
                  ) : (
                    <div className="list-group list-group-flush">
                      {tasks.slice(0, 4).map(task => (
                        <div key={task.id} className="list-group-item">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{task.title}</h6>
                            <span className={`badge ${
                              new Date(task.dueDate) > new Date() ? 'bg-warning' : 'bg-success'
                            }`}>
                              {new Date(task.dueDate) > new Date() ? 'Activa' : 'Completada'}
                            </span>
                          </div>
                          <p className="mb-1 text-muted small">{task.description}</p>
                          <small className="text-muted">
                            Vence: {new Date(task.dueDate).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Estudiantes */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Mis Estudiantes</h5>
                </div>
                <div className="card-body">
                  {students.length === 0 ? (
                    <p className="text-muted text-center py-4">No hay estudiantes asignados</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Grado</th>
                            <th>Clases</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map(student => (
                            <tr key={student.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-person-circle me-2"></i>
                                  {student.name}
                                </div>
                              </td>
                              <td>{student.grade}</td>
                              <td>
                                <span className="badge bg-secondary">
                                  {student.classIds.length} clases
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-success">Activo</span>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-outline-primary" 
                                title="Ver perfil"
                                onClick={() => handleViewStudent()}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button 
                                className="btn btn-outline-success" 
                                title="Calificar"
                                onClick={() => handleGradeStudent()}
                              >
                                <i className="bi bi-star"></i>
                              </button>
                              <button 
                                className="btn btn-outline-info" 
                                title="Tomar asistencia"
                                onClick={() => handleTakeStudentAttendance()}
                              >
                                <i className="bi bi-calendar-check"></i>
                              </button>
                                </div>
                              </td>
                            </tr>
                          ))}
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
