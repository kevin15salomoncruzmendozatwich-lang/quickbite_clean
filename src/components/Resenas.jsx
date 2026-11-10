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

const MAX_FOTOS = 3
const MAX_MB = 5

// Reduce la foto (máx. 1600 px) y la convierte a JPG para subirla más rápido
async function comprimir(file) {
  const bmp = await createImageBitmap(file)
  const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k)
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height)
  return await new Promise(res => c.toBlob(b => res(b), 'image/jpeg', 0.82))
}

function Respuesta({ r, resp, isAdmin, user, onChange }) {
  const [editando, setEditando] = useState(false)
  const [texto, setTexto]       = useState(resp?.texto || '')
  const [guardando, setGuardando] = useState(false)
  const [error, setError]       = useState('')

  async function guardar() {
    setError(''); setGuardando(true)
    try {
      const { data, error: err } = await supabase.rpc('responder_resena', {
        p_id_cliente: user.id_cliente, p_email: user.email,
        p_id_resena: r.id_resena, p_texto: texto,
      })
      if (err) throw err
      if (!data?.ok) { setError(data?.error || 'No se pudo guardar'); return }
      setEditando(false); onChange()
    } catch { setError('No se pudo guardar. Inténtalo de nuevo.') }
    finally { setGuardando(false) }
  }

  async function borrar() {
    if (!confirm('¿Eliminar tu respuesta?')) return
    await supabase.rpc('eliminar_respuesta', {
      p_id_cliente: user.id_cliente, p_email: user.email, p_id_resena: r.id_resena,
    })
    onChange()
  }

  if (editando) {
    return (
      <div className="ml-12 mt-3 bg-cream border border-border rounded-xl p-4">
        <textarea value={texto} onChange={e => setTexto(e.target.value)} rows={3} maxLength={600} autoFocus
                  placeholder="Escribe tu respuesta a esta reseña…"
                  className="w-full px-3 py-2 border-2 border-border rounded-lg text-sm text-navy outline-none
                             focus:border-orange bg-white resize-none" />
        {error && <p className="text-red-500 text-xs mt-1">⚠️ {error}</p>}
        <div className="flex gap-2 mt-2">
          <button onClick={guardar} disabled={guardando}
                  className="bg-orange hover:bg-orange-dark text-white text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-60">
            {guardando ? 'Guardando…' : 'Publicar respuesta'}
          </button>
          <button onClick={() => { setEditando(false); setTexto(resp?.texto || ''); setError('') }}
                  className="text-sub text-xs px-3 py-2 hover:text-navy">Cancelar</button>
        </div>
      </div>
    )
  }

  if (resp) {
    return (
      <div className="ml-12 mt-3 bg-orange-soft border border-orange/20 rounded-xl p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-xs font-bold text-orange uppercase tracking-wider">Respuesta del restaurante</p>
          {isAdmin && (
            <div className="flex gap-3 text-xs">
              <button onClick={() => setEditando(true)} className="text-sub hover:text-navy">Editar</button>
              <button onClick={borrar} className="text-red-400 hover:text-red-600">Eliminar</button>
            </div>
          )}
        </div>
        <p className="text-navy/80 text-sm leading-relaxed">{resp.texto}</p>
        <p className="text-sub text-xs mt-1">{fmtFecha(resp.editado_at || resp.created_at)}{resp.editado_at ? ' · editada' : ''}</p>
      </div>
    )
  }

  if (isAdmin) {
    return (
      <button onClick={() => setEditando(true)}
              className="ml-12 mt-3 text-xs font-semibold text-orange hover:underline">
        Responder
      </button>
    )
  }
  return null
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
  const [fotos, setFotos]           = useState([])   // [{ file, preview }]
  const [visor, setVisor]           = useState('')
  const [isAdmin, setIsAdmin]       = useState(false)

  useEffect(() => {
    cargar()
  }, [idRestaurante])

  // ¿Esta cuenta administra el restaurante? (canjeó su clave ilimitada)
  useEffect(() => {
    setIsAdmin(false)
    if (!user?.id_cliente) return
    supabase.rpc('es_admin_restaurante', { p_id_cliente: user.id_cliente, p_id_restaurante: idRestaurante })
      .then(({ data }) => setIsAdmin(data === true))
  }, [user?.id_cliente, idRestaurante])

  async function cargar() {
    setLoading(true)
    let { data, error } = await supabase
      .from('resena')
      .select('*, resena_foto(url), resena_respuesta(texto, created_at, editado_at)')
      .eq('id_restaurante', idRestaurante)
      .order('created_at', { ascending: false })
    if (error) {
      // Si aún no existen las tablas nuevas, se cargan las reseñas simples
      ;({ data } = await supabase.from('resena').select('*')
        .eq('id_restaurante', idRestaurante).order('created_at', { ascending: false }))
    }
    setResenas(data || [])
    setLoading(false)
  }

  function agregarFotos(e) {
    setError('')
    const nuevas = []
    for (const f of Array.from(e.target.files || [])) {
      if (!/^image\//.test(f.type)) { setError('Solo se permiten imágenes'); continue }
      if (f.size > MAX_MB * 1024 * 1024) { setError(`Cada foto debe pesar menos de ${MAX_MB} MB`); continue }
      nuevas.push({ file: f, preview: URL.createObjectURL(f) })
    }
    setFotos(prev => [...prev, ...nuevas].slice(0, MAX_FOTOS))
    e.target.value = ''
  }
  function quitarFoto(i) {
    setFotos(prev => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, j) => j !== i) })
  }

  async function enviar(e) {
    e.preventDefault()
    setError('')
    if (form.calificacion === 0) { setError('Selecciona una calificación'); return }
    if (form.comentario.trim().length < 5) { setError('Escribe un comentario más largo'); return }

    setEnviando(true)
    try {
      const nombre = user?.nombre || nombreAnonimo()
      const { data: nueva, error: err } = await supabase.from('resena').insert({
        id_restaurante: idRestaurante,
        nombre_usuario: nombre,
        calificacion:   form.calificacion,
        comentario:     form.comentario.trim(),
      }).select('id_resena').single()
      if (err) throw err

      // Fotos (si falla alguna, la reseña se publica igual)
      let fallaFoto = false
      for (let i = 0; i < fotos.length; i++) {
        try {
          const blob = await comprimir(fotos[i].file)
          const ruta = `${idRestaurante}/${nueva.id_resena}-${i}-${Date.now()}.jpg`
          const { error: eUp } = await supabase.storage.from('resenas_fotos')
            .upload(ruta, blob, { contentType: 'image/jpeg' })
          if (eUp) throw eUp
          const { data: pub } = supabase.storage.from('resenas_fotos').getPublicUrl(ruta)
          await supabase.from('resena_foto').insert({ id_resena: nueva.id_resena, url: pub.publicUrl })
        } catch { fallaFoto = true }
      }
      fotos.forEach(f => URL.revokeObjectURL(f.preview))
      setFotos([])
      if (fallaFoto) setError('Tu reseña se publicó, pero alguna foto no se pudo subir.')
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
          <div>
            <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-2">
              Fotos ({fotos.length}/{MAX_FOTOS})
            </label>
            <div className="flex flex-wrap gap-3">
              {fotos.map((f, i) => (
                <div key={f.preview} className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
                  <img src={f.preview} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => quitarFoto(i)} aria-label="Quitar foto"
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs leading-none">✕</button>
                </div>
              ))}
              {fotos.length < MAX_FOTOS && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-orange
                                  text-sub hover:text-orange flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="text-[10px] font-semibold mt-0.5">Agregar</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={agregarFotos} />
                </label>
              )}
            </div>
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
              {r.resena_foto?.length > 0 && (
                <div className="pl-12 mb-3 flex flex-wrap gap-2">
                  {r.resena_foto.map(f => (
                    <button key={f.url} type="button" onClick={() => setVisor(f.url)}
                            className="w-24 h-24 rounded-xl overflow-hidden border border-border hover:opacity-90 transition-opacity">
                      <img src={f.url} alt="Foto de la reseña" loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <div className="pl-12">
                <LikeBtn idResena={r.id_resena} user={user} onNeedAuth={onNeedAuth || (() => {})} />
              </div>
              <Respuesta r={r}
                         resp={Array.isArray(r.resena_respuesta) ? r.resena_respuesta[0] : r.resena_respuesta}
                         isAdmin={isAdmin} user={user} onChange={cargar} />
            </div>
          ))}
        </div>
      )}

      {visor && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
             onClick={() => setVisor('')}>
          <img src={visor} alt="" className="max-w-full max-h-full rounded-xl" />
          <button className="absolute top-5 right-5 text-white text-2xl" aria-label="Cerrar">✕</button>
        </div>
      )}
    </div>
  )
}
