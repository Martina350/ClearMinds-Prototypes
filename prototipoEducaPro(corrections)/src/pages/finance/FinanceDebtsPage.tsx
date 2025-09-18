import { useEffect, useState } from 'react'
import { paymentService, parentService } from '../../services/dataService'
import type { Payment, Parent } from '../../types'

export function FinanceDebtsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [parents, setParents] = useState<Parent[]>([])
  const [filter, setFilter] = useState<string>('overdue')

  useEffect(() => {
    const paymentsData = paymentService.getAll()
    setPayments(paymentsData)
    
    const parentsData = parentService.getAll()
    setParents(parentsData)
  }, [])

  const getParentName = (parentId: string) => {
    const parent = parents.find(p => p.id === parentId)
    return parent?.name || 'Padre no encontrado'
  }

  const getParentEmail = (parentId: string) => {
    const parent = parents.find(p => p.id === parentId)
    return parent?.email || 'Email no encontrado'
  }

  const getDaysOverdue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = today.getTime() - due.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  const overduePayments = payments.filter(p => p.status === 'overdue')
  const pendingPayments = payments.filter(p => p.status === 'pending')
  
  const totalOverdue = overduePayments.reduce((sum, p) => sum + p.amount, 0)
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0)

  const filteredPayments = filter === 'overdue' ? overduePayments : pendingPayments

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Gestión de Deudas</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            style={{ width: 'auto' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="overdue">Pagos Vencidos</option>
            <option value="pending">Pagos Pendientes</option>
          </select>
          <button 
            className="btn btn-primary"
            onClick={() => {
              const totalDebts = overduePayments.length + pendingPayments.length
              alert(`Enviando recordatorios a ${totalDebts} padres de familia...`)
            }}
          >
            <i className="bi bi-envelope me-2"></i>
            Enviar Recordatorios
          </button>
        </div>
      </div>

      {/* Resumen de deudas */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h6>Pagos Vencidos</h6>
              <h3>${totalOverdue.toLocaleString()}</h3>
              <small>{overduePayments.length} pagos</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h6>Pagos Pendientes</h6>
              <h3>${totalPending.toLocaleString()}</h3>
              <small>{pendingPayments.length} pagos</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h6>Total Deudas</h6>
              <h3>${(totalOverdue + totalPending).toLocaleString()}</h3>
              <small>{overduePayments.length + pendingPayments.length} pagos</small>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de deudas */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            {filter === 'overdue' ? 'Pagos Vencidos' : 'Pagos Pendientes'}
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Padre de Familia</th>
                  <th>Email</th>
                  <th>Monto</th>
                  <th>Fecha Vencimiento</th>
                  <th>Días de Retraso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map(payment => {
                  const daysOverdue = getDaysOverdue(payment.dueDate)
                  
                  return (
                    <tr key={payment.id}>
                      <td>{payment.description}</td>
                      <td>{getParentName(payment.parentId)}</td>
                      <td>{getParentEmail(payment.parentId)}</td>
                      <td>
                        <strong>${payment.amount.toLocaleString()}</strong>
                      </td>
                      <td>{new Date(payment.dueDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${daysOverdue > 30 ? 'bg-danger' : daysOverdue > 7 ? 'bg-warning' : 'bg-secondary'}`}>
                          {daysOverdue} días
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-primary" title="Ver detalles">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-outline-success" title="Marcar como pagado">
                            <i className="bi bi-check"></i>
                          </button>
                          <button className="btn btn-outline-warning" title="Enviar recordatorio">
                            <i className="bi bi-bell"></i>
                          </button>
                          <button className="btn btn-outline-info" title="Contactar">
                            <i className="bi bi-envelope"></i>
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

      {/* Acciones masivas */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Acciones Masivas</h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <button className="btn btn-outline-primary w-100">
                    <i className="bi bi-envelope me-2"></i>
                    Enviar Recordatorios
                  </button>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-outline-success w-100">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Generar Reporte
                  </button>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-outline-warning w-100">
                    <i className="bi bi-calendar me-2"></i>
                    Programar Llamadas
                  </button>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-outline-info w-100">
                    <i className="bi bi-graph-up me-2"></i>
                    Análisis de Deudas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
