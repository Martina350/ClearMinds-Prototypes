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
    <div className="auth-hero">
      <div className="container-fluid py-5">
        <div className="row justify-content-center px-3 px-md-4">
          <div className="col-12 col-xl-11 col-xxl-10">
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold auth-title mb-2">EducaPro</h1>
              <p className="lead text-white-50 mb-0">Plataforma Educativa Integral</p>
            </div>
            
            <div className="row row-cols-1 row-cols-lg-2 g-4 g-xxl-5 align-items-stretch">
              <div className="col col-12 col-md-10 col-lg-6 col-xxl-5 mx-auto">
                <div className="card card-elevated h-100">
                  <div className="card-body p-4 p-lg-5">
                    <div className="text-center mb-4">
                      <i className="bi bi-person-circle display-4 text-primary mb-3"></i>
                      <h2 className="h4 mb-3">Iniciar Sesión</h2>
                      <p className="text-muted">Accede a tu cuenta</p>
                    </div>
                    
                    <form className="vstack gap-3" onSubmit={(e) => e.preventDefault()}>
                      <div className="form-floating">
                        <input type="email" className="form-control" id="loginEmail" placeholder="name@example.com" required />
                        <label htmlFor="loginEmail">Correo electrónico</label>
                      </div>
                      <div className="form-floating">
                        <input type="password" className="form-control" id="loginPass" placeholder="••••••" required minLength={6} />
                        <label htmlFor="loginPass">Contraseña</label>
                      </div>
                      
                      <div className="d-grid gap-2">
                        <button 
                          className="btn btn-primary btn-lg btn-full" 
                          onClick={() => simulateLogin('estudiante')}
                          disabled={isLoading}
                        >
                          <i className="bi bi-person-badge me-2"></i>
                          Estudiante
                        </button>
                        <button 
                          className="btn btn-outline-primary btn-lg btn-full" 
                          onClick={() => simulateLogin('padre')}
                          disabled={isLoading}
                        >
                          <i className="bi bi-people me-2"></i>
                          Padre
                        </button>
                        <button 
                          className="btn btn-outline-secondary btn-lg btn-full" 
                          onClick={() => simulateLogin('docente')}
                          disabled={isLoading}
                        >
                          <i className="bi bi-person-workspace me-2"></i>
                          Docente
                        </button>
                        <button 
                          className="btn btn-outline-dark btn-lg btn-full" 
                          onClick={() => simulateLogin('admin')}
                          disabled={isLoading}
                        >
                          <i className="bi bi-gear me-2"></i>
                          Admin
                        </button>
                        <button 
                          className="btn btn-outline-success btn-lg btn-full" 
                          onClick={() => simulateLogin('finanzas')}
                          disabled={isLoading}
                        >
                          <i className="bi bi-currency-dollar me-2"></i>
                          Finanzas
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
