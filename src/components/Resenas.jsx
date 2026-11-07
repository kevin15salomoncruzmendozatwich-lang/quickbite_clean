import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

function Estrellas({ valor, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1" onMouseLeave={() => onChange && setHover(0)}>
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button"
                onClick={() => onChange?.(s)}
                onMouseEnter={() => onChange && setHover(s)}
                className={`text-2xl transition-transform ${onChange ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}>
          {s <= (hover || valor) ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  )
}

function nombreAnonimo() {
  return `UserAnonimo${Math.floor(10000 + Math.random() * 90000)}`
}

function LikeBtn({ idResena, user, onNeedAuth }) {
  const [liked, setLiked]   = useState(false)
  const [count, setCount]   = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Cargar conteo y si ya dio like (por sesión local)
    supabase.from('resena_like').select('id', { count: 'exact' })
      .eq('id_resena', idResena)
      .then(({ count: c }) => setCount(c || 0))
    const likedKey = `like_${idResena}`
    setLiked(localStorage.getItem(likedKey) === '1')
  }, [idResena])

  async function handleLike() {
    if (!user) { onNeedAuth(); return }
    if (loading) return
    setLoading(true)
    const likedKey = `like_${idResena}`
    try {
      if (liked) {
        // Unlike — no borramos de DB, solo localmente
        localStorage.removeItem(likedKey)
        setLiked(false)
        setCount(c => Math.max(0, c - 1))
      } else {
        await supabase.from('resena_like').insert({ id_resena: idResena })
        localStorage.setItem(likedKey, '1')
        setLiked(true)
        setCount(c => c + 1)
      }
    } catch (e) { console.warn(e) }
    finally { setLoading(false) }
  }

  return (
    <button onClick={handleLike} disabled={loading}
            className={`flex items-center gap-2 text-sm font-semibold transition-all duration-200
                        px-3 py-1.5 rounded-full border disabled:opacity-60 ${
              liked
                ? 'bg-green-50 border-green-200 text-green-600'
                : 'bg-cream border-border text-sub hover:border-navy hover:text-navy'
            }`}>
      <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'}
           stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
        <path strokeLinecap="round" strokeLinejoin="round"
              d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
      </svg>
      <span>{liked ? 'Útil' : '¿Te fue útil?'}</span>
      {count > 0 && (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
          liked ? 'bg-green-100 text-green-700' : 'bg-border text-sub'
        }`}>{count}</span>
      )}
    </button>
  )
}

function fmtFecha(s) {
  const d = new Date(s)
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Resenas({ idRestaurante, onNeedAuth }) {
  const { user } = useAuth()
  const [resenas, setResenas]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [form, setForm]             = useState({ calificacion: 0, comentario: '' })
  const [enviando, setEnviando]     = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState(false)

  useEffect(() => {
    cargar()
  }, [idRestaurante])

  async function cargar() {
    setLoading(true)
    const { data } = await supabase
      .from('resena')
      .select('*')
      .eq('id_restaurante', idRestaurante)
      .order('created_at', { ascending: false })
    setResenas(data || [])
    setLoading(false)
  }

  async function enviar(e) {
    e.preventDefault()
    setError('')
    if (form.calificacion === 0) { setError('Selecciona una calificación'); return }
    if (form.comentario.trim().length < 5) { setError('Escribe un comentario más largo'); return }

    setEnviando(true)
    try {
      const nombre = user?.nombre || nombreAnonimo()
      const { error: err } = await supabase.from('resena').insert({
        id_restaurante: idRestaurante,
        nombre_usuario: nombre,
        calificacion:   form.calificacion,
        comentario:     form.comentario.trim(),
      })
      if (err) throw err
      setSuccess(true)
      setForm({ calificacion: 0, comentario: '' })
      await cargar()
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError('Error al enviar: ' + e.message)
    } finally {
      setEnviando(false)
    }
  }

  const promedio = resenas.length
    ? (resenas.reduce((s, r) => s + r.calificacion, 0) / resenas.length).toFixed(1)
    : null

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-playfair font-bold text-xl text-navy">Reseñas</h2>
        {promedio && (
          <div className="flex items-center gap-2 bg-orange-soft border border-orange/20
                          px-3 py-1.5 rounded-full">
            <span className="text-orange font-bold text-lg">{promedio}</span>
            <span>⭐</span>
            <span className="text-sub text-xs">({resenas.length})</span>
          </div>
        )}
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-6 shadow-card">
        <h3 className="font-bold text-navy mb-4">
          {user ? `Deja tu reseña, ${user.nombre}` : 'Deja tu reseña'}
        </h3>
        {!user && (
          <p className="text-sub text-xs mb-4 bg-cream border border-border rounded-xl px-3 py-2">
            💡 Sin cuenta tu reseña aparecerá con un nombre anónimo aleatorio
          </p>
        )}
        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-2">
              Calificación
            </label>
            <Estrellas valor={form.calificacion} onChange={v => setForm(f => ({ ...f, calificacion: v }))} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-2">
              Comentario
            </label>
            <textarea
              value={form.comentario}
              onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))}
              placeholder="¿Cómo fue tu experiencia?"
              rows={3}
              className="w-full px-4 py-3 border-2 border-border rounded-xl text-sm text-navy
                         outline-none focus:border-orange transition-colors bg-cream resize-none"
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">⚠️ {error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm font-medium">✅ ¡Reseña enviada!</p>
          )}
          <button type="submit" disabled={enviando}
                  className="bg-navy hover:bg-orange text-white font-bold px-6 py-2.5
                             rounded-xl transition-all duration-200 disabled:opacity-60 text-sm">
            {enviando ? 'Enviando…' : 'Publicar reseña'}
          </button>
        </form>
      </div>

      {/* Lista de reseñas */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : resenas.length === 0 ? (
        <div className="text-center py-12 text-sub">
          <div className="text-4xl mb-3">💬</div>
          <p className="font-medium">Sé el primero en dejar una reseña</p>
        </div>
      ) : (
        <div className="space-y-4">
          {resenas.map((r, i) => (
            <div key={r.id_resena}
                 className="bg-white rounded-2xl border border-border p-5 shadow-card anim-fadeup"
                 style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-navy rounded-full flex items-center justify-center
                                  text-white font-bold text-sm shrink-0">
                    {r.nombre_usuario.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{r.nombre_usuario}</p>
                    <p className="text-sub text-xs">{fmtFecha(r.created_at)}</p>
                  </div>
                </div>
                <Estrellas valor={r.calificacion} />
              </div>
              <p className="text-navy/80 text-sm leading-relaxed pl-12 mb-3">{r.comentario}</p>
              <div className="pl-12">
                <LikeBtn idResena={r.id_resena} user={user} onNeedAuth={onNeedAuth || (() => {})} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
