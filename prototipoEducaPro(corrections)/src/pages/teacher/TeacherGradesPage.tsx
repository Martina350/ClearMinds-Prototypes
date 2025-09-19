import { useEffect, useState } from 'react'
import { gradeService, classService, teacherService, studentService } from '../../services/dataService'
import type { Grade, Class, Student } from '../../types'

export function TeacherGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  // const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [gradeValue, setGradeValue] = useState<number>(0)
  const [maxValue, setMaxValue] = useState<number>(10)
  const [gradeType, setGradeType] = useState<string>('homework')
  const [gradeDescription, setGradeDescription] = useState<string>('')

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
        
        if (studentsData.length > 0) {
          setSelectedStudent(studentsData[0].id)
        }
      }
    }
  }, [selectedClass, classes])

  useEffect(() => {
    if (selectedStudent && selectedClass) {
      // Filtrar calificaciones por estudiante y clase
      const allGrades = gradeService.getAll()
      const filteredGrades = allGrades.filter(grade => 
        grade.studentId === selectedStudent && grade.classId === selectedClass
      )
      setGrades(filteredGrades)
    } else if (selectedClass) {
      // Si solo hay clase seleccionada, mostrar todas las calificaciones de esa clase
      const allGrades = gradeService.getAll()
      const filteredGrades = allGrades.filter(grade => grade.classId === selectedClass)
      setGrades(filteredGrades)
    } else {
      // Si no hay filtros, mostrar todas las calificaciones del docente
      const allGrades = gradeService.getAll()
      const teacherClasses = classes.map(c => c.id)
      const filteredGrades = allGrades.filter(grade => teacherClasses.includes(grade.classId))
      setGrades(filteredGrades)
    }
  }, [selectedStudent, selectedClass, classes])

  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newGrade: Grade = {
      id: Date.now().toString(),
      studentId: selectedStudent,
      classId: selectedClass,
      type: gradeType as 'homework' | 'exam' | 'participation',
      value: gradeValue,
      maxValue: maxValue,
      description: gradeDescription,
      createdAt: new Date().toISOString()
    }
    
    setGrades([...grades, newGrade])
    setShowForm(false)
    setGradeValue(0)
    setMaxValue(10)
    setGradeType('homework')
    setGradeDescription('')
  }

  const getClassName = (classId: string) => {
    const classData = classes.find(c => c.id === classId)
    return classData?.name || 'Clase no encontrada'
  }

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    return student?.name || 'Estudiante no encontrado'
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'homework':
        return 'Tarea'
      case 'exam':
        return 'Examen'
      case 'participation':
        return 'Participación'
      default:
        return 'Otro'
    }
  }

  const handleViewGrade = (grade: Grade) => {
    alert(`Ver detalles de calificación: ${getStudentName(grade.studentId)} - ${grade.value}/${grade.maxValue}`)
  }

  const handleEditGrade = (grade: Grade) => {
    setSelectedStudent(grade.studentId)
    setSelectedClass(grade.classId)
    setGradeValue(grade.value)
    setMaxValue(grade.maxValue)
    setGradeType(grade.type || 'homework')
    setGradeDescription(grade.description || '')
    setShowForm(true)
  }

  const handleDeleteGrade = (gradeId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta calificación?')) {
      setGrades(grades.filter(g => g.id !== gradeId))
      alert('Calificación eliminada exitosamente')
    }
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Calificar Estudiantes</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus me-2"></i>
          Nueva Calificación
        </button>
      </div>

      {/* Formulario de nueva calificación */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Registrar Calificación</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitGrade}>
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
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Tipo de Calificación</label>
                  <select 
                    className="form-select"
                    value={gradeType}
                    onChange={(e) => setGradeType(e.target.value)}
                    required
                  >
                    <option value="homework">Tarea</option>
                    <option value="exam">Examen</option>
                    <option value="participation">Participación</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Nota Obtenida</label>
                  <input 
                    type="number"
                    className="form-control"
                    value={gradeValue}
                    onChange={(e) => setGradeValue(Number(e.target.value))}
                    min="0"
                    max={maxValue}
                    step="0.1"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Nota Máxima</label>
                  <input 
                    type="number"
                    className="form-control"
                    value={maxValue}
                    onChange={(e) => setMaxValue(Number(e.target.value))}
                    min="1"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Descripción</label>
                  <textarea 
                    className="form-control"
                    rows={2}
                    value={gradeDescription}
                    onChange={(e) => setGradeDescription(e.target.value)}
                    placeholder="Descripción de la calificación (opcional)"
                  ></textarea>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-check me-2"></i>
                      Registrar Calificación
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

      {/* Selectores para filtrar */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Filtrar por Clase</label>
          <select 
            className="form-select"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Todas las clases</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.name} - {cls.subject}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Filtrar por Estudiante</label>
          <select 
            className="form-select"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Todos los estudiantes</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {grades.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-star display-1 text-muted"></i>
          <h4 className="mt-3">No hay calificaciones registradas</h4>
          <p className="text-muted">Comienza registrando las calificaciones de tus estudiantes</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Calificaciones Registradas</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Clase</th>
                    <th>Tipo</th>
                    <th>Nota</th>
                    <th>Porcentaje</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map(grade => {
                    const percentage = (grade.value / grade.maxValue) * 100
                    return (
                      <tr key={grade.id}>
                        <td>{getStudentName(grade.studentId)}</td>
                        <td>{getClassName(grade.classId)}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {getTypeText(grade.type)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${grade.value >= (grade.maxValue * 0.7) ? 'bg-success' : 'bg-warning'}`}>
                            {grade.value}/{grade.maxValue}
                          </span>
                        </td>
                        <td>{percentage.toFixed(1)}%</td>
                        <td>{new Date(grade.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary"
                              onClick={() => handleViewGrade(grade)}
                              title="Ver detalles"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-outline-warning"
                              onClick={() => handleEditGrade(grade)}
                              title="Editar calificación"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteGrade(grade.id)}
                              title="Eliminar calificación"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
