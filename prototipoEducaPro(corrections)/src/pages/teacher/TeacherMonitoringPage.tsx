import { useEffect, useState } from 'react'
import { classService, teacherService, studentService } from '../../services/dataService'
import type { Class, Student } from '../../types'

export function TeacherMonitoringPage() {
  const [classes, setClasses] = useState<Class[]>([])
  // const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [students, setStudents] = useState<Student[]>([])
  const [monitoringData, setMonitoringData] = useState<Record<string, any>>({})

  useEffect(() => {
    const teacherId = '52' // ID del docente actual (simulado)
    const teacherData = teacherService.getById(teacherId)
    // setTeacher(teacherData || null)
    
    if (teacherData) {
      const classesData = classService.getByTeacherId(teacherId)
      setClasses(classesData)
      
      if (classesData.length > 0) {
        setSelectedClass(classesData[0].id)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedClass) {
      const classData = classes.find(c => c.id === selectedClass)
      if (classData) {
        const studentsData = classData.studentIds.map(id => studentService.getById(id)).filter(Boolean) as Student[]
        setStudents(studentsData)
        
        // Simular datos de monitoreo
        const mockMonitoringData: Record<string, any> = {}
        studentsData.forEach(student => {
          mockMonitoringData[student.id] = {
            onlineTime: Math.floor(Math.random() * 480) + 60, // 1-8 horas
            lastActivity: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
            participation: Math.floor(Math.random() * 100),
            assignmentsCompleted: Math.floor(Math.random() * 10),
            currentStatus: Math.random() > 0.3 ? 'online' : 'offline'
          }
        })
        setMonitoringData(mockMonitoringData)
      }
    }
  }, [selectedClass, classes])

  const getClassName = (classId: string) => {
    const classData = classes.find(c => c.id === classId)
    return classData?.name || 'Clase no encontrada'
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Monitoreo Virtual</h2>
        <select 
          className="form-select"
          style={{ width: 'auto' }}
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-eye display-1 text-muted"></i>
          <h4 className="mt-3">Selecciona una clase</h4>
          <p className="text-muted">Elige una clase para ver el monitoreo de estudiantes</p>
        </div>
      ) : (
        <>
          {/* Lista de estudiantes con monitoreo */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Monitoreo de {getClassName(selectedClass)}</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Estado</th>
                      <th>Tiempo Online</th>
                      <th>Última Actividad</th>
                      <th>Participación</th>
                      <th>Tareas Completadas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => {
                      const data = monitoringData[student.id]
                      if (!data) return null
                      
                      return (
                        <tr key={student.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-person-circle me-2"></i>
                              {student.name}
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${data.currentStatus === 'online' ? 'bg-success' : 'bg-secondary'}`}>
                              {data.currentStatus === 'online' ? 'Online' : 'Offline'}
                            </span>
                          </td>
                          <td>{formatTime(data.onlineTime)}</td>
                          <td>{data.lastActivity}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
                                <div 
                                  className={`progress-bar ${data.participation >= 70 ? 'bg-success' : data.participation >= 40 ? 'bg-warning' : 'bg-danger'}`}
                                  style={{ width: `${data.participation}%` }}
                                ></div>
                              </div>
                              <small>{data.participation}%</small>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-info">{data.assignmentsCompleted}/10</span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary" title="Ver detalles">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-outline-success" title="Enviar mensaje">
                                <i className="bi bi-chat"></i>
                              </button>
                              <button className="btn btn-outline-warning" title="Dar aviso">
                                <i className="bi bi-bell"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Gráfico de actividad (simulado) */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">Actividad en Tiempo Real</h6>
                </div>
                <div className="card-body">
                  <div className="text-center py-5">
                    <i className="bi bi-graph-up display-1 text-muted"></i>
                    <h5 className="mt-3">Gráfico de Actividad</h5>
                    <p className="text-muted">Aquí se mostraría un gráfico en tiempo real de la actividad de los estudiantes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
