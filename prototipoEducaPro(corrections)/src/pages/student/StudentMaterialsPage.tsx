import { useState } from 'react'

export function StudentMaterialsPage() {
  const [materials] = useState([
    { id: 'm1', title: 'Guía de Matemáticas', type: 'PDF', size: '2.3MB', subject: 'Matemáticas', uploadedDate: '2024-01-15' },
    { id: 'm2', title: 'Presentación de Ciencias', type: 'PPT', size: '5.8MB', subject: 'Ciencias', uploadedDate: '2024-01-10' },
    { id: 'm3', title: 'Ejercicios de Historia', type: 'DOC', size: '1.2MB', subject: 'Historia', uploadedDate: '2024-01-12' },
    { id: 'm4', title: 'Manual de Laboratorio', type: 'PDF', size: '3.5MB', subject: 'Química', uploadedDate: '2024-01-08' },
  ])
  const [showMaterialModal, setShowMaterialModal] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)
  const [filter, setFilter] = useState('all')

  const handleDownload = (material: any) => {
    // Simular descarga
    alert(`Descargando: ${material.title} (${material.size})`)
  }

  const handleViewDetails = (material: any) => {
    setSelectedMaterial(material)
    setShowMaterialModal(true)
  }

  const handleCloseModal = () => {
    setShowMaterialModal(false)
    setSelectedMaterial(null)
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
                
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleDownload(m)}
                  >
                    <i className="bi bi-download me-1"></i>Descargar
                  </button>
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleViewDetails(m)}
                  >
                    <i className="bi bi-eye me-1"></i>Ver Detalles
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

      {/* Modal para ver detalles del material */}
      {showMaterialModal && selectedMaterial && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`bi ${getFileIcon(selectedMaterial.type)} me-2`}></i>
                  {selectedMaterial.title}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-8">
                    <h6>Información del Archivo</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Título:</span>
                        <span>{selectedMaterial.title}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Materia:</span>
                        <span className="badge bg-primary">{selectedMaterial.subject}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Tipo:</span>
                        <span className="badge bg-secondary">{selectedMaterial.type}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Tamaño:</span>
                        <span>{selectedMaterial.size}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Subido:</span>
                        <span>{new Date(selectedMaterial.uploadedDate).toLocaleDateString()}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-4">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <i className={`bi ${getFileIcon(selectedMaterial.type)} display-1 mb-3`}></i>
                        <h6>Vista Previa</h6>
                        <p className="small text-muted">Archivo {selectedMaterial.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={() => {
                  handleDownload(selectedMaterial)
                  handleCloseModal()
                }}>
                  <i className="bi bi-download me-2"></i>
                  Descargar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


