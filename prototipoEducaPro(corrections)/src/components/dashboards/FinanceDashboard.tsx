import { useState, useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { paymentService, getDashboardStats } from '../../services/dataService'
import type { Payment } from '../../types'

export function FinanceDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleNewPayment = () => {
    navigate('/app/finanzas/pagos')
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

  useEffect(() => {
    const financeId = '5' // ID del financiero actual (simulado)
    
    const paymentsData = paymentService.getAll()
    setPayments(paymentsData)
    
    const userStats = getDashboardStats(financeId, 'finanzas')
    setStats(userStats)
  }, [])

  if (!stats) {
    return <div className="d-flex justify-content-center"><div className="spinner-border"></div></div>
  }

  const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const pendingPayments = payments.filter(p => p.status === 'pending').length
  const overduePayments = payments.filter(p => p.status === 'overdue').length

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
  }

  return (
    <div style={{
      padding: 'var(--space-6)',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Header con búsqueda */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-6)'
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
              margin: 0
            }}>
              Dashboard Financiero
            </h1>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-base)',
              margin: 0
            }}>
              Gestiona pagos, alertas y reportes.
            </p>
          </div>
          
          {/* Barra de búsqueda */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}>
              <input
                type="text"
                placeholder="Buscar transacciones..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  width: '300px',
                  padding: 'var(--space-3) var(--space-4) var(--space-3) var(--space-10)',
                  fontSize: 'var(--font-size-sm)',
                  border: '1px solid var(--color-gray-300)',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-background)',
                  transition: 'border-color var(--transition-fast)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-primary)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--color-gray-300)'
                }}
              />
              <i className="bi bi-search" style={{
                position: 'absolute',
                left: 'var(--space-3)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)'
              }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)'
      }}>
        {/* Ingresos Totales */}
        <div style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-inverse)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--space-2)',
              opacity: 0.9
            }}>
              Ingresos Totales
            </div>
            <div style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 1
            }}>
              ${totalRevenue.toLocaleString()}
            </div>
          </div>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-currency-dollar" style={{
              fontSize: 'var(--font-size-2xl)',
              opacity: 0.8
            }}></i>
          </div>
        </div>

        {/* Pagos Recibidos */}
        <div style={{
          backgroundColor: 'var(--color-success)',
          color: 'var(--color-text-inverse)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--space-2)',
              opacity: 0.9
            }}>
              Pagos Recibidos
            </div>
            <div style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 1
            }}>
              ${totalRevenue.toLocaleString()}
            </div>
          </div>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-file-earmark-check" style={{
              fontSize: 'var(--font-size-2xl)',
              opacity: 0.8
            }}></i>
          </div>
        </div>

        {/* Pagos Pendientes */}
        <div style={{
          backgroundColor: 'var(--color-warning)',
          color: 'var(--color-text-inverse)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--space-2)',
              opacity: 0.9
            }}>
              Pagos Pendientes
            </div>
            <div style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 1
            }}>
              {pendingPayments}
            </div>
          </div>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-hourglass-split" style={{
              fontSize: 'var(--font-size-2xl)',
              opacity: 0.8
            }}></i>
          </div>
        </div>

        {/* Alertas Vencidas */}
        <div style={{
          backgroundColor: 'var(--color-danger)',
          color: 'var(--color-text-inverse)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--space-2)',
              opacity: 0.9
            }}>
              Alertas Vencidas
            </div>
            <div style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 1
            }}>
              {overduePayments}
            </div>
          </div>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-exclamation-circle" style={{
              fontSize: 'var(--font-size-2xl)',
              opacity: 0.8
            }}></i>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 'var(--space-6)'
      }}>
        {/* Left Column - Recent Transactions */}
        <div className="card" style={{
          backgroundColor: 'var(--color-background)',
          border: '1px solid var(--color-gray-200)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: 'var(--space-6)',
            borderBottom: '1px solid var(--color-gray-200)',
            backgroundColor: 'var(--color-background-tertiary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h5 style={{
              margin: 0,
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)'
            }}>
              Transacciones Recientes
            </h5>
            <button style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              cursor: 'pointer',
              textDecoration: 'none'
            }}>
              Ver Todo
            </button>
          </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{
                      textAlign: 'left',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-secondary)',
                      paddingBottom: 'var(--space-4)',
                      borderBottom: '1px solid var(--color-gray-200)'
                    }}>
                      Nombre del Estudiante
                    </th>
                    <th style={{
                      textAlign: 'left',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-secondary)',
                      paddingBottom: 'var(--space-4)',
                      borderBottom: '1px solid var(--color-gray-200)'
                    }}>
                      ID de Factura
                    </th>
                    <th style={{
                      textAlign: 'left',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-secondary)',
                      paddingBottom: 'var(--space-4)',
                      borderBottom: '1px solid var(--color-gray-200)'
                    }}>
                      Monto
                    </th>
                    <th style={{
                      textAlign: 'left',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-secondary)',
                      paddingBottom: 'var(--space-4)',
                      borderBottom: '1px solid var(--color-gray-200)'
                    }}>
                      Estado
                    </th>
                    <th style={{
                      textAlign: 'left',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-secondary)',
                      paddingBottom: 'var(--space-4)',
                      borderBottom: '1px solid var(--color-gray-200)'
                    }}>
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Liam Johnson */}
                  <tr>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--color-primary-100)',
                          borderRadius: 'var(--radius-full)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-primary)'
                        }}>
                          LJ
                        </div>
                        <span style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)'
                        }}>
                          Liam Johnson
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        #INV-12345
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)'
                      }}>
                        $250.00
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        padding: 'var(--space-1) var(--space-2)',
                        backgroundColor: 'var(--color-success)',
                        color: 'var(--color-text-inverse)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}>
                        Pagado
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        25 Oct, 2023
                      </span>
                    </td>
                  </tr>

                  {/* Olivia Smith */}
                  <tr>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--color-info-100)',
                          borderRadius: 'var(--radius-full)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-info)'
                        }}>
                          OS
                        </div>
                        <span style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)'
                        }}>
                          Olivia Smith
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        #INV-12346
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)'
                      }}>
                        $150.00
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        padding: 'var(--space-1) var(--space-2)',
                        backgroundColor: 'var(--color-danger)',
                        color: 'var(--color-text-inverse)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}>
                        Vencido
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        24 Oct, 2023
                      </span>
                    </td>
                  </tr>

                  {/* Noah Williams */}
                  <tr>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--color-warning-100)',
                          borderRadius: 'var(--radius-full)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-warning)'
                        }}>
                          NW
                        </div>
                        <span style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)'
                        }}>
                          Noah Williams
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        #INV-12347
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)'
                      }}>
                        $300.00
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        padding: 'var(--space-1) var(--space-2)',
                        backgroundColor: 'var(--color-warning)',
                        color: 'var(--color-text-inverse)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}>
                        Pendiente
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        23 Oct, 2023
                      </span>
                    </td>
                  </tr>

                  {/* Emma Brown */}
                  <tr>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--color-success-100)',
                          borderRadius: 'var(--radius-full)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-success)'
                        }}>
                          EB
                        </div>
                        <span style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)'
                        }}>
                          Emma Brown
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        #INV-12348
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)'
                      }}>
                        $250.00
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        padding: 'var(--space-1) var(--space-2)',
                        backgroundColor: 'var(--color-success)',
                        color: 'var(--color-text-inverse)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-medium)'
                      }}>
                        Pagado
                      </span>
                    </td>
                    <td style={{ padding: 'var(--space-4) 0' }}>
                      <span style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        22 Oct, 2023
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Generate Report & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Generate Report */}
          <div className="card" style={{
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-gray-200)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: 'var(--space-6)',
              borderBottom: '1px solid var(--color-gray-200)',
              backgroundColor: 'var(--color-background-tertiary)'
            }}>
              <h5 style={{
                margin: 0,
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)'
              }}>
                Generar Reporte
              </h5>
            </div>
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Tipo de Reporte
                </label>
                <select style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  fontSize: 'var(--font-size-sm)',
                  border: '1px solid var(--color-gray-300)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-background)'
                }}>
                  <option>Resumen de Ingresos</option>
                  <option>Reporte de Pagos</option>
                  <option>Análisis Financiero</option>
                </select>
              </div>
              
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-2)'
                }}>
                  Rango de Fechas
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) var(--space-4) var(--space-3) var(--space-3)',
                      fontSize: 'var(--font-size-sm)',
                      border: '1px solid var(--color-gray-300)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-background)'
                    }}
                  />
                  <i className="bi bi-calendar" style={{
                    position: 'absolute',
                    right: 'var(--space-3)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)'
                  }}></i>
                </div>
              </div>
              
              <button 
                onClick={handleGenerateReport}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                  border: '1px solid var(--color-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                }}
              >
                <i className="bi bi-download"></i>
                Descargar Reporte
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-gray-200)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: 'var(--space-6)',
              borderBottom: '1px solid var(--color-gray-200)',
              backgroundColor: 'var(--color-background-tertiary)'
            }}>
              <h5 style={{
                margin: 0,
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)'
              }}>
                Acciones Rápidas
              </h5>
            </div>
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <button 
                  onClick={handleNewPayment}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-gray-200)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-50)'
                    e.currentTarget.style.borderColor = 'var(--color-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = 'var(--color-gray-200)'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--color-primary-50)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-file-earmark-plus" style={{
                      fontSize: 'var(--font-size-base)',
                      color: 'var(--color-primary)'
                    }}></i>
                  </div>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  }}>
                    Nuevo Pago
                  </span>
                </button>

                <button 
                  onClick={handleSendReminders}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-gray-200)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-50)'
                    e.currentTarget.style.borderColor = 'var(--color-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = 'var(--color-gray-200)'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--color-primary-50)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-megaphone" style={{
                      fontSize: 'var(--font-size-base)',
                      color: 'var(--color-primary)'
                    }}></i>
                  </div>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  }}>
                    Enviar Recordatorios de Pago
                  </span>
                </button>

                <button 
                  onClick={handleIncomeAnalysis}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-gray-200)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-success-50)'
                    e.currentTarget.style.borderColor = 'var(--color-success)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = 'var(--color-gray-200)'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--color-success-50)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-file-earmark-dollar" style={{
                      fontSize: 'var(--font-size-base)',
                      color: 'var(--color-success)'
                    }}></i>
                  </div>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  }}>
                    Crear Factura
                  </span>
                </button>
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
