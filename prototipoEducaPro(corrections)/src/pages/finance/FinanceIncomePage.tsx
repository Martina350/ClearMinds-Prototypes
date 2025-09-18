import { useEffect, useState } from 'react'
import { paymentService } from '../../services/dataService'
import type { Payment } from '../../types'

export function FinanceIncomePage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    const paymentsData = paymentService.getAll()
    setPayments(paymentsData)
  }, [])

  const getFilteredPayments = () => {
    const currentDate = new Date()
    const year = selectedYear
    
    return payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt)
      const paymentYear = paymentDate.getFullYear()
      
      if (paymentYear !== year) return false
      
      if (selectedPeriod === 'month') {
        return paymentDate.getMonth() === currentDate.getMonth()
      } else if (selectedPeriod === 'quarter') {
        const quarter = Math.floor(currentDate.getMonth() / 3)
        const paymentQuarter = Math.floor(paymentDate.getMonth() / 3)
        return paymentQuarter === quarter
      } else if (selectedPeriod === 'year') {
        return true
      }
      
      return false
    })
  }

  const filteredPayments = getFilteredPayments()
  const paidPayments = filteredPayments.filter(p => p.status === 'paid')
  const pendingPayments = filteredPayments.filter(p => p.status === 'pending')
  const overduePayments = filteredPayments.filter(p => p.status === 'overdue')

  const totalIncome = paidPayments.reduce((sum, p) => sum + p.amount, 0)
  const pendingIncome = pendingPayments.reduce((sum, p) => sum + p.amount, 0)
  const overdueIncome = overduePayments.reduce((sum, p) => sum + p.amount, 0)

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'month':
        return 'Mes Actual'
      case 'quarter':
        return 'Trimestre Actual'
      case 'year':
        return 'Año Actual'
      default:
        return 'Período'
    }
  }

  const getMonthlyData = () => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthPayments = payments.filter(p => {
        const paymentDate = new Date(p.createdAt)
        return paymentDate.getFullYear() === selectedYear && 
               paymentDate.getMonth() === i &&
               p.status === 'paid'
      })
      
      return {
        month: i + 1,
        income: monthPayments.reduce((sum, p) => sum + p.amount, 0),
        count: monthPayments.length
      }
    })
    
    return monthlyData
  }

  const monthlyData = getMonthlyData()
  const maxIncome = Math.max(...monthlyData.map(d => d.income))

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Análisis de Ingresos</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            style={{ width: 'auto' }}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="month">Mes Actual</option>
            <option value="quarter">Trimestre Actual</option>
            <option value="year">Año Actual</option>
          </select>
          <select 
            className="form-select"
            style={{ width: 'auto' }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <option value={2023}>2023</option>
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>

      {/* Resumen de ingresos */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h6>Ingresos {getPeriodLabel()}</h6>
              <h3>${totalIncome.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h6>Pendientes</h6>
              <h3>${pendingIncome.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body text-center">
              <h6>Vencidos</h6>
              <h3>${overdueIncome.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h6>Pagos Procesados</h6>
              <h3>{paidPayments.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de ingresos mensuales */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Ingresos Mensuales - {selectedYear}</h5>
            </div>
            <div className="card-body">
              <div className="row">
                {monthlyData.map(data => {
                  const percentage = maxIncome > 0 ? (data.income / maxIncome) * 100 : 0
                  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
                  
                  return (
                    <div key={data.month} className="col-md-1">
                      <div className="text-center">
                        <div className="mb-2">
                          <div 
                            className="bg-primary rounded"
                            style={{ 
                              height: `${Math.max(percentage * 2, 20)}px`,
                              width: '100%',
                              minHeight: '20px'
                            }}
                          ></div>
                        </div>
                        <small className="text-muted">{monthNames[data.month - 1]}</small>
                        <br />
                        <small className="text-success">${data.income.toLocaleString()}</small>
                        <br />
                        <small className="text-muted">{data.count} pagos</small>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis detallado */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Distribución de Ingresos</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Ingresos Confirmados</span>
                <span className="badge bg-success">${totalIncome.toLocaleString()}</span>
              </div>
              <div className="progress mb-3">
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: '100%' }}
                ></div>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Pendientes</span>
                <span className="badge bg-warning">${pendingIncome.toLocaleString()}</span>
              </div>
              <div className="progress mb-3">
                <div 
                  className="progress-bar bg-warning" 
                  style={{ width: `${totalIncome > 0 ? (pendingIncome / totalIncome) * 100 : 0}%` }}
                ></div>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Vencidos</span>
                <span className="badge bg-danger">${overdueIncome.toLocaleString()}</span>
              </div>
              <div className="progress mb-3">
                <div 
                  className="progress-bar bg-danger" 
                  style={{ width: `${totalIncome > 0 ? (overdueIncome / totalIncome) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Estadísticas de Pago</h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between">
                  <span>Promedio por Pago</span>
                  <span className="badge bg-primary">
                    ${paidPayments.length > 0 ? (totalIncome / paidPayments.length).toLocaleString() : '0'}
                  </span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>Tasa de Cobro</span>
                  <span className="badge bg-success">
                    {filteredPayments.length > 0 ? ((paidPayments.length / filteredPayments.length) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>Pagos Vencidos</span>
                  <span className="badge bg-danger">
                    {filteredPayments.length > 0 ? ((overduePayments.length / filteredPayments.length) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>Total Transacciones</span>
                  <span className="badge bg-info">{filteredPayments.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Acciones Rápidas</h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => alert('Exportando reporte de ingresos...')}
                  >
                    <i className="bi bi-download me-2"></i>
                    Exportar Reporte
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-success w-100"
                    onClick={() => alert('Generando gráfico de ingresos...')}
                  >
                    <i className="bi bi-graph-up me-2"></i>
                    Generar Gráfico
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-warning w-100"
                    onClick={() => alert('Enviando recordatorios de pagos...')}
                  >
                    <i className="bi bi-bell me-2"></i>
                    Enviar Recordatorios
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-outline-info w-100"
                    onClick={() => alert('Programando cobros automáticos...')}
                  >
                    <i className="bi bi-calendar me-2"></i>
                    Programar Cobros
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
