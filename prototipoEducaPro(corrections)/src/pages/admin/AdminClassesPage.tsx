import { useEffect, useState } from 'react'
import { classService, teacherService, studentService } from '../../services/dataService'
import type { Class, Teacher, Student } from '../../types'

export function AdminClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newClass, setNewClass] = useState({
    name: '',
    subject: '',
    schedule: '',
    room: '',
    teacherId: '',
    studentIds: [] as string[],
    modality: 'presencial' as 'presencial' | 'virtual' | 'in-home'
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [editClass, setEditClass] = useState({
    name: '',
    subject: '',
    schedule: '',
    room: '',
    teacherId: '',
    studentIds: [] as string[],
    modality: 'presencial' as 'presencial' | 'virtual' | 'in-home'
  })

  useEffect(() => {
    const classesData = classService.getAll()
    setClasses(classesData)
    
    const teachersData = teacherService.getAll()
    setTeachers(teachersData)
    
    const studentsData = studentService.getAll()
    setStudents(studentsData)
  }, [])

  const handleSubmitClass = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[AdminClassesPage] submit new class:', newClass)
    
    const created = classService.create({
      name: newClass.name,
      subject: newClass.subject,
      schedule: newClass.schedule,
      room: newClass.room,
      teacherId: newClass.teacherId,
      studentIds: newClass.studentIds,
      modality: newClass.modality
    })
    
    const all = classService.getAll()
    console.log('[AdminClassesPage] after create, classes:', all.length)
    setClasses(all)
    setShowForm(false)
    setNewClass({ name: '', subject: '', schedule: '', room: '', teacherId: '', studentIds: [], modality: 'presencial' })
    alert(`Clase creada exitosamente: ${created.name}`)
  }

  const handleEditClass = (classData: Class) => {
    console.log('[AdminClassesPage] open edit for:', classData.id)
    setSelectedClass(classData)
    setEditClass({
      name: classData.name,
      subject: classData.subject,
      schedule: classData.schedule,
      room: classData.room,
      teacherId: classData.teacherId,
      studentIds: classData.studentIds,
      modality: classData.modality || 'presencial'
    })
    setShowEditModal(true)
  }

  const handleViewDetails = (classData: Class) => {
    console.log('[AdminClassesPage] view details for:', classData.id)
    setSelectedClass(classData)
    setShowDetailsModal(true)
  }

  const handleAddStudent = (classData: Class) => {
    console.log('[AdminClassesPage] open add student for:', classData.id)
    setSelectedClass(classData)
    setShowAddStudentModal(true)
  }

  const handleDeleteClass = (classData: Class) => {
    console.log('[AdminClassesPage] delete class click:', classData.id)
    if (window.confirm(`¿Estás seguro de que quieres eliminar la clase ${classData.name}?`)) {
      classService.delete(classData.id)
      const all = classService.getAll()
      console.log('[AdminClassesPage] after delete, classes:', all.length)
      setClasses(all)
      alert('Clase eliminada exitosamente')
    }
  }

  const handleUpdateClass = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedClass) {
      console.log('[AdminClassesPage] update class:', selectedClass.id, editClass)
      const updated = classService.update(selectedClass.id, {
        name: editClass.name,
        subject: editClass.subject,
        schedule: editClass.schedule,
        room: editClass.room,
        teacherId: editClass.teacherId,
        studentIds: editClass.studentIds,
        modality: editClass.modality
      })
      
      if (updated) {
        const all = classService.getAll()
        console.log('[AdminClassesPage] after update, classes:', all.length)
        setClasses(all)
        setShowEditModal(false)
        setSelectedClass(null)
        alert('Clase actualizada exitosamente')
      }
    }
  }

  const handleAddStudentToClass = (e: React.FormEvent) => {
    e.preventDefault()
    const studentId = (e.target as any).studentId.value
    if (selectedClass && studentId) {
      console.log('[AdminClassesPage] add student to class:', selectedClass.id, studentId)
      const updated = classService.update(selectedClass.id, {
        studentIds: [...selectedClass.studentIds, studentId]
      })
      
      if (updated) {
        const all = classService.getAll()
        console.log('[AdminClassesPage] after add student, classes:', all.length)
        setClasses(all)
        setShowAddStudentModal(false)
        setSelectedClass(null)
        alert('Estudiante agregado exitosamente')
      }
    }
  }

  const handleCloseModals = () => {
    setShowEditModal(false)
    setShowDetailsModal(false)
    setShowAddStudentModal(false)
    setSelectedClass(null)
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId)
    return teacher?.name || 'Docente no asignado'
  }

  // const getStudentName = (studentId: string) => {
  //   const student = students.find(s => s.id === studentId)
  //   return student?.name || 'Estudiante no encontrado'
  // }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Gestión de Clases</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus me-2"></i>
          Nueva Clase
        </button>
      </div>

      {/* Formulario de nueva clase */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Crear Nueva Clase</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitClass}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre de la Clase</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={newClass.name}
                    onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                    placeholder="Ej: Matemáticas 5°A"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Materia</label>
                  <select 
                    className="form-select"
                    value={newClass.subject}
                    onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
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
                  <label className="form-label">Horario</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={newClass.schedule}
                    onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                    placeholder="Ej: Lunes 8:00-9:00"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Aula</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={newClass.room}
                    onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                    placeholder="Ej: Aula 201"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Docente</label>
                  <select 
                    className="form-select"
                    value={newClass.teacherId}
                    onChange={(e) => setNewClass({ ...newClass, teacherId: e.target.value })}
                    required
                  >
                    <option value="">Selecciona un docente</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Modalidad</label>
                  <select 
                    className="form-select"
                    value={newClass.modality}
                    onChange={(e) => setNewClass({ ...newClass, modality: e.target.value as 'presencial' | 'virtual' | 'in-home' })}
                    required
                  >
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="in-home">In-home</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Estudiantes</label>
                  <select 
                    className="form-select"
                    multiple
                    value={newClass.studentIds}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                      setNewClass({ ...newClass, studentIds: selectedOptions })
                    }}
                  >
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.grade}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-check me-2"></i>
                      Crear Clase
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

      {/* Lista de clases */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Lista de Clases</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Clase</th>
                  <th>Materia</th>
                  <th>Docente</th>
                  <th>Horario</th>
                  <th>Aula</th>
                  <th>Modalidad</th>
                  <th>Estudiantes</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {classes.map(cls => (
                  <tr key={cls.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-book me-2"></i>
                        {cls.name}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-primary">{cls.subject}</span>
                    </td>
                    <td>{getTeacherName(cls.teacherId)}</td>
                    <td>{cls.schedule}</td>
                    <td>{cls.room}</td>
                    <td>
                      <span className={`badge ${
                        cls.modality === 'presencial' ? 'bg-primary' :
                        cls.modality === 'virtual' ? 'bg-success' :
                        'bg-warning'
                      }`}>
                        <i className={`bi ${
                          cls.modality === 'presencial' ? 'bi-building' :
                          cls.modality === 'virtual' ? 'bi-camera-video' :
                          'bi-house'
                        } me-1`}></i>
                        {cls.modality === 'presencial' ? 'Presencial' :
                         cls.modality === 'virtual' ? 'Virtual' :
                         'In-home'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info">{cls.studentIds.length} estudiantes</span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary" 
                          title="Editar"
                          onClick={() => handleEditClass(cls)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-outline-info" 
                          title="Ver detalles"
                          onClick={() => handleViewDetails(cls)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-success" 
                          title="Agregar estudiante"
                          onClick={() => handleAddStudent(cls)}
                        >
                          <i className="bi bi-plus-circle"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger" 
                          title="Eliminar"
                          onClick={() => handleDeleteClass(cls)}
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

      {/* Modal para editar clase */}
      {showEditModal && selectedClass && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Clase</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <form onSubmit={handleUpdateClass}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombre de la Clase</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={editClass.name}
                        onChange={(e) => setEditClass({ ...editClass, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Materia</label>
                      <select 
                        className="form-select"
                        value={editClass.subject}
                        onChange={(e) => setEditClass({ ...editClass, subject: e.target.value })}
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
                      <label className="form-label">Horario</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={editClass.schedule}
                        onChange={(e) => setEditClass({ ...editClass, schedule: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Aula</label>
                      <input 
                        type="text"
                        className="form-control"
                        value={editClass.room}
                        onChange={(e) => setEditClass({ ...editClass, room: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Docente</label>
                      <select 
                        className="form-select"
                        value={editClass.teacherId}
                        onChange={(e) => setEditClass({ ...editClass, teacherId: e.target.value })}
                        required
                      >
                        <option value="">Selecciona un docente</option>
                        {teachers.map(teacher => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name} - {teacher.subject}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Modalidad</label>
                      <select 
                        className="form-select"
                        value={editClass.modality}
                        onChange={(e) => setEditClass({ ...editClass, modality: e.target.value as 'presencial' | 'virtual' | 'in-home' })}
                        required
                      >
                        <option value="presencial">Presencial</option>
                        <option value="virtual">Virtual</option>
                        <option value="in-home">In-home</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Estudiantes</label>
                      <select 
                        className="form-select"
                        multiple
                        value={editClass.studentIds}
                        onChange={(e) => {
                          const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
                          setEditClass({ ...editClass, studentIds: selectedOptions })
                        }}
                      >
                        {students.map(student => (
                          <option key={student.id} value={student.id}>
                            {student.name} - {student.grade}
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
                    Actualizar Clase
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {showDetailsModal && selectedClass && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles de la Clase</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <i className="bi bi-book display-1 text-primary"></i>
                    <h4 className="mt-3">{selectedClass.name}</h4>
                    <p className="text-muted">{selectedClass.subject}</p>
                  </div>
                  <div className="col-md-8">
                    <h6>Información de la Clase</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Materia:</span>
                        <span className="badge bg-primary">{selectedClass.subject}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Docente:</span>
                        <span>{getTeacherName(selectedClass.teacherId)}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Horario:</span>
                        <span>{selectedClass.schedule}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Aula:</span>
                        <span>{selectedClass.room}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Modalidad:</span>
                        <span className={`badge ${
                          selectedClass.modality === 'presencial' ? 'bg-primary' :
                          selectedClass.modality === 'virtual' ? 'bg-success' :
                          'bg-warning'
                        }`}>
                          <i className={`bi ${
                            selectedClass.modality === 'presencial' ? 'bi-building' :
                            selectedClass.modality === 'virtual' ? 'bi-camera-video' :
                            'bi-house'
                          } me-1`}></i>
                          {selectedClass.modality === 'presencial' ? 'Presencial' :
                           selectedClass.modality === 'virtual' ? 'Virtual' :
                           'In-home'}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Estudiantes:</span>
                        <span className="badge bg-info">{selectedClass.studentIds.length}</span>
                      </li>
                    </ul>
                    <h6 className="mt-3">Estudiantes Matriculados</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {selectedClass.studentIds.map(studentId => {
                        const student = students.find(s => s.id === studentId)
                        return (
                          <span key={studentId} className="badge bg-secondary">
                            {student?.name || 'Estudiante no encontrado'}
                          </span>
                        )
                      })}
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
                  handleEditClass(selectedClass)
                }}>
                  Editar Clase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar estudiante */}
      {showAddStudentModal && selectedClass && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Estudiante</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <form onSubmit={handleAddStudentToClass}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Clase:</strong> {selectedClass.name}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Seleccionar Estudiante</label>
                    <select 
                      className="form-select"
                      name="studentId"
                      required
                    >
                      <option value="">Selecciona un estudiante</option>
                      {students.filter(student => !selectedClass.studentIds.includes(student.id)).map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} - {student.grade}
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
                    Agregar Estudiante
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
