import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* Iconos SVG inline (estilo Lucide) — sin dependencias */
const Icon = ({ children }) => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)
const TabletIcon = () => (
  <Icon><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M12 18h.01" /></Icon>
)
const MonitorIcon = () => (
  <Icon><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></Icon>
)
const GlobeIcon = () => (
  <Icon><circle cx="12" cy="12" r="10" /><path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Icon>
)

const APPS = [
  {
    Icon: MonitorIcon,
    title: 'App de escritorio',
    img: 'https://i.imgur.com/DCsKpRs.png', // ← pon aquí tu link
    desc: 'El centro de tu restaurante: comandas en tiempo real, ticket PDF, reservaciones, menú, promociones, zonas y fotos, todo desde un solo lugar.',
    // Bento: tarjeta principal, grande a la izquierda
    span: 'md:col-span-2 md:row-span-2',
    mediaH: 'h-56 md:h-full md:min-h-[260px]',
    big: true,
  },
  {
    Icon: TabletIcon,
    title: 'App Android para tablet',
    img: 'https://i.imgur.com/F6ZxWHI.jpeg', // ← pon aquí tu link
    desc: 'Tus clientes piden desde la mesa: menú con fotos, promociones, notas por platillo y seguimiento del pedido en vivo.',
    span: '',
    mediaH: 'h-36',
  },
  {
    Icon: GlobeIcon,
    title: 'Portal web',
    img: 'https://i.imgur.com/ku5HOBx.png', // ← pon aquí tu link
    desc: 'Esta misma página muestra a los restaurantes afiliados: los comensales los descubren, leen reseñas y reservan con confirmación por correo.',
    span: '',
    mediaH: 'h-36',
    to: '/restaurantes',
  },
]

/* Detecta cuando la sección entra en pantalla (una sola vez) */
function useInView() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect() }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, visible]
}

export default function AppsBento() {
  const [ref, visible] = useInView()

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      {/* Encabezado */}
      <div className={`text-center max-w-2xl mx-auto mb-14 transition-all duration-700 ease-out motion-reduce:transition-none
                       ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h2 className="font-playfair font-bold text-3xl md:text-4xl text-navy">
          Una plataforma, tres aplicaciones
        </h2>
        <p className="text-sub mt-3">
          Todo comparte la misma información en tiempo real: lo que cambias en caja se ve al instante en la mesa y en la web.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
        {APPS.map(({ Icon: Ico, title, desc, img, span, mediaH, big, to }, i) => (
          // Wrapper: animación de entrada escalonada (stagger)
          <div key={title}
               style={{ transitionDelay: visible ? `${i * 150}ms` : '0ms' }}
               className={`${span} transition-all duration-700 ease-out motion-reduce:transition-none
                           ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            {/* Tarjeta: micro-interacción hover */}
            <article className="group h-full flex flex-col bg-white rounded-3xl overflow-hidden
                                border border-border/60 shadow-sm border-t-2 border-t-orange
                                transition-all duration-300 ease-out
                                hover:-translate-y-2 hover:shadow-xl hover:border-orange/40
                                motion-reduce:hover:translate-y-0">

              {/* ▼ Espacio para imagen/mockup: reemplaza este div por <img src="..." className="w-full h-full object-cover" /> */}
              <div className={`relative ${mediaH} m-3 mb-0 rounded-2xl overflow-hidden
                               bg-gradient-to-br from-cream to-orange-soft
                               border border-border/50 flex items-center justify-center`}>
                {img ? (
                  <img src={img} alt={title} loading="lazy"
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
                ) : (
                  <div className="relative text-orange transition-transform duration-300 ease-out group-hover:scale-110">
                    <Ico />
                  </div>
                )}
              </div>

              <div className={`flex flex-col flex-1 ${big ? 'p-8' : 'p-6'}`}>
                <h3 className={`font-playfair font-bold text-navy mb-2 ${big ? 'text-2xl' : 'text-xl'}`}>
                  {title}
                </h3>
                <p className="text-sub text-sm leading-relaxed">{desc}</p>
                {to && (
                  <Link to={to} className="mt-auto pt-5 text-orange text-sm font-semibold inline-flex items-center gap-1">
                    Ver restaurantes
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </Link>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
