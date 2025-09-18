import { useRouteError, Link } from 'react-router-dom'

export function ErrorBoundary() {
  const error = useRouteError() as any

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center">
        <div className="mb-4">
          <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
        </div>
        <h1 className="h2 mb-3">¡Oops! Algo salió mal</h1>
        <p className="text-muted mb-4">
          {error?.status === 404 
            ? 'La página que buscas no existe.' 
            : 'Ha ocurrido un error inesperado.'}
        </p>
        <div className="d-flex gap-3 justify-content-center">
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-house me-2"></i>
            Ir al Inicio
          </Link>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-outline-secondary"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Recargar
          </button>
        </div>
        {import.meta.env.DEV && error && (
          <details className="mt-4 text-start">
            <summary className="btn btn-sm btn-outline-danger">
              Ver detalles del error
            </summary>
            <pre className="mt-2 p-3 bg-dark text-light rounded small">
              {JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
