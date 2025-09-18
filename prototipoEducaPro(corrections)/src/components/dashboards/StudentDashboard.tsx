import { useState, useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { getDashboardStats } from '../../services/dataService'
import type { DashboardStats } from '../../types'

export function StudentDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const handleViewTasks = () => navigate('/app/estudiante/tareas')
  const handleViewGrades = () => navigate('/app/estudiante/calificaciones')
  const handleViewAttendance = () => navigate('/app/estudiante/asistencia')
  const handleViewMaterials = () => navigate('/app/estudiante/materiales')

  useEffect(() => {
    const userId = '1'
    setStats(getDashboardStats(userId, 'estudiante'))
  }, [])

  if (!stats) {
    return <div className="d-flex justify-content-center"><div className="spinner-border"></div></div>
  }

  const weeklyProgress = (() => {
    const total = stats.totalTasks || stats.pendingTasks + stats.completedTasks
    return total ? Math.round((stats.completedTasks / total) * 100) : 0
  })()

  return (
    <div style={{
      padding: 'var(--space-6)',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header simplificado */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
          margin: 0
        }}>
          Dashboard Estudiante
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-base)',
          margin: 0
        }}>
          Resumen general de tu progreso académico
        </p>
      </div>

      {/* Resumen General - KPIs estilo horizontal */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-8)'
      }}>
        {/* Tareas Pendientes */}
        <div className="card" style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-inverse)',
          border: 'none',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          transition: 'all var(--transition-normal)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
        }}>
          <div style={{
            padding: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h6 style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: 'var(--space-2)',
                opacity: 0.9,
                margin: 0
              }}>
                Tareas Pendientes
              </h6>
              <div style={{
                fontSize: 'var(--font-size-4xl)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 1,
                margin: 0
              }}>
                {stats.pendingTasks}
              </div>
            </div>
            <i className="bi bi-journal-text" style={{
              fontSize: 'var(--font-size-3xl)',
              opacity: 0.7
            }}></i>
          </div>
        </div>

        {/* Tareas Completadas */}
        <div className="card" style={{
          backgroundColor: 'var(--color-success)',
          color: 'var(--color-text-inverse)',
          border: 'none',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          transition: 'all var(--transition-normal)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
        }}>
          <div style={{
            padding: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h6 style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: 'var(--space-2)',
                opacity: 0.9,
                margin: 0
              }}>
                Tareas Completadas
              </h6>
              <div style={{
                fontSize: 'var(--font-size-4xl)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 1,
                margin: 0
              }}>
                {stats.completedTasks}
              </div>
            </div>
            <i className="bi bi-check-circle" style={{
              fontSize: 'var(--font-size-3xl)',
              opacity: 0.7
            }}></i>
          </div>
        </div>

        {/* Promedio General */}
        <div className="card" style={{
          backgroundColor: 'var(--color-warning)',
          color: 'var(--color-text-inverse)',
          border: 'none',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          transition: 'all var(--transition-normal)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
        }}>
          <div style={{
            padding: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h6 style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: 'var(--space-2)',
                opacity: 0.9,
                margin: 0
              }}>
                Promedio General
              </h6>
              <div style={{
                fontSize: 'var(--font-size-4xl)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 1,
                margin: 0
              }}>
                {stats.averageGrade.toFixed(1)}
              </div>
            </div>
            <i className="bi bi-star-fill" style={{
              fontSize: 'var(--font-size-3xl)',
              opacity: 0.7
            }}></i>
          </div>
        </div>

        {/* Asistencia */}
        <div className="card" style={{
          backgroundColor: 'var(--color-info)',
          color: 'var(--color-text-inverse)',
          border: 'none',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          transition: 'all var(--transition-normal)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = 'var(--shadow-xl)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
        }}>
          <div style={{
            padding: 'var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h6 style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: 'var(--space-2)',
                opacity: 0.9,
                margin: 0
              }}>
                Asistencia
              </h6>
              <div style={{
                fontSize: 'var(--font-size-4xl)',
                fontWeight: 'var(--font-weight-bold)',
                lineHeight: 1,
                margin: 0
              }}>
                {stats.attendanceRate}%
              </div>
            </div>
            <i className="bi bi-calendar-check" style={{
              fontSize: 'var(--font-size-3xl)',
              opacity: 0.7
            }}></i>
          </div>
        </div>
      </div>

      {/* Progreso Semanal */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
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
              <i className="bi bi-graph-up"></i>
              Progreso Semanal
            </h5>
          </div>
          <div style={{ padding: 'var(--space-8)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-8)',
              alignItems: 'center'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-6)'
              }}>
                <div style={{ position: 'relative' }}>
                  <div 
                    style={{ 
                      width: '140px', 
                      height: '140px', 
                      background: `conic-gradient(var(--color-success) ${weeklyProgress}%, var(--color-gray-200) 0)`,
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    <div style={{ 
                      width: '100px', 
                      height: '100px', 
                      backgroundColor: 'var(--color-background)',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--font-size-xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-primary)'
                    }}>
                      {weeklyProgress}%
                    </div>
                  </div>
                </div>
                <div>
                  <h4 style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-2)',
                    margin: 0
                  }}>
                    Progreso de la Semana
                  </h4>
                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-base)',
                    marginBottom: 'var(--space-4)',
                    margin: '0 0 var(--space-4) 0'
                  }}>
                    Tareas completadas esta semana
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: 'var(--space-3)',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      backgroundColor: 'var(--color-success-50)',
                      color: 'var(--color-success)',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)'
                    }}>
                      Completadas: {stats.completedTasks}
                    </span>
                    <span style={{
                      backgroundColor: 'var(--color-gray-100)',
                      color: 'var(--color-gray-600)',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)'
                    }}>
                      Total: {stats.totalTasks || stats.pendingTasks + stats.completedTasks}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-4)'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--space-6)',
                  backgroundColor: 'var(--color-primary-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-primary-100)'
                }}>
                  <i className="bi bi-journal-text" style={{
                    fontSize: 'var(--font-size-2xl)',
                    color: 'var(--color-primary)',
                    marginBottom: 'var(--space-3)'
                  }}></i>
                  <div style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    {stats.pendingTasks}
                  </div>
                  <small style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    Pendientes
                  </small>
                </div>
                <div style={{
                  textAlign: 'center',
                  padding: 'var(--space-6)',
                  backgroundColor: 'var(--color-success-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-success-100)'
                }}>
                  <i className="bi bi-check-circle" style={{
                    fontSize: 'var(--font-size-2xl)',
                    color: 'var(--color-success)',
                    marginBottom: 'var(--space-3)'
                  }}></i>
                  <div style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-success)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    {stats.completedTasks}
                  </div>
                  <small style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    Completadas
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div>
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
              <i className="bi bi-lightning"></i>
              Acciones Rápidas
            </h5>
          </div>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4)'
            }}>
              <button 
                onClick={handleViewTasks}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-6)',
                  backgroundColor: 'transparent',
                  border: '2px solid var(--color-primary)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  minHeight: '140px',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                  const icon = e.currentTarget.querySelector('i')
                  const title = e.currentTarget.querySelector('h6')
                  const subtitle = e.currentTarget.querySelector('small')
                  if (icon) icon.style.color = 'var(--color-text-inverse)'
                  if (title) title.style.color = 'var(--color-text-inverse)'
                  if (subtitle) subtitle.style.color = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  const icon = e.currentTarget.querySelector('i')
                  const title = e.currentTarget.querySelector('h6')
                  const subtitle = e.currentTarget.querySelector('small')
                  if (icon) icon.style.color = 'var(--color-primary)'
                  if (title) title.style.color = 'var(--color-primary)'
                  if (subtitle) subtitle.style.color = 'var(--color-text-secondary)'
                }}
              >
                <i className="bi bi-journal-text" style={{
                  fontSize: 'var(--font-size-3xl)',
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--space-3)',
                  transition: 'color var(--transition-normal)'
                }}></i>
                <h6 style={{
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-primary)',
                  marginBottom: 'var(--space-2)',
                  margin: '0 0 var(--space-2) 0',
                  transition: 'color var(--transition-normal)'
                }}>
                  Mis Tareas
                </h6>
                <small style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  textAlign: 'center',
                  transition: 'color var(--transition-normal)'
                }}>
                  Ver y gestionar tareas
                </small>
              </button>

              <button 
                onClick={handleViewGrades}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-6)',
                  backgroundColor: 'transparent',
                  border: '2px solid var(--color-success)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  minHeight: '140px',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-success)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                  const icon = e.currentTarget.querySelector('i')
                  const title = e.currentTarget.querySelector('h6')
                  const subtitle = e.currentTarget.querySelector('small')
                  if (icon) icon.style.color = 'var(--color-text-inverse)'
                  if (title) title.style.color = 'var(--color-text-inverse)'
                  if (subtitle) subtitle.style.color = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  const icon = e.currentTarget.querySelector('i')
                  const title = e.currentTarget.querySelector('h6')
                  const subtitle = e.currentTarget.querySelector('small')
                  if (icon) icon.style.color = 'var(--color-success)'
                  if (title) title.style.color = 'var(--color-success)'
                  if (subtitle) subtitle.style.color = 'var(--color-text-secondary)'
                }}
              >
                <i className="bi bi-star" style={{
                  fontSize: 'var(--font-size-3xl)',
                  color: 'var(--color-success)',
                  marginBottom: 'var(--space-3)',
                  transition: 'color var(--transition-normal)'
                }}></i>
                <h6 style={{
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-success)',
                  marginBottom: 'var(--space-2)',
                  margin: '0 0 var(--space-2) 0',
                  transition: 'color var(--transition-normal)'
                }}>
                  Calificaciones
                </h6>
                <small style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  textAlign: 'center',
                  transition: 'color var(--transition-normal)'
                }}>
                  Ver notas y promedios
                </small>
              </button>

              <button 
                onClick={handleViewAttendance}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-6)',
                  backgroundColor: 'transparent',
                  border: '2px solid var(--color-info)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  minHeight: '140px',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-info)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                  const icon = e.currentTarget.querySelector('i')
                  const title = e.currentTarget.querySelector('h6')
                  const subtitle = e.currentTarget.querySelector('small')
                  if (icon) icon.style.color = 'var(--color-text-inverse)'
                  if (title) title.style.color = 'var(--color-text-inverse)'
                  if (subtitle) subtitle.style.color = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  const icon = e.currentTarget.querySelector('i')
                  const title = e.currentTarget.querySelector('h6')
                  const subtitle = e.currentTarget.querySelector('small')
                  if (icon) icon.style.color = 'var(--color-info)'
                  if (title) title.style.color = 'var(--color-info)'
                  if (subtitle) subtitle.style.color = 'var(--color-text-secondary)'
                }}
              >
                <i className="bi bi-calendar-check" style={{
                  fontSize: 'var(--font-size-3xl)',
                  color: 'var(--color-info)',
                  marginBottom: 'var(--space-3)',
                  transition: 'color var(--transition-normal)'
                }}></i>
                <h6 style={{
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-info)',
                  marginBottom: 'var(--space-2)',
                  margin: '0 0 var(--space-2) 0',
                  transition: 'color var(--transition-normal)'
                }}>
                  Asistencia
                </h6>
                <small style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  textAlign: 'center',
                  transition: 'color var(--transition-normal)'
                }}>
                  Consultar asistencia
                </small>
              </button>

              <button 
                onClick={handleViewMaterials}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-6)',
                  backgroundColor: 'transparent',
                  border: '2px solid var(--color-warning)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  minHeight: '140px',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-warning)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                  const icon = e.currentTarget.querySelector('i')
                  const title = e.currentTarget.querySelector('h6')
                  const subtitle = e.currentTarget.querySelector('small')
                  if (icon) icon.style.color = 'var(--color-text-inverse)'
                  if (title) title.style.color = 'var(--color-text-inverse)'
                  if (subtitle) subtitle.style.color = 'rgba(255,255,255,0.8)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  const icon = e.currentTarget.querySelector('i')
                  const title = e.currentTarget.querySelector('h6')
                  const subtitle = e.currentTarget.querySelector('small')
                  if (icon) icon.style.color = 'var(--color-warning)'
                  if (title) title.style.color = 'var(--color-warning)'
                  if (subtitle) subtitle.style.color = 'var(--color-text-secondary)'
                }}
              >
                <i className="bi bi-book" style={{
                  fontSize: 'var(--font-size-3xl)',
                  color: 'var(--color-warning)',
                  marginBottom: 'var(--space-3)',
                  transition: 'color var(--transition-normal)'
                }}></i>
                <h6 style={{
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-warning)',
                  marginBottom: 'var(--space-2)',
                  margin: '0 0 var(--space-2) 0',
                  transition: 'color var(--transition-normal)'
                }}>
                  Materiales
                </h6>
                <small style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  textAlign: 'center',
                  transition: 'color var(--transition-normal)'
                }}>
                  Acceder a recursos
                </small>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  )
}