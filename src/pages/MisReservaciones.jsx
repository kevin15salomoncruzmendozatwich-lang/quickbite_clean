import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

const ESTADO_STYLES = {
  pendiente:  { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200', label: 'Pendiente',  icon: '⏳' },
  confirmada: { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200',  label: 'Confirmada', icon: '✅' },
  cancelada:  { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',    label: 'Cancelada',  icon: '❌' },
  asistio:    { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',   label: 'Asistió',    icon: '🎉' },
}

function fmtFecha(s) {
  if (!s) return '—'
  const d = new Date(s)
  return d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}
function fmtHora(s) {
  if (!s) return '—'
  const d = new Date(s)
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}

export default function MisReservaciones() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reservaciones, setReservaciones] = useState([])
  const [loading, setLoading]             = useState(true)
  const [tab, setTab]                     = useState('proximas')

  useEffect(() => {
    if (!user) { navigate('/'); return }
    supabase
      .from('reservacion')
      .select('*, restaurante(nombre, direccion)')
      .eq('email', user.email)
      .order('fecha_reservacion', { ascending: false })
      .then(({ data }) => { setReservaciones(data || []); setLoading(false) })
  }, [user])

  const hoy = new Date()
  const proximas  = reservaciones.filter(r => new Date(r.fecha_reservacion) >= hoy && r.estado !== 'cancelada')
  const pasadas   = reservaciones.filter(r => new Date(r.fecha_reservacion) <  hoy || r.estado === 'cancelada')

  const lista = tab === 'proximas' ? proximas : pasadas

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-sub text-sm font-medium hover:text-navy transition-colors mb-6 group">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
               fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Inicio
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-navy rounded-2xl flex items-center justify-center
                          text-white text-xl font-bold font-playfair shadow-card">
            {user?.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-playfair font-bold text-2xl text-navy">{user?.nombre}</h1>
            <p className="text-sub text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-cream-dark rounded-2xl p-1 mb-6 w-fit border border-border">
        {[
          { key: 'proximas', label: 'Próximas', count: proximas.length },
          { key: 'pasadas',  label: 'Historial', count: pasadas.length },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setTab(key)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    tab === key ? 'bg-white text-navy shadow-sm' : 'text-sub hover:text-navy'
                  }`}>
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              tab === key ? 'bg-orange text-white' : 'bg-border text-sub'
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      ) : lista.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">{tab === 'proximas' ? '📅' : '📋'}</div>
          <p className="font-playfair font-bold text-lg text-navy mb-2">
            {tab === 'proximas' ? 'Sin reservaciones próximas' : 'Sin historial aún'}
          </p>
          <p className="text-sub text-sm mb-6">
            {tab === 'proximas' ? 'Explora los restaurantes y haz tu primera reservación' : 'Aquí aparecerán tus reservaciones pasadas'}
          </p>
          {tab === 'proximas' && (
            <button onClick={() => navigate('/')}
                    className="bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange transition-colors">
              Explorar restaurantes
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {lista.map((r, i) => {
            const est = ESTADO_STYLES[r.estado] || ESTADO_STYLES.pendiente
            return (
              <div key={r.id_reservacion}
                   className="bg-white rounded-2xl border border-border shadow-card p-6 anim-fadeup"
                   style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-playfair font-bold text-lg text-navy leading-tight">
                      {r.restaurante?.nombre || 'Restaurante'}
                    </h3>
                    {r.restaurante?.direccion && (
                      <p className="text-sub text-xs mt-0.5 flex items-center gap-1">
                        <svg className="w-3 h-3 text-orange" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                        </svg>
                        {r.restaurante.direccion}
                      </p>
                    )}
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full border ${est.bg} ${est.text} ${est.border}`}>
                    {est.icon} {est.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: '📅', label: 'Fecha',    val: fmtFecha(r.fecha_reservacion) },
                    { icon: '⏰', label: 'Hora',     val: fmtHora(r.fecha_reservacion)  },
                    { icon: '👥', label: 'Personas', val: `${r.numero_personas} persona${r.numero_personas > 1 ? 's' : ''}` },
                    { icon: '📍', label: 'Zona',     val: r.zona || '—' },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="bg-cream rounded-xl px-3 py-2.5">
                      <p className="text-sub text-[10px] font-semibold uppercase tracking-wider mb-0.5">{icon} {label}</p>
                      <p className="text-navy text-xs font-semibold leading-tight">{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
