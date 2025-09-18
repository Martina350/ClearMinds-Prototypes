import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { getDashboardStats } from '../../services/dataService'
import type { DashboardStats } from '../../types'

export function StudentDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const userId = '1'
    setStats(getDashboardStats(userId, 'estudiante'))
  }, [])

  if (!stats) {
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
              ¡Bienvenido, Estudiante!
            </h1>
            <p style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-base)',
              margin: 0
            }}>
              Revisemos tu progreso académico hoy.
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
        {/* Calificaciones - Superior Izquierda */}
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
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <i className="bi bi-star-fill"></i>
              Calificaciones
            </h5>
                  </div>
          <div style={{ padding: 'var(--space-6)' }}>
            {/* Matemáticas */}
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
                  Matemáticas
                </span>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-success)'
                }}>
                  A+ (92%)
                </span>
                </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--color-gray-200)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '92%',
                  height: '100%',
                  backgroundColor: 'var(--color-success)',
                  borderRadius: 'var(--radius-full)'
                }}></div>
              </div>
            </div>

            {/* Física */}
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
                  Física
                </span>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-info)'
                }}>
                  B (85%)
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--color-gray-200)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '85%',
                  height: '100%',
                  backgroundColor: 'var(--color-info)',
                  borderRadius: 'var(--radius-full)'
                }}></div>
              </div>
                  </div>

            {/* Historia */}
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
                  Historia
                </span>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-warning)'
                }}>
                  C+ (78%)
                </span>
                </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--color-gray-200)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '78%',
                  height: '100%',
                  backgroundColor: 'var(--color-warning)',
                  borderRadius: 'var(--radius-full)'
                }}></div>
              </div>
            </div>

            {/* Literatura */}
                  <div>
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
                  Literatura
                </span>
                <span style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-success)'
                }}>
                  A+ (95%)
                </span>
                  </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--color-gray-200)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '95%',
                  height: '100%',
                  backgroundColor: 'var(--color-success)',
                  borderRadius: 'var(--radius-full)'
                }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Asistencia - Superior Derecha */}
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
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <i className="bi bi-calendar-check"></i>
              Asistencia
            </h5>
          </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-6)'
            }}>
              {/* Indicador circular */}
              <div style={{ position: 'relative' }}>
                <div 
                  style={{ 
                    width: '120px', 
                    height: '120px', 
                    background: `conic-gradient(var(--color-success) ${stats.attendanceRate}%, var(--color-gray-200) 0)`,
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    backgroundColor: 'var(--color-background)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)'
                  }}>
                    <span style={{ color: 'var(--color-success)' }}>{stats.attendanceRate}%</span>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Presente</span>
                  </div>
                </div>
              </div>
              
              {/* Estadísticas */}
                  <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-3)'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--color-success)',
                    borderRadius: 'var(--radius-full)'
                  }}></div>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-primary)'
                  }}>
                    234 días Presente
                  </span>
                  </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--color-danger)',
                    borderRadius: 'var(--radius-full)'
                  }}></div>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-primary)'
                  }}>
                    10 días Ausente
                  </span>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Observaciones del Docente - Inferior Izquierda */}
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
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <i className="bi bi-eye"></i>
              Observaciones del Docente
            </h5>
          </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Primera observación */}
              <div style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)'
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
                  <i className="bi bi-megaphone" style={{
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--color-info)'
                  }}></i>
                </div>
                <div>
                  <p style={{
                    margin: 0,
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.5
                  }}>
                    Excelente participación en las discusiones de clase.
                  </p>
                  <small style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-xs)'
                  }}>
                    Del Sr. Harrison - Física
                  </small>
        </div>
      </div>

              {/* Segunda observación */}
              <div style={{
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-background)',
                border: '1px solid var(--color-gray-200)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)'
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
                  <i className="bi bi-briefcase" style={{
                    fontSize: 'var(--font-size-lg)',
                    color: 'var(--color-warning)'
                  }}></i>
              </div>
                <div>
                  <p style={{
                    margin: 0,
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.5
                  }}>
                    Tarea pendiente sobre la Revolución Francesa.
                  </p>
                  <small style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-xs)'
                  }}>
                    De la Sra. Davis - Historia
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enlaces Rápidos de Clases - Inferior Derecha */}
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
              color: 'var(--color-text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <i className="bi bi-link-45deg"></i>
              Enlaces Rápidos de Clases
            </h5>
            </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* Enlace a Clase de Matemáticas */}
              <button 
                onClick={() => window.open('#', '_blank')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none'
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--color-info-50)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-camera-video" style={{
                      fontSize: 'var(--font-size-lg)',
                      color: 'var(--color-info)'
                    }}></i>
                      </div>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  }}>
                    Unirse a Clase de Matemáticas
                  </span>
                </div>
                <i className="bi bi-arrow-right" style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)'
                }}></i>
              </button>

              {/* Enlace a Laboratorio Virtual de Física */}
              <button 
                onClick={() => window.open('#', '_blank')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none'
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--color-gray-100)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-microscope" style={{
                      fontSize: 'var(--font-size-lg)',
                      color: 'var(--color-gray-600)'
                    }}></i>
            </div>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  }}>
                    Laboratorio Virtual de Física
                  </span>
          </div>
                <i className="bi bi-arrow-right" style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)'
                }}></i>
              </button>

              {/* Enlace a Material de Lectura de Historia */}
              <button 
                onClick={() => window.open('#', '_blank')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-gray-200)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-warning-50)'
                  e.currentTarget.style.borderColor = 'var(--color-warning)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'var(--color-gray-200)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--color-gray-100)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-book" style={{
                      fontSize: 'var(--font-size-lg)',
                      color: 'var(--color-gray-600)'
                    }}></i>
            </div>
                  <span style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)'
                  }}>
                    Material de Lectura de Historia
                  </span>
                </div>
                <i className="bi bi-arrow-right" style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-secondary)'
                }}></i>
              </button>
            </div>
          </div>
        </div>
      </div>


      <Outlet />
    </div>
  )
}