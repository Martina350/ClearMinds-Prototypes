import { useState } from 'react'
import { userService, initializeData } from '../services/dataService'

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const simulateLogin = async (role: string) => {
    setIsLoading(true)
    
    // Inicializar datos si no existen
    initializeData()
    
    // Elegir un usuario sembrado según el rol
    const seededUsers: Record<string, { id: string; name: string; email: string; role: 'estudiante' | 'padre' | 'docente' | 'admin' | 'finanzas' }> = {
      estudiante: { id: '1', name: 'Ana García', email: 'ana@estudiante.com', role: 'estudiante' },
      padre: { id: '2', name: 'Carlos López', email: 'carlos@padre.com', role: 'padre' },
      docente: { id: '3', name: 'María Rodríguez', email: 'maria@docente.com', role: 'docente' },
      admin: { id: '4', name: 'Admin Sistema', email: 'admin@educapro.com', role: 'admin' },
      finanzas: { id: '5', name: 'Finanzas Pro', email: 'finanzas@educapro.com', role: 'finanzas' }
    }
    
    const selected = seededUsers[role]
    if (selected) {
      userService.setCurrentUser({ ...selected, createdAt: new Date().toISOString() })
    }
    
    const redirect: Record<string, string> = {
      estudiante: '/app/estudiante',
      padre: '/app/padre',
      docente: '/app/docente',
      admin: '/app/admin',
      finanzas: '/app/finanzas',
    }
    
    // Simular delay de login
    setTimeout(() => {
      window.location.href = redirect[role] ?? '/'
    }, 500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-4)'
    }}>
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h1 style={{
            fontSize: 'var(--font-size-4xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-inverse)',
            marginBottom: 'var(--space-3)',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            EducaPro
          </h1>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'rgba(255,255,255,0.8)',
            margin: 0
          }}>
            Plataforma Educativa Integral
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          backgroundColor: 'var(--color-background)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: 'var(--space-5)' }}>
            {/* Card Header */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: 'var(--color-primary-50)',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-3)',
                fontSize: 'var(--font-size-2xl)',
                color: 'var(--color-primary)'
              }}>
                <i className="bi bi-person-circle"></i>
              </div>
              <h2 style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
                margin: '0 0 var(--space-2) 0'
              }}>
                Iniciar Sesión
              </h2>
              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-sm)',
                margin: 0
              }}>
                Selecciona tu rol para acceder
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <label htmlFor="loginEmail" style={{
                    display: 'block',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    Correo electrónico
                  </label>
                  <input 
                    type="email" 
                    id="loginEmail" 
                    placeholder="nombre@ejemplo.com"
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--space-2) var(--space-3)',
                      fontSize: 'var(--font-size-sm)',
                      border: '1px solid var(--color-gray-300)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-background)',
                      transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)'
                      e.target.style.boxShadow = '0 0 0 2px var(--color-primary-50)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-gray-300)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
                
                <div>
                  <label htmlFor="loginPass" style={{
                    display: 'block',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    Contraseña
                  </label>
                  <input 
                    type="password" 
                    id="loginPass" 
                    placeholder="••••••••"
                    required 
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2) var(--space-3)',
                      fontSize: 'var(--font-size-sm)',
                      border: '1px solid var(--color-gray-300)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-background)',
                      transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)'
                      e.target.style.boxShadow = '0 0 0 2px var(--color-primary-50)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-gray-300)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>
              
              {/* Role Selection Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <button 
                  type="button"
                  onClick={() => simulateLogin('estudiante')}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-text-inverse)',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  <i className="bi bi-person-badge"></i>
                  Estudiante
                </button>

                <button 
                  type="button"
                  onClick={() => simulateLogin('padre')}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)'
                      e.currentTarget.style.color = 'var(--color-text-inverse)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--color-primary)'
                    }
                  }}
                >
                  <i className="bi bi-people"></i>
                  Padre/Madre
                </button>

                <button 
                  type="button"
                  onClick={() => simulateLogin('docente')}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-info)',
                    border: '1px solid var(--color-info)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = 'var(--color-info)'
                      e.currentTarget.style.color = 'var(--color-text-inverse)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--color-info)'
                    }
                  }}
                >
                  <i className="bi bi-person-workspace"></i>
                  Docente
                </button>

                <button 
                  type="button"
                  onClick={() => simulateLogin('admin')}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-gray-600)',
                    border: '1px solid var(--color-gray-300)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-600)'
                      e.currentTarget.style.color = 'var(--color-text-inverse)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--color-gray-600)'
                    }
                  }}
                >
                  <i className="bi bi-gear"></i>
                  Administrador
                </button>

                <button 
                  type="button"
                  onClick={() => simulateLogin('finanzas')}
                  disabled={isLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'transparent',
                    color: 'var(--color-success)',
                    border: '1px solid var(--color-success)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = 'var(--color-success)'
                      e.currentTarget.style.color = 'var(--color-text-inverse)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--color-success)'
                    }
                  }}
                >
                  <i className="bi bi-currency-dollar"></i>
                  Finanzas
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 'var(--font-size-sm)',
            margin: 0
          }}>
            © 2025 EducaPro. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
