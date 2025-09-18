import { useEffect, useState } from 'react'
import { paymentService, parentService } from '../../services/dataService'
import type { Payment, Parent } from '../../types'

export function FinanceReportsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [parents, setParents] = useState<Parent[]>([])
  const [selectedReport, setSelectedReport] = useState<string>('')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    const paymentsData = paymentService.getAll()
    setPayments(paymentsData)
    
    const parentsData = parentService.getAll()
    setParents(parentsData)
  }, [])

  const generateReport = () => {
    if (!selectedReport) {
      alert('Selecciona un tipo de reporte')
      return
    }
    
    // Simular generación de reporte
    alert(`Generando reporte: ${selectedReport}`)
  }

  const handleExportExcel = () => {
    if (!selectedReport) {
      alert('Selecciona un tipo de reporte primero')
      return
    }
    alert(`Exportando reporte ${selectedReport} a Excel...`)
  }

  const handleExportPDF = () => {
    if (!selectedReport) {
      alert('Selecciona un tipo de reporte primero')
      return
    }
    alert(`Exportando reporte ${selectedReport} a PDF...`)
  }

  const handleExportCSV = () => {
    if (!selectedReport) {
      alert('Selecciona un tipo de reporte primero')
      return
    }
    alert(`Exportando reporte ${selectedReport} a CSV...`)
  }

  const handlePrint = () => {
    if (!selectedReport) {
      alert('Selecciona un tipo de reporte primero')
      return
    }
    window.print()
  }

  const handleMonthlyReport = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    setDateRange({
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    })
    setSelectedReport('payments')
    alert('Reporte mensual configurado')
  }

  const handleQuarterlyReport = () => {
    const today = new Date()
    const quarter = Math.floor(today.getMonth() / 3)
    const firstDay = new Date(today.getFullYear(), quarter * 3, 1)
    const lastDay = new Date(today.getFullYear(), quarter * 3 + 3, 0)
    
    setDateRange({
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    })
    setSelectedReport('payments')
    alert('Reporte trimestral configurado')
  }

  const handleYearlyReport = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), 0, 1)
    const lastDay = new Date(today.getFullYear(), 11, 31)
    
    setDateRange({
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    })
    setSelectedReport('payments')
    alert('Reporte anual configurado')
  }

  const handleTrendAnalysis = () => {
    alert('Generando análisis de tendencias...')
  }

  const getFilteredPayments = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      return payments
    }
    
    return payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt)
      const start = new Date(dateRange.startDate)
      const end = new Date(dateRange.endDate)
      
      return paymentDate >= start && paymentDate <= end
    })
  }

  const filteredPayments = getFilteredPayments()

  const getReportData = () => {
    switch (selectedReport) {
      case 'payments':
        return {
          title: 'Reporte de Pagos',
          data: filteredPayments.map(payment => ({
            descripción: payment.description,
            padre: parents.find(p => p.id === payment.parentId)?.name || 'N/A',
            monto: `$${payment.amount.toLocaleString()}`,
            fechaVencimiento: new Date(payment.dueDate).toLocaleDateString(),
            estado: payment.status === 'paid' ? 'Pagado' : payment.status === 'pending' ? 'Pendiente' : 'Vencido',
            fechaCreación: new Date(payment.createdAt).toLocaleDateString()
          }))
        }
      case 'income':
        return {
          title: 'Reporte de Ingresos',
          data: filteredPayments.filter(p => p.status === 'paid').map(payment => ({
            descripción: payment.description,
            padre: parents.find(p => p.id === payment.parentId)?.name || 'N/A',
            monto: `$${payment.amount.toLocaleString()}`,
            fechaPago: new Date(payment.createdAt).toLocaleDateString(),
            método: 'Transferencia' // Simulado
          }))
        }
      case 'pending':
        return {
          title: 'Reporte de Pagos Pendientes',
          data: filteredPayments.filter(p => p.status === 'pending').map(payment => ({
            descripción: payment.description,
            padre: parents.find(p => p.id === payment.parentId)?.name || 'N/A',
            monto: `$${payment.amount.toLocaleString()}`,
            fechaVencimiento: new Date(payment.dueDate).toLocaleDateString(),
            díasVencido: Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24))
          }))
        }
      case 'overdue':
        return {
          title: 'Reporte de Pagos Vencidos',
          data: filteredPayments.filter(p => p.status === 'overdue').map(payment => ({
            descripción: payment.description,
            padre: parents.find(p => p.id === payment.parentId)?.name || 'N/A',
            monto: `$${payment.amount.toLocaleString()}`,
            fechaVencimiento: new Date(payment.dueDate).toLocaleDateString(),
            díasVencido: Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 60 * 60 * 24))
          }))
        }
      default:
        return { title: '', data: [] }
    }
  }

  const reportData = getReportData()

  const totalIncome = filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const overdueAmount = filteredPayments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Reportes Financieros</h2>
        <div className="d-flex gap-2">
          <input 
            type="date"
            className="form-control"
            style={{ width: 'auto' }}
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          />
          <input 
            type="date"
            className="form-control"
            style={{ width: 'auto' }}
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          />
          <select 
            className="form-select"
            style={{ width: 'auto' }}
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
          >
            <option value="">Selecciona un reporte</option>
            <option value="payments">Todos los Pagos</option>
            <option value="income">Ingresos</option>
            <option value="pending">Pagos Pendientes</option>
            <option value="overdue">Pagos Vencidos</option>
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

      {/* Resumen financiero */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h6>Ingresos Totales</h6>
              <h3>${totalIncome.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h6>Pendientes</h6>
              <h3>${pendingAmount.toLocaleString()}</h3>
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
              <h6>Total Transacciones</h6>
              <h3>{filteredPayments.length}</h3>
            </div>
          </div>
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
                <p className="text-muted">No se encontraron datos para este reporte en el rango de fechas seleccionado</p>
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
                      <tr key={`finance-report-row-${index}`}>
                        {Object.values(row).map((value, idx) => (
                          <td key={`finance-report-cell-${index}-${idx}`}>{value}</td>
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
                      onClick={handleExportExcel}
                    >
                      <i className="bi bi-file-earmark-excel me-2"></i>
                      Exportar a Excel
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button 
                      className="btn btn-outline-success w-100"
                      onClick={handleExportPDF}
                    >
                      <i className="bi bi-file-earmark-pdf me-2"></i>
                      Exportar a PDF
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button 
                      className="btn btn-outline-info w-100"
                      onClick={handleExportCSV}
                    >
                      <i className="bi bi-file-earmark-text me-2"></i>
                      Exportar a CSV
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button 
                      className="btn btn-outline-warning w-100"
                      onClick={handlePrint}
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

      {/* Reportes predefinidos */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Reportes Predefinidos</h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={handleMonthlyReport}
                  >
                    <i className="bi bi-calendar-month me-2"></i>
                    Reporte Mensual
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-success w-100"
                    onClick={handleQuarterlyReport}
                  >
                    <i className="bi bi-calendar3 me-2"></i>
                    Reporte Trimestral
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-info w-100"
                    onClick={handleYearlyReport}
                  >
                    <i className="bi bi-calendar-year me-2"></i>
                    Reporte Anual
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-warning w-100"
                    onClick={handleTrendAnalysis}
                  >
                    <i className="bi bi-graph-up me-2"></i>
                    Análisis de Tendencias
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
