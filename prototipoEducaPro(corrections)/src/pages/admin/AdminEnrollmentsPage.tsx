import { useEffect, useState } from 'react'
import { studentService, classService, parentService } from '../../services/dataService'
import type { Student, Class, Parent } from '../../types'

export function AdminEnrollmentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [parents, setParents] = useState<Parent[]>([])
  const [showForm, setShowForm] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')

  useEffect(() => {
    const studentsData = studentService.getAll()
    setStudents(studentsData)
    
    const classesData = classService.getAll()
    setClasses(classesData)
    
    const parentsData = parentService.getAll()
    setParents(parentsData)
  }, [])

  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedStudent || !selectedClass) {
      alert('Selecciona un estudiante y una clase')
      return
    }
    
    console.log('[AdminEnrollmentsPage] enroll student:', selectedStudent, 'into class:', selectedClass)
    const updated = studentService.update(selectedStudent, {
      classIds: [...students.find(s => s.id === selectedStudent)?.classIds || [], selectedClass]
    })
    
    if (updated) {
      const all = studentService.getAll()
      console.log('[AdminEnrollmentsPage] after enroll, students:', all.length)
      setStudents(all)
      setShowForm(false)
      setSelectedStudent('')
      setSelectedClass('')
      alert('Estudiante matriculado exitosamente')
    }
  }

  const handleViewProfile = (student: Student) => {
    console.log('[AdminEnrollmentsPage] view profile for:', student.id)
    alert(`Perfil de ${student.name}\nGrado: ${student.grade}\nClases: ${student.classIds.length}`)
  }

  const handleEnrollInAnotherClass = (student: Student) => {
    console.log('[AdminEnrollmentsPage] open enroll form for:', student.id)
    setSelectedStudent(student.id)
    setShowForm(true)
  }

  const handleEditEnrollment = (student: Student) => {
    console.log('[AdminEnrollmentsPage] edit enrollment click for:', student.id)
    alert(`Editar matrícula de ${student.name} - Funcionalidad en desarrollo`)
  }

  const handleCancelEnrollment = (student: Student) => {
    console.log('[AdminEnrollmentsPage] cancel enrollment click for:', student.id)
    if (window.confirm(`¿Cancelar todas las matrículas de ${student.name}?`)) {
      const updated = studentService.update(student.id, { classIds: [] })
      if (updated) {
        const all = studentService.getAll()
        console.log('[AdminEnrollmentsPage] after cancel, students:', all.length)
        setStudents(all)
        alert('Matrículas canceladas exitosamente')
      }
    }
  }

  // const getStudentName = (studentId: string) => {
  //   const student = students.find(s => s.id === studentId)
  //   return student?.name || 'Estudiante no encontrado'
  // }

  const getClassName = (classId: string) => {
    const classData = classes.find(c => c.id === classId)
    return classData?.name || 'Clase no encontrada'
  }

  // const getParentName = (parentId: string) => {
  //   const parent = parents.find(p => p.id === parentId)
  //   return parent?.name || 'Padre no encontrado'
  // }

  const getAvailableClasses = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    if (!student) return classes
    
    return classes.filter(cls => !student.classIds.includes(cls.id))
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Gestión de Matrículas</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus me-2"></i>
          Nueva Matrícula
        </button>
      </div>

      {/* Formulario de nueva matrícula */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Matricular Estudiante</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleEnrollStudent}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Estudiante</label>
                  <select 
                    className="form-select"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                  >
                    <option value="">Selecciona un estudiante</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.name} - {student.grade}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Clase</label>
                  <select 
                    className="form-select"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una clase</option>
                    {selectedStudent && getAvailableClasses(selectedStudent).map(cls => (
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
                      Matricular Estudiante
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

      {/* Lista de matrículas */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Lista de Matrículas</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Grado</th>
                  <th>Clases Matriculadas</th>
                  <th>Padre de Familia</th>
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
                    <td>
                      <span className="text-muted">
                        {parents.find(p => p.studentIds.includes(student.id))?.name || 'No asignado'}
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
                          title="Matricular en otra clase"
                          onClick={() => handleEnrollInAnotherClass(student)}
                        >
                          <i className="bi bi-plus-circle"></i>
                        </button>
                        <button 
                          className="btn btn-outline-warning" 
                          title="Editar matrícula"
                          onClick={() => handleEditEnrollment(student)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger" 
                          title="Cancelar matrícula"
                          onClick={() => handleCancelEnrollment(student)}
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

      {/* Resumen de matrículas */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h6>Total Estudiantes</h6>
              <h3>{students.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h6>Matriculados</h6>
              <h3>{students.filter(s => s.classIds.length > 0).length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h6>Sin Matricular</h6>
              <h3>{students.filter(s => s.classIds.length === 0).length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h6>Total Clases</h6>
              <h3>{classes.length}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
