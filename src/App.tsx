import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/infra/navigation'

function App() {
  return <RouterProvider router={router} />
}

export default App
