import { useEffect, useState } from 'react'
import { classService, teacherService, studentService, notificationService } from '../../services/dataService'
import type { Class, Teacher, Student, VirtualClassLink } from '../../types'

export function TeacherClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [activeTab, setActiveTab] = useState<'presencial' | 'virtual' | 'in-home'>('presencial')
  const [virtualLink, setVirtualLink] = useState('')
  const [virtualLinks, setVirtualLinks] = useState<VirtualClassLink[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newClass, setNewClass] = useState({
    name: '',
    subject: '',
    schedule: '',
    room: '',
    modality: 'presencial' as 'presencial' | 'virtual' | 'in-home',
    studentIds: [] as string[]
  })
  const [availableStudents, setAvailableStudents] = useState<Student[]>([])
  const [showStudentsModal, setShowStudentsModal] = useState(false)
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<Class | null>(null)

  useEffect(() => {
    const teacherId = '52' // ID del docente actual (simulado)
    const teacherData = teacherService.getById(teacherId)
    setTeacher(teacherData || null)
    
    if (teacherData) {
      const classesData = classService.getByTeacherId(teacherId)
      setClasses(classesData)
      
      // Obtener todos los estudiantes de las clases
      const allStudentIds = classesData.flatMap(c => c.studentIds)
      const uniqueStudentIds = [...new Set(allStudentIds)]
      const studentsData = uniqueStudentIds.map(id => studentService.getById(id)).filter(Boolean) as Student[]
      setStudents(studentsData)
      
      // Cargar todos los estudiantes disponibles para asignar a nuevas clases
      const allStudents = studentService.getAll()
      setAvailableStudents(allStudents)
    }
  }, [])

  // Filtrar clases por modalidad
  const getClassesByModality = (modality: 'presencial' | 'virtual' | 'in-home') => {
    return classes.filter(cls => cls.modality === modality)
  }

  // Obtener estudiantes virtuales de una clase
  const getVirtualStudentsInClass = (classId: string) => {
    const classData = classes.find(c => c.id === classId)
    if (!classData) return []
    
    return students.filter(student => 
      classData.studentIds.includes(student.id) && student.modality === 'virtual'
    )
  }

  // Guardar enlace de conexión virtual
  const saveVirtualLink = (classId: string, link: string) => {
    const newLink: VirtualClassLink = {
      id: `link_${classId}_${Date.now()}`,
      classId,
      teacherId: teacher?.id || '',
      link,
      date: new Date().toISOString().split('T')[0],
      sentToStudents: false,
      createdAt: new Date().toISOString()
    }
    setVirtualLinks(prev => [...prev, newLink])
    setVirtualLink('')
  }

  // Enviar enlace por WhatsApp
  const sendLinkViaWhatsApp = (classId: string, link: string) => {
    const virtualStudents = getVirtualStudentsInClass(classId)
    const phoneNumbers = virtualStudents
      .map(student => student.phone)
      .filter(phone => phone)
      .join(',')
    
    if (phoneNumbers) {
      const message = encodeURIComponent(`Hola! Aquí tienes el enlace para la clase virtual de hoy: ${link}`)
      const whatsappUrl = `https://wa.me/${phoneNumbers}?text=${message}`
      window.open(whatsappUrl, '_blank')
    }
  }

  // Enviar notificaciones a estudiantes virtuales
  const sendNotificationsToVirtualStudents = (classId: string, link: string) => {
    const virtualStudents = getVirtualStudentsInClass(classId)
    
    virtualStudents.forEach(student => {
      notificationService.create({
        userId: student.id,
        title: 'Nuevo enlace de clase virtual',
        message: `Se ha compartido un nuevo enlace para tu clase virtual: ${link}`,
        type: 'info',
        read: false,
        actionUrl: '/estudiante/clases'
      })
    })
  }

  // Enviar enlace a estudiantes virtuales
  const sendLinkToVirtualStudents = (classId: string, link: string) => {
    // Enviar por WhatsApp
    sendLinkViaWhatsApp(classId, link)
    
    // Enviar notificaciones
    sendNotificationsToVirtualStudents(classId, link)
    
    // Marcar como enviado
    setVirtualLinks(prev => 
      prev.map(vl => 
        vl.classId === classId 
          ? { ...vl, sentToStudents: true }
          : vl
      )
    )
  }

  // Crear nueva clase
  const createNewClass = () => {
    if (!teacher || !newClass.name.trim() || !newClass.subject.trim()) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    const createdClass = classService.create({
      name: newClass.name,
      subject: newClass.subject,
      teacherId: teacher.id,
      studentIds: newClass.studentIds,
      schedule: newClass.schedule,
      room: newClass.room,
      modality: newClass.modality
    })

    // Actualizar la lista de clases
    setClasses(prev => [...prev, createdClass])
    
    // Actualizar estudiantes si se asignaron
    if (newClass.studentIds.length > 0) {
      const assignedStudents = availableStudents.filter(s => newClass.studentIds.includes(s.id))
      setStudents(prev => [...prev, ...assignedStudents])
    }

    // Limpiar formulario y cerrar modal
    setNewClass({
      name: '',
      subject: '',
      schedule: '',
      room: '',
      modality: 'presencial',
      studentIds: []
    })
    setShowCreateModal(false)
    
    alert('Clase creada exitosamente!')
  }

  // Manejar selección de estudiantes
  const toggleStudentSelection = (studentId: string) => {
    setNewClass(prev => ({
      ...prev,
      studentIds: prev.studentIds.includes(studentId)
        ? prev.studentIds.filter(id => id !== studentId)
        : [...prev.studentIds, studentId]
    }))
  }

  // Filtrar estudiantes por modalidad
  const getStudentsByModality = (modality: 'presencial' | 'virtual' | 'in-home') => {
    return availableStudents.filter(student => student.modality === modality)
  }

  // Manejar clic en "Ver Estudiantes"
  const handleViewStudents = (classData: Class) => {
    setSelectedClassForStudents(classData)
    setShowStudentsModal(true)
  }

  // Obtener estudiantes de una clase específica
  const getStudentsInClass = (classId: string) => {
    const classData = classes.find(c => c.id === classId)
    if (!classData) return []
    
    const studentsInClass = classData.studentIds
      .map(id => studentService.getById(id))
      .filter(Boolean) as Student[]
    
    return studentsInClass.map(student => ({
      ...student,
      modality: student.modality || 'presencial',
      phone: student.phone || `+57${Math.floor(Math.random() * 9000000000) + 1000000000}`
    }))
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Mis Clases</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <i className="bi bi-plus me-2"></i>
          Nueva Clase
        </button>
      </div>

      {/* Pestañas de modalidad */}
      <ul className="nav nav-tabs mb-4" id="classTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'presencial' ? 'active' : ''}`}
            onClick={() => setActiveTab('presencial')}
            type="button"
          >
            <i className="bi bi-building me-2"></i>
            Presencial
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'virtual' ? 'active' : ''}`}
            onClick={() => setActiveTab('virtual')}
            type="button"
          >
            <i className="bi bi-camera-video me-2"></i>
            Virtual
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'in-home' ? 'active' : ''}`}
            onClick={() => setActiveTab('in-home')}
            type="button"
          >
            <i className="bi bi-house me-2"></i>
            In-home
          </button>
        </li>
      </ul>

      {/* Contenido de las pestañas */}
      <div className="tab-content">
        {/* Pestaña Presencial */}
        {activeTab === 'presencial' && (
          <div className="tab-pane fade show active">
            {getClassesByModality('presencial').length === 0 ? (
        <div className="text-center py-5">
                <i className="bi bi-building display-1 text-muted"></i>
                <h4 className="mt-3">No tienes clases presenciales</h4>
                <p className="text-muted">Contacta al administrador para asignar clases presenciales</p>
        </div>
      ) : (
        <div className="row g-4">
                {getClassesByModality('presencial').map(cls => (
            <div key={cls.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title">{cls.name}</h5>
                  </div>
                  
                  <p className="text-muted mb-3">{cls.subject}</p>
                  
                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="bi bi-calendar me-1"></i>
                      {cls.schedule}
                    </small>
                    <br />
                    <small className="text-muted">
                      <i className="bi bi-geo-alt me-1"></i>
                      {cls.room}
                    </small>
                  </div>

                  <div className="d-grid gap-2">
                           <button 
                             className="btn btn-outline-primary btn-sm"
                             onClick={() => handleViewStudents(cls)}
                           >
                      <i className="bi bi-people me-2"></i>
                      Ver Estudiantes
                    </button>
                           <button 
                             className="btn btn-outline-warning btn-sm"
                             onClick={() => window.location.href = '/app/docente/asistencia'}
                           >
                      <i className="bi bi-calendar-check me-2"></i>
                      Tomar Asistencia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
          </div>
        )}

        {/* Pestaña Virtual */}
        {activeTab === 'virtual' && (
          <div className="tab-pane fade show active">
            {getClassesByModality('virtual').length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-camera-video display-1 text-muted"></i>
                <h4 className="mt-3">No tienes clases virtuales</h4>
                <p className="text-muted">Contacta al administrador para asignar clases virtuales</p>
              </div>
            ) : (
              <div className="row g-4">
                {getClassesByModality('virtual').map(cls => {
                  const classLink = virtualLinks.find(vl => vl.classId === cls.id)
                  
                  return (
                    <div key={cls.id} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <h5 className="card-title">{cls.name}</h5>
                            </div>
                          
                          <p className="text-muted mb-3">{cls.subject}</p>
                          
                          <div className="mb-3">
                            <small className="text-muted">
                              <i className="bi bi-calendar me-1"></i>
                              {cls.schedule}
                            </small>
                            <br />
                            <small className="text-muted">
                              <i className="bi bi-camera-video me-1"></i>
                              Clase Virtual
                            </small>
                          </div>

                          {/* Sección de enlace virtual */}
                          <div className="mb-3">
                            <label className="form-label small">Enlace de conexión del día:</label>
                            <div className="input-group input-group-sm">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="https://zoom.us/j/..."
                                value={virtualLink}
                                onChange={(e) => setVirtualLink(e.target.value)}
                              />
                              <button 
                                className="btn btn-outline-primary"
                                onClick={() => saveVirtualLink(cls.id, virtualLink)}
                                disabled={!virtualLink.trim()}
                              >
                                <i className="bi bi-check"></i>
                              </button>
                            </div>
                          </div>

                          <div className="d-grid gap-2">
                            <button 
                              className="btn btn-success btn-sm"
                              onClick={() => sendLinkToVirtualStudents(cls.id, classLink?.link || virtualLink)}
                              disabled={!classLink?.link && !virtualLink.trim()}
                            >
                              <i className="bi bi-whatsapp me-2"></i>
                              Enviar enlace a estudiantes virtuales
                            </button>
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => handleViewStudents(cls)}
                            >
                              <i className="bi bi-people me-2"></i>
                              Ver Estudiantes Virtuales
                            </button>
                            <button 
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => window.location.href = '/app/docente/asistencia'}
                            >
                              <i className="bi bi-calendar-check me-2"></i>
                              Tomar Asistencia
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
        </div>
      )}

        {/* Pestaña In-home */}
        {activeTab === 'in-home' && (
          <div className="tab-pane fade show active">
            {getClassesByModality('in-home').length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-house display-1 text-muted"></i>
                <h4 className="mt-3">No tienes clases in-home</h4>
                <p className="text-muted">Contacta al administrador para asignar clases in-home</p>
              </div>
            ) : (
              <div className="row g-4">
                {getClassesByModality('in-home').map(cls => (
                  <div key={cls.id} className="col-12 col-md-6 col-lg-4">
                    <div className="card h-100">
                      <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="card-title">{cls.name}</h5>
                          </div>
                        
                        <p className="text-muted mb-3">{cls.subject}</p>
                        
                        <div className="mb-3">
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            {cls.schedule}
                          </small>
                          <br />
                          <small className="text-muted">
                            <i className="bi bi-house me-1"></i>
                            Clase In-home
                          </small>
                        </div>

                         <div className="d-grid gap-2">
                           <button 
                             className="btn btn-outline-primary btn-sm"
                             onClick={() => handleViewStudents(cls)}
                           >
                             <i className="bi bi-people me-2"></i>
                             Ver Estudiantes
                           </button>
                           <button 
                             className="btn btn-outline-warning btn-sm"
                             onClick={() => window.location.href = '/app/docente/asistencia'}
                           >
                             <i className="bi bi-calendar-check me-2"></i>
                             Tomar Asistencia
                           </button>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            )}
          </div>
        )}
      </div>

      {/* Modal para crear nueva clase */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Nueva Clase</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Nombre de la Clase *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newClass.name}
                        onChange={(e) => setNewClass(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Matemáticas 5to A"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Materia *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newClass.subject}
                        onChange={(e) => setNewClass(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Ej: Matemáticas"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Horario</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newClass.schedule}
                        onChange={(e) => setNewClass(prev => ({ ...prev, schedule: e.target.value }))}
                        placeholder="Ej: Lunes 8:00-9:00"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Aula/Sala</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newClass.room}
                        onChange={(e) => setNewClass(prev => ({ ...prev, room: e.target.value }))}
                        placeholder="Ej: Aula 201"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Modalidad</label>
                  <select
                    className="form-select"
                    value={newClass.modality}
                    onChange={(e) => setNewClass(prev => ({ 
                      ...prev, 
                      modality: e.target.value as 'presencial' | 'virtual' | 'in-home' 
                    }))}
                  >
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="in-home">In-home</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Estudiantes</label>
                  <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <div className="row">
                      {getStudentsByModality(newClass.modality).map(student => (
                        <div key={student.id} className="col-md-6 mb-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`student-${student.id}`}
                              checked={newClass.studentIds.includes(student.id)}
                              onChange={() => toggleStudentSelection(student.id)}
                            />
                            <label className="form-check-label" htmlFor={`student-${student.id}`}>
                              {student.name} - {student.grade}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                    {getStudentsByModality(newClass.modality).length === 0 && (
                      <p className="text-muted text-center">No hay estudiantes disponibles en esta modalidad</p>
                    )}
                  </div>
                  <small className="text-muted">
                    Seleccionados: {newClass.studentIds.length} estudiantes
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={createNewClass}
                >
                  <i className="bi bi-plus me-2"></i>
                  Crear Clase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para mostrar estudiantes de una clase */}
      {showStudentsModal && selectedClassForStudents && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowStudentsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Materia:</strong> {selectedClassForStudents.subject}
                  </div>
                  <div className="col-md-6">
                    <strong>Modalidad:</strong> 
                    <span className={`badge ms-2 ${
                      activeTab === 'presencial' ? 'bg-primary' :
                      activeTab === 'virtual' ? 'bg-success' :
                      'bg-warning'
                    }`}>
                      <i className={`bi ${
                        activeTab === 'presencial' ? 'bi-building' :
                        activeTab === 'virtual' ? 'bi-camera-video' :
                        'bi-house'
                      } me-1`}></i>
                      {activeTab === 'presencial' ? 'Presencial' :
                       activeTab === 'virtual' ? 'Virtual' :
                       'In-home'}
                    </span>
                  </div>
                </div>

                {getStudentsInClass(selectedClassForStudents.id).length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-people display-4 text-muted"></i>
                    <h5 className="mt-3">No hay estudiantes asignados</h5>
                    <p className="text-muted">Esta clase no tiene estudiantes asignados</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Estudiante</th>
                          <th>Grado</th>
                          <th>Email</th>
                          <th>Modalidad</th>
                          <th>Teléfono</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getStudentsInClass(selectedClassForStudents.id).map(student => (
                          <tr key={student.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-person-circle me-2"></i>
                                {student.name}
                              </div>
                            </td>
                            <td>{student.grade}</td>
                            <td>{student.email}</td>
                            <td>
                              <span className={`badge ${
                                student.modality === 'presencial' ? 'bg-primary' :
                                student.modality === 'virtual' ? 'bg-success' :
                                'bg-warning'
                              }`}>
                                <i className={`bi ${
                                  student.modality === 'presencial' ? 'bi-building' :
                                  student.modality === 'virtual' ? 'bi-camera-video' :
                                  'bi-house'
                                } me-1`}></i>
                                {student.modality === 'presencial' ? 'Presencial' :
                                 student.modality === 'virtual' ? 'Virtual' :
                                 'In-home'}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">{student.phone}</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowStudentsModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
