import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { parentService, getDashboardStats } from '../../services/dataService'
import type { Parent, DashboardStats } from '../../types'

export function ParentDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [parent, setParent] = useState<Parent | null>(null)

  useEffect(() => {
    const parentId = '2' // ID del padre actual (simulado)
    const parentData = parentService.getById(parentId)
    setParent(parentData || null)
    
    const userStats = getDashboardStats(parentId, 'padre')
    setStats(userStats)
  }, [])

  if (!stats || !parent) {
    return <div className="d-flex justify-content-center"><div className="spinner-border"></div></div>
  }

  return (
    <div style={{
      padding: 'var(--space-6)',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header con saludo personalizado */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 'var(--space-6)'
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
              margin: 0
            }}>
              ¡Bienvenido, Sra. Davis!
            </h1>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-base)',
              margin: 0
            }}>
              (Madre de Alex Davis)
            </p>
          </div>
        </div>
      </div>

      {/* Grid principal - 2x2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-8)'
      }}>
        {/* Progreso Académico de Alex - Superior Izquierda */}
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
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}>
              Progreso Académico de Alex
            </h5>
          </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-4)'
            }}>
              {/* Calificación General */}
              <div style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-primary-50)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-primary-100)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--space-1)'
                }}>
                  A-
                </div>
                <small style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  Calificación General
                </small>
              </div>

              {/* Asistencia */}
              <div style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-success-50)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-success-100)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-success)',
                  marginBottom: 'var(--space-1)'
                }}>
                  95%
                </div>
                <small style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  Asistencia
                </small>
              </div>

              {/* Matemáticas */}
              <div style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-warning-50)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-warning-100)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-warning)',
                  marginBottom: 'var(--space-1)'
                }}>
                  B+
                </div>
                <small style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  Matemáticas
                </small>
              </div>

              {/* Literatura */}
              <div style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-info-50)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-info-100)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-info)',
                  marginBottom: 'var(--space-1)'
                }}>
                  A
                </div>
                <small style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  Literatura
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Estado Financiero - Superior Derecha */}
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
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}>
              Estado Financiero
            </h5>
          </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-2)'
              }}>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)'
                }}>
                  Próximo Pago
                </span>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-danger)'
                }}>
                  Vence en 5 días
                </span>
              </div>
              <div style={{
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-1)'
              }}>
                $450.00
              </div>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-4)'
              }}>
                Para la Colegiatura de Noviembre
              </div>
              
              {/* Barra de progreso */}
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--color-gray-200)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
                marginBottom: 'var(--space-4)'
              }}>
                <div style={{
                  width: '60%',
                  height: '100%',
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: 'var(--radius-full)'
                }}></div>
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <button 
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                  border: '1px solid var(--color-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                }}
              >
                Pagar Ahora
              </button>
              <button 
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-gray-300)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background-tertiary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Ver Historial
              </button>
            </div>
          </div>
        </div>

        {/* Evaluaciones Cualitativas - Inferior Izquierda */}
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
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}>
              Evaluaciones Cualitativas
            </h5>
          </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Primera evaluación - Matemáticas */}
              <div style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--space-3)'
                }}>
                  <div>
                    <h6 style={{
                      fontSize: 'var(--font-size-base)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      Matemáticas - Sr. Anderson
                    </h6>
                    <small style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      25 de Octubre, 2023
                    </small>
                  </div>
                  <span style={{
                    padding: 'var(--space-1) var(--space-2)',
                    backgroundColor: 'var(--color-success-50)',
                    color: 'var(--color-success)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}>
                    Positivo
                  </span>
                </div>
                <p style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  Alex muestra gran entusiasmo por la resolución de problemas. Participa constantemente en las discusiones de clase y tiene un fuerte dominio de los conceptos fundamentales. Animarlo a revisar su trabajo ayudará a mejorar aún más sus calificaciones en los exámenes.
                </p>
              </div>

              {/* Segunda evaluación - Educación Física */}
              <div style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--space-3)'
                }}>
                  <div>
                    <h6 style={{
                      fontSize: 'var(--font-size-base)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-1)'
                    }}>
                      Educación Física - Sra. Chen
                    </h6>
                    <small style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      22 de Octubre, 2023
                    </small>
                  </div>
                  <span style={{
                    padding: 'var(--space-1) var(--space-2)',
                    backgroundColor: 'var(--color-warning-50)',
                    color: 'var(--color-warning)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)'
                  }}>
                    Mejora
                  </span>
                </div>
                <p style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  Alex es un excelente jugador de equipo pero a veces olvida su ropa de gimnasio. Por favor, asegúrese de que tenga su uniforme los días de Educación Física para participar completamente.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos Eventos - Inferior Derecha */}
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
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)'
            }}>
              Próximos Eventos
            </h5>
          </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Evento 1 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-primary-50)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="bi bi-calendar-event" style={{
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-primary)'
                  }}></i>
                </div>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    NOV 15: Reunión de Padres y Maestros
                  </div>
                  <small style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    Reunión Virtual
                  </small>
                </div>
              </div>

              {/* Evento 2 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-info-50)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="bi bi-flask" style={{
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-info)'
                  }}></i>
                </div>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    NOV 22: Feria de Ciencias
                  </div>
                  <small style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    Gimnasio de la Escuela
                  </small>
                </div>
              </div>

              {/* Evento 3 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-warning-50)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className="bi bi-snow" style={{
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--color-warning)'
                  }}></i>
                </div>
                <div>
                  <div style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    DIC 05: Comienzan las Vacaciones de Invierno
                  </div>
                  <small style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    Día Festivo Escolar
                  </small>
                </div>
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
