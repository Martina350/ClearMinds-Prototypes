import { useEffect, useState } from 'react'
import { studentService, classService, teacherService, initializeData } from '../../services/dataService'
import type { Student, Class } from '../../types'

export function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  // const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalityFilter, setModalityFilter] = useState<string>('')

  useEffect(() => {
    try {
      setLoading(true)
      setError(null)
      
      // Asegurar que los datos estén inicializados
      initializeData()
      
      const teacherId = '52' // ID del docente actual (simulado)
      const teacherData = teacherService.getById(teacherId)
      
      if (teacherData) {
        const classesData = classService.getByTeacherId(teacherId)
        setClasses(classesData || [])
        
        // Obtener todos los estudiantes de las clases
        const allStudentIds = classesData?.flatMap(c => c.studentIds || []) || []
        const uniqueStudentIds = [...new Set(allStudentIds)]
        const studentsData = uniqueStudentIds
          .map(id => studentService.getById(id))
          .filter(Boolean) as Student[]
        
        // Asegurar que todos los estudiantes tengan modalidad y teléfono
        const studentsWithModality = studentsData.map(student => ({
          ...student,
          modality: student.modality || 'presencial',
          phone: student.phone || `+57${Math.floor(Math.random() * 9000000000) + 1000000000}`
        }))
        
        setStudents(studentsWithModality)
        
        // Establecer la primera clase como seleccionada por defecto
        if (classesData && classesData.length > 0) {
          setSelectedClass(classesData[0].id)
        }
      } else {
        setError('No se encontró información del docente')
      }
    } catch (error) {
      console.error('Error al cargar datos del docente:', error)
      setError('Error al cargar los datos. Por favor, recarga la página.')
      setStudents([])
      setClasses([])
    } finally {
      setLoading(false)
    }
  }, [])

  const getStudentsInClass = (classId: string) => {
    const classData = classes.find(c => c.id === classId)
    if (!classData) return []
    
    const studentsInClass = (classData.studentIds || [])
      .map(id => studentService.getById(id))
      .filter(Boolean) as Student[]
    
    // Asegurar que todos los estudiantes tengan modalidad y teléfono
    return studentsInClass.map(student => ({
      ...student,
      modality: student.modality || 'presencial',
      phone: student.phone || `+57${Math.floor(Math.random() * 9000000000) + 1000000000}`
    }))
  }

  const [showStudentModal, setShowStudentModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showGradeModal, setShowGradeModal] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [gradeValue, setGradeValue] = useState<number>(0)
  const [gradeType, setGradeType] = useState<string>('homework')
  const [attendanceStatus, setAttendanceStatus] = useState<string>('present')
  const [messageSubject, setMessageSubject] = useState<string>('')
  const [messageText, setMessageText] = useState<string>('')

  const filteredStudents = (() => {
    let filtered = selectedClass ? getStudentsInClass(selectedClass) : students
    
    if (modalityFilter) {
      filtered = filtered.filter(student => student.modality === modalityFilter)
    }
    
    return filtered
  })()

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student)
    setShowStudentModal(true)
  }

  const handleGradeStudent = (student: Student) => {
    setSelectedStudent(student)
    setShowGradeModal(true)
  }

  const handleTakeAttendance = (student: Student) => {
    setSelectedStudent(student)
    setShowAttendanceModal(true)
  }

  const handleSendMessage = (student: Student) => {
    setSelectedStudent(student)
    setShowMessageModal(true)
  }

  const handleCloseStudentModal = () => {
    setShowStudentModal(false)
    setSelectedStudent(null)
  }

  const handleCloseGradeModal = () => {
    setShowGradeModal(false)
    setSelectedStudent(null)
    setGradeValue(0)
    setGradeType('homework')
  }

  const handleCloseAttendanceModal = () => {
    setShowAttendanceModal(false)
    setSelectedStudent(null)
    setAttendanceStatus('present')
  }

  const handleCloseMessageModal = () => {
    setShowMessageModal(false)
    setSelectedStudent(null)
    setMessageSubject('')
    setMessageText('')
  }

  const handleSubmitGrade = () => {
    if (selectedStudent && gradeValue > 0) {
      alert(`Calificación ${gradeValue}/10 registrada para ${selectedStudent.name} (${gradeType})`)
      handleCloseGradeModal()
    } else {
      alert('Por favor ingresa una calificación válida')
    }
  }

  const handleSubmitAttendance = () => {
    if (selectedStudent) {
      const statusText = attendanceStatus === 'present' ? 'Presente' : 
                       attendanceStatus === 'late' ? 'Tarde' : 'Ausente'
      alert(`Asistencia registrada para ${selectedStudent.name}: ${statusText}`)
      handleCloseAttendanceModal()
    }
  }

  const handleSendStudentMessage = () => {
    if (selectedStudent && messageSubject && messageText) {
      alert(`Mensaje enviado a ${selectedStudent.name}:\nAsunto: ${messageSubject}\nMensaje: ${messageText}`)
      handleCloseMessageModal()
    } else {
      alert('Por favor completa todos los campos del mensaje')
    }
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="page-container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3">Cargando estudiantes...</p>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-outline-danger" 
            onClick={() => window.location.reload()}
          >
            Recargar página
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Mis Estudiantes</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            style={{ width: 'auto' }}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Todas las clases</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          <select 
            className="form-select"
            style={{ width: 'auto' }}
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
          >
            <option value="">Todas las modalidades</option>
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
            <option value="in-home">In-home</option>
          </select>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-people display-1 text-muted"></i>
          <h4 className="mt-3">No hay estudiantes</h4>
          <p className="text-muted">Los estudiantes aparecerán aquí cuando se asignen a tus clases</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              Estudiantes {selectedClass ? `de ${classes.find(c => c.id === selectedClass)?.name}` : ''}
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Grado</th>
                    <th>Email</th>
                    <th>Modalidad</th>
                    <th>Clases</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person-circle me-2"></i>
                          {student.name}
                        </div>
                      </td>
                      <td>{student.grade}</td>
                      <td>{student.email}</td>
                      <td>
                        <span className={`badge ${
                          student.modality === 'presencial' ? 'bg-primary' :
                          student.modality === 'virtual' ? 'bg-success' :
                          'bg-warning'
                        }`}>
                          <i className={`bi ${
                            student.modality === 'presencial' ? 'bi-building' :
                            student.modality === 'virtual' ? 'bi-camera-video' :
                            'bi-house'
                          } me-1`}></i>
                          {student.modality === 'presencial' ? 'Presencial' :
                           student.modality === 'virtual' ? 'Virtual' :
                           'In-home'}
                        </span>
                      </td>
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
                            onClick={() => handleViewProfile(student)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button 
                            className="btn btn-outline-success" 
                            title="Calificar"
                            onClick={() => handleGradeStudent(student)}
                          >
                            <i className="bi bi-star"></i>
                          </button>
                          <button 
                            className="btn btn-outline-warning" 
                            title="Tomar asistencia"
                            onClick={() => handleTakeAttendance(student)}
                          >
                            <i className="bi bi-calendar-check"></i>
                          </button>
                          <button 
                            className="btn btn-outline-info" 
                            title="Enviar mensaje"
                            onClick={() => handleSendMessage(student)}
                          >
                            <i className="bi bi-chat"></i>
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
      )}

      {/* Modal para ver perfil del estudiante */}
      {showStudentModal && selectedStudent && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Perfil del Estudiante</h5>
                <button type="button" className="btn-close" onClick={handleCloseStudentModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <i className="bi bi-person-circle display-1 text-primary"></i>
                    <h4 className="mt-3">{selectedStudent.name}</h4>
                    <p className="text-muted">{selectedStudent.email}</p>
                  </div>
                  <div className="col-md-8">
                    <h6>Información Académica</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Grado:</span>
                        <span className="badge bg-primary">{selectedStudent.grade}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Modalidad:</span>
                        <span className={`badge ${
                          selectedStudent.modality === 'presencial' ? 'bg-primary' :
                          selectedStudent.modality === 'virtual' ? 'bg-success' :
                          'bg-warning'
                        }`}>
                          <i className={`bi ${
                            selectedStudent.modality === 'presencial' ? 'bi-building' :
                            selectedStudent.modality === 'virtual' ? 'bi-camera-video' :
                            'bi-house'
                          } me-1`}></i>
                          {selectedStudent.modality === 'presencial' ? 'Presencial' :
                           selectedStudent.modality === 'virtual' ? 'Virtual' :
                           'In-home'}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Estado:</span>
                        <span className={`badge ${selectedStudent.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                          {selectedStudent.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Clases:</span>
                        <span>{selectedStudent.classIds.length}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de registro:</span>
                        <span>{new Date(selectedStudent.createdAt).toLocaleDateString()}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseStudentModal}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={() => {
                  handleCloseStudentModal()
                  handleGradeStudent(selectedStudent)
                }}>
                  Calificar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para calificar estudiante */}
      {showGradeModal && selectedStudent && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Calificar Estudiante</h5>
                <button type="button" className="btn-close" onClick={handleCloseGradeModal}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Estudiante:</strong> {selectedStudent.name}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Tipo de Evaluación</label>
                  <select 
                    className="form-select"
                    value={gradeType}
                    onChange={(e) => setGradeType(e.target.value)}
                  >
                    <option value="homework">Tarea</option>
                    <option value="exam">Examen</option>
                    <option value="project">Proyecto</option>
                    <option value="participation">Participación</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Nota</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="0-10" 
                    min="0" 
                    max="10" 
                    value={gradeValue}
                    onChange={(e) => setGradeValue(Number(e.target.value))}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Comentarios</label>
                  <textarea className="form-control" rows={3} placeholder="Observaciones sobre la calificación..."></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseGradeModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-success" onClick={handleSubmitGrade}>
                  <i className="bi bi-star me-2"></i>
                  Guardar Calificación
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para tomar asistencia */}
      {showAttendanceModal && selectedStudent && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Tomar Asistencia</h5>
                <button type="button" className="btn-close" onClick={handleCloseAttendanceModal}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Estudiante:</strong> {selectedStudent.name}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Fecha</label>
                  <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Estado de Asistencia</label>
                  <div className="btn-group w-100" role="group">
                    <input 
                      type="radio" 
                      className="btn-check" 
                      name="attendance" 
                      id="present" 
                      value="present"
                      checked={attendanceStatus === 'present'}
                      onChange={(e) => setAttendanceStatus(e.target.value)}
                    />
                    <label className="btn btn-outline-success" htmlFor="present">Presente</label>
                    
                    <input 
                      type="radio" 
                      className="btn-check" 
                      name="attendance" 
                      id="late" 
                      value="late"
                      checked={attendanceStatus === 'late'}
                      onChange={(e) => setAttendanceStatus(e.target.value)}
                    />
                    <label className="btn btn-outline-warning" htmlFor="late">Tarde</label>
                    
                    <input 
                      type="radio" 
                      className="btn-check" 
                      name="attendance" 
                      id="absent" 
                      value="absent"
                      checked={attendanceStatus === 'absent'}
                      onChange={(e) => setAttendanceStatus(e.target.value)}
                    />
                    <label className="btn btn-outline-danger" htmlFor="absent">Ausente</label>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Observaciones</label>
                  <textarea className="form-control" rows={2} placeholder="Notas adicionales..."></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseAttendanceModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSubmitAttendance}>
                  <i className="bi bi-check me-2"></i>
                  Registrar Asistencia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para enviar mensaje */}
      {showMessageModal && selectedStudent && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enviar Mensaje</h5>
                <button type="button" className="btn-close" onClick={handleCloseMessageModal}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Para:</strong> {selectedStudent.name}
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Asunto</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Asunto del mensaje..." 
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea 
                    className="form-control" 
                    rows={4} 
                    placeholder="Escribe tu mensaje aquí..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="urgent" />
                  <label className="form-check-label" htmlFor="urgent">
                    Mensaje urgente
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseMessageModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSendStudentMessage}>
                  <i className="bi bi-send me-2"></i>
                  Enviar Mensaje
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
