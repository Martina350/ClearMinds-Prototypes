import { useState, useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { userService, studentService, parentService, teacherService, classService, getDashboardStats } from '../../services/dataService'
import type { User, Student, Parent, Teacher, Class } from '../../types'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [parents, setParents] = useState<Parent[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<Class[]>([])

  const go = (path: string, label?: string) => {
    console.log('[AdminDashboard] click:', label || path)
    navigate(path)
  }

  const handleLogout = () => {
    userService.logout()
    navigate('/')
  }

  useEffect(() => {
    const adminId = '4' // ID del admin actual (simulado)
    
    const usersData = userService.getAll()
    setUsers(usersData)
    
    const studentsData = studentService.getAll()
    setStudents(studentsData)
    
    const parentsData = parentService.getAll()
    setParents(parentsData)
    
    const teachersData = teacherService.getAll()
    setTeachers(teachersData)
    
    const classesData = classService.getAll()
    setClasses(classesData)
    
    const userStats = getDashboardStats(adminId, 'admin')
    setStats(userStats)
  }, [])

  if (!stats) {
    return <div className="d-flex justify-content-center"><div className="spinner-border"></div></div>
  }

  const totalUsers = users.length
  const activeStudents = students.length
  const activeTeachers = teachers.length
  const totalClasses = classes.length

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h3 fw-semibold text-dark mb-1">Dashboard Administrador</h1>
          <p className="text-muted">Panel de control del sistema</p>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="row g-4 mb-4">
        <div className="col-6 col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Usuarios</h6>
                  <h3 className="mb-0">{totalUsers}</h3>
                </div>
                <i className="bi bi-people display-4 opacity-50"></i>
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
                  <h3 className="mb-0">{activeStudents}</h3>
                </div>
                <i className="bi bi-person-badge display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Docentes</h6>
                  <h3 className="mb-0">{activeTeachers}</h3>
                </div>
                <i className="bi bi-person-workspace display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Clases</h6>
                  <h3 className="mb-0">{totalClasses}</h3>
                </div>
                <i className="bi bi-book display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Acciones administrativas - Lado derecho */}
        <div className="col-12 col-xl-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Acciones Administrativas</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={() => go('/app/admin/usuarios', 'Crear Usuario (quick action)')}>
                  <i className="bi bi-person-plus me-2"></i>
                  Crear Usuario
                </button>
                <button className="btn btn-success" onClick={() => go('/app/admin/clases', 'Gestionar Clases (quick action)')}>
                  <i className="bi bi-book me-2"></i>
                  Gestionar Clases
                </button>
                <button className="btn btn-warning" onClick={() => go('/app/admin/matriculas', 'Matricular Estudiante (quick action)')}>
                  <i className="bi bi-person-check me-2"></i>
                  Matricular Estudiante
                </button>
                <button className="btn btn-info" onClick={() => go('/app/admin/usuarios', 'Gestionar Accesos (quick action)')}>
                  <i className="bi bi-key me-2"></i>
                  Gestionar Accesos
                </button>
                <button className="btn btn-secondary" onClick={() => go('/app/admin/reportes', 'Generar Reportes (quick action)')}>
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Generar Reportes
                </button>
                <button className="btn btn-dark" onClick={() => console.log('[AdminDashboard] Configuración del Sistema (no implementado)')}>
                  <i className="bi bi-gear me-2"></i>
                  Configuración del Sistema
                </button>
              </div>
            </div>
          </div>

          {/* Resumen por rol */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Resumen por Rol</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-person-badge text-primary me-2"></i>
                    Estudiantes
                  </div>
                  <span className="badge bg-primary rounded-pill">{activeStudents}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-people text-success me-2"></i>
                    Padres
                  </div>
                  <span className="badge bg-success rounded-pill">{parents.length}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-person-workspace text-warning me-2"></i>
                    Docentes
                  </div>
                  <span className="badge bg-warning rounded-pill">{activeTeachers}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-book text-info me-2"></i>
                    Clases
                  </div>
                  <span className="badge bg-info rounded-pill">{totalClasses}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal - Lado izquierdo */}
        <div className="col-12 col-xl-9">
          <div className="row g-4">
            {/* Gestión de usuarios */}
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Gestión de Usuarios</h5>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-primary" onClick={() => go('/app/admin/usuarios', 'Nuevo Usuario')}>
                      <i className="bi bi-plus me-1"></i>Nuevo Usuario
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => go('/app/admin/usuarios', 'Exportar Usuarios')}>
                      <i className="bi bi-download me-1"></i>Exportar
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={`user-${user.id}-${index}`}>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-person-circle me-2"></i>
                                {user.name}
                              </div>
                            </td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${
                                user.role === 'estudiante' ? 'bg-primary' :
                                user.role === 'padre' ? 'bg-success' :
                                user.role === 'docente' ? 'bg-warning' :
                                user.role === 'admin' ? 'bg-danger' : 'bg-info'
                              }`}>
                                {user.role === 'estudiante' ? 'Estudiante' :
                                 user.role === 'padre' ? 'Padre' :
                                 user.role === 'docente' ? 'Docente' :
                                 user.role === 'admin' ? 'Admin' : 'Finanzas'}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-success">Activo</span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary" title="Editar" onClick={() => go('/app/admin/usuarios', 'Editar Usuario desde dashboard')}>
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-outline-danger" title="Eliminar" onClick={() => console.log('[AdminDashboard] Eliminar Usuario desde dashboard (navega a usuarios)')}>
                                  <i className="bi bi-trash"></i>
                                </button>
                                <button className="btn btn-outline-info" title="Ver detalles" onClick={() => go('/app/admin/usuarios', 'Ver detalles Usuario desde dashboard')}>
                                  <i className="bi bi-eye"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Clases activas */}
            <div className="col-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Clases Activas</h5>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => go('/app/admin/clases', 'Gestionar Clases')}>
                    Gestionar
                  </button>
                </div>
                <div className="card-body">
                  {classes.length === 0 ? (
                    <p className="text-muted text-center py-4">No hay clases registradas</p>
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
          </div>
        </div>
      </div>
      
      {/* Renderizar las rutas anidadas */}
      <Outlet />
    </div>
  )
}
