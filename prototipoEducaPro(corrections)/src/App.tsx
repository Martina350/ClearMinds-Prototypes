import { RouterProvider } from 'react-router-dom'
import { improvedRouter } from './routes/improved-router'
import { initializeData } from './services/dataService'
import './App.css'

// Inicializar datos al cargar la aplicación
initializeData()

function App() {
  return <RouterProvider router={improvedRouter} />
}

export default App