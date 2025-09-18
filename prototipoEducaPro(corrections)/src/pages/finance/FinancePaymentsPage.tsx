import { useEffect, useState } from 'react'
import { paymentService, parentService } from '../../services/dataService'
import type { Payment, Parent } from '../../types'

export function FinancePaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [parents, setParents] = useState<Parent[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [newPayment, setNewPayment] = useState({
    parentId: '',
    description: '',
    amount: 0,
    dueDate: '',
    status: 'pending' as 'pending' | 'paid' | 'overdue'
  })
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    const paymentsData = paymentService.getAll()
    setPayments(paymentsData)
    
    const parentsData = parentService.getAll()
    setParents(parentsData)
  }, [])

  const filteredPayments = filter === 'all' 
    ? payments 
    : payments.filter(p => p.status === filter)

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault()
    
    const payment: Payment = {
      id: Date.now().toString(),
      parentId: newPayment.parentId,
      description: newPayment.description,
      amount: newPayment.amount,
      dueDate: newPayment.dueDate,
      status: newPayment.status,
      createdAt: new Date().toISOString()
    }
    
    setPayments([...payments, payment])
    setShowForm(false)
    setNewPayment({ parentId: '', description: '', amount: 0, dueDate: '', status: 'pending' })
    alert('Pago registrado exitosamente')
  }

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowDetailsModal(true)
  }

  const handleMarkAsPaid = (payment: Payment) => {
    if (window.confirm(`¿Marcar como pagado el pago de ${getParentName(payment.parentId)} por $${payment.amount.toLocaleString()}?`)) {
      setPayments(payments.map(p => 
        p.id === payment.id ? { ...p, status: 'paid' as const } : p
      ))
      alert('Pago marcado como pagado')
    }
  }

  const handleSendReminder = (payment: Payment) => {
    alert(`Recordatorio enviado a ${getParentName(payment.parentId)} por el pago de $${payment.amount.toLocaleString()}`)
  }

  const handleDeletePayment = (payment: Payment) => {
    if (window.confirm(`¿Eliminar el pago de ${getParentName(payment.parentId)} por $${payment.amount.toLocaleString()}?`)) {
      setPayments(payments.filter(p => p.id !== payment.id))
      alert('Pago eliminado exitosamente')
    }
  }

  const handleCloseModal = () => {
    setShowDetailsModal(false)
    setSelectedPayment(null)
  }

  const getParentName = (parentId: string) => {
    const parent = parents.find(p => p.id === parentId)
    return parent?.name || 'Padre no encontrado'
  }

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

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Gestión de Pagos</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            style={{ width: 'auto' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="paid">Pagados</option>
            <option value="pending">Pendientes</option>
            <option value="overdue">Vencidos</option>
          </select>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus me-2"></i>
            Nuevo Pago
          </button>
        </div>
      </div>

      {/* Formulario de nuevo pago */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Registrar Nuevo Pago</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitPayment}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Padre de Familia</label>
                  <select 
                    className="form-select"
                    value={newPayment.parentId}
                    onChange={(e) => setNewPayment({ ...newPayment, parentId: e.target.value })}
                    required
                  >
                    <option value="">Selecciona un padre</option>
                    {parents.map(parent => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Estado</label>
                  <select 
                    className="form-select"
                    value={newPayment.status}
                    onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value as any })}
                    required
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="overdue">Vencido</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Descripción</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={newPayment.description}
                    onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                    placeholder="Ej: Matrícula mensual"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Monto</label>
                  <input 
                    type="number"
                    className="form-control"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Fecha de Vencimiento</label>
                  <input 
                    type="date"
                    className="form-control"
                    value={newPayment.dueDate}
                    onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                    required
                  />
                </div>
                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-check me-2"></i>
                      Registrar Pago
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

      {/* Resumen de pagos */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h6>Ingresos Totales</h6>
              <h3>${totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h6>Pendientes</h6>
              <h3>${pendingRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h6>Vencidos</h6>
              <h3>${overdueAmount.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h6>Total Pagos</h6>
              <h3>{payments.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de pagos */}
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
                  <th>Padre de Familia</th>
                  <th>Monto</th>
                  <th>Fecha Vencimiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(payment => (
                  <tr key={payment.id}>
                    <td>{payment.description}</td>
                    <td>{getParentName(payment.parentId)}</td>
                    <td>
                      <strong>${payment.amount.toLocaleString()}</strong>
                    </td>
                    <td>{new Date(payment.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(payment.status)}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary" 
                          title="Ver detalles"
                          onClick={() => handleViewDetails(payment)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-success" 
                          title="Marcar como pagado"
                          onClick={() => handleMarkAsPaid(payment)}
                        >
                          <i className="bi bi-check"></i>
                        </button>
                        <button 
                          className="btn btn-outline-warning" 
                          title="Enviar recordatorio"
                          onClick={() => handleSendReminder(payment)}
                        >
                          <i className="bi bi-bell"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger" 
                          title="Eliminar"
                          onClick={() => handleDeletePayment(payment)}
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

      {/* Modal para ver detalles del pago */}
      {showDetailsModal && selectedPayment && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Pago</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Información del Pago</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Descripción:</span>
                        <span>{selectedPayment.description}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Monto:</span>
                        <span className="fw-bold">${selectedPayment.amount.toLocaleString()}</span>
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
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de creación:</span>
                        <span>{new Date(selectedPayment.createdAt).toLocaleDateString()}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Información del Padre</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Nombre:</span>
                        <span>{getParentName(selectedPayment.parentId)}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>ID del padre:</span>
                        <span className="text-muted small">{selectedPayment.parentId}</span>
                      </li>
                    </ul>
                    
                    <h6 className="mt-3">Acciones Rápidas</h6>
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => {
                          handleMarkAsPaid(selectedPayment)
                          handleCloseModal()
                        }}
                      >
                        <i className="bi bi-check me-2"></i>
                        Marcar como Pagado
                      </button>
                      <button 
                        className="btn btn-warning btn-sm"
                        onClick={() => {
                          handleSendReminder(selectedPayment)
                          handleCloseModal()
                        }}
                      >
                        <i className="bi bi-bell me-2"></i>
                        Enviar Recordatorio
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => {
                    handleDeletePayment(selectedPayment)
                    handleCloseModal()
                  }}
                >
                  <i className="bi bi-trash me-2"></i>
                  Eliminar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
