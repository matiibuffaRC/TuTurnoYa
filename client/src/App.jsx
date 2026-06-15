import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Import components
import Navbar from './components/Header/Navbar';
import Footer from './components/Footer/Footer'

// Import pages
import ReservarTurno from './pages/ReservarTurno'
import Servicios from './pages/Servicios'
import MisTurnos from './pages/MisTurnos'
import AdminsPanel from './pages/AdminsPanel'

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-50">
                {/* Headear */}
                <Navbar />
                {/* Diferentes pages */}
                <Routes>
                    <Route path="/" element={<ReservarTurno />} />
                    <Route path="/servicios" element={<Servicios />} />
                    <Route path="/mis-turnos" element={<MisTurnos />} />
                    <Route path="/admins-panel" element={<AdminsPanel />}/>
                </Routes>
                <Footer></Footer>
            </div>
        </BrowserRouter>
    )
}

export default App
