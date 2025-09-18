import { useEffect, useState } from 'react'
import { classService, teacherService, studentService } from '../../services/dataService'
import type { Class, Student } from '../../types'

export function TeacherAttendancePage() {
  const [classes, setClasses] = useState<Class[]>([])
  // const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0])

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
        
        // Inicializar asistencia como presente por defecto
        const initialAttendance: Record<string, boolean> = {}
        studentsData.forEach(student => {
          initialAttendance[student.id] = true
        })
        setAttendance(initialAttendance)
      }
    }
  }, [selectedClass, classes])

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: present
    }))
  }

  const handleSubmitAttendance = () => {
    const presentCount = Object.values(attendance).filter(Boolean).length
    const absentCount = students.length - presentCount
    
    alert(`Asistencia registrada:\nPresentes: ${presentCount}\nAusentes: ${absentCount}`)
    
    // Aquí se guardaría la asistencia en el backend
    console.log('Asistencia registrada:', {
      classId: selectedClass,
      date: attendanceDate,
      attendance
    })
  }

  const getClassName = (classId: string) => {
    const classData = classes.find(c => c.id === classId)
    return classData?.name || 'Clase no encontrada'
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Tomar Asistencia</h2>
        <div className="d-flex gap-2">
          <input 
            type="date"
            className="form-control"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>
      </div>

      {/* Selector de clase */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Seleccionar Clase</label>
          <select 
            className="form-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Selecciona una clase</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name} - {cls.subject}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Información de la Clase</label>
          {selectedClass && (
            <div className="p-3 bg-light rounded">
              <p className="mb-1"><strong>Clase:</strong> {getClassName(selectedClass)}</p>
              <p className="mb-0"><strong>Estudiantes:</strong> {students.length}</p>
            </div>
          )}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-calendar-check display-1 text-muted"></i>
          <h4 className="mt-3">Selecciona una clase</h4>
          <p className="text-muted">Elige una clase para tomar la asistencia</p>
        </div>
      ) : (
        <>
          {/* Lista de estudiantes */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Lista de Asistencia - {getClassName(selectedClass)}</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Grado</th>
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
                          <span className={`badge ${attendance[student.id] ? 'bg-success' : 'bg-danger'}`}>
                            {attendance[student.id] ? 'Presente' : 'Ausente'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className={`btn ${attendance[student.id] ? 'btn-success' : 'btn-outline-success'}`}
                              onClick={() => handleAttendanceChange(student.id, true)}
                            >
                              <i className="bi bi-check-circle"></i>
                            </button>
                            <button 
                              className={`btn ${!attendance[student.id] ? 'btn-danger' : 'btn-outline-danger'}`}
                              onClick={() => handleAttendanceChange(student.id, false)}
                            >
                              <i className="bi bi-x-circle"></i>
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

          {/* Resumen y acciones */}
          <div className="row mt-4">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">Resumen de Asistencia</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between">
                        <span>Presentes:</span>
                        <span className="badge bg-success">{Object.values(attendance).filter(Boolean).length}</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex justify-content-between">
                        <span>Ausentes:</span>
                        <span className="badge bg-danger">{students.length - Object.values(attendance).filter(Boolean).length}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between">
                      <span>Porcentaje de Asistencia:</span>
                      <span className="badge bg-primary">
                        {((Object.values(attendance).filter(Boolean).length / students.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">Acciones</h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-success"
                      onClick={handleSubmitAttendance}
                    >
                      <i className="bi bi-check me-2"></i>
                      Guardar Asistencia
                    </button>
                    <button className="btn btn-outline-primary">
                      <i className="bi bi-download me-2"></i>
                      Exportar Lista
                    </button>
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
