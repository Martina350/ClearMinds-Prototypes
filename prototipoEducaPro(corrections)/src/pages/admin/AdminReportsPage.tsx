import { useEffect, useState } from 'react'
import { studentService, teacherService, classService, gradeService, taskService } from '../../services/dataService'
import type { Student, Teacher, Class, Grade, Task } from '../../types'

export function AdminReportsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedReport, setSelectedReport] = useState<string>('')

  useEffect(() => {
    const studentsData = studentService.getAll()
    setStudents(studentsData)
    
    const teachersData = teacherService.getAll()
    setTeachers(teachersData)
    
    const classesData = classService.getAll()
    setClasses(classesData)
    
    const gradesData = gradeService.getAll()
    setGrades(gradesData)
    
    const tasksData = taskService.getAll()
    setTasks(tasksData)
  }, [])

  const generateReport = () => {
    if (!selectedReport) {
      alert('Selecciona un tipo de reporte')
      return
    }
    
    const reportData = getReportData()
    if (reportData.data.length === 0) {
      alert('No hay datos para generar el reporte')
      return
    }
    
    // Generar CSV
    const csvContent = [
      Object.keys(reportData.data[0]),
      ...reportData.data.map(row => Object.values(row))
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${selectedReport}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    if (!selectedReport) {
      alert('Selecciona un tipo de reporte')
      return
    }
    
    const reportData = getReportData()
    if (reportData.data.length === 0) {
      alert('No hay datos para exportar')
      return
    }
    
    // Generar CSV (simulando Excel)
    const csvContent = [
      Object.keys(reportData.data[0]),
      ...reportData.data.map(row => Object.values(row))
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${selectedReport}_${new Date().toISOString().split('T')[0]}.xlsx`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    if (!selectedReport) {
      alert('Selecciona un tipo de reporte')
      return
    }
    
    const reportData = getReportData()
    if (reportData.data.length === 0) {
      alert('No hay datos para exportar')
      return
    }
    
    // Simular exportación a PDF
    alert(`Exportando ${reportData.title} a PDF...\nFuncionalidad de PDF en desarrollo`)
  }

  const exportToCSV = () => {
    generateReport()
  }

  const printReport = () => {
    if (!selectedReport) {
      alert('Selecciona un tipo de reporte')
      return
    }
    
    const reportData = getReportData()
    if (reportData.data.length === 0) {
      alert('No hay datos para imprimir')
      return
    }
    
    window.print()
  }

  const getReportData = () => {
    switch (selectedReport) {
      case 'students':
        return {
          title: 'Reporte de Estudiantes',
          data: students.map(student => ({
            nombre: student.name,
            grado: student.grade,
            email: student.email,
            clases: student.classIds.length,
            fechaRegistro: new Date(student.createdAt).toLocaleDateString()
          }))
        }
      case 'teachers':
        return {
          title: 'Reporte de Docentes',
          data: teachers.map(teacher => ({
            nombre: teacher.name,
            materia: teacher.subject,
            email: teacher.email,
            clases: teacher.classIds.length,
            fechaRegistro: new Date(teacher.createdAt).toLocaleDateString()
          }))
        }
      case 'grades':
        return {
          title: 'Reporte de Calificaciones',
          data: grades.map(grade => ({
            estudiante: students.find(s => s.id === grade.studentId)?.name || 'N/A',
            clase: classes.find(c => c.id === grade.classId)?.name || 'N/A',
            tipo: grade.type,
            nota: `${grade.value}/${grade.maxValue}`,
            fecha: new Date(grade.createdAt).toLocaleDateString()
          }))
        }
      case 'classes':
        return {
          title: 'Reporte de Clases',
          data: classes.map(cls => ({
            nombre: cls.name,
            materia: cls.subject,
            docente: teachers.find(t => t.id === cls.teacherId)?.name || 'N/A',
            estudiantes: cls.studentIds.length,
            horario: cls.schedule,
            aula: cls.room
          }))
        }
      default:
        return { title: '', data: [] }
    }
  }

  const reportData = getReportData()

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Reportes del Sistema</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            style={{ width: 'auto' }}
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
          >
            <option value="">Selecciona un reporte</option>
            <option value="students">Reporte de Estudiantes</option>
            <option value="teachers">Reporte de Docentes</option>
            <option value="classes">Reporte de Clases</option>
            <option value="grades">Reporte de Calificaciones</option>
            <option value="attendance">Reporte de Asistencia</option>
            <option value="tasks">Reporte de Tareas</option>
          </select>
          <button 
            className="btn btn-primary"
            onClick={generateReport}
            disabled={!selectedReport}
          >
            <i className="bi bi-download me-2"></i>
            Generar Reporte
          </button>
        </div>
      </div>

      {/* Vista previa del reporte */}
      {selectedReport && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Vista Previa: {reportData.title}</h5>
          </div>
          <div className="card-body">
            {reportData.data.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-file-earmark-text display-1 text-muted"></i>
                <h4 className="mt-3">No hay datos disponibles</h4>
                <p className="text-muted">No se encontraron datos para este reporte</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      {Object.keys(reportData.data[0]).map(key => (
                        <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.data.slice(0, 10).map((row, index) => (
                      <tr key={`report-row-${index}`}>
                        {Object.values(row).map((value, idx) => (
                          <td key={`report-cell-${index}-${idx}`}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {reportData.data.length > 10 && (
                  <div className="text-center mt-3">
                    <p className="text-muted">Mostrando 10 de {reportData.data.length} registros</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Opciones de exportación */}
      {selectedReport && reportData.data.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">Opciones de Exportación</h6>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-3">
                    <button 
                      className="btn btn-outline-primary w-100"
                      onClick={exportToExcel}
                    >
                      <i className="bi bi-file-earmark-excel me-2"></i>
                      Exportar a Excel
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button 
                      className="btn btn-outline-success w-100"
                      onClick={exportToPDF}
                    >
                      <i className="bi bi-file-earmark-pdf me-2"></i>
                      Exportar a PDF
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button 
                      className="btn btn-outline-info w-100"
                      onClick={exportToCSV}
                    >
                      <i className="bi bi-file-earmark-text me-2"></i>
                      Exportar a CSV
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button 
                      className="btn btn-outline-warning w-100"
                      onClick={printReport}
                    >
                      <i className="bi bi-printer me-2"></i>
                      Imprimir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
