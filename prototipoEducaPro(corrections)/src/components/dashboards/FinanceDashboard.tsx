import { useState, useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { paymentService, getDashboardStats, userService } from '../../services/dataService'
import type { Payment } from '../../types'

export function FinanceDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const handleLogout = () => {
    userService.logout()
    navigate('/')
  }

  const handleNewPayment = () => {
    navigate('/app/finanzas/pagos')
  }

  const handleExportData = () => {
    // Simular exportación de datos
    const dataStr = JSON.stringify(payments, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'pagos-financieros.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleGenerateReport = () => {
    navigate('/app/finanzas/reportes')
  }

  const handleSendReminders = () => {
    // Simular envío de recordatorios
    alert('Recordatorios enviados a todos los pagos pendientes')
  }

  const handleIncomeAnalysis = () => {
    navigate('/app/finanzas/ingresos')
  }

  const handleViewPayment = () => {
    navigate(`/app/finanzas/pagos`)
  }

  const handleMarkAsPaid = (paymentId: string) => {
    // Simular marcar como pagado
    const updatedPayments = payments.map(p => 
      p.id === paymentId ? { ...p, status: 'paid' as const } : p
    )
    setPayments(updatedPayments)
    setFilteredPayments(updatedPayments)
    alert('Pago marcado como completado')
  }

  const handleSendReminder = () => {
    // Simular envío de recordatorio
    alert('Recordatorio enviado para este pago')
  }

  const handleDeletePayment = (paymentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pago?')) {
      const updatedPayments = payments.filter(p => p.id !== paymentId)
      setPayments(updatedPayments)
      setFilteredPayments(updatedPayments)
      alert('Pago eliminado correctamente')
    }
  }

  useEffect(() => {
    const financeId = '5' // ID del financiero actual (simulado)
    
    const paymentsData = paymentService.getAll()
    setPayments(paymentsData)
    setFilteredPayments(paymentsData)
    
    const userStats = getDashboardStats(financeId, 'finanzas')
    setStats(userStats)
  }, [])

  if (!stats) {
    return <div className="d-flex justify-content-center"><div className="spinner-border"></div></div>
  }

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const pendingRevenue = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)
  const paidPayments = payments.filter(p => p.status === 'paid').length
  const pendingPayments = payments.filter(p => p.status === 'pending').length
  const overduePayments = payments.filter(p => p.status === 'overdue').length

  const handleFilter = (status: string) => {
    let filtered = payments

    // Filtrar por estado
    if (status !== 'all') {
      filtered = filtered.filter(p => p.status === status)
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por fecha
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.dueDate)
        return paymentDate.toDateString() === filterDate.toDateString()
      })
    }

    setFilteredPayments(filtered)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    // Aplicar filtros inmediatamente
    const statusSelect = document.querySelector('select[onChange]') as HTMLSelectElement
    const currentStatus = statusSelect?.value || 'all'
    handleFilter(currentStatus)
  }

  const handleDateChange = (date: string) => {
    setDateFilter(date)
    // Aplicar filtros inmediatamente
    const statusSelect = document.querySelector('select[onChange]') as HTMLSelectElement
    const currentStatus = statusSelect?.value || 'all'
    handleFilter(currentStatus)
  }

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h3 fw-semibold text-dark mb-1">Dashboard Financiero</h1>
          <p className="text-muted">Gestión de pagos y finanzas</p>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="row g-4 mb-4">
        <div className="col-6 col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Ingresos Totales</h6>
                  <h3 className="mb-0">${totalRevenue.toLocaleString()}</h3>
                </div>
                <i className="bi bi-currency-dollar display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Pendientes</h6>
                  <h3 className="mb-0">${pendingRevenue.toLocaleString()}</h3>
                </div>
                <i className="bi bi-clock display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Vencidos</h6>
                  <h3 className="mb-0">${overdueAmount.toLocaleString()}</h3>
                </div>
                <i className="bi bi-exclamation-triangle display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Pagos Procesados</h6>
                  <h3 className="mb-0">{paidPayments}</h3>
                </div>
                <i className="bi bi-check-circle display-4 opacity-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Acciones financieras - Lado derecho */}
        <div className="col-12 col-xl-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Acciones Financieras</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={handleNewPayment}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Registrar Pago
                </button>
                <button className="btn btn-success" onClick={handleGenerateReport}>
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Generar Reporte
                </button>
                <button className="btn btn-warning" onClick={handleSendReminders}>
                  <i className="bi bi-bell me-2"></i>
                  Enviar Recordatorios
                </button>
                <button className="btn btn-info" onClick={handleIncomeAnalysis}>
                  <i className="bi bi-graph-up me-2"></i>
                  Análisis de Ingresos
                </button>
                <button className="btn btn-outline-secondary" onClick={handleExportData}>
                  <i className="bi bi-download me-2"></i>
                  Exportar Datos
                </button>
              </div>
            </div>
          </div>

          {/* Resumen financiero */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Resumen Financiero</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Pagos Completados
                  </div>
                  <span className="badge bg-success rounded-pill">{paidPayments}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-clock text-warning me-2"></i>
                    Pagos Pendientes
                  </div>
                  <span className="badge bg-warning rounded-pill">{pendingPayments}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                    Pagos Vencidos
                  </div>
                  <span className="badge bg-danger rounded-pill">{overduePayments}</span>
                </div>
              </div>
              
              <hr />
              
              <div className="text-center">
                <h6>Ingresos del Mes</h6>
                <h3 className="text-success">${totalRevenue.toLocaleString()}</h3>
                <small className="text-muted">Total recaudado</small>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal - Lado izquierdo */}
        <div className="col-12 col-xl-9">
          {/* Filtros y búsqueda */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Filtros de Búsqueda</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Estado del Pago</label>
                  <select 
                    className="form-select" 
                    onChange={(e) => handleFilter(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="paid">Pagados</option>
                    <option value="pending">Pendientes</option>
                    <option value="overdue">Vencidos</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Rango de Fechas</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={dateFilter}
                    onChange={(e) => handleDateChange(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Buscar</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Buscar por descripción..." 
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lista de pagos */}
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Gestión de Pagos</h5>
              <div className="btn-group btn-group-sm">
                <button className="btn btn-primary" onClick={handleNewPayment}>
                  <i className="bi bi-plus me-1"></i>Nuevo Pago
                </button>
                <button className="btn btn-outline-secondary" onClick={handleExportData}>
                  <i className="bi bi-download me-1"></i>Exportar
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Descripción</th>
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
                        <td>
                          <strong>${payment.amount.toLocaleString()}</strong>
                        </td>
                        <td>{new Date(payment.dueDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${
                            payment.status === 'paid' ? 'bg-success' :
                            payment.status === 'overdue' ? 'bg-danger' : 'bg-warning'
                          }`}>
                            {payment.status === 'paid' ? 'Pagado' :
                             payment.status === 'overdue' ? 'Vencido' : 'Pendiente'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary" 
                              title="Ver detalles"
                              onClick={() => handleViewPayment()}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-outline-success" 
                              title="Marcar como pagado"
                              onClick={() => handleMarkAsPaid(payment.id)}
                            >
                              <i className="bi bi-check"></i>
                            </button>
                            <button 
                              className="btn btn-outline-warning" 
                              title="Enviar recordatorio"
                              onClick={() => handleSendReminder()}
                            >
                              <i className="bi bi-bell"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger" 
                              title="Eliminar"
                              onClick={() => handleDeletePayment(payment.id)}
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
        </div>
      </div>
      
      {/* Renderizar las rutas anidadas */}
      <Outlet />
    </div>
  )
}
