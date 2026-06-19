import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Navbar from './components/Header/Navbar'
import Footer from './components/Footer/Footer'

import ReservarTurno from './pages/ReservarTurno'
import Servicios from './pages/Servicios'
import MisTurnos from './pages/MisTurnos'
import AdminsPanel from './pages/AdminsPanel'
import Dashboard from './pages/Dashboard'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="min-h-screen bg-slate-50">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<ReservarTurno />} />
                        <Route path="/servicios" element={<Servicios />} />
                        <Route path="/mis-turnos" element={<MisTurnos />} />
                        <Route path="/admins-panel" element={<AdminsPanel />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
