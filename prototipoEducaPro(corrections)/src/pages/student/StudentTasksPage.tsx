import { useEffect, useState } from 'react'
import { taskService, taskSubmissionService } from '../../services/dataService'
import type { Task, TaskSubmission } from '../../types'

export function StudentTasksPage() {
  const studentId = '1'
  const [tasks, setTasks] = useState<Task[]>([])
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([])
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)

  useEffect(() => {
    setTasks(taskService.getByStudentId(studentId))
    setSubmissions(taskSubmissionService.getByStudentId(studentId))
  }, [])

  function submit(task: Task) {
    setSelectedTask(task)
    setShowSubmitModal(true)
  }

  function statusOf(taskId: string) {
    return submissions.some(s => s.taskId === taskId) ? 'Entregada' : 'Pendiente'
  }

  const handleDownloadTask = (task: Task) => {
    // Simular descarga de tarea
    alert(`Descargando: ${task.title}`)
  }

  const handleViewTaskDetails = (task: Task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const handleCloseSubmitModal = () => {
    setShowSubmitModal(false)
    setSelectedTask(null)
  }

  const handleCloseTaskModal = () => {
    setShowTaskModal(false)
    setSelectedTask(null)
  }

  const handleSubmitTask = () => {
    if (selectedTask) {
      const exists = submissions.find(s => s.taskId === selectedTask.id)
      if (exists) return
      
      const sub = taskSubmissionService.create({ 
        taskId: selectedTask.id, 
        studentId, 
        content: 'Tarea entregada desde el sistema', 
        attachments: [] 
      })
      setSubmissions(prev => [...prev, sub])
      alert('Tarea entregada exitosamente')
      handleCloseSubmitModal()
    }
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Mis Tareas</h2>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Tarea</th>
              <th>Materia</th>
              <th>Vence</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>
                  <div className="fw-medium">{task.title}</div>
                  <div className="text-muted small">{task.description}</div>
                </td>
                <td>{task.classId}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${statusOf(task.id) === 'Entregada' ? 'bg-success' : 'bg-warning'}`}>{statusOf(task.id)}</span>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button 
                      className="btn btn-outline-primary" 
                      onClick={() => submit(task)} 
                      disabled={statusOf(task.id) === 'Entregada'}
                    >
                      <i className="bi bi-upload me-1"></i>Entregar
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => handleDownloadTask(task)}
                    >
                      <i className="bi bi-download me-1"></i>Descargar
                    </button>
                    <button 
                      className="btn btn-outline-info"
                      onClick={() => handleViewTaskDetails(task)}
                    >
                      <i className="bi bi-eye me-1"></i>Ver
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para entregar tarea */}
      {showSubmitModal && selectedTask && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Entregar Tarea</h5>
                <button type="button" className="btn-close" onClick={handleCloseSubmitModal}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Tarea:</strong> {selectedTask.title}
                </div>
                
                <div className="card">
                  <div className="card-body">
                    <h6>Descripción</h6>
                    <p className="text-muted">{selectedTask.description}</p>
                    
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de vencimiento:</span>
                        <span className={new Date(selectedTask.dueDate) < new Date() ? 'text-danger fw-bold' : 'text-primary fw-bold'}>
                          {new Date(selectedTask.dueDate).toLocaleDateString()}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Tipo:</span>
                        <span className="badge bg-secondary">{selectedTask.type}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Esta es una entrega de demostración. En un sistema real, aquí podrías subir archivos y escribir texto.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseSubmitModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-success" onClick={handleSubmitTask}>
                  <i className="bi bi-upload me-2"></i>
                  Entregar Tarea
                </button>
              </div>
            </div>
          </div>
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
                        <span>Materia:</span>
                        <span>{selectedTask.classId}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de asignación:</span>
                        <span>{new Date(selectedTask.createdAt).toLocaleDateString()}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de vencimiento:</span>
                        <span className={new Date(selectedTask.dueDate) < new Date() ? 'text-danger fw-bold' : 'text-primary fw-bold'}>
                          {new Date(selectedTask.dueDate).toLocaleDateString()}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Tipo:</span>
                        <span className="badge bg-secondary">{selectedTask.type}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Estado:</span>
                        <span className={`badge ${statusOf(selectedTask.id) === 'Entregada' ? 'bg-success' : 'bg-warning'}`}>
                          {statusOf(selectedTask.id)}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Acciones</h6>
                        <div className="d-grid gap-2">
                          {statusOf(selectedTask.id) !== 'Entregada' && (
                            <button className="btn btn-primary btn-sm" onClick={() => {
                              handleCloseTaskModal()
                              submit(selectedTask)
                            }}>
                              <i className="bi bi-upload me-1"></i>
                              Entregar
                            </button>
                          )}
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDownloadTask(selectedTask)}>
                            <i className="bi bi-download me-1"></i>
                            Descargar
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
    </div>
  )
}


