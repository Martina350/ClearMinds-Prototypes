import { useEffect, useState } from 'react'
import { taskService, studentService, parentService } from '../../services/dataService'
import type { Task, Student } from '../../types'

export function ParentTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [students, setStudents] = useState<Student[]>([])
  // const [parent, setParent] = useState<Parent | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)

  useEffect(() => {
    const parentId = '2' // ID del padre actual (simulado)
    const parentData = parentService.getById(parentId)
    // setParent(parentData || null)
    
    if (parentData) {
      const studentsData = studentService.getByParentId(parentId)
      setStudents(studentsData)
      
      if (studentsData.length > 0) {
        setSelectedStudent(studentsData[0].id)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedStudent) {
      const studentTasks = taskService.getByStudentId(selectedStudent)
      setTasks(studentTasks)
    }
  }, [selectedStudent])

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    return student?.name || 'N/A'
  }

  const isTaskOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const isTaskDueSoon = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays > 0
  }

  const handleViewTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const handleContactTeacher = (task: Task) => {
    setSelectedTask(task)
    setShowContactModal(true)
  }

  const handleCloseTaskModal = () => {
    setShowTaskModal(false)
    setSelectedTask(null)
  }

  const handleCloseContactModal = () => {
    setShowContactModal(false)
    setSelectedTask(null)
  }

  const handleSendMessage = () => {
    // Simular envío de mensaje
    alert('Mensaje enviado al docente. Te responderá pronto.')
    handleCloseContactModal()
  }

  return (
    <div style={{ width: '100%', padding: '1rem', maxWidth: 'none' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="h4 mb-0">Tareas de Mis Hijos</h2>
        <div className="d-flex gap-2 w-100 w-md-auto">
          <select 
            className="form-select"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-journal-text display-1 text-muted"></i>
          <h4 className="mt-3">No hay tareas asignadas</h4>
          <p className="text-muted">Las tareas aparecerán aquí cuando los docentes las asignen</p>
        </div>
      ) : (
        <div className="row g-3 g-md-4">
          {tasks.map(task => {
            const overdue = isTaskOverdue(task.dueDate)
            const dueSoon = isTaskDueSoon(task.dueDate)
            
            return (
              <div key={task.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className={`card h-100 ${overdue ? 'border-danger' : dueSoon ? 'border-warning' : ''}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title text-truncate flex-grow-1 me-2">{task.title}</h6>
                      <span className={`badge ${overdue ? 'bg-danger' : dueSoon ? 'bg-warning' : 'bg-success'} flex-shrink-0`}>
                        {overdue ? 'Vencida' : dueSoon ? 'Próxima' : 'Activa'}
                      </span>
                    </div>
                    
                    <p className="card-text text-muted small text-truncate">{task.description}</p>
                    
                    <div className="mb-3">
                      <small className="text-muted">
                        <i className="bi bi-calendar me-1"></i>
                        Vence: {new Date(task.dueDate).toLocaleDateString()}
                      </small>
                    </div>

                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleViewTaskDetails(task)}
                      >
                        <i className="bi bi-eye me-2"></i>
                        <span className="d-none d-sm-inline">Ver Detalles</span>
                        <span className="d-sm-none">Ver</span>
                      </button>
                      <button 
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleContactTeacher(task)}
                      >
                        <i className="bi bi-chat me-2"></i>
                        <span className="d-none d-sm-inline">Comunicar con Docente</span>
                        <span className="d-sm-none">Contactar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal para ver detalles de tarea */}
      {showTaskModal && selectedTask && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedTask.title}</h5>
                <button type="button" className="btn-close" onClick={handleCloseTaskModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-8">
                    <h6>Descripción</h6>
                    <p className="text-muted">{selectedTask.description}</p>
                    
                    <h6>Detalles</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de asignación:</span>
                        <span>{new Date(selectedTask.createdAt).toLocaleDateString()}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de vencimiento:</span>
                        <span className={isTaskOverdue(selectedTask.dueDate) ? 'text-danger fw-bold' : 'text-primary fw-bold'}>
                          {new Date(selectedTask.dueDate).toLocaleDateString()}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Estado:</span>
                        <span className={`badge ${isTaskOverdue(selectedTask.dueDate) ? 'bg-danger' : isTaskDueSoon(selectedTask.dueDate) ? 'bg-warning' : 'bg-success'}`}>
                          {isTaskOverdue(selectedTask.dueDate) ? 'Vencida' : isTaskDueSoon(selectedTask.dueDate) ? 'Próxima' : 'Activa'}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Tipo:</span>
                        <span className="badge bg-secondary">{selectedTask.type}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Información del Estudiante</h6>
                        <i className="bi bi-person-circle display-4 text-primary"></i>
                        <p className="mt-2 mb-0">{getStudentName(selectedTask.studentId || '')}</p>
                        <small className="text-muted">Estudiante asignado</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseTaskModal}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-success" onClick={() => {
                  handleCloseTaskModal()
                  handleContactTeacher(selectedTask)
                }}>
                  Contactar Docente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para contactar docente */}
      {showContactModal && selectedTask && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contactar Docente</h5>
                <button type="button" className="btn-close" onClick={handleCloseContactModal}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Estás contactando al docente sobre la tarea: <strong>{selectedTask.title}</strong>
                </div>
                <div className="mb-3">
                  <label className="form-label">Asunto</label>
                  <input type="text" className="form-control" placeholder="Consulta sobre tarea..." defaultValue={`Consulta sobre: ${selectedTask.title}`} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <textarea className="form-control" rows={4} placeholder="Escribe tu mensaje aquí..."></textarea>
                </div>
                <div className="text-muted small">
                  <i className="bi bi-clock me-1"></i>
                  El docente recibirá tu mensaje y te responderá en un plazo de 24 horas.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseContactModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSendMessage}>
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
