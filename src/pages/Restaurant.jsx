import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import AuthModal from '../components/AuthModal'
import ReservaModal from '../components/ReservaModal'

const EMOJIS_MAP = {
  hamburguesa:'🍔', pizza:'🍕', tacos:'🌮', pasta:'🍝', ensalada:'🥗',
  agua:'💧', bebida:'🥤', refresco:'🥤', postre:'🍰', helado:'🍦',
  café:'☕', pollo:'🍗', res:'🥩', cerdo:'🥓', mariscos:'🦐',
}
function getEmoji(nombre) {
  const n = nombre.toLowerCase()
  for (const [k, v] of Object.entries(EMOJIS_MAP)) if (n.includes(k)) return v
  return '🍽️'
}
function fmtFecha(s) {
  if (!s) return '—'
  const [y, m, d] = s.split('-')
  const M = ['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  return `${d} ${M[+m]} ${y}`
}

const TABS = [
  { key: 'menu',   label: 'Menú' },
  { key: 'promos', label: 'Promociones' },
]

export default function Restaurant() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [rest, setRest]         = useState(null)
  const [tab, setTab]           = useState('menu')
  const [cats, setCats]         = useState([])
  const [productos, setProductos] = useState([])
  const [promoIds, setPromoIds] = useState(new Set())
  const [promos, setPromos]     = useState([])
  const [catActiva, setCatActiva] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [authModal, setAuthModal] = useState(null)
  const [reservaOpen, setReservaOpen] = useState(false)
  const [pendingReserva, setPendingReserva] = useState(false)

  useEffect(() => {
    supabase.from('restaurante').select('*').eq('id_restaurante', id).single()
      .then(({ data }) => setRest(data))
  }, [id])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const hoy = new Date().toISOString().split('T')[0]
      const [{ data: c }, { data: p }, { data: pr }] = await Promise.all([
        supabase.from('categoria').select('*').eq('id_restaurante', id).order('nombre'),
        supabase.from('producto').select('*').eq('id_restaurante', id).eq('disponible', true).order('nombre'),
        supabase.from('promocion').select('*').eq('id_restaurante', id).eq('activa', true)
          .lte('fecha_inicio', hoy).gte('fecha_fin', hoy)
          .order('porcentaje_descuento', { ascending: false }),
      ])
      setCats(c || [])
      setProductos(p || [])
      setPromos(pr || [])
      const ids = new Set()
      for (const promo of (pr || [])) {
        if (promo.tipo_aplicacion === 'todos') {
          (p || []).forEach(prod => ids.add(prod.id_producto))
        } else if (promo.tipo_aplicacion === 'productos') {
          const { data: rel } = await supabase.from('promocion_producto')
            .select('id_producto').eq('id_promocion', promo.id_promocion)
          rel?.forEach(r => ids.add(r.id_producto))
        } else if (promo.tipo_aplicacion === 'categorias') {
          const { data: rel } = await supabase.from('promocion_categoria')
            .select('id_categoria').eq('id_promocion', promo.id_promocion)
          const catIds = new Set(rel?.map(r => r.id_categoria))
          ;(p || []).filter(prod => catIds.has(prod.id_categoria)).forEach(prod => ids.add(prod.id_producto))
        }
      }
      setPromoIds(ids)
      setLoading(false)
    }
    load()

    // Realtime: re-cargar cuando cambie producto o promocion en este restaurante
    const channel = supabase
      .channel(`restaurant-${id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'producto',
        filter: `id_restaurante=eq.${id}`
      }, () => load())
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'promocion',
        filter: `id_restaurante=eq.${id}`
      }, () => load())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [id])

  function iniciarReserva() {
    setReservaOpen(true)
  }
  function onAuthSuccess() {
    setAuthModal(null)
    if (pendingReserva) { setPendingReserva(false); setReservaOpen(true) }
  }

  const productosFiltrados = catActiva
    ? productos.filter(p => p.id_categoria === catActiva)
    : productos

  if (!rest) return (
    <div className="flex flex-col items-center justify-center py-40 gap-3 text-sub">
      <div className="spinner" />
      <span className="text-sm font-medium">Cargando restaurante…</span>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 pb-24">

      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-sub text-sm font-medium
                   hover:text-navy transition-colors mb-8 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
             fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        Todos los restaurantes
      </button>

      {/* ── Restaurant header ───────────────────── */}
      <div className="bg-white border border-border rounded-3xl overflow-hidden mb-8 shadow-card">
        {/* Cover banner */}
        <div className="h-52 bg-gradient-to-br from-navy to-navy-light relative flex
                        items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(232,99,42,.15),transparent_60%)]" />
          <span className="text-8xl opacity-70">
            {getEmoji(rest.nombre)}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-5 left-7">
            <h1 className="font-playfair font-bold text-3xl text-white">{rest.nombre}</h1>
            {rest.direccion && (
              <p className="text-white/65 text-sm mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"/>
                </svg>
                {rest.direccion}
              </p>
            )}
          </div>
        </div>

        {/* Info bar */}
        <div className="px-7 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {rest.telefono && (
              <span className="flex items-center gap-1.5 text-sub text-sm">
                <svg className="w-4 h-4 text-orange" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                {rest.telefono}
              </span>
            )}
            {promos.length > 0 && (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-700
                               text-xs font-semibold px-3 py-1 rounded-full border border-green-100">
                🏷️ {promos.length} promo{promos.length > 1 ? 's' : ''} activa{promos.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <button
            onClick={iniciarReserva}
            className="bg-orange hover:bg-orange-dark text-white font-bold px-7 py-3 rounded-xl
                       transition-all duration-200 hover:-translate-y-0.5 shadow-orange
                       flex items-center gap-2 whitespace-nowrap text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5"
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Hacer reservación
          </button>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────── */}
      <div className="flex gap-1 bg-cream-dark rounded-2xl p-1 mb-7 w-fit border border-border">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === key
                ? 'bg-white text-navy shadow-sm'
                : 'text-sub hover:text-navy'
            }`}
          >
            {label}
            {key === 'promos' && promos.length > 0 && (
              <span className="ml-1.5 bg-orange text-white text-[10px] font-bold
                               px-1.5 py-0.5 rounded-full">
                {promos.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-24 gap-3 text-sub">
          <div className="spinner" />
          <span className="text-sm">Cargando…</span>
        </div>
      ) : tab === 'menu' ? (
        <MenuTab
          cats={cats}
          productos={productosFiltrados}
          catActiva={catActiva}
          setCatActiva={setCatActiva}
          promoIds={promoIds}
        />
      ) : (
        <PromosTab promos={promos} />
      )}

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={setAuthModal}
          onSuccess={onAuthSuccess}
        />
      )}
      {reservaOpen && (
        <ReservaModal
          restaurante={rest}
          onClose={() => setReservaOpen(false)}
        />
      )}
    </div>
  )
}

/* ── Menu Tab ─────────────────────────────────── */
function MenuTab({ cats, productos, catActiva, setCatActiva, promoIds }) {
  return (
    <>
      {/* Category chips */}
      <div className="flex gap-2 flex-wrap mb-7">
        <button
          onClick={() => setCatActiva(null)}
          className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
            !catActiva
              ? 'bg-navy text-white border-navy shadow-sm'
              : 'bg-white text-sub border-border hover:border-navy hover:text-navy'
          }`}
        >
          Todos
        </button>
        {cats.map(c => (
          <button
            key={c.id_categoria}
            onClick={() => setCatActiva(c.id_categoria)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
              catActiva === c.id_categoria
                ? 'bg-navy text-white border-navy shadow-sm'
                : 'bg-white text-sub border-border hover:border-navy hover:text-navy'
            }`}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-sub font-medium">Sin productos en esta categoría</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {productos.map((prod, i) => (
            <ProductCard key={prod.id_producto} prod={prod} index={i} hasPromo={promoIds.has(prod.id_producto)} />
          ))}
        </div>
      )}
    </>
  )
}

function ProductCard({ prod, index: i, hasPromo }) {
  return (
    <div
      className="group bg-white rounded-2xl border border-border overflow-hidden
                 shadow-card hover:-translate-y-1 hover:shadow-lg transition-all
                 duration-300 anim-fadeup"
      style={{ animationDelay: `${i * 0.035}s` }}
    >
      <div className="h-32 bg-gradient-to-br from-orange-soft to-[#FFE0CC] relative
                      flex items-center justify-center overflow-hidden">
        {hasPromo && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px]
                          font-bold px-2 py-0.5 rounded-full z-10">
            🏷️ Promo
          </div>
        )}
        {prod.imagen ? (
          <img src={prod.imagen} alt={prod.nombre}
               className="w-full h-full object-cover absolute inset-0"
               onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
        ) : null}
        <span className="relative text-4xl group-hover:scale-110 transition-transform duration-300"
              style={{ display: prod.imagen ? 'none' : 'inline' }}>
          {getEmoji(prod.nombre)}
        </span>
      </div>
      <div className="p-3.5">
        <p className="font-bold text-navy text-sm leading-tight">{prod.nombre}</p>
        {prod.descripcion && (
          <p className="text-sub text-xs mt-1 line-clamp-2 leading-relaxed">
            {prod.descripcion}
          </p>
        )}
        {prod.precio && (
          <p className="text-orange font-bold text-sm mt-2">
            ${Number(prod.precio).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  )
}

/* ── Promos Tab ───────────────────────────────── */
function PromosTab({ promos }) {
  if (promos.length === 0) return (
    <div className="text-center py-24">
      <div className="text-6xl mb-4">🏷️</div>
      <p className="text-sub font-medium">Sin promociones activas en este momento</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {promos.map((promo, i) => (
        <div
          key={promo.id_promocion}
          className="relative bg-navy rounded-2xl p-6 overflow-hidden anim-fadeup"
          style={{ animationDelay: `${i * 0.07}s` }}
        >
          {/* bg decoration */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -right-2 -bottom-6 w-28 h-28 rounded-full bg-orange/10" />

          <div className="relative">
            <div className="font-playfair font-extrabold text-6xl text-orange leading-none mb-2">
              {Math.round(promo.porcentaje_descuento)}%
            </div>
            <p className="font-bold text-white text-lg leading-tight mb-1">{promo.nombre}</p>
            {promo.descripcion && (
              <p className="text-white/55 text-sm mb-3">{promo.descripcion}</p>
            )}
            <p className="text-white/35 text-xs mb-3">
              📅 {fmtFecha(promo.fecha_inicio)} — {fmtFecha(promo.fecha_fin)}
            </p>
            <span className="inline-block bg-white/10 text-white/70 text-xs
                             font-medium px-3 py-1 rounded-full">
              {{ todos: 'Todo el menú', categorias: 'Por categoría', productos: 'Productos seleccionados' }
                [promo.tipo_aplicacion] || promo.tipo_aplicacion}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
