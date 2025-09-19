import { useEffect, useState } from 'react'
import { paymentService, parentService } from '../../services/dataService'
import type { Payment } from '../../types'

export function ParentPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  // const [parent, setParent] = useState<Parent | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    const parentId = '2' // ID del padre actual (simulado)
    const parentData = parentService.getById(parentId)
    // setParent(parentData || null)
    
    if (parentData) {
      const paymentsData = paymentService.getByParentId(parentId)
      setPayments(paymentsData)
    }
  }, [])

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(p => p.status === filter)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-success'
      case 'pending':
        return 'bg-warning'
      case 'overdue':
        return 'bg-danger'
      default:
        return 'bg-secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagado'
      case 'pending':
        return 'Pendiente'
      case 'overdue':
        return 'Vencido'
      default:
        return 'Desconocido'
    }
  }

  const handleMakePayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowPaymentModal(true)
  }

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowDetailsModal(true)
  }

  const handleDownloadReceipt = (payment: Payment) => {
    // Simular descarga de recibo
    alert(`Descargando recibo para: ${payment.description}`)
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
    setSelectedPayment(null)
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedPayment(null)
  }

  const handleProcessPayment = () => {
    if (selectedPayment) {
      // Simular procesamiento de pago
      alert(`Pago procesado exitosamente por $${selectedPayment.amount.toLocaleString()}`)
      
      // Actualizar el estado del pago
      setPayments(prev => prev.map(p => 
        p.id === selectedPayment.id ? { ...p, status: 'paid' as const } : p
      ))
      
      handleClosePaymentModal()
    }
  }

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div style={{ width: '100%', padding: '1rem', maxWidth: 'none' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="h4 mb-0">Mis Pagos</h2>
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
          <select 
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="paid">Pagados</option>
            <option value="pending">Pendientes</option>
            <option value="overdue">Vencidos</option>
          </select>
          <button className="btn btn-primary">
            <i className="bi bi-plus me-2"></i>
            <span className="d-none d-sm-inline">Nuevo Pago</span>
            <span className="d-sm-none">Nuevo</span>
          </button>
        </div>
      </div>
      {filteredPayments.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-credit-card display-1 text-muted"></i>
          <h4 className="mt-3">No hay pagos registrados</h4>
          <p className="text-muted">Los pagos aparecerán aquí cuando se generen</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Lista de Pagos</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th className="d-none d-md-table-cell">Fecha Vencimiento</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(payment => (
                    <tr key={payment.id}>
                      <td>
                        <div>
                          <div className="fw-medium">{payment.description}</div>
                          <div className="d-md-none small text-muted">
                            Vence: {new Date(payment.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong>${payment.amount.toLocaleString()}</strong>
                      </td>
                      <td className="d-none d-md-table-cell">{new Date(payment.dueDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(payment.status)}`}>
                          {getStatusText(payment.status)}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {payment.status === 'pending' && (
                            <button 
                              className="btn btn-success" 
                              title="Pagar"
                              onClick={() => handleMakePayment(payment)}
                            >
                              <i className="bi bi-credit-card"></i>
                            </button>
                          )}
                          {payment.status === 'overdue' && (
                            <button 
                              className="btn btn-warning" 
                              title="Urgente"
                              onClick={() => handleMakePayment(payment)}
                            >
                              <i className="bi bi-clock"></i>
                            </button>
                          )}
                          <button 
                            className="btn btn-outline-primary" 
                            title="Ver detalles"
                            onClick={() => handleViewDetails(payment)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          {payment.status === 'paid' && (
                            <button 
                              className="btn btn-outline-secondary" 
                              title="Descargar"
                              onClick={() => handleDownloadReceipt(payment)}
                            >
                              <i className="bi bi-download"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Información de Pagos</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                <li><i className="bi bi-check-circle text-success me-2"></i>Los pagos se procesan en 24-48 horas</li>
                <li><i className="bi bi-clock text-warning me-2"></i>Recuerda pagar antes de la fecha de vencimiento</li>
                <li><i className="bi bi-info-circle text-info me-2"></i>Contacta a finanzas para consultas</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Métodos de Pago</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-primary">Transferencia</span>
                <span className="badge bg-success">Tarjeta</span>
                <span className="badge bg-warning">Efectivo</span>
                <span className="badge bg-info">PSE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para procesar pago */}
      {showPaymentModal && selectedPayment && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Procesar Pago</h5>
                <button type="button" className="btn-close" onClick={handleClosePaymentModal}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Pago Pendiente:</strong> {selectedPayment.description}
                </div>
                
                <div className="card">
                  <div className="card-body">
                    <h6>Detalles del Pago</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Concepto:</span>
                        <span>{selectedPayment.description}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Monto:</span>
                        <span className="fw-bold text-success">${selectedPayment.amount.toLocaleString()}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de vencimiento:</span>
                        <span>{new Date(selectedPayment.dueDate).toLocaleDateString()}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Estado:</span>
                        <span className={`badge ${getStatusBadge(selectedPayment.status)}`}>
                          {getStatusText(selectedPayment.status)}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Este es un sistema de demostración. En un sistema real, aquí se integraría con un procesador de pagos.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClosePaymentModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-success" onClick={handleProcessPayment}>
                  <i className="bi bi-credit-card me-2"></i>
                  Procesar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles de pago */}
      {showDetailsModal && selectedPayment && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Pago</h5>
                <button type="button" className="btn-close" onClick={handleCloseDetailsModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Información General</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Concepto:</span>
                        <span>{selectedPayment.description}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Monto:</span>
                        <span className="fw-bold">${selectedPayment.amount.toLocaleString()}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Estado:</span>
                        <span className={`badge ${getStatusBadge(selectedPayment.status)}`}>
                          {getStatusText(selectedPayment.status)}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Fechas</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de creación:</span>
                        <span>{new Date(selectedPayment.createdAt).toLocaleDateString()}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de vencimiento:</span>
                        <span>{new Date(selectedPayment.dueDate).toLocaleDateString()}</span>
                      </li>
                      {selectedPayment.status === 'paid' && (
                        <li className="list-group-item d-flex justify-content-between">
                          <span>Fecha de pago:</span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {selectedPayment.status === 'paid' && (
                  <div className="mt-3">
                    <div className="alert alert-success">
                      <i className="bi bi-check-circle me-2"></i>
                      <strong>Pago Completado</strong> - Este pago ha sido procesado exitosamente.
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDetailsModal}>
                  Cerrar
                </button>
                {selectedPayment.status === 'paid' && (
                  <button type="button" className="btn btn-primary" onClick={() => handleDownloadReceipt(selectedPayment)}>
                    <i className="bi bi-download me-2"></i>
                    Descargar Recibo
                  </button>
                )}
                {selectedPayment.status !== 'paid' && (
                  <button type="button" className="btn btn-success" onClick={() => {
                    handleCloseDetailsModal()
                    handleMakePayment(selectedPayment)
                  }}>
                    <i className="bi bi-credit-card me-2"></i>
                    Realizar Pago
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
