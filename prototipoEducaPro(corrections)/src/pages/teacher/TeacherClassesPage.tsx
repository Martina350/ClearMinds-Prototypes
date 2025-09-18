import { useEffect, useState } from 'react'
import { classService, teacherService, studentService } from '../../services/dataService'
import type { Class, Teacher, Student } from '../../types'

export function TeacherClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    const teacherId = '52' // ID del docente actual (simulado)
    const teacherData = teacherService.getById(teacherId)
    setTeacher(teacherData || null)
    
    if (teacherData) {
      const classesData = classService.getByTeacherId(teacherId)
      setClasses(classesData)
      
      // Obtener todos los estudiantes de las clases
      const allStudentIds = classesData.flatMap(c => c.studentIds)
      const uniqueStudentIds = [...new Set(allStudentIds)]
      const studentsData = uniqueStudentIds.map(id => studentService.getById(id)).filter(Boolean) as Student[]
      setStudents(studentsData)
    }
  }, [])

  // const getStudentsInClass = (classId: string) => {
  //   const classData = classes.find(c => c.id === classId)
  //   return classData ? classData.studentIds.length : 0
  // }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Mis Clases</h2>
        <button className="btn btn-primary">
          <i className="bi bi-plus me-2"></i>
          Nueva Clase
        </button>
      </div>

      {classes.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-book display-1 text-muted"></i>
          <h4 className="mt-3">No tienes clases asignadas</h4>
          <p className="text-muted">Contacta al administrador para asignar clases</p>
        </div>
      ) : (
        <div className="row g-4">
          {classes.map(cls => (
            <div key={cls.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title">{cls.name}</h5>
                    <span className="badge bg-primary">{cls.studentIds.length} estudiantes</span>
                  </div>
                  
                  <p className="text-muted mb-3">{cls.subject}</p>
                  
                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="bi bi-calendar me-1"></i>
                      {cls.schedule}
                    </small>
                    <br />
                    <small className="text-muted">
                      <i className="bi bi-geo-alt me-1"></i>
                      {cls.room}
                    </small>
                  </div>

                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-people me-2"></i>
                      Ver Estudiantes
                    </button>
                    <button className="btn btn-outline-success btn-sm">
                      <i className="bi bi-journal-plus me-2"></i>
                      Crear Tarea
                    </button>
                    <button className="btn btn-outline-warning btn-sm">
                      <i className="bi bi-calendar-check me-2"></i>
                      Tomar Asistencia
                    </button>
                    <button className="btn btn-outline-info btn-sm">
                      <i className="bi bi-star me-2"></i>
                      Calificar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen de clases */}
      {classes.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h6>Total Clases</h6>
                <h3>{classes.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h6>Total Estudiantes</h6>
                <h3>{students.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <h6>Materia</h6>
                <h6>{teacher?.subject || 'N/A'}</h6>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
