import { useEffect, useState } from 'react'
import { teacherService, classService } from '../../services/dataService'
import type { Teacher, Class } from '../../types'

export function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    subject: '',
    classIds: [] as string[]
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [editTeacher, setEditTeacher] = useState({
    name: '',
    email: '',
    subject: '',
    classIds: [] as string[]
  })

  useEffect(() => {
    const teachersData = teacherService.getAll()
    setTeachers(teachersData)
    
    const classesData = classService.getAll()
    setClasses(classesData)
  }, [])

  const handleSubmitTeacher = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[AdminTeachersPage] submit new teacher:', newTeacher)
    
    const created = teacherService.create({
      name: newTeacher.name,
      email: newTeacher.email,
      role: 'docente',
      subject: newTeacher.subject,
      classIds: newTeacher.classIds
    })
    
    const all = teacherService.getAll()
    console.log('[AdminTeachersPage] after create, teachers:', all.length)
    setTeachers(all)
    setShowForm(false)
    setNewTeacher({ name: '', email: '', subject: '', classIds: [] })
    alert(`Docente registrado exitosamente: ${created.name}`)
  }

  const handleEditTeacher = (teacher: Teacher) => {
    console.log('[AdminTeachersPage] open edit for:', teacher.id)
    setSelectedTeacher(teacher)
    setEditTeacher({
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
      classIds: teacher.classIds
    })
    setShowEditModal(true)
  }

  const handleViewProfile = (teacher: Teacher) => {
    console.log('[AdminTeachersPage] view profile for:', teacher.id)
    setSelectedTeacher(teacher)
    setShowProfileModal(true)
  }

  const handleAssignClass = (teacher: Teacher) => {
    console.log('[AdminTeachersPage] open assign class for:', teacher.id)
    setSelectedTeacher(teacher)
    setShowAssignModal(true)
  }

  const handleDeleteTeacher = (teacher: Teacher) => {
    console.log('[AdminTeachersPage] delete teacher click:', teacher.id)
    if (window.confirm(`¿Estás seguro de que quieres eliminar al docente ${teacher.name}?`)) {
      teacherService.delete(teacher.id)
      const all = teacherService.getAll()
      console.log('[AdminTeachersPage] after delete, teachers:', all.length)
      setTeachers(all)
      alert('Docente eliminado exitosamente')
    }
  }

  const handleUpdateTeacher = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedTeacher) {
      console.log('[AdminTeachersPage] update teacher:', selectedTeacher.id, editTeacher)
      const updated = teacherService.update(selectedTeacher.id, {
        name: editTeacher.name,
        email: editTeacher.email,
        subject: editTeacher.subject,
        classIds: editTeacher.classIds
      })
      
      if (updated) {
        const all = teacherService.getAll()
        console.log('[AdminTeachersPage] after update, teachers:', all.length)
        setTeachers(all)
        setShowEditModal(false)
        setSelectedTeacher(null)
        alert('Docente actualizado exitosamente')
      }
    }
  }

  const handleAssignToClass = (e: React.FormEvent) => {
    e.preventDefault()
    const classId = (e.target as any).classId.value
    if (selectedTeacher && classId) {
      console.log('[AdminTeachersPage] assign class:', selectedTeacher.id, classId)
      const updated = teacherService.update(selectedTeacher.id, {
        classIds: [...selectedTeacher.classIds, classId]
      })
      
      if (updated) {
        const all = teacherService.getAll()
        console.log('[AdminTeachersPage] after assign, teachers:', all.length)
        setTeachers(all)
        setShowAssignModal(false)
        setSelectedTeacher(null)
        alert('Clase asignada exitosamente')
      }
    }
  }

  const handleCloseModals = () => {
    setShowEditModal(false)
    setShowProfileModal(false)
    setShowAssignModal(false)
    setSelectedTeacher(null)
  }

  const getClassName = (classId: string) => {
    const classData = classes.find(c => c.id === classId)
    return classData?.name || 'Clase no encontrada'
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Gestión de Docentes</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus me-2"></i>
          Nuevo Docente
        </button>
      </div>

      {/* Formulario de nuevo docente */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Registrar Nuevo Docente</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitTeacher}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre Completo</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={newTeacher.name}
                    onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input 
                    type="email"
                    className="form-control"
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Materia</label>
                  <select 
                    className="form-select"
                    value={newTeacher.subject}
                    onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                    required
                  >
                    <option value="">Selecciona una materia</option>
                    <option value="Matemáticas">Matemáticas</option>
                    <option value="Español">Español</option>
                    <option value="Ciencias">Ciencias</option>
                    <option value="Historia">Historia</option>
                    <option value="Geografía">Geografía</option>
                    <option value="Inglés">Inglés</option>
                    <option value="Educación Física">Educación Física</option>
                    <option value="Arte">Arte</option>
                    <option value="Música">Música</option>
                    <option value="Informática">Informática</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Clases Asignadas</label>
                  <select 
                    className="form-select"
                    multiple
                    value={newTeacher.classIds}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                      setNewTeacher({ ...newTeacher, classIds: selectedOptions })
                    }}
                  >
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} - {cls.subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-check me-2"></i>
                      Registrar Docente
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

      {/* Lista de docentes */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Lista de Docentes</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Docente</th>
                  <th>Email</th>
                  <th>Materia</th>
                  <th>Clases</th>
                  <th>Fecha Registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(teacher => (
                  <tr key={teacher.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-person-workspace me-2"></i>
                        {teacher.name}
                      </div>
                    </td>
                    <td>{teacher.email}</td>
                    <td>
                      <span className="badge bg-warning">{teacher.subject}</span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {teacher.classIds.map(classId => (
                          <span key={classId} className="badge bg-secondary">
                            {getClassName(classId)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{new Date(teacher.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="badge bg-success">Activo</span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary" 
                          title="Editar"
                          onClick={() => handleEditTeacher(teacher)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-outline-info" 
                          title="Ver perfil"
                          onClick={() => handleViewProfile(teacher)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-success" 
                          title="Asignar clase"
                          onClick={() => handleAssignClass(teacher)}
                        >
                          <i className="bi bi-plus-circle"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger" 
                          title="Eliminar"
                          onClick={() => handleDeleteTeacher(teacher)}
                        >
                          <i className="bi bi-trash"></i>
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

      {/* Resumen por materia */}
      <div className="row mt-4">
        {['Matemáticas', 'Español', 'Ciencias', 'Historia', 'Geografía', 'Inglés', 'Educación Física', 'Arte', 'Música', 'Informática'].map(subject => {
          const count = teachers.filter(t => t.subject === subject).length
          if (count === 0) return null
          
          return (
            <div key={subject} className="col-md-2 col-lg-1">
              <div className="card bg-warning text-white">
                <div className="card-body text-center p-2">
                  <h6 className="mb-1">{subject}</h6>
                  <h5 className="mb-0">{count}</h5>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal para editar docente */}
      {showEditModal && selectedTeacher && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Docente</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <form onSubmit={handleUpdateTeacher}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre Completo</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={editTeacher.name}
                        onChange={(e) => setEditTeacher({ ...editTeacher, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input 
                        type="email"
                        className="form-control"
                        value={editTeacher.email}
                        onChange={(e) => setEditTeacher({ ...editTeacher, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Materia</label>
                      <select 
                        className="form-select"
                        value={editTeacher.subject}
                        onChange={(e) => setEditTeacher({ ...editTeacher, subject: e.target.value })}
                        required
                      >
                        <option value="">Selecciona una materia</option>
                        <option value="Matemáticas">Matemáticas</option>
                        <option value="Español">Español</option>
                        <option value="Ciencias">Ciencias</option>
                        <option value="Historia">Historia</option>
                        <option value="Geografía">Geografía</option>
                        <option value="Inglés">Inglés</option>
                        <option value="Educación Física">Educación Física</option>
                        <option value="Arte">Arte</option>
                        <option value="Música">Música</option>
                        <option value="Informática">Informática</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Clases Asignadas</label>
                      <select 
                        className="form-select"
                        multiple
                        value={editTeacher.classIds}
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                          setEditTeacher({ ...editTeacher, classIds: selectedOptions })
                        }}
                      >
                        {classes.map(cls => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} - {cls.subject}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Actualizar Docente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver perfil */}
      {showProfileModal && selectedTeacher && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Perfil del Docente</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <i className="bi bi-person-workspace display-1 text-warning"></i>
                    <h4 className="mt-3">{selectedTeacher.name}</h4>
                    <p className="text-muted">{selectedTeacher.email}</p>
                  </div>
                  <div className="col-md-8">
                    <h6>Información Profesional</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Materia:</span>
                        <span className="badge bg-warning">{selectedTeacher.subject}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Estado:</span>
                        <span className="badge bg-success">Activo</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Clases asignadas:</span>
                        <span>{selectedTeacher.classIds.length}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de registro:</span>
                        <span>{new Date(selectedTeacher.createdAt).toLocaleDateString()}</span>
                      </li>
                    </ul>
                    <h6 className="mt-3">Clases Asignadas</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedTeacher.classIds.map(classId => (
                        <span key={classId} className="badge bg-secondary">
                          {getClassName(classId)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={() => {
                  handleCloseModals()
                  handleEditTeacher(selectedTeacher)
                }}>
                  Editar Docente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para asignar clase */}
      {showAssignModal && selectedTeacher && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Asignar Clase</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <form onSubmit={handleAssignToClass}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Docente:</strong> {selectedTeacher.name}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Seleccionar Clase</label>
                    <select 
                      className="form-select"
                      name="classId"
                      required
                    >
                      <option value="">Selecciona una clase</option>
                      {classes.filter(cls => !selectedTeacher.classIds.includes(cls.id)).map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name} - {cls.subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-plus-circle me-2"></i>
                    Asignar Clase
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
