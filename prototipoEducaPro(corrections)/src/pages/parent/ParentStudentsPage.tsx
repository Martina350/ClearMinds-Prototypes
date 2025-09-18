import { useEffect, useState } from 'react'
import { studentService, parentService } from '../../services/dataService'
import type { Student } from '../../types'

export function ParentStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  // const [parent, setParent] = useState<Parent | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showStudentModal, setShowStudentModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  useEffect(() => {
    const parentId = '2' // ID del padre actual (simulado)
    const parentData = parentService.getById(parentId)
    // setParent(parentData || null)
    
    if (parentData) {
      const studentsData = studentService.getByParentId(parentId)
      setStudents(studentsData)
    }
  }, [])

  const handleAddStudent = () => {
    setShowAddForm(true)
  }

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student)
    setShowStudentModal(true)
  }

  const handleViewGrades = (student: Student) => {
    // Navegar a la página de notas con el estudiante seleccionado
    window.location.href = `/padre/notas?student=${student.id}`
  }

  const handleViewTasks = (student: Student) => {
    // Navegar a la página de tareas con el estudiante seleccionado
    window.location.href = `/padre/tareas?student=${student.id}`
  }

  const handleCloseModal = () => {
    setShowStudentModal(false)
    setSelectedStudent(null)
  }

  const handleCloseAddForm = () => {
    setShowAddForm(false)
  }

  return (
    <div style={{ width: '100%', padding: '1rem', maxWidth: 'none' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="h4 mb-0">Mis Hijos</h2>
        <button className="btn btn-primary" onClick={handleAddStudent}>
          <i className="bi bi-plus me-2"></i>
          <span className="d-none d-sm-inline">Agregar Hijo</span>
          <span className="d-sm-none">Agregar</span>
        </button>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-people display-1 text-muted"></i>
          <h4 className="mt-3">No tienes hijos registrados</h4>
          <p className="text-muted">Contacta al administrador para registrar a tus hijos</p>
        </div>
      ) : (
        <div className="row g-3 g-md-4">
          {students.map(student => (
            <div key={student.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <div className="card h-100" style={{ width: '100%' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-person-circle display-6 text-primary me-3 flex-shrink-0"></i>
                    <div className="flex-grow-1 min-width-0">
                      <h5 className="card-title mb-1 text-truncate">{student.name}</h5>
                      <p className="text-muted mb-0 small text-truncate">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-primary">Grado {student.grade}</span>
                      <span className="badge bg-secondary">{student.classIds.length} clases</span>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleViewProfile(student)}
                    >
                      <i className="bi bi-eye me-2"></i>
                      <span className="d-none d-sm-inline">Ver Perfil Completo</span>
                      <span className="d-sm-none">Perfil</span>
                    </button>
                    <button 
                      className="btn btn-outline-success btn-sm"
                      onClick={() => handleViewGrades(student)}
                    >
                      <i className="bi bi-star me-2"></i>
                      <span className="d-none d-sm-inline">Ver Notas</span>
                      <span className="d-sm-none">Notas</span>
                    </button>
                    <button 
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => handleViewTasks(student)}
                    >
                      <i className="bi bi-journal-text me-2"></i>
                      <span className="d-none d-sm-inline">Ver Tareas</span>
                      <span className="d-sm-none">Tareas</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen de estudiantes */}
      {students.length > 0 && (
        <div className="row mt-4 g-3">
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h6>Total Hijos</h6>
                <h3>{students.length}</h3>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h6>Activos</h6>
                <h3>{students.filter(s => s.status === 'active').length}</h3>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card bg-info text-white">
              <div className="card-body text-center">
                <h6>Grados Únicos</h6>
                <h3>{new Set(students.map(s => s.grade)).size}</h3>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card bg-warning text-white">
              <div className="card-body text-center">
                <h6>Total Clases</h6>
                <h3>{students.reduce((sum, s) => sum + s.classIds.length, 0)}</h3>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card bg-secondary text-white">
              <div className="card-body text-center">
                <h6>Promedio Edad</h6>
                <h3>{students.length > 0 ? Math.round(students.reduce((sum, s) => sum + parseInt(s.grade), 0) / students.length + 5) : '0'}</h3>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 col-lg-2">
            <div className="card bg-dark text-white">
              <div className="card-body text-center">
                <h6>Este Año</h6>
                <h3>{students.length}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar hijo */}
      {showAddForm && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nuevo Hijo</h5>
                <button type="button" className="btn-close" onClick={handleCloseAddForm}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Para agregar un nuevo hijo, contacta al administrador del sistema. 
                  Se requiere validación de documentos y asignación de matrícula.
                </div>
                <div className="text-center">
                  <p><strong>Información de contacto:</strong></p>
                  <p>📧 admin@educapro.com</p>
                  <p>📞 (555) 123-4567</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseAddForm}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={() => {
                  window.open('mailto:admin@educapro.com?subject=Solicitud de matrícula', '_blank')
                  handleCloseAddForm()
                }}>
                  Enviar Correo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver perfil completo */}
      {showStudentModal && selectedStudent && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Perfil de {selectedStudent.name}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
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
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={() => handleViewGrades(selectedStudent)}>
                  Ver Notas
                </button>
                <button type="button" className="btn btn-warning" onClick={() => handleViewTasks(selectedStudent)}>
                  Ver Tareas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
