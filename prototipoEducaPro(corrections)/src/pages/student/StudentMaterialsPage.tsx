import { useState } from 'react'

export function StudentMaterialsPage() {
  const [materials] = useState([
    { id: 'm1', title: 'Guía de Matemáticas', type: 'PDF', size: '2.3MB', subject: 'Matemáticas', uploadedDate: '2024-01-15' },
    { id: 'm2', title: 'Presentación de Ciencias', type: 'PPT', size: '5.8MB', subject: 'Ciencias', uploadedDate: '2024-01-10' },
    { id: 'm3', title: 'Ejercicios de Historia', type: 'DOC', size: '1.2MB', subject: 'Historia', uploadedDate: '2024-01-12' },
    { id: 'm4', title: 'Manual de Laboratorio', type: 'PDF', size: '3.5MB', subject: 'Química', uploadedDate: '2024-01-08' },
  ])
  const [filter, setFilter] = useState('all')

  const handleDownload = (material: any) => {
    // Simular descarga
    alert(`Descargando: ${material.title} (${material.size})`)
  }


  const filteredMaterials = filter === 'all' 
    ? materials 
    : materials.filter(m => m.subject.toLowerCase().includes(filter.toLowerCase()))

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return 'bi-file-earmark-pdf text-danger'
      case 'PPT': return 'bi-file-earmark-ppt text-warning'
      case 'DOC': return 'bi-file-earmark-word text-primary'
      case 'XLS': return 'bi-file-earmark-excel text-success'
      default: return 'bi-file-earmark text-secondary'
    }
  }
  return (
    <div className="page-container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="h4 mb-0">Materiales del Curso</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todas las materias</option>
            <option value="matemáticas">Matemáticas</option>
            <option value="ciencias">Ciencias</option>
            <option value="historia">Historia</option>
            <option value="química">Química</option>
          </select>
        </div>
      </div>
      
      <div className="row g-3">
        {filteredMaterials.map(m => (
          <div key={m.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <i className={`bi ${getFileIcon(m.type)} display-6 me-3`}></i>
                  <div className="flex-grow-1">
                    <h6 className="card-title mb-1">{m.title}</h6>
                    <small className="text-muted">{m.subject}</small>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between small text-muted">
                    <span>{m.type} • {m.size}</span>
                    <span>{new Date(m.uploadedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="d-grid">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleDownload(m)}
                  >
                    <i className="bi bi-download me-1"></i>Descargar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-folder-x display-1 text-muted"></i>
          <h4 className="mt-3">No hay materiales</h4>
          <p className="text-muted">No se encontraron materiales para la materia seleccionada</p>
        </div>
      )}

    </div>
  )
}


