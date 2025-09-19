import { useEffect, useState } from 'react'
import { teacherRatingService, teacherService, parentService } from '../../services/dataService'
import type { TeacherRating, Teacher, Parent } from '../../types'

export function ParentRatingsPage() {
  const [ratings, setRatings] = useState<TeacherRating[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [parent, setParent] = useState<Parent | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<string>('')
  const [rating, setRating] = useState<number>(0)
  const [review, setReview] = useState<string>('')

  useEffect(() => {
    const parentId = '2' // ID del padre actual (simulado)
    const parentData = parentService.getById(parentId)
    setParent(parentData || null)
    
    const ratingsData = teacherRatingService.getAll()
    setRatings(ratingsData)
    
    const teachersData = teacherService.getAll()
    setTeachers(teachersData)
  }, [])

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newRating: TeacherRating = {
      id: Date.now().toString(),
      parentId: parent?.id || '',
      teacherId: selectedTeacher,
      rating: rating,
      review: review,
      createdAt: new Date().toISOString()
    }
    
    setRatings([...ratings, newRating])
    setShowForm(false)
    setSelectedTeacher('')
    setRating(0)
    setReview('')
  }

  const handleEditRating = (ratingItem: TeacherRating) => {
    setSelectedTeacher(ratingItem.teacherId)
    setRating(ratingItem.rating)
    setReview(ratingItem.review)
    setShowForm(true)
  }

  const handleDeleteRating = (ratingId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta calificación?')) {
      setRatings(ratings.filter(r => r.id !== ratingId))
    }
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId)
    return teacher?.name || 'Docente no encontrado'
  }

  return (
    <div style={{ width: '100%', padding: '1rem', maxWidth: 'none' }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="h4 mb-0">Calificar Docentes</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-star me-2"></i>
          <span className="d-none d-sm-inline">Nueva Calificación</span>
          <span className="d-sm-none">Nueva</span>
        </button>
      </div>

      {/* Formulario de calificación */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Calificar Docente</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitRating}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Seleccionar Docente</label>
                  <select 
                    className="form-select"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    required
                  >
                    <option value="">Selecciona un docente</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name} - {teacher.subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Calificación</label>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`btn ${star <= rating ? 'btn-warning' : 'btn-outline-secondary'}`}
                        onClick={() => setRating(star)}
                      >
                        <i className="bi bi-star-fill"></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label">Comentario</label>
                  <textarea 
                    className="form-control"
                    rows={3}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Escribe tu comentario sobre el docente..."
                  ></textarea>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-check me-2"></i>
                      Enviar Calificación
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {ratings.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-star display-1 text-muted"></i>
          <h4 className="mt-3">No hay calificaciones registradas</h4>
          <p className="text-muted">Comienza calificando a los docentes de tus hijos</p>
        </div>
      ) : (
        <div className="row g-3 g-md-4">
          {ratings.map(ratingItem => (
            <div key={ratingItem.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h6 className="card-title text-truncate flex-grow-1 me-2">{getTeacherName(ratingItem.teacherId)}</h6>
                    <small className="text-muted flex-shrink-0">
                      {new Date(ratingItem.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i 
                          key={star}
                          className={`bi bi-star${star <= ratingItem.rating ? '-fill text-warning' : ''}`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  
                  <p className="card-text small">{ratingItem.review}</p>
                  
                  <div className="d-flex flex-wrap gap-2">
                    <button 
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEditRating(ratingItem)}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      <span className="d-none d-sm-inline">Editar</span>
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteRating(ratingItem.id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      <span className="d-none d-sm-inline">Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
