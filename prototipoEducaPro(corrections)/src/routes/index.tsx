import { createBrowserRouter, Navigate } from 'react-router-dom'
import { BaseLayout } from '../components/layouts/BaseLayout'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { LoginPage } from '../pages/LoginPage'
import { NotificationsPage } from '../pages/NotificationsPage'

// Dashboards
import { AdminDashboard } from '../components/dashboards/AdminDashboard'
import { FinanceDashboard } from '../components/dashboards/FinanceDashboard'
import { ParentDashboard } from '../components/dashboards/ParentDashboard'
import { StudentDashboard } from '../components/dashboards/StudentDashboard'
import { TeacherDashboard } from '../components/dashboards/TeacherDashboard'

// Páginas de Admin
import { AdminClassesPage } from '../pages/admin/AdminClassesPage'
import { AdminEnrollmentsPage } from '../pages/admin/AdminEnrollmentsPage'
import { AdminReportsPage } from '../pages/admin/AdminReportsPage'
import { AdminStudentsPage } from '../pages/admin/AdminStudentsPage'
import { AdminTeachersPage } from '../pages/admin/AdminTeachersPage'
import { AdminUsersPage } from '../pages/admin/AdminUsersPage'

// Páginas de Finanzas
import { FinanceDebtsPage } from '../pages/finance/FinanceDebtsPage'
import { FinanceIncomePage } from '../pages/finance/FinanceIncomePage'
import { FinancePaymentsPage } from '../pages/finance/FinancePaymentsPage'
import { FinanceReportsPage } from '../pages/finance/FinanceReportsPage'

// Páginas de Padre
import { ParentGradesPage } from '../pages/parent/ParentGradesPage'
import { ParentPaymentsPage } from '../pages/parent/ParentPaymentsPage'
import { ParentRatingsPage } from '../pages/parent/ParentRatingsPage'
import { ParentStudentsPage } from '../pages/parent/ParentStudentsPage'
import { ParentTasksPage } from '../pages/parent/ParentTasksPage'

// Páginas de Estudiante
import { StudentAttendancePage } from '../pages/student/StudentAttendancePage'
import { StudentGradesPage } from '../pages/student/StudentGradesPage'
import { StudentMaterialsPage } from '../pages/student/StudentMaterialsPage'
import { StudentNotificationsPage } from '../pages/student/StudentNotificationsPage'
import { StudentTasksPage } from '../pages/student/StudentTasksPage'

// Páginas de Docente
import { TeacherAttendancePage } from '../pages/teacher/TeacherAttendancePage'
import { TeacherClassesPage } from '../pages/teacher/TeacherClassesPage'
import { TeacherGradesPage } from '../pages/teacher/TeacherGradesPage'
import { TeacherMonitoringPage } from '../pages/teacher/TeacherMonitoringPage'
import { TeacherStudentsPage } from '../pages/teacher/TeacherStudentsPage'
import { TeacherTasksPage } from '../pages/teacher/TeacherTasksPage'

// Página 404
import { NotFoundPage } from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '/app',
    element: <BaseLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      // Redirección por defecto
      {
        index: true,
        element: <Navigate to="/app/admin" replace />
      },
      
      // Rutas de Admin
      {
        path: 'admin',
        element: <AdminDashboard />,
        children: [
          {
            index: true,
            element: <Navigate to="usuarios" replace />
          },
          {
            path: 'usuarios',
            element: <AdminUsersPage />
          },
          {
            path: 'estudiantes',
            element: <AdminStudentsPage />
          },
          {
            path: 'docentes',
            element: <AdminTeachersPage />
          },
          {
            path: 'clases',
            element: <AdminClassesPage />
          },
          {
            path: 'matriculas',
            element: <AdminEnrollmentsPage />
          },
          {
            path: 'reportes',
            element: <AdminReportsPage />
          }
        ]
      },

      // Rutas de Finanzas
      {
        path: 'finanzas',
        element: <FinanceDashboard />,
        children: [
          {
            index: true,
            element: <Navigate to="pagos" replace />
          },
          {
            path: 'pagos',
            element: <FinancePaymentsPage />
          },
          {
            path: 'ingresos',
            element: <FinanceIncomePage />
          },
          {
            path: 'deudas',
            element: <FinanceDebtsPage />
          },
          {
            path: 'reportes',
            element: <FinanceReportsPage />
          }
        ]
      },

      // Rutas de Padre
      {
        path: 'padre',
        element: <ParentDashboard />,
        children: [
          {
            index: true,
            element: <Navigate to="hijos" replace />
          },
          {
            path: 'hijos',
            element: <ParentStudentsPage />
          },
          {
            path: 'calificaciones',
            element: <ParentGradesPage />
          },
          {
            path: 'tareas',
            element: <ParentTasksPage />
          },
          {
            path: 'pagos',
            element: <ParentPaymentsPage />
          },
          {
            path: 'calificaciones-docentes',
            element: <ParentRatingsPage />
          }
        ]
      },

      // Rutas de Estudiante
      {
        path: 'estudiante',
        element: <StudentDashboard />,
        children: [
          {
            index: true,
            element: <Navigate to="tareas" replace />
          },
          {
            path: 'tareas',
            element: <StudentTasksPage />
          },
          {
            path: 'calificaciones',
            element: <StudentGradesPage />
          },
          {
            path: 'asistencia',
            element: <StudentAttendancePage />
          },
          {
            path: 'materiales',
            element: <StudentMaterialsPage />
          },
          {
            path: 'notificaciones',
            element: <StudentNotificationsPage />
          }
        ]
      },

      // Rutas de Docente
      {
        path: 'docente',
        element: <TeacherDashboard />,
        children: [
          {
            index: true,
            element: <Navigate to="estudiantes" replace />
          },
          {
            path: 'estudiantes',
            element: <TeacherStudentsPage />
          },
          {
            path: 'clases',
            element: <TeacherClassesPage />
          },
          {
            path: 'calificaciones',
            element: <TeacherGradesPage />
          },
          {
            path: 'tareas',
            element: <TeacherTasksPage />
          },
          {
            path: 'asistencia',
            element: <TeacherAttendancePage />
          },
          {
            path: 'monitoreo',
            element: <TeacherMonitoringPage />
          }
        ]
      },

      // Rutas compartidas
      {
        path: 'notificaciones',
        element: <NotificationsPage />
      },

      // Página 404
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  },
  // Ruta catch-all para cualquier ruta no encontrada fuera de /app
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: <ErrorBoundary />
  }
])
