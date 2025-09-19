import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import type { 
  User, Student, Parent, Teacher, Task, TaskSubmission, Class, 
  Grade, Attendance, Payment, Notification, TeacherRating, DashboardStats 
} from '../types'

// Claves para localStorage
const KEYS = {
  USERS: 'educapro_users',
  STUDENTS: 'educapro_students',
  PARENTS: 'educapro_parents',
  TEACHERS: 'educapro_teachers',
  CLASSES: 'educapro_classes',
  TASKS: 'educapro_tasks',
  TASK_SUBMISSIONS: 'educapro_task_submissions',
  GRADES: 'educapro_grades',
  ATTENDANCE: 'educapro_attendance',
  PAYMENTS: 'educapro_payments',
  NOTIFICATIONS: 'educapro_notifications',
  TEACHER_RATINGS: 'educapro_teacher_ratings',
  CURRENT_USER: 'educapro_current_user'
}

// Función genérica para obtener datos del localStorage
function getData<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Función genérica para guardar datos en localStorage
function setData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

// Función para migrar datos existentes
function migrateExistingData(): void {
  const students = getData<Student>(KEYS.STUDENTS)
  const classes = getData<Class>(KEYS.CLASSES)
  
  // Migrar estudiantes si no tienen modalidad
  if (students.length > 0 && !students[0].modality) {
    const modalities: ('presencial' | 'virtual' | 'in-home')[] = ['presencial', 'virtual', 'in-home']
    const updatedStudents = students.map(student => ({
      ...student,
      modality: modalities[Math.floor(Math.random() * modalities.length)],
      phone: student.phone || `+57${Math.floor(Math.random() * 9000000000) + 1000000000}`
    }))
    setData(KEYS.STUDENTS, updatedStudents)
  }
  
  // Migrar clases si no tienen modalidad
  if (classes.length > 0 && !classes[0].modality) {
    const modalities: ('presencial' | 'virtual' | 'in-home')[] = ['presencial', 'virtual', 'in-home']
    const updatedClasses = classes.map(cls => ({
      ...cls,
      modality: modalities[Math.floor(Math.random() * modalities.length)]
    }))
    setData(KEYS.CLASSES, updatedClasses)
  }
}

// Función para inicializar datos de prueba
export function initializeData(): void {
  // Migrar datos existentes primero
  migrateExistingData()
  
  // Verificar si ya existen datos
  if (getData<User>(KEYS.USERS).length > 0) return

  const now = dayjs().toISOString()

  // Generar nombres para estudiantes
  const nombresEstudiantes = [
    'Ana', 'Carlos', 'María', 'José', 'Laura', 'Miguel', 'Carmen', 'Antonio', 'Isabel', 'Francisco',
    'Elena', 'David', 'Pilar', 'Manuel', 'Rosa', 'Javier', 'Teresa', 'Rafael', 'Cristina', 'Pedro',
    'Sofía', 'Alejandro', 'Lucía', 'Diego', 'Paula', 'Sergio', 'Andrea', 'Fernando', 'Natalia', 'Álvaro',
    'Claudia', 'Rubén', 'Beatriz', 'Guillermo', 'Adriana', 'Víctor', 'Elena', 'Óscar', 'Mónica', 'Raúl',
    'Patricia', 'Iván', 'Silvia', 'Adrián', 'Raquel', 'Daniel', 'Marta', 'Roberto', 'Cristina', 'Ángel',
    'Inés', 'Marcos', 'Alba', 'Gonzalo', 'Lorena', 'Pablo', 'Nuria', 'Jorge', 'Sandra', 'Iker',
    'Marina', 'Álex', 'Vanesa', 'Andrés', 'Olga', 'Héctor', 'Lidia', 'César', 'Amparo', 'Nicolás',
    'Rocío', 'Víctor', 'Dolores', 'Rubén', 'Concepción', 'Emilio', 'Mercedes', 'Félix', 'Rosario', 'Gabriel',
    'Esperanza', 'Alfonso', 'Dolores', 'León', 'Pilar', 'Ramón', 'Remedios', 'Tomás', 'Encarnación', 'Valentín',
    'Purificación', 'Severo', 'Soledad', 'Benito', 'Ascensión', 'Bonifacio', 'Presentación', 'Agustín', 'Natividad', 'Eugenio'
  ]

  const apellidos = [
    'García', 'López', 'Rodríguez', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Cruz', 'Flores',
    'Reyes', 'Morales', 'Jiménez', 'Álvarez', 'Ruiz', 'Herrera', 'Díaz', 'Torres', 'Vargas', 'Moreno',
    'Castillo', 'Romero', 'Ramos', 'Mendoza', 'Herrera', 'Guerrero', 'Vega', 'Delgado', 'Medina', 'Castro'
  ]

  const materias = ['Matemáticas', 'Ciencias', 'Historia', 'Español', 'Inglés']
  const grados = ['5to A', '5to B', '6to A', '6to B', '7mo A']

  // Usuarios base
  const users: User[] = [
    { id: '1', name: 'Ana García', email: 'ana@estudiante.com', role: 'estudiante', createdAt: now },
    { id: '2', name: 'Carlos López', email: 'carlos@padre.com', role: 'padre', createdAt: now },
    { id: '3', name: 'María Rodríguez', email: 'maria@docente.com', role: 'docente', createdAt: now },
    { id: '4', name: 'Admin Sistema', email: 'admin@educapro.com', role: 'admin', createdAt: now },
    { id: '5', name: 'Finanzas Pro', email: 'finanzas@educapro.com', role: 'finanzas', createdAt: now }
  ]

  // Generar 100 estudiantes
  const students: Student[] = []
  const studentIds: string[] = []
  
  for (let i = 1; i <= 100; i++) {
    const nombre = nombresEstudiantes[i - 1]
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)]
    const estudianteId = i.toString()
    studentIds.push(estudianteId)
    
    // Asignar modalidad aleatoria a los estudiantes
    const studentModalities: ('presencial' | 'virtual' | 'in-home')[] = ['presencial', 'virtual', 'in-home']
    const randomStudentModality = studentModalities[Math.floor(Math.random() * studentModalities.length)]
    
    // Generar número de teléfono aleatorio
    const phoneNumber = `+57${Math.floor(Math.random() * 9000000000) + 1000000000}`
    
    students.push({
      id: estudianteId,
      name: `${nombre} ${apellido}`,
      email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@estudiante.com`,
      role: 'estudiante',
      parentId: (Math.floor((i - 1) / 2) + 2).toString(), // Distribuir entre padres
      classIds: [], // Se asignarán después
      grade: grados[Math.floor((i - 1) / 20)],
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      modality: randomStudentModality,
      phone: phoneNumber,
      createdAt: now
    })

    // Agregar usuario correspondiente
    users.push({
      id: estudianteId,
      name: `${nombre} ${apellido}`,
      email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@estudiante.com`,
      role: 'estudiante',
      createdAt: now
    })
  }

  // Generar 50 padres (2 estudiantes por padre)
  const parents: Parent[] = []
  const parentIds: string[] = []
  
  for (let i = 2; i <= 51; i++) {
    const nombre = nombresEstudiantes[i - 2]
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)]
    const parentId = i.toString()
    parentIds.push(parentId)
    
    const studentIdsForParent = students
      .filter(s => s.parentId === parentId)
      .map(s => s.id)

    parents.push({
      id: parentId,
      name: `${nombre} ${apellido}`,
      email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@padre.com`,
      role: 'padre',
      studentIds: studentIdsForParent,
      createdAt: now
    })

    // Agregar usuario correspondiente
    users.push({
      id: parentId,
      name: `${nombre} ${apellido}`,
      email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@padre.com`,
      role: 'padre',
      createdAt: now
    })
  }

  // Generar 10 docentes
  const teachers: Teacher[] = []
  const teacherIds: string[] = []
  
  for (let i = 52; i <= 61; i++) {
    const nombre = nombresEstudiantes[i - 52]
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)]
    const materia = materias[Math.floor(Math.random() * materias.length)]
    const teacherId = i.toString()
    teacherIds.push(teacherId)
    
    teachers.push({
      id: teacherId,
      name: `${nombre} ${apellido}`,
      email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@docente.com`,
      role: 'docente',
      classIds: [], // Se asignarán después
      subject: materia,
      createdAt: now
    })

    // Agregar usuario correspondiente
    users.push({
      id: teacherId,
      name: `${nombre} ${apellido}`,
      email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}@docente.com`,
      role: 'docente',
      createdAt: now
    })
  }

  // Generar 5 clases con 20 estudiantes cada una
  const classes: Class[] = []
  const classIds: string[] = []
  
  for (let i = 1; i <= 5; i++) {
    const materia = materias[i - 1]
    const grado = grados[i - 1]
    const teacherId = teacherIds[i - 1]
    const classId = `class${i}`
    classIds.push(classId)
    
    // Asignar 20 estudiantes a esta clase
    const startIndex = (i - 1) * 20
    const endIndex = startIndex + 20
    const studentsInClass = studentIds.slice(startIndex, endIndex)
    
    // Actualizar los estudiantes para incluir esta clase
    studentsInClass.forEach(studentId => {
      const student = students.find(s => s.id === studentId)
      if (student) {
        student.classIds.push(classId)
      }
    })
    
    // Actualizar el docente para incluir esta clase
    const teacher = teachers.find(t => t.id === teacherId)
    if (teacher) {
      teacher.classIds.push(classId)
    }
    
    // Asignar modalidad aleatoria a las clases
    const modalities: ('presencial' | 'virtual' | 'in-home')[] = ['presencial', 'virtual', 'in-home']
    const randomModality = modalities[Math.floor(Math.random() * modalities.length)]
    
    classes.push({
      id: classId,
      name: `${materia} ${grado}`,
      subject: materia,
      teacherId: teacherId,
      studentIds: studentsInClass,
      schedule: `Lunes ${8 + i}:00-${9 + i}:00`,
      room: `Aula ${200 + i}`,
      modality: randomModality,
      createdAt: now
    })
  }

  // Generar tareas para cada clase
  const tasks: Task[] = []
  const taskTypes = ['homework', 'exam', 'project', 'participation']
  
  classes.forEach((cls, index) => {
    // Crear 3-4 tareas por clase
    for (let j = 0; j < 4; j++) {
      const taskId = `task${index * 4 + j + 1}`
      const taskTitles = {
        'Matemáticas': ['Ejercicios de fracciones', 'Problemas de álgebra', 'Examen de geometría', 'Proyecto de estadística'],
        'Ciencias': ['Experimento de plantas', 'Laboratorio de química', 'Examen de biología', 'Proyecto de física'],
        'Historia': ['Ensayo sobre la independencia', 'Examen de civilizaciones', 'Proyecto de cultura', 'Análisis de documentos'],
        'Español': ['Análisis literario', 'Composición creativa', 'Examen de gramática', 'Proyecto de lectura'],
        'Inglés': ['Presentación oral', 'Examen de vocabulario', 'Proyecto de cultura', 'Ensayo en inglés']
      }
      
      tasks.push({
        id: taskId,
        title: taskTitles[cls.subject as keyof typeof taskTitles]?.[j] || `Tarea ${j + 1}`,
        description: `Descripción detallada de la tarea ${j + 1} para ${cls.subject}`,
        classId: cls.id,
        teacherId: cls.teacherId,
        dueDate: dayjs().add(j + 1, 'week').toISOString(),
        createdAt: now,
        type: taskTypes[j] as string,
        attachments: j === 0 ? [`${cls.subject.toLowerCase()}_material.pdf`] : []
      })
    }
  })

  // Generar notas para algunos estudiantes
  const grades: Grade[] = []
  students.forEach((student, index) => {
    if (index % 3 === 0) { // Solo algunos estudiantes tienen notas
      student.classIds.forEach(classId => {
        const cls = classes.find(c => c.id === classId)
        if (cls) {
          grades.push({
            id: `grade${student.id}_${classId}`,
            studentId: student.id,
            classId: classId,
            taskId: `task${Math.floor(Math.random() * 20) + 1}`,
            value: Math.floor(Math.random() * 4) + 6, // Notas entre 6-10
            maxValue: 10,
            type: 'homework',
            description: `Calificación de ${cls.subject}`,
            createdAt: dayjs().subtract(Math.floor(Math.random() * 30), 'days').toISOString()
          })
        }
      })
    }
  })

  // Generar asistencia para los últimos 30 días
  const attendance: Attendance[] = []
  students.forEach(student => {
    for (let i = 0; i < 30; i++) {
      const date = dayjs().subtract(i, 'days').format('YYYY-MM-DD')
      if (Math.random() > 0.1) { // 90% de asistencia
        student.classIds.forEach(classId => {
          attendance.push({
            id: `att${student.id}_${classId}_${date}`,
            studentId: student.id,
            classId: classId,
            date: date,
            status: Math.random() > 0.05 ? 'present' : 'late'
          })
        })
      }
    }
  })

  // Generar pagos para padres
  const payments: Payment[] = []
  parents.forEach((parent) => {
    parent.studentIds.forEach((studentId, studentIndex) => {
      // Mensualidad
      payments.push({
        id: `pay${parent.id}_${studentId}_mensualidad`,
        parentId: parent.id,
        studentId: studentId,
        amount: 150000,
        dueDate: dayjs().add(studentIndex * 5, 'days').format('YYYY-MM-DD'),
        status: Math.random() > 0.3 ? 'paid' : Math.random() > 0.5 ? 'pending' : 'overdue',
        description: `Mensualidad ${dayjs().format('MMMM YYYY')}`,
        createdAt: dayjs().subtract(10, 'days').toISOString()
      })
      
      // Matrícula (solo algunos)
      if (Math.random() > 0.7) {
        payments.push({
          id: `pay${parent.id}_${studentId}_matricula`,
          parentId: parent.id,
          studentId: studentId,
          amount: 300000,
          dueDate: dayjs().add(15, 'days').format('YYYY-MM-DD'),
          status: Math.random() > 0.4 ? 'pending' : 'overdue',
          description: 'Matrícula 2024',
          createdAt: dayjs().subtract(5, 'days').toISOString()
        })
      }
    })
  })

  // Generar notificaciones para diferentes usuarios
  const notifications: Notification[] = []
  
  // Notificaciones para estudiantes
  students.slice(0, 20).forEach((student, index) => {
    notifications.push({
      id: `notif_student_${student.id}_1`,
      userId: student.id,
      title: 'Nueva tarea asignada',
      message: 'Se ha asignado una nueva tarea en una de tus clases',
      type: 'info',
      read: Math.random() > 0.5,
      createdAt: dayjs().subtract(index, 'hours').toISOString(),
      actionUrl: '/estudiante/tareas'
    })
  })
  
  // Notificaciones para padres
  parents.slice(0, 15).forEach((parent, index) => {
    notifications.push({
      id: `notif_parent_${parent.id}_1`,
      userId: parent.id,
      title: 'Recordatorio de pago',
      message: 'La mensualidad de tu hijo vence pronto',
      type: 'warning',
      read: Math.random() > 0.3,
      createdAt: dayjs().subtract(index * 2, 'hours').toISOString(),
      actionUrl: '/padre/pagos'
    })
  })
  
  // Notificaciones para docentes
  teachers.slice(0, 5).forEach((teacher, index) => {
    notifications.push({
      id: `notif_teacher_${teacher.id}_1`,
      userId: teacher.id,
      title: 'Nueva entrega de tarea',
      message: 'Un estudiante ha entregado una tarea',
      type: 'success',
      read: Math.random() > 0.4,
      createdAt: dayjs().subtract(index * 3, 'hours').toISOString(),
      actionUrl: '/docente/tareas'
    })
  })

  // Generar calificaciones de docentes
  const teacherRatings: TeacherRating[] = []
  teachers.forEach(teacher => {
    parents.slice(0, 3).forEach((parent, index) => {
      if (Math.random() > 0.6) {
        teacherRatings.push({
          id: `rating_${parent.id}_${teacher.id}`,
          parentId: parent.id,
          teacherId: teacher.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 estrellas
          review: `Excelente docente de ${teacher.subject}, muy dedicado y claro en sus explicaciones`,
          createdAt: dayjs().subtract(index * 7, 'days').toISOString()
        })
      }
    })
  })

  // Guardar todos los datos
  setData(KEYS.USERS, users)
  setData(KEYS.STUDENTS, students)
  setData(KEYS.PARENTS, parents)
  setData(KEYS.TEACHERS, teachers)
  setData(KEYS.CLASSES, classes)
  setData(KEYS.TASKS, tasks)
  setData(KEYS.GRADES, grades)
  setData(KEYS.ATTENDANCE, attendance)
  setData(KEYS.PAYMENTS, payments)
  setData(KEYS.NOTIFICATIONS, notifications)
  setData(KEYS.TEACHER_RATINGS, teacherRatings)
}

// Función para limpiar todos los datos y reinicializar
export function resetAllData(): void {
  Object.values(KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
  initializeData()
}

// Función para forzar migración de datos existentes
export function forceDataMigration(): void {
  console.log('🔄 Iniciando migración de datos...')
  migrateExistingData()
  console.log('✅ Migración completada')
}

// Servicios para cada entidad
export const userService = {
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(KEYS.CURRENT_USER)
    return user ? JSON.parse(user) : null
  },
  
  setCurrentUser: (user: User): void => {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user))
  },
  
  logout: (): void => {
    localStorage.removeItem(KEYS.CURRENT_USER)
  },
  
  getAll: (): User[] => getData<User>(KEYS.USERS),
  getById: (id: string): User | undefined => getData<User>(KEYS.USERS).find(u => u.id === id),
  create: (user: Omit<User, 'id' | 'createdAt'>): User => {
    console.log('[userService.create] input:', user)
    const users = getData<User>(KEYS.USERS)
    const newUser: User = { ...user, id: uuidv4(), createdAt: dayjs().toISOString() }
    setData(KEYS.USERS, [...users, newUser])
    console.log('[userService.create] created:', newUser)
    return newUser
  },
  update: (id: string, updates: Partial<User>): User | null => {
    console.log('[userService.update] id, updates:', id, updates)
    const users = getData<User>(KEYS.USERS)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return null
    users[index] = { ...users[index], ...updates } as User
    setData(KEYS.USERS, users)
    console.log('[userService.update] updated:', users[index])
    return users[index]
  },
  delete: (id: string): void => {
    console.log('[userService.delete] id:', id)
    const users = getData<User>(KEYS.USERS)
    setData(KEYS.USERS, users.filter(u => u.id !== id))
  }
}

export const studentService = {
  getAll: (): Student[] => {
    const students = getData<Student>(KEYS.STUDENTS)
    // Verificar y corregir estudiantes que no tengan modalidad
    return students.map(student => ({
      ...student,
      modality: student.modality || 'presencial',
      phone: student.phone || `+57${Math.floor(Math.random() * 9000000000) + 1000000000}`
    }))
  },
  getById: (id: string): Student | undefined => {
    const student = getData<Student>(KEYS.STUDENTS).find(s => s.id === id)
    if (!student) return undefined
    // Asegurar que el estudiante tenga modalidad
    return {
      ...student,
      modality: student.modality || 'presencial',
      phone: student.phone || `+57${Math.floor(Math.random() * 9000000000) + 1000000000}`
    }
  },
  getByParentId: (parentId: string): Student[] => getData<Student>(KEYS.STUDENTS).filter(s => s.parentId === parentId),
  create: (student: Omit<Student, 'id' | 'createdAt'>): Student => {
    console.log('[studentService.create] input:', student)
    const students = getData<Student>(KEYS.STUDENTS)
    const newStudent: Student = { ...student, id: uuidv4(), createdAt: dayjs().toISOString() }
    setData(KEYS.STUDENTS, [...students, newStudent])
    // asegurar usuario espejo
    const users = getData<User>(KEYS.USERS)
    setData(KEYS.USERS, [...users, { id: newStudent.id, name: newStudent.name, email: newStudent.email, role: 'estudiante', createdAt: newStudent.createdAt } as User])
    console.log('[studentService.create] created:', newStudent)
    return newStudent
  },
  update: (id: string, updates: Partial<Student>): Student | null => {
    console.log('[studentService.update] id, updates:', id, updates)
    const students = getData<Student>(KEYS.STUDENTS)
    const index = students.findIndex(s => s.id === id)
    if (index === -1) return null
    students[index] = { ...students[index], ...updates } as Student
    setData(KEYS.STUDENTS, students)
    // reflejar cambios básicos en usuario
    if (updates.name || updates.email) {
      const users = getData<User>(KEYS.USERS)
      const uIndex = users.findIndex(u => u.id === id)
      if (uIndex !== -1) {
        users[uIndex] = { ...users[uIndex], name: updates.name ?? users[uIndex].name, email: updates.email ?? users[uIndex].email }
        setData(KEYS.USERS, users)
      }
    }
    console.log('[studentService.update] updated:', students[index])
    return students[index]
  },
  delete: (id: string): void => {
    console.log('[studentService.delete] id:', id)
    const students = getData<Student>(KEYS.STUDENTS)
    setData(KEYS.STUDENTS, students.filter(s => s.id !== id))
    // eliminar also usuario espejo
    const users = getData<User>(KEYS.USERS)
    setData(KEYS.USERS, users.filter(u => u.id !== id))
  }
}

export const parentService = {
  getAll: (): Parent[] => getData<Parent>(KEYS.PARENTS),
  getById: (id: string): Parent | undefined => getData<Parent>(KEYS.PARENTS).find(p => p.id === id)
}

export const teacherService = {
  getAll: (): Teacher[] => getData<Teacher>(KEYS.TEACHERS),
  getById: (id: string): Teacher | undefined => getData<Teacher>(KEYS.TEACHERS).find(t => t.id === id),
  create: (teacher: Omit<Teacher, 'id' | 'createdAt'>): Teacher => {
    console.log('[teacherService.create] input:', teacher)
    const teachers = getData<Teacher>(KEYS.TEACHERS)
    const newTeacher: Teacher = { ...teacher, id: uuidv4(), createdAt: dayjs().toISOString() }
    setData(KEYS.TEACHERS, [...teachers, newTeacher])
    // usuario espejo
    const users = getData<User>(KEYS.USERS)
    setData(KEYS.USERS, [...users, { id: newTeacher.id, name: newTeacher.name, email: newTeacher.email, role: 'docente', createdAt: newTeacher.createdAt } as User])
    console.log('[teacherService.create] created:', newTeacher)
    return newTeacher
  },
  update: (id: string, updates: Partial<Teacher>): Teacher | null => {
    console.log('[teacherService.update] id, updates:', id, updates)
    const teachers = getData<Teacher>(KEYS.TEACHERS)
    const index = teachers.findIndex(t => t.id === id)
    if (index === -1) return null
    teachers[index] = { ...teachers[index], ...updates } as Teacher
    setData(KEYS.TEACHERS, teachers)
    if (updates.name || updates.email) {
      const users = getData<User>(KEYS.USERS)
      const uIndex = users.findIndex(u => u.id === id)
      if (uIndex !== -1) {
        users[uIndex] = { ...users[uIndex], name: updates.name ?? users[uIndex].name, email: updates.email ?? users[uIndex].email }
        setData(KEYS.USERS, users)
      }
    }
    console.log('[teacherService.update] updated:', teachers[index])
    return teachers[index]
  },
  delete: (id: string): void => {
    console.log('[teacherService.delete] id:', id)
    const teachers = getData<Teacher>(KEYS.TEACHERS)
    setData(KEYS.TEACHERS, teachers.filter(t => t.id !== id))
    const users = getData<User>(KEYS.USERS)
    setData(KEYS.USERS, users.filter(u => u.id !== id))
  }
}

export const classService = {
  getAll: (): Class[] => {
    const classes = getData<Class>(KEYS.CLASSES)
    // Verificar y corregir clases que no tengan modalidad
    return classes.map(cls => ({
      ...cls,
      modality: cls.modality || 'presencial'
    }))
  },
  getById: (id: string): Class | undefined => {
    const cls = getData<Class>(KEYS.CLASSES).find(c => c.id === id)
    if (!cls) return undefined
    // Asegurar que la clase tenga modalidad
    return {
      ...cls,
      modality: cls.modality || 'presencial'
    }
  },
  getByStudentId: (studentId: string): Class[] => {
    const classes = getData<Class>(KEYS.CLASSES)
    return classes
      .filter(c => c.studentIds.includes(studentId))
      .map(cls => ({
        ...cls,
        modality: cls.modality || 'presencial'
      }))
  },
  getByTeacherId: (teacherId: string): Class[] => {
    const classes = getData<Class>(KEYS.CLASSES)
    return classes
      .filter(c => c.teacherId === teacherId)
      .map(cls => ({
        ...cls,
        modality: cls.modality || 'presencial'
      }))
  },
  create: (cls: Omit<Class, 'id' | 'createdAt'>): Class => {
    console.log('[classService.create] input:', cls)
    const classes = getData<Class>(KEYS.CLASSES)
    const newClass: Class = { ...cls, id: uuidv4(), createdAt: dayjs().toISOString() }
    setData(KEYS.CLASSES, [...classes, newClass])
    // reflejar relación en teacher
    if (newClass.teacherId) {
      const teachers = getData<Teacher>(KEYS.TEACHERS)
      const tIndex = teachers.findIndex(t => t.id === newClass.teacherId)
      if (tIndex !== -1) {
        const setIds = new Set(teachers[tIndex].classIds)
        setIds.add(newClass.id)
        teachers[tIndex] = { ...teachers[tIndex], classIds: Array.from(setIds) }
        setData(KEYS.TEACHERS, teachers)
      }
    }
    // reflejar relación en students
    if (newClass.studentIds?.length) {
      const students = getData<Student>(KEYS.STUDENTS)
      const updated = students.map(s => newClass.studentIds.includes(s.id) ? { ...s, classIds: Array.from(new Set([...(s.classIds || []), newClass.id])) } : s)
      setData(KEYS.STUDENTS, updated)
    }
    console.log('[classService.create] created:', newClass)
    return newClass
  },
  update: (id: string, updates: Partial<Class>): Class | null => {
    console.log('[classService.update] id, updates:', id, updates)
    const classes = getData<Class>(KEYS.CLASSES)
    const index = classes.findIndex(c => c.id === id)
    if (index === -1) return null
    const prev = classes[index]
    const next: Class = { ...prev, ...updates } as Class
    classes[index] = next
    setData(KEYS.CLASSES, classes)
    // sincronizar teacher
    if (updates.teacherId && updates.teacherId !== prev.teacherId) {
      const teachers = getData<Teacher>(KEYS.TEACHERS)
      const detachIdx = teachers.findIndex(t => t.id === prev.teacherId)
      if (detachIdx !== -1) {
        teachers[detachIdx] = { ...teachers[detachIdx], classIds: (teachers[detachIdx].classIds || []).filter(cid => cid !== id) }
      }
      const attachIdx = teachers.findIndex(t => t.id === updates.teacherId)
      if (attachIdx !== -1) {
        teachers[attachIdx] = { ...teachers[attachIdx], classIds: Array.from(new Set([...(teachers[attachIdx].classIds || []), id])) }
      }
      setData(KEYS.TEACHERS, teachers)
    }
    // sincronizar students si cambió studentIds
    if (updates.studentIds) {
      const students = getData<Student>(KEYS.STUDENTS)
      const prevSet = new Set(prev.studentIds || [])
      const nextSet = new Set(next.studentIds || [])
      const toRemove = [...prevSet].filter(sid => !nextSet.has(sid))
      const toAdd = [...nextSet].filter(sid => !prevSet.has(sid))
      const updated = students.map(s => {
        if (toRemove.includes(s.id)) return { ...s, classIds: (s.classIds || []).filter(cid => cid !== id) }
        if (toAdd.includes(s.id)) return { ...s, classIds: Array.from(new Set([...(s.classIds || []), id])) }
        return s
      })
      setData(KEYS.STUDENTS, updated)
    }
    console.log('[classService.update] updated:', next)
    return next
  },
  delete: (id: string): void => {
    console.log('[classService.delete] id:', id)
    const classes = getData<Class>(KEYS.CLASSES)
    const cls = classes.find(c => c.id === id)
    setData(KEYS.CLASSES, classes.filter(c => c.id !== id))
    // quitar relación en teacher
    if (cls?.teacherId) {
      const teachers = getData<Teacher>(KEYS.TEACHERS)
      const idx = teachers.findIndex(t => t.id === cls.teacherId)
      if (idx !== -1) {
        teachers[idx] = { ...teachers[idx], classIds: (teachers[idx].classIds || []).filter(cid => cid !== id) }
        setData(KEYS.TEACHERS, teachers)
      }
    }
    // quitar relación en students
    if (cls?.studentIds?.length) {
      const students = getData<Student>(KEYS.STUDENTS)
      const updated = students.map(s => ({ ...s, classIds: (s.classIds || []).filter(cid => cid !== id) }))
      setData(KEYS.STUDENTS, updated)
    }
  }
}

export const taskService = {
  getAll: (): Task[] => getData<Task>(KEYS.TASKS),
  getById: (id: string): Task | undefined => getData<Task>(KEYS.TASKS).find(t => t.id === id),
  getByClassId: (classId: string): Task[] => getData<Task>(KEYS.TASKS).filter(t => t.classId === classId),
  getByStudentId: (studentId: string): Task[] => {
    const student = studentService.getById(studentId)
    if (!student) return []
    const studentClasses = classService.getByStudentId(studentId)
    const classIds = studentClasses.map(c => c.id)
    return getData<Task>(KEYS.TASKS).filter(t => classIds.includes(t.classId))
  },
  create: (task: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: dayjs().toISOString()
    }
    const tasks = getData<Task>(KEYS.TASKS)
    setData(KEYS.TASKS, [...tasks, newTask])
    return newTask
  }
}

export const taskSubmissionService = {
  getAll: (): TaskSubmission[] => getData<TaskSubmission>(KEYS.TASK_SUBMISSIONS),
  getByStudentId: (studentId: string): TaskSubmission[] => getData<TaskSubmission>(KEYS.TASK_SUBMISSIONS).filter(s => s.studentId === studentId),
  getByTaskId: (taskId: string): TaskSubmission[] => getData<TaskSubmission>(KEYS.TASK_SUBMISSIONS).filter(s => s.taskId === taskId),
  create: (submission: Omit<TaskSubmission, 'id' | 'submittedAt'>): TaskSubmission => {
    const newSubmission: TaskSubmission = {
      ...submission,
      id: uuidv4(),
      submittedAt: dayjs().toISOString()
    }
    const subs = getData<TaskSubmission>(KEYS.TASK_SUBMISSIONS)
    setData(KEYS.TASK_SUBMISSIONS, [...subs, newSubmission])
    return newSubmission
  }
}

export const gradeService = {
  getAll: (): Grade[] => getData<Grade>(KEYS.GRADES),
  getByStudentId: (studentId: string): Grade[] => getData<Grade>(KEYS.GRADES).filter(g => g.studentId === studentId),
  getByClassId: (classId: string): Grade[] => getData<Grade>(KEYS.GRADES).filter(g => g.classId === classId),
  create: (grade: Omit<Grade, 'id' | 'createdAt'>): Grade => {
    const newGrade: Grade = {
      ...grade,
      id: uuidv4(),
      createdAt: dayjs().toISOString()
    }
    const grades = getData<Grade>(KEYS.GRADES)
    setData(KEYS.GRADES, [...grades, newGrade])
    return newGrade
  }
}

export const paymentService = {
  getAll: (): Payment[] => getData<Payment>(KEYS.PAYMENTS),
  getByParentId: (parentId: string): Payment[] => getData<Payment>(KEYS.PAYMENTS).filter(p => p.parentId === parentId),
  getByStudentId: (studentId: string): Payment[] => getData<Payment>(KEYS.PAYMENTS).filter(p => p.studentId === studentId),
  create: (payment: Omit<Payment, 'id'>): Payment => {
    const newPayment: Payment = {
      ...payment,
      id: uuidv4()
    }
    const payments = getData<Payment>(KEYS.PAYMENTS)
    setData(KEYS.PAYMENTS, [...payments, newPayment])
    return newPayment
  },
  update: (id: string, updates: Partial<Payment>): Payment | null => {
    const payments = getData<Payment>(KEYS.PAYMENTS)
    const index = payments.findIndex(p => p.id === id)
    if (index === -1) return null
    payments[index] = { ...payments[index], ...updates } as Payment
    setData(KEYS.PAYMENTS, payments)
    return payments[index]
  }
}

export const notificationService = {
  getAll: (): Notification[] => getData<Notification>(KEYS.NOTIFICATIONS),
  getByUserId: (userId: string): Notification[] => getData<Notification>(KEYS.NOTIFICATIONS).filter(n => n.userId === userId),
  getUnreadByUserId: (userId: string): Notification[] => getData<Notification>(KEYS.NOTIFICATIONS).filter(n => n.userId === userId && !n.read),
  create: (notification: Omit<Notification, 'id' | 'createdAt'>): Notification => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      createdAt: dayjs().toISOString()
    }
    const notifications = getData<Notification>(KEYS.NOTIFICATIONS)
    setData(KEYS.NOTIFICATIONS, [...notifications, newNotification])
    return newNotification
  },
  markAsRead: (id: string): void => {
    const notifications = getData<Notification>(KEYS.NOTIFICATIONS)
    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) {
      (notifications[index] as Notification).read = true
      setData(KEYS.NOTIFICATIONS, notifications)
    }
  }
}

export const teacherRatingService = {
  getAll: (): TeacherRating[] => getData<TeacherRating>(KEYS.TEACHER_RATINGS),
  getByTeacherId: (teacherId: string): TeacherRating[] => getData<TeacherRating>(KEYS.TEACHER_RATINGS).filter(r => r.teacherId === teacherId),
  create: (rating: Omit<TeacherRating, 'id' | 'createdAt'>): TeacherRating => {
    const newRating: TeacherRating = {
      ...rating,
      id: uuidv4(),
      createdAt: dayjs().toISOString()
    }
    const ratings = getData<TeacherRating>(KEYS.TEACHER_RATINGS)
    setData(KEYS.TEACHER_RATINGS, [...ratings, newRating])
    return newRating
  }
}

// Función para obtener estadísticas del dashboard
export function getDashboardStats(userId: string, role: string): DashboardStats {
  const notifications = notificationService.getUnreadByUserId(userId)
  
  if (role === 'estudiante') {
    const tasks = taskService.getByStudentId(userId)
    const grades = gradeService.getByStudentId(userId)
    const completedTasks = tasks.filter(t => 
      getData<TaskSubmission>(KEYS.TASK_SUBMISSIONS).some(ts => ts.taskId === t.id && ts.studentId === userId)
    )
    
    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: tasks.length - completedTasks.length,
      averageGrade: grades.length > 0 ? grades.reduce((sum, g) => sum + g.value, 0) / grades.length : 0,
      attendanceRate: 95, // Simulado
      notifications: notifications.length
    }
  }
  
  if (role === 'padre') {
    const parent = parentService.getById(userId)
    const students = parent ? studentService.getByParentId(userId) : []
    const allTasks = students.flatMap(s => taskService.getByStudentId(s.id))
    
    return {
      totalTasks: allTasks.length,
      completedTasks: 0, // Se calcularía basado en entregas
      pendingTasks: allTasks.length,
      averageGrade: 8.5, // Simulado
      attendanceRate: 95,
      notifications: notifications.length
    }
  }
  
  if (role === 'docente') {
    const teacher = teacherService.getById(userId)
    const classes = teacher ? classService.getByTeacherId(userId) : []
    const allTasks = classes.flatMap(c => taskService.getByClassId(c.id))
    
    return {
      totalTasks: allTasks.length,
      completedTasks: 0, // Se calcularía basado en entregas
      pendingTasks: allTasks.length,
      averageGrade: 8.5, // Simulado
      attendanceRate: 95,
      notifications: notifications.length
    }
  }
  
  // Para otros roles, retornar estadísticas básicas
  return {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    averageGrade: 0,
    attendanceRate: 0,
    notifications: notifications.length
  }
}
