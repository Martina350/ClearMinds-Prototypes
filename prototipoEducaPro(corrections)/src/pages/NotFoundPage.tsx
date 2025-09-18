import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="error-template">
          <h1 className="display-1 text-primary">404</h1>
          <h2 className="mb-3">Página no encontrada</h2>
          <div className="error-details mb-4">
            <p className="text-muted">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
          </div>
          <div className="error-actions">
            <Link to="/" className="btn btn-primary btn-lg me-3">
              <i className="bi bi-house me-2"></i>
              Ir al Inicio
            </Link>
            <button 
              className="btn btn-outline-secondary btn-lg"
              onClick={() => window.history.back()}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver Atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
