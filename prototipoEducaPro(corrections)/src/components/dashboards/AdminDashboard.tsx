import { useState, useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { studentService, teacherService, getDashboardStats } from '../../services/dataService'
import type { Student, Teacher } from '../../types'

export function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])

  const go = (path: string, label?: string) => {
    console.log('[AdminDashboard] click:', label || path)
    navigate(path)
  }

  useEffect(() => {
    const adminId = '4' // ID del admin actual (simulado)
    
    const studentsData = studentService.getAll()
    setStudents(studentsData)
    
    const teachersData = teacherService.getAll()
    setTeachers(teachersData)
    
    const userStats = getDashboardStats(adminId, 'admin')
    setStats(userStats)
  }, [])

  if (!stats) {
    return <div className="d-flex justify-content-center"><div className="spinner-border"></div></div>
  }

  const activeStudents = students.length
  const activeTeachers = teachers.length

  return (
    <div style={{
      padding: 'var(--space-6)',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
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
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-2)',
              margin: 0
            }}>
              Dashboard Administrador
            </h1>
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
        {/* Gestión de Estudiantes */}
        <div style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-inverse)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-mortarboard" style={{
              fontSize: 'var(--font-size-2xl)',
              color: 'var(--color-text-inverse)'
            }}></i>
          </div>
          <div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--space-2)',
              opacity: 0.9
            }}>
              Gestión de Estudiantes
            </div>
            <div style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 1,
              marginBottom: 'var(--space-1)'
            }}>
              {activeStudents}
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              opacity: 0.8
            }}>
              Total Estudiantes
            </div>
          </div>
        </div>

        {/* Gestión de Docentes */}
        <div style={{
          backgroundColor: 'var(--color-danger)',
          color: 'var(--color-text-inverse)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-people" style={{
              fontSize: 'var(--font-size-2xl)',
              color: 'var(--color-text-inverse)'
            }}></i>
          </div>
          <div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--space-2)',
              opacity: 0.9
            }}>
              Gestión de Docentes
            </div>
            <div style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 1,
              marginBottom: 'var(--space-1)'
            }}>
              {activeTeachers}
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              opacity: 0.8
            }}>
              Total Docentes
            </div>
          </div>
        </div>

        {/* Resumen Financiero */}
        <div style={{
          backgroundColor: 'var(--color-info)',
          color: 'var(--color-text-inverse)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-eye" style={{
              fontSize: 'var(--font-size-2xl)',
              color: 'var(--color-text-inverse)'
            }}></i>
          </div>
          <div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--space-2)',
              opacity: 0.9
            }}>
              Resumen Financiero
            </div>
            <div style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 1,
              marginBottom: 'var(--space-1)'
            }}>
              $52,480
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              opacity: 0.8
            }}>
              Ingresos Este Mes
            </div>
          </div>
        </div>

        {/* Anuncios */}
        <div style={{
          backgroundColor: 'var(--color-warning)',
          color: 'var(--color-text-inverse)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          padding: 'var(--space-6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 'var(--space-4)',
            right: 'var(--space-4)',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-megaphone" style={{
              fontSize: 'var(--font-size-2xl)',
              color: 'var(--color-text-inverse)'
            }}></i>
          </div>
          <div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              marginBottom: 'var(--space-2)',
              opacity: 0.9
            }}>
              Anuncios
            </div>
            <div style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              lineHeight: 1,
              marginBottom: 'var(--space-1)'
            }}>
              5
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              opacity: 0.8
            }}>
              Anuncios Activos
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Registros Recientes de Estudiantes */}
      <div className="card" style={{
        backgroundColor: 'var(--color-background)',
        border: '1px solid var(--color-gray-200)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
        marginBottom: 'var(--space-6)'
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
            Registros Recientes de Estudiantes
          </h5>
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
                    ID Estudiante
                  </th>
                  <th style={{
                    textAlign: 'left',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-secondary)',
                    paddingBottom: 'var(--space-4)',
                    borderBottom: '1px solid var(--color-gray-200)'
                  }}>
                    Nombre
                  </th>
                  <th style={{
                    textAlign: 'left',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-secondary)',
                    paddingBottom: 'var(--space-4)',
                    borderBottom: '1px solid var(--color-gray-200)'
                  }}>
                    Curso
                  </th>
                  <th style={{
                    textAlign: 'left',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-secondary)',
                    paddingBottom: 'var(--space-4)',
                    borderBottom: '1px solid var(--color-gray-200)'
                  }}>
                    Fecha de Registro
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
                </tr>
              </thead>
              <tbody>
                {/* Juan Pérez */}
                <tr>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      #EST-001
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)'
                    }}>
                      Juan Pérez
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Ciencias de la Computación
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      2023-10-26
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
                      Aprobado
                    </span>
                  </td>
                </tr>

                {/* María González */}
                <tr>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      #EST-002
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)'
                    }}>
                      María González
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Administración de Empresas
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      2023-10-25
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
                      Aprobado
                    </span>
                  </td>
                </tr>

                {/* Carlos Rodríguez */}
                <tr>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      #EST-003
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)'
                    }}>
                      Carlos Rodríguez
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Diseño Gráfico
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      2023-10-25
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
                </tr>

                {/* Ana Martínez */}
                <tr>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      #EST-004
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)'
                    }}>
                      Ana Martínez
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      Psicología
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <span style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      2023-10-24
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
                      Rechazado
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Botón Agregar Nuevo Docente */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 'var(--space-6)'
      }}>
        <button 
          onClick={() => go('/app/admin/usuarios', 'Agregar Nuevo Docente')}
          style={{
            backgroundColor: 'var(--color-info)',
            color: 'var(--color-text-inverse)',
            border: '1px solid var(--color-info)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-6)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            transition: 'all var(--transition-fast)',
            boxShadow: 'var(--shadow-md)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-info-dark)'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-info)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
          }}
        >
          <i className="bi bi-person-plus"></i>
          Agregar Nuevo Docente
        </button>
      </div>
      
      {/* Renderizar las rutas anidadas */}
      <Outlet />
    </div>
  )
}
