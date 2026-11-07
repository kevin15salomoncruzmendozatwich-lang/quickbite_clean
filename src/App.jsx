import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Restaurant from './pages/Restaurant'
import MisReservaciones from './pages/MisReservaciones'
import Perfil from './pages/Perfil'
import ActivarCuenta from './pages/ActivarCuenta'

export default function App() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/restaurantes" element={<Home />} />
          <Route path="/restaurante/:id" element={<Restaurant />} />
          <Route path="/mis-reservaciones" element={<MisReservaciones />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/activar-cuenta" element={<ActivarCuenta />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}
