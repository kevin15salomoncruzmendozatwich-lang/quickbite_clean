import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import AuthModal from './AuthModal'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [modal, setModal]       = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleLogout() {
    setDropdown(false)
    logout()
    navigate('/')
  }

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_#E8DDD4] py-3' : 'bg-cream/90 backdrop-blur-md py-4'
      } px-6 md:px-12`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 bg-navy rounded-xl flex items-center justify-center
                            group-hover:bg-orange transition-colors duration-200 shadow-sm">
              <span className="text-lg">🍔</span>
            </div>
            <span className="font-playfair font-bold text-xl text-navy tracking-tight">
              Quick<span className="text-orange">Bite</span>
            </span>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setDropdown(d => !d)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                    dropdown
                      ? 'bg-navy text-white border-navy'
                      : 'bg-orange-soft border-orange/20 hover:border-orange/50'
                  }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    dropdown ? 'bg-white text-navy' : 'bg-orange text-white'
                  }`}>
                    {user.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <span className={`font-semibold text-sm ${dropdown ? 'text-white' : 'text-navy'}`}>
                    {user.nombre}
                  </span>
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    dropdown ? 'rotate-180 text-white/70' : 'text-sub'
                  }`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>

                {/* Dropdown */}
                {dropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl
                                  border border-border shadow-modal overflow-hidden anim-modalin z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border bg-cream">
                      <p className="font-bold text-navy text-sm">{user.nombre}</p>
                      <p className="text-sub text-xs truncate">{user.email}</p>
                    </div>

                    {/* Options */}
                    <div className="py-1.5">
                      <button
                        onClick={() => { setDropdown(false); navigate('/mis-reservaciones') }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-navy
                                   hover:bg-cream transition-colors text-left">
                        <span className="text-base">📅</span>
                        <span className="font-medium">Mis reservaciones</span>
                      </button>
                    </div>

                    <div className="border-t border-border py-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm
                                   text-red-500 hover:bg-red-50 transition-colors text-left">
                        <span className="text-base">🚪</span>
                        <span className="font-medium">Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={() => setModal('login')}
                        className="text-navy font-medium text-sm px-5 py-2.5 rounded-full
                                   border border-border hover:border-navy transition-all duration-200">
                  Iniciar sesión
                </button>
                <button onClick={() => setModal('register')}
                        className="bg-navy text-white font-semibold text-sm px-5 py-2.5 rounded-full
                                   hover:bg-orange transition-all duration-200 shadow-sm">
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {modal && <AuthModal mode={modal} onClose={() => setModal(null)} onSwitch={setModal} />}
    </>
  )
}
