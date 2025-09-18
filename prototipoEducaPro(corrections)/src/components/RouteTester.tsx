import { useLocation, useNavigate } from 'react-router-dom'

export function RouteTester() {
  const location = useLocation()
  const navigate = useNavigate()

  const testRoutes = [
    { path: '/', label: 'Login' },
    { path: '/app/admin', label: 'Admin Dashboard' },
    { path: '/app/admin/usuarios', label: 'Admin Usuarios' },
    { path: '/app/estudiante', label: 'Estudiante Dashboard' },
    { path: '/app/estudiante/tareas', label: 'Estudiante Tareas' },
    { path: '/app/padre', label: 'Padre Dashboard' },
    { path: '/app/docente', label: 'Docente Dashboard' },
    { path: '/app/finanzas', label: 'Finanzas Dashboard' },
    { path: '/ruta-inexistente', label: 'Ruta Inexistente (404)' }
  ]

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h2>🧪 Route Tester</h2>
          <p className="text-muted">Ruta actual: <code>{location.pathname}</code></p>
          
          <div className="row">
            {testRoutes.map((route, index) => (
              <div key={`route-${route.path}-${index}`} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">{route.label}</h6>
                    <p className="card-text small text-muted">{route.path}</p>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(route.path)}
                    >
                      Probar Ruta
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <button 
              className="btn btn-secondary"
              onClick={() => window.history.back()}
            >
              ← Volver Atrás
            </button>
            <button 
              className="btn btn-primary ms-2"
              onClick={() => navigate('/')}
            >
              🏠 Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


