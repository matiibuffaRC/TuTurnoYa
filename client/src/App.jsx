import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ReservarTurno from './pages/ReservarTurno'
import Servicios from './pages/Servicios'
import MisTurnos from './pages/MisTurnos'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<ReservarTurno />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/mis-turnos" element={<MisTurnos />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
