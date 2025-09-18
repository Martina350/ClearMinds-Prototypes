import { useEffect, useState } from 'react'
import { gradeService } from '../../services/dataService'
import type { Grade } from '../../types'

export function StudentGradesPage() {
  const studentId = '1'
  const [grades, setGrades] = useState<Grade[]>([])

  useEffect(() => {
    setGrades(gradeService.getByStudentId(studentId))
  }, [])

  return (
    <div className="page-container">
      <h2 className="h4 mb-3">Mis Notas</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Materia</th>
              <th>Tipo</th>
              <th>Nota</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(g => (
              <tr key={g.id}>
                <td>{g.classId}</td>
                <td>{g.type}</td>
                <td><span className={`badge ${g.value >= 7 ? 'bg-success' : 'bg-warning'}`}>{g.value}/{g.maxValue}</span></td>
                <td>{new Date(g.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


