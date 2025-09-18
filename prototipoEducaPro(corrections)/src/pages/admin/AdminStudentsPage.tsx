import { useEffect, useState } from 'react'
import { studentService, classService } from '../../services/dataService'
import type { Student, Class } from '../../types'

export function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    grade: '',
    classIds: [] as string[]
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editStudent, setEditStudent] = useState({
    name: '',
    email: '',
    grade: '',
    classIds: [] as string[]
  })

  useEffect(() => {
    const studentsData = studentService.getAll()
    setStudents(studentsData)
    
    const classesData = classService.getAll()
    setClasses(classesData)
  }, [])

  const handleSubmitStudent = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[AdminStudentsPage] submit new student:', newStudent)
    
    const created = studentService.create({
      name: newStudent.name,
      email: newStudent.email,
      role: 'estudiante',
      grade: newStudent.grade,
      classIds: newStudent.classIds,
      parentId: '', // Se asignará después
      status: 'active'
    })
    
    const all = studentService.getAll()
    console.log('[AdminStudentsPage] after create, students:', all.length)
    setStudents(all)
    setShowForm(false)
    setNewStudent({ name: '', email: '', grade: '', classIds: [] })
    alert(`Estudiante registrado exitosamente: ${created.name}`)
  }

  const handleEditStudent = (student: Student) => {
    console.log('[AdminStudentsPage] open edit for:', student.id)
    setSelectedStudent(student)
    setEditStudent({
      name: student.name,
      email: student.email,
      grade: student.grade,
      classIds: student.classIds
    })
    setShowEditModal(true)
  }

  const handleViewProfile = (student: Student) => {
    console.log('[AdminStudentsPage] view profile for:', student.id)
    setSelectedStudent(student)
    setShowProfileModal(true)
  }

  const handleEnrollStudent = (student: Student) => {
    console.log('[AdminStudentsPage] open enroll modal for:', student.id)
    setSelectedStudent(student)
    setShowEnrollModal(true)
  }

  const handleDeleteStudent = (student: Student) => {
    console.log('[AdminStudentsPage] delete student click:', student.id)
    if (window.confirm(`¿Estás seguro de que quieres eliminar al estudiante ${student.name}?`)) {
      studentService.delete(student.id)
      const all = studentService.getAll()
      console.log('[AdminStudentsPage] after delete, students:', all.length)
      setStudents(all)
      alert('Estudiante eliminado exitosamente')
    }
  }

  const handleUpdateStudent = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedStudent) {
      console.log('[AdminStudentsPage] update student:', selectedStudent.id, editStudent)
      const updated = studentService.update(selectedStudent.id, {
        name: editStudent.name,
        email: editStudent.email,
        grade: editStudent.grade,
        classIds: editStudent.classIds
      })
      
      if (updated) {
        const all = studentService.getAll()
        console.log('[AdminStudentsPage] after update, students:', all.length)
        setStudents(all)
        setShowEditModal(false)
        setSelectedStudent(null)
        alert('Estudiante actualizado exitosamente')
      }
    }
  }

  const handleEnrollInClass = (e: React.FormEvent) => {
    e.preventDefault()
    const classId = (e.target as any).classId.value
    if (selectedStudent && classId) {
      console.log('[AdminStudentsPage] enroll student in class:', selectedStudent.id, classId)
      const updated = studentService.update(selectedStudent.id, {
        classIds: [...selectedStudent.classIds, classId]
      })
      
      if (updated) {
        const all = studentService.getAll()
        console.log('[AdminStudentsPage] after enroll, students:', all.length)
        setStudents(all)
        setShowEnrollModal(false)
        setSelectedStudent(null)
        alert('Estudiante matriculado exitosamente')
      }
    }
  }

  const handleCloseModals = () => {
    setShowEditModal(false)
    setShowProfileModal(false)
    setShowEnrollModal(false)
    setSelectedStudent(null)
  }

  const getClassName = (classId: string) => {
    const classData = classes.find(c => c.id === classId)
    return classData?.name || 'Clase no encontrada'
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Gestión de Estudiantes</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus me-2"></i>
          Nuevo Estudiante
        </button>
      </div>

      {/* Formulario de nuevo estudiante */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Registrar Nuevo Estudiante</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitStudent}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre Completo</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input 
                    type="email"
                    className="form-control"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Grado</label>
                  <select 
                    className="form-select"
                    value={newStudent.grade}
                    onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                    required
                  >
                    <option value="">Selecciona un grado</option>
                    <option value="1°">1° Grado</option>
                    <option value="2°">2° Grado</option>
                    <option value="3°">3° Grado</option>
                    <option value="4°">4° Grado</option>
                    <option value="5°">5° Grado</option>
                    <option value="6°">6° Grado</option>
                    <option value="7°">7° Grado</option>
                    <option value="8°">8° Grado</option>
                    <option value="9°">9° Grado</option>
                    <option value="10°">10° Grado</option>
                    <option value="11°">11° Grado</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Clases</label>
                  <select 
                    className="form-select"
                    multiple
                    value={newStudent.classIds}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                      setNewStudent({ ...newStudent, classIds: selectedOptions })
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
                      Registrar Estudiante
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

      {/* Lista de estudiantes */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Lista de Estudiantes</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Email</th>
                  <th>Grado</th>
                  <th>Clases</th>
                  <th>Fecha Registro</th>
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
                    <td>{student.email}</td>
                    <td>
                      <span className="badge bg-primary">{student.grade}</span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {student.classIds.map(classId => (
                          <span key={classId} className="badge bg-secondary">
                            {getClassName(classId)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="badge bg-success">Activo</span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary" 
                          title="Editar"
                          onClick={() => handleEditStudent(student)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-outline-info" 
                          title="Ver perfil"
                          onClick={() => handleViewProfile(student)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-success" 
                          title="Matricular en clase"
                          onClick={() => handleEnrollStudent(student)}
                        >
                          <i className="bi bi-plus-circle"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger" 
                          title="Eliminar"
                          onClick={() => handleDeleteStudent(student)}
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

      {/* Resumen por grado */}
      <div className="row mt-4">
        {['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°', '9°', '10°', '11°'].map(grade => {
          const count = students.filter(s => s.grade === grade).length
          if (count === 0) return null
          
          return (
            <div key={grade} className="col-md-2 col-lg-1">
              <div className="card bg-primary text-white">
                <div className="card-body text-center p-2">
                  <h6 className="mb-1">{grade}</h6>
                  <h5 className="mb-0">{count}</h5>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal para editar estudiante */}
      {showEditModal && selectedStudent && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Estudiante</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <form onSubmit={handleUpdateStudent}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre Completo</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={editStudent.name}
                        onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input 
                        type="email"
                        className="form-control"
                        value={editStudent.email}
                        onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Grado</label>
                      <select 
                        className="form-select"
                        value={editStudent.grade}
                        onChange={(e) => setEditStudent({ ...editStudent, grade: e.target.value })}
                        required
                      >
                        <option value="">Selecciona un grado</option>
                        <option value="1°">1° Grado</option>
                        <option value="2°">2° Grado</option>
                        <option value="3°">3° Grado</option>
                        <option value="4°">4° Grado</option>
                        <option value="5°">5° Grado</option>
                        <option value="6°">6° Grado</option>
                        <option value="7°">7° Grado</option>
                        <option value="8°">8° Grado</option>
                        <option value="9°">9° Grado</option>
                        <option value="10°">10° Grado</option>
                        <option value="11°">11° Grado</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Clases</label>
                      <select 
                        className="form-select"
                        multiple
                        value={editStudent.classIds}
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                          setEditStudent({ ...editStudent, classIds: selectedOptions })
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
                    Actualizar Estudiante
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver perfil */}
      {showProfileModal && selectedStudent && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Perfil del Estudiante</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
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
                        <span className="badge bg-success">Activo</span>
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
                    <h6 className="mt-3">Clases Matriculadas</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedStudent.classIds.map(classId => (
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
                  handleEditStudent(selectedStudent)
                }}>
                  Editar Estudiante
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para matricular en clase */}
      {showEnrollModal && selectedStudent && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Matricular en Clase</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <form onSubmit={handleEnrollInClass}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Estudiante:</strong> {selectedStudent.name}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Seleccionar Clase</label>
                    <select 
                      className="form-select"
                      name="classId"
                      required
                    >
                      <option value="">Selecciona una clase</option>
                      {classes.filter(cls => !selectedStudent.classIds.includes(cls.id)).map(cls => (
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
                    Matricular
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
