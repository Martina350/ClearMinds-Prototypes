export interface User {
  id: string
  name: string
  email: string
  role: 'estudiante' | 'padre' | 'docente' | 'admin' | 'finanzas'
  avatar?: string
  createdAt: string
}

export interface Student extends User {
  parentId?: string
  classIds: string[]
  grade: string
  status?: 'active' | 'inactive'
}

export interface Parent extends User {
  studentIds: string[]
}

export interface Teacher extends User {
  classIds: string[]
  subject: string
}

export interface Task {
  id: string
  title: string
  description: string
  classId: string
  teacherId: string
  dueDate: string
  createdAt: string
  attachments?: string[]
  type?: string
  studentId?: string
  status?: string
}

export interface TaskSubmission {
  id: string
  taskId: string
  studentId: string
  content: string
  attachments: string[]
  submittedAt: string
  grade?: number
  feedback?: string
}

export interface Class {
  id: string
  name: string
  subject: string
  teacherId: string
  studentIds: string[]
  schedule: string
  room: string
  createdAt: string
}

export interface Grade {
  id: string
  studentId: string
  classId: string
  taskId?: string
  value: number
  maxValue: number
  type: 'homework' | 'exam' | 'participation'
  description?: string
  createdAt: string
}

export interface Attendance {
  id: string
  studentId: string
  classId: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

export interface Payment {
  id: string
  parentId: string
  amount: number
  dueDate: string
  paidDate?: string
  status: 'pending' | 'paid' | 'overdue'
  description: string
  createdAt: string
  studentId?: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface TeacherRating {
  id: string
  parentId: string
  teacherId: string
  rating: number // 1-5
  review: string
  createdAt: string
}

export interface DashboardStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  averageGrade: number
  attendanceRate: number
  notifications: number
}
