import { useEffect, useState } from 'react'
import { gradeService, studentService, parentService } from '../../services/dataService'
import type { Grade, Student } from '../../types'

export function ParentGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [students, setStudents] = useState<Student[]>([])
  // const [parent, setParent] = useState<Parent | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string>('')

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
      const studentGrades = gradeService.getByStudentId(selectedStudent)
      setGrades(studentGrades)
    }
  }, [selectedStudent])

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId)
    return student?.name || 'N/A'
  }

  return (
    <div style={{ width: '100%', padding: '1rem', maxWidth: 'none' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="h4 mb-0">Notas de Mis Hijos</h2>
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

      {grades.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-star display-1 text-muted"></i>
          <h4 className="mt-3">No hay notas registradas</h4>
          <p className="text-muted">Las notas aparecerán aquí cuando los docentes las registren</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Notas de {getStudentName(selectedStudent)}</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Materia</th>
                    <th className="d-none d-md-table-cell">Tipo</th>
                    <th>Nota</th>
                    <th className="d-none d-lg-table-cell">Porcentaje</th>
                    <th className="d-none d-md-table-cell">Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map(grade => {
                    const percentage = (grade.value / grade.maxValue) * 100
                    return (
                      <tr key={grade.id}>
                        <td>
                          <div>
                            <div className="fw-medium">Matemáticas</div>
                            <div className="d-md-none small text-muted">
                              <span className="badge bg-secondary">
                                {grade.type === 'homework' ? 'Tarea' : 
                                 grade.type === 'exam' ? 'Examen' : 'Participación'}
                              </span>
                            </div>
                            <div className="d-md-none small text-muted">
                              {new Date(grade.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="d-none d-md-table-cell">
                          <span className="badge bg-secondary">
                            {grade.type === 'homework' ? 'Tarea' : 
                             grade.type === 'exam' ? 'Examen' : 'Participación'}
                          </span>
                        </td>
                        <td>
                          <div>
                            <span className={`badge ${grade.value >= 7 ? 'bg-success' : 'bg-warning'}`}>
                              {grade.value}/{grade.maxValue}
                            </span>
                            <div className="d-lg-none small text-muted">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        </td>
                        <td className="d-none d-lg-table-cell">{percentage.toFixed(1)}%</td>
                        <td className="d-none d-md-table-cell">{new Date(grade.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${grade.value >= 7 ? 'bg-success' : 'bg-danger'}`}>
                            {grade.value >= 7 ? 'Aprobado' : 'Reprobado'}
                          </span>
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
