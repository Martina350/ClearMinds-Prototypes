import { useEffect, useState } from 'react'
import { userService } from '../../services/dataService'
import type { User } from '../../types'

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'estudiante' as 'estudiante' | 'padre' | 'docente' | 'admin' | 'finanzas'
  })
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    role: 'estudiante' as 'estudiante' | 'padre' | 'docente' | 'admin' | 'finanzas'
  })

  useEffect(() => {
    const usersData = userService.getAll()
    setUsers(usersData)
  }, [])

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(user => user.role === filter)

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[AdminUsersPage] submit new user:', newUser)
    
    const created = userService.create({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    })
    
    const all = userService.getAll()
    console.log('[AdminUsersPage] after create, users:', all.length)
    setUsers(all)
    setShowForm(false)
    setNewUser({ name: '', email: '', role: 'estudiante' })
    alert(`Usuario creado exitosamente: ${created.name}`)
  }

  const handleEditUser = (user: User) => {
    console.log('[AdminUsersPage] open edit for:', user.id)
    setSelectedUser(user)
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role
    })
    setShowEditModal(true)
  }

  const handleViewDetails = (user: User) => {
    console.log('[AdminUsersPage] view details for:', user.id)
    setSelectedUser(user)
    setShowDetailsModal(true)
  }

  const handleChangePassword = (user: User) => {
    console.log('[AdminUsersPage] change password for:', user.id)
    setSelectedUser(user)
    setShowPasswordModal(true)
  }

  const handleDeleteUser = (user: User) => {
    console.log('[AdminUsersPage] delete user click:', user.id)
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.name}?`)) {
      userService.delete(user.id)
      const all = userService.getAll()
      console.log('[AdminUsersPage] after delete, users:', all.length)
      setUsers(all)
      alert('Usuario eliminado exitosamente')
    }
  }

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedUser) {
      console.log('[AdminUsersPage] update user:', selectedUser.id, editUser)
      const updated = userService.update(selectedUser.id, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role
      })
      
      if (updated) {
        const all = userService.getAll()
        console.log('[AdminUsersPage] after update, users:', all.length)
        setUsers(all)
        setShowEditModal(false)
        setSelectedUser(null)
        alert('Usuario actualizado exitosamente')
      }
    }
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string
    
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }
    
    if (newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    alert(`Contraseña actualizada para ${selectedUser?.name}`)
    setShowPasswordModal(false)
    setSelectedUser(null)
  }

  const handleExportUsers = () => {
    const csvContent = [
      ['Nombre', 'Email', 'Rol', 'Fecha Creación', 'Estado'],
      ...users.map(user => [
        user.name,
        user.email,
        getRoleText(user.role),
        new Date(user.createdAt).toLocaleDateString(),
        'Activo'
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCloseModals = () => {
    setShowEditModal(false)
    setShowDetailsModal(false)
    setShowPasswordModal(false)
    setSelectedUser(null)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'estudiante':
        return 'bg-primary'
      case 'padre':
        return 'bg-success'
      case 'docente':
        return 'bg-warning'
      case 'admin':
        return 'bg-danger'
      case 'finanzas':
        return 'bg-info'
      default:
        return 'bg-secondary'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'estudiante':
        return 'Estudiante'
      case 'padre':
        return 'Padre'
      case 'docente':
        return 'Docente'
      case 'admin':
        return 'Admin'
      case 'finanzas':
        return 'Finanzas'
      default:
        return 'Desconocido'
    }
  }

  return (
    <div className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Gestión de Usuarios</h2>
        <div className="d-flex gap-2">
          <select 
            className="form-select"
            style={{ width: 'auto' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="estudiante">Estudiantes</option>
            <option value="padre">Padres</option>
            <option value="docente">Docentes</option>
            <option value="admin">Admins</option>
            <option value="finanzas">Finanzas</option>
          </select>
          <button 
            className="btn btn-outline-secondary"
            onClick={handleExportUsers}
            title="Exportar usuarios a CSV"
          >
            <i className="bi bi-download me-2"></i>
            Exportar
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <i className="bi bi-plus me-2"></i>
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Formulario de nuevo usuario */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Crear Nuevo Usuario</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitUser}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre Completo</label>
                  <input 
                    type="text"
                    className="form-control"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input 
                    type="email"
                    className="form-control"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Rol</label>
                  <select 
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    required
                  >
                    <option value="estudiante">Estudiante</option>
                    <option value="padre">Padre de Familia</option>
                    <option value="docente">Docente</option>
                    <option value="admin">Administrador</option>
                    <option value="finanzas">Finanzas</option>
                  </select>
                </div>
                <div className="col-12">
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      <i className="bi bi-check me-2"></i>
                      Crear Usuario
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

      {/* Lista de usuarios */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Lista de Usuarios</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Fecha Creación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-person-circle me-2"></i>
                        {user.name}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${getRoleBadge(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className="badge bg-success">Activo</span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary" 
                          title="Editar"
                          onClick={() => handleEditUser(user)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-outline-info" 
                          title="Ver detalles"
                          onClick={() => handleViewDetails(user)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-warning" 
                          title="Cambiar contraseña"
                          onClick={() => handleChangePassword(user)}
                        >
                          <i className="bi bi-key"></i>
                        </button>
                        <button 
                          className="btn btn-outline-danger" 
                          title="Eliminar"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para editar usuario */}
      {showEditModal && selectedUser && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Usuario</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre Completo</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={editUser.name}
                      onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email"
                      className="form-control"
                      value={editUser.email}
                      onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select 
                      className="form-select"
                      value={editUser.role}
                      onChange={(e) => setEditUser({ ...editUser, role: e.target.value as any })}
                      required
                    >
                      <option value="estudiante">Estudiante</option>
                      <option value="padre">Padre de Familia</option>
                      <option value="docente">Docente</option>
                      <option value="admin">Administrador</option>
                      <option value="finanzas">Finanzas</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Actualizar Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {showDetailsModal && selectedUser && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Usuario</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <i className="bi bi-person-circle display-1 text-primary"></i>
                    <h4 className="mt-3">{selectedUser.name}</h4>
                    <p className="text-muted">{selectedUser.email}</p>
                  </div>
                  <div className="col-md-8">
                    <h6>Información del Usuario</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Rol:</span>
                        <span className={`badge ${getRoleBadge(selectedUser.role)}`}>
                          {getRoleText(selectedUser.role)}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Fecha de creación:</span>
                        <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Estado:</span>
                        <span className="badge bg-success">Activo</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>ID:</span>
                        <span className="text-muted small">{selectedUser.id}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={() => {
                  handleCloseModals()
                  handleEditUser(selectedUser)
                }}>
                  Editar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para cambiar contraseña */}
      {showPasswordModal && selectedUser && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cambiar Contraseña</h5>
                <button type="button" className="btn-close" onClick={handleCloseModals}></button>
              </div>
              <form onSubmit={handleUpdatePassword}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Usuario:</strong> {selectedUser.name}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nueva Contraseña</label>
                    <input 
                      type="password"
                      name="newPassword"
                      className="form-control"
                      placeholder="Ingresa la nueva contraseña"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirmar Contraseña</label>
                    <input 
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirma la nueva contraseña"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-warning">
                    <i className="bi bi-key me-2"></i>
                    Cambiar Contraseña
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
