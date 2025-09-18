import { useState, useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { teacherService, classService, taskService, studentService, getDashboardStats } from '../../services/dataService'
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

  // Funciones de navegación para las tarjetas de métricas
  const handleViewAllStudents = () => {
    navigate('/app/docente/estudiantes')
  }

  const handleTakeTodayAttendance = () => {
    navigate('/app/docente/asistencia')
  }

  const handleUpdateGrades = () => {
    navigate('/app/docente/calificaciones')
  }

  const handleReviewSubmissions = () => {
    navigate('/app/docente/tareas')
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
    <div style={{
      padding: 'var(--space-6)',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header con saludo personalizado */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-6)'
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
              margin: 0
            }}>
              ¡Hola, Prof. {teacher.name.split(' ')[0]}!
            </h1>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-base)',
              margin: 0
            }}>
              Aquí tienes un resumen de tu día de enseñanza.
            </p>
          </div>
        </div>
      </div>


      {/* Tarjetas de métricas principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)'
      }}>
        {/* Lista de Estudiantes */}
        <div className="card" style={{
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-4)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'var(--color-info-50)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-people" style={{
                  fontSize: 'var(--font-size-2xl)',
                  color: 'var(--color-info)'
                }}></i>
              </div>
                <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-1)'
                }}>
                  Lista de Estudiantes
                </div>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)'
                }}>
                  {totalStudents}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)'
                }}>
                  total en {classes.length} clases
                </div>
              </div>
            </div>
            <button 
              onClick={handleViewAllStudents}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Ver Todos
            </button>
          </div>
        </div>
        
        {/* Asistencia */}
        <div className="card" style={{
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-4)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'var(--color-warning-50)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-calendar-check" style={{
                  fontSize: 'var(--font-size-2xl)',
                  color: 'var(--color-warning)'
                }}></i>
              </div>
                <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-1)'
                }}>
                  Asistencia
                </div>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)'
                }}>
                  98.2%
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)'
                }}>
                  promedio esta semana
                </div>
              </div>
            </div>
            <button 
              onClick={handleTakeTodayAttendance}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Tomar Hoy
            </button>
          </div>
        </div>
        
        {/* Calificaciones */}
        <div className="card" style={{
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-4)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'var(--color-success-50)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-list-check" style={{
                  fontSize: 'var(--font-size-2xl)',
                  color: 'var(--color-success)'
                }}></i>
              </div>
                <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-1)'
                }}>
                  Calificaciones
                </div>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)'
                }}>
                  B+
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)'
                }}>
                  rendimiento promedio
                </div>
              </div>
            </div>
            <button 
              onClick={handleUpdateGrades}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Actualizar Calificaciones
            </button>
          </div>
        </div>
        
        {/* Entregas */}
        <div className="card" style={{
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-4)'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'var(--color-danger-50)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="bi bi-file-earmark-check" style={{
                  fontSize: 'var(--font-size-2xl)',
                  color: 'var(--color-danger)'
                }}></i>
              </div>
                <div>
                <div style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-1)'
                }}>
                  Entregas
                </div>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)'
                }}>
                  {pendingTasks}/{totalStudents}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)'
                }}>
                  entregas esperando revisión
                </div>
              </div>
            </div>
            <button 
              onClick={handleReviewSubmissions}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Revisar Ahora
            </button>
          </div>
        </div>
      </div>

      {/* Secciones inferiores - Actividad Reciente y Fechas Límite */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-6)'
      }}>
        {/* Actividad Reciente - Columna Izquierda */}
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
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)'
            }}>
              Actividad Reciente
            </h5>
            </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Actividad 1 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-success-50)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="bi bi-check-circle" style={{
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-success)'
                  }}></i>
              </div>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    Matemáticas 101 - Tarea 3 calificada
            </div>
                  <small style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    hace 15 minutos
                  </small>
          </div>
        </div>

              {/* Actividad 2 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-warning-50)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="bi bi-bell" style={{
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-warning)'
                  }}></i>
                </div>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    Física 202 - Fecha límite mañana
                          </div>
                  <small style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    hace 1 hora
                          </small>
              </div>
            </div>

              {/* Actividad 3 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-info-50)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="bi bi-envelope" style={{
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-info)'
                  }}></i>
                </div>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    Nuevo mensaje de Juan Pérez
                          </div>
                  <small style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    hace 3 horas
                          </small>
                        </div>
                    </div>
                </div>
              </div>
            </div>

        {/* Fechas Límite Próximas - Columna Derecha */}
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
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)'
            }}>
              Fechas Límite Próximas
            </h5>
          </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Fecha límite 1 */}
              <div style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    Reporte de Laboratorio de Química
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    Vence: 25 Oct, 11:59 PM
                  </div>
                </div>
                <span style={{
                  padding: 'var(--space-1) var(--space-2)',
                  backgroundColor: 'var(--color-danger)',
                  color: 'var(--color-text-inverse)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  2 Días
                </span>
              </div>

              {/* Fecha límite 2 */}
              <div style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    Ensayo de Historia
                  </div>
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    Vence: 28 Oct, 11:59 PM
                  </div>
                                </div>
                <span style={{
                  padding: 'var(--space-1) var(--space-2)',
                  backgroundColor: 'var(--color-warning)',
                  color: 'var(--color-text-inverse)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  5 Días
                                </span>
              </div>

              {/* Fecha límite 3 */}
              <div style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    Examen Parcial de Cálculo
                                </div>
                  <div style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    Vence: 30 Oct, 9:00 AM
                    </div>
                </div>
                <span style={{
                  padding: 'var(--space-1) var(--space-2)',
                  backgroundColor: 'var(--color-success)',
                  color: 'var(--color-text-inverse)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)'
                }}>
                  7 Días
                </span>
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
