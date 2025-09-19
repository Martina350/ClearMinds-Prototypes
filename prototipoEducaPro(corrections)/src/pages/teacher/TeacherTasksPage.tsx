import { useEffect, useState } from 'react'
import { taskService, classService, teacherService } from '../../services/dataService'
import type { Task, Class } from '../../types'

export function TeacherTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  // const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [taskTitle, setTaskTitle] = useState<string>('')
  const [taskDescription, setTaskDescription] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    const teacherId = '52' // ID del docente actual (simulado)
    const teacherData = teacherService.getById(teacherId)
    // setTeacher(teacherData || null)
    
    if (teacherData) {
      const classesData = classService.getByTeacherId(teacherId)
      setClasses(classesData)
      
      const tasksData = classesData.flatMap(c => taskService.getByClassId(c.id))
      setTasks(tasksData)
    }
  }, [])

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newTask: Task = {
      id: Date.now().toString(),
      classId: selectedClass,
      teacherId: '52', // ID del docente actual
      title: taskTitle,
      description: taskDescription,
      dueDate: dueDate,
      createdAt: new Date().toISOString()
    }
    
    setTasks([...tasks, newTask])
    setShowForm(false)
    setSelectedClass('')
    setTaskTitle('')
    setTaskDescription('')
    setDueDate('')
  }

  const getClassName = (classId: string) => {
    const classData = classes.find(c => c.id === classId)
    return classData?.name || 'Clase no encontrada'
  }

  const isTaskOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const handleViewTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const handleViewSubmissions = (task: Task) => {
    setSelectedTask(task)
    setShowSubmissionsModal(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setTaskTitle(task.title)
    setTaskDescription(task.description)
    setDueDate(task.dueDate)
    setSelectedClass(task.classId)
    setShowEditModal(true)
  }

  const handleCloseTaskModal = () => {
    setShowTaskModal(false)
    setSelectedTask(null)
  }

  const handleCloseSubmissionsModal = () => {
    setShowSubmissionsModal(false)
    setSelectedTask(null)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedTask(null)
    setTaskTitle('')
    setTaskDescription('')
    setDueDate('')
    setSelectedClass('')
  }

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedTask) {
      const updatedTask: Task = {
        ...selectedTask,
        title: taskTitle,
        description: taskDescription,
        dueDate: dueDate,
        classId: selectedClass
      }
      
      setTasks(tasks.map(t => t.id === selectedTask.id ? updatedTask : t))
      handleCloseEditModal()
      alert('Tarea actualizada exitosamente')
    }
  }

  const handleDeleteTask = (task: Task) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la tarea "${task.title}"?`)) {
      setTasks(tasks.filter(t => t.id !== task.id))
      alert('Tarea eliminada exitosamente')
    }
  }

  const handleGradeSubmission = (_submissionId: string, grade: number) => {
    alert(`Calificación ${grade} registrada para la entrega`)
  }

  const handleViewSubmission = (studentName: string) => {
    alert(`Viendo entrega de ${studentName}`)
  }

  const handleAddComment = (studentName: string) => {
    const comment = prompt(`Agregar comentario para ${studentName}:`)
    if (comment) {
      alert(`Comentario agregado: "${comment}"`)
    }
  }

  const handleSendReminder = (studentName: string) => {
    alert(`Recordatorio enviado a ${studentName}`)
  }

  const handleExportList = () => {
    alert('Lista de entregas exportada exitosamente')
  }

  const isTaskDueSoon = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays > 0
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Gestionar Tareas</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus me-2"></i>
          Nueva Tarea
        </button>
      </div>

      {/* Formulario de nueva tarea */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Crear Nueva Tarea</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitTask}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Clase</label>
                  <select 
                    className="form-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    required
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
                  <label className="form-label">Fecha de Entrega</label>
                  <input 
                    type="datetime-local"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Título de la Tarea</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Ej: Ejercicios de Matemáticas"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea 
                    className="form-control"
                    rows={4}
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="Describe la tarea que deben realizar los estudiantes..."
                    required
                  ></textarea>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-check me-2"></i>
                      Crear Tarea
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-journal-text display-1 text-muted"></i>
          <h4 className="mt-3">No hay tareas creadas</h4>
          <p className="text-muted">Crea tu primera tarea para comenzar</p>
        </div>
      ) : (
        <div className="row g-4">
          {tasks.map(task => {
            const overdue = isTaskOverdue(task.dueDate)
            const dueSoon = isTaskDueSoon(task.dueDate)
            
            return (
              <div key={task.id} className="col-12 col-md-6 col-lg-4">
                <div className={`card h-100 ${overdue ? 'border-danger' : dueSoon ? 'border-warning' : ''}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title">{task.title}</h6>
                      <span className={`badge ${overdue ? 'bg-danger' : dueSoon ? 'bg-warning' : 'bg-success'}`}>
                        {overdue ? 'Vencida' : dueSoon ? 'Próxima' : 'Activa'}
                      </span>
                    </div>
                    
                    <p className="text-muted small mb-2">
                      <strong>Clase:</strong> {getClassName(task.classId)}
                    </p>
                    
                    <p className="card-text text-muted small">{task.description}</p>
                    
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
                        Ver Detalles
                      </button>
                      <button 
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleViewSubmissions(task)}
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Ver Entregas
                      </button>
                      <button 
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => handleEditTask(task)}
                      >
                        <i className="bi bi-pencil me-2"></i>
                        Editar
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDeleteTask(task)}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Modal para ver detalles de la tarea */}
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
                        <span>Clase:</span>
                        <span>{getClassName(selectedTask.classId)}</span>
                      </li>
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
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Acciones Rápidas</h6>
                        <div className="d-grid gap-2">
                          <button className="btn btn-primary btn-sm" onClick={() => {
                            handleCloseTaskModal()
                            handleViewSubmissions(selectedTask)
                          }}>
                            <i className="bi bi-check-circle me-1"></i>
                            Ver Entregas
                          </button>
                          <button className="btn btn-warning btn-sm" onClick={() => {
                            handleCloseTaskModal()
                            handleEditTask(selectedTask)
                          }}>
                            <i className="bi bi-pencil me-1"></i>
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseTaskModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver entregas */}
      {showSubmissionsModal && selectedTask && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Entregas - {selectedTask.title}</h5>
                <button type="button" className="btn-close" onClick={handleCloseSubmissionsModal}></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Estudiante</th>
                        <th>Fecha de Entrega</th>
                        <th>Estado</th>
                        <th>Calificación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Juan Pérez</td>
                        <td>{new Date().toLocaleDateString()}</td>
                        <td><span className="badge bg-success">Entregada</span></td>
                        <td><span className="badge bg-primary">85/100</span></td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary" 
                              title="Ver entrega"
                              onClick={() => handleViewSubmission('Juan Pérez')}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-outline-success" 
                              title="Calificar"
                              onClick={() => handleGradeSubmission('sub1', 90)}
                            >
                              <i className="bi bi-star"></i>
                            </button>
                            <button 
                              className="btn btn-outline-info" 
                              title="Comentarios"
                              onClick={() => handleAddComment('Juan Pérez')}
                            >
                              <i className="bi bi-chat"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>María García</td>
                        <td>{new Date(Date.now() - 86400000).toLocaleDateString()}</td>
                        <td><span className="badge bg-success">Entregada</span></td>
                        <td><span className="badge bg-warning">Sin calificar</span></td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary" 
                              title="Ver entrega"
                              onClick={() => handleViewSubmission('María García')}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-outline-success" 
                              title="Calificar"
                              onClick={() => handleGradeSubmission('sub2', 85)}
                            >
                              <i className="bi bi-star"></i>
                            </button>
                            <button 
                              className="btn btn-outline-info" 
                              title="Comentarios"
                              onClick={() => handleAddComment('María García')}
                            >
                              <i className="bi bi-chat"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Carlos López</td>
                        <td>-</td>
                        <td><span className="badge bg-danger">No entregada</span></td>
                        <td><span className="badge bg-secondary">-</span></td>
                        <td>
                          <button 
                            className="btn btn-outline-warning btn-sm" 
                            title="Recordar entrega"
                            onClick={() => handleSendReminder('Carlos López')}
                          >
                            <i className="bi bi-bell"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseSubmissionsModal}>
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleExportList}
                >
                  <i className="bi bi-download me-2"></i>
                  Exportar Lista
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar tarea */}
      {showEditModal && selectedTask && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Tarea</h5>
                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
              </div>
              <form onSubmit={handleUpdateTask}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Editando: <strong>{selectedTask.title}</strong>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Clase</label>
                    <select 
                      className="form-select"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      required
                    >
                      <option value="">Seleccionar clase</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Título de la tarea</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea 
                      className="form-control"
                      rows={4}
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Fecha de vencimiento</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check me-2"></i>
                    Actualizar Tarea
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
