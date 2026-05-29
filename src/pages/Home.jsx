import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const COVER_GRADIENTS = [
  'from-[#1A2A4A] to-[#2d4a7a]',
  'from-[#3D1F00] to-[#7A3F00]',
  'from-[#0D2B2B] to-[#1A5050]',
  'from-[#2B0D3D] to-[#5A1A7A]',
  'from-[#2B1A0D] to-[#7A4A1A]',
  'from-[#0D1F2B] to-[#1A4A6A]',
]
const EMOJIS = ['🍔','🍕','🌮','🍣','🍜','🥩','🍗','🥗','🍰','🥘']
const TAGS   = ['Menú completo','Reservaciones','Promociones del día','Atención al instante']

function RestaurantSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-10 w-full mt-4" />
      </div>
    </div>
  )
}

export default function Home() {
  const [restaurantes, setRestaurantes] = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('restaurante')
      .select('id_restaurante, nombre, direccion, telefono')
      .eq('estado', true)
      .order('nombre')
      .then(({ data, error }) => { if (error) console.error('QB:', error); setRestaurantes(data || []); setLoading(false) })
  }, [])

  const filtered = restaurantes.filter(r =>
    r.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (r.direccion || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy pt-20 pb-24 px-6">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full
                        bg-orange/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full
                        bg-navy-light/40 blur-[100px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm
                          border border-white/15 px-4 py-1.5 rounded-full text-sm
                          text-white/70 font-medium mb-6 anim-fadeup"
               style={{ animationDelay: '0s' }}>
            <span className="w-2 h-2 rounded-full bg-orange animate-[pulse-dot_1.5s_ease-in-out_infinite]" />
            Reservas en tiempo real
          </div>

          <h1 className="font-playfair font-extrabold text-5xl md:text-6xl text-white leading-[1.1]
                         mb-5 anim-fadeup" style={{ animationDelay: '.08s' }}>
            Descubre los mejores<br />
            <span className="text-orange">restaurantes</span> cerca de ti
          </h1>

          <p className="text-white/55 text-lg leading-relaxed mb-10 anim-fadeup"
             style={{ animationDelay: '.14s' }}>
            Consulta el menú, aprovecha promociones y reserva tu mesa en segundos.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto anim-fadeup" style={{ animationDelay: '.2s' }}>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor"
                   strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
              </svg>
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar restaurante o dirección…"
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20
                         text-white placeholder-white/40 pl-12 pr-4 py-4 rounded-2xl
                         text-sm font-medium outline-none focus:bg-white/15
                         focus:border-orange/60 transition-all"
            />
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8 anim-fadeup"
               style={{ animationDelay: '.26s' }}>
            {TAGS.map(tag => (
              <span key={tag}
                    className="bg-white/8 border border-white/12 text-white/60
                               text-xs px-3 py-1.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Restaurant grid ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="font-playfair font-bold text-2xl text-navy">
              {search ? `Resultados para "${search}"` : 'Restaurantes disponibles'}
            </h2>
            {!loading && (
              <p className="text-sub text-sm mt-1">
                {filtered.length} {filtered.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <RestaurantSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏚️</div>
            <p className="text-sub font-medium">
              {search ? 'No encontramos resultados para tu búsqueda' : 'Sin restaurantes disponibles por ahora'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r, i) => (
              <RestaurantCard
                key={r.id_restaurante}
                restaurante={r}
                index={i}
                onClick={() => navigate(`/restaurante/${r.id_restaurante}`)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

function RestaurantCard({ restaurante: r, index: i, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl border border-border overflow-hidden
                 cursor-pointer shadow-card hover:-translate-y-1.5 hover:shadow-xl
                 transition-all duration-300 anim-fadeup"
      style={{ animationDelay: `${i * 0.06}s` }}
    >
      {/* Cover image / gradient */}
      <div className={`h-48 bg-gradient-to-br ${COVER_GRADIENTS[i % COVER_GRADIENTS.length]}
                       relative flex items-center justify-center overflow-hidden`}>
        <span className="text-7xl opacity-80 group-hover:scale-110 transition-transform duration-500">
          {EMOJIS[i % EMOJIS.length]}
        </span>
        {/* Overlay shine */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Status badge */}
        <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px]
                        font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          Abierto
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-playfair font-bold text-lg text-navy mb-1 leading-tight">
          {r.nombre}
        </h3>

        {r.direccion && (
          <p className="text-sub text-sm flex items-start gap-1.5 mb-1">
            <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-orange" fill="currentColor"
                 viewBox="0 0 20 20">
              <path fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"/>
            </svg>
            {r.direccion}
          </p>
        )}

        {r.telefono && (
          <p className="text-sub text-sm flex items-center gap-1.5 mb-4">
            <svg className="w-3.5 h-3.5 shrink-0 text-orange" fill="currentColor"
                 viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            {r.telefono}
          </p>
        )}

        {!r.telefono && <div className="mb-4" />}

        <button
          className="w-full bg-navy text-white text-sm font-semibold py-3 rounded-xl
                     group-hover:bg-orange transition-colors duration-200 flex items-center
                     justify-center gap-2"
          onClick={e => { e.stopPropagation(); onClick() }}
        >
          Ver menú y reservar
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
               fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}