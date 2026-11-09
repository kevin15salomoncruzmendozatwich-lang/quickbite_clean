import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppsBento from '../components/AppsBento'

const PASOS = [
  ['1', 'Registra tu restaurante', 'Carga menú, categorías, zonas y fotos desde la app de escritorio.'],
  ['2', 'Coloca las tablets', 'Cada mesa tiene su tablet en modo kiosco para pedir sin esperar.'],
  ['3', 'Recibe y gestiona', 'Los pedidos llegan a cocina al instante y las reservaciones a tu panel.'],
  ['4', 'Atrae más clientes', 'Tu restaurante aparece en el portal web con reseñas y reservaciones.'],
]

const CASOS = [
  ['🍔', 'Restaurantes y fondas', 'Pedidos desde la mesa sin saturar a los meseros, menos errores en comanda.'],
  ['☕', 'Cafeterías', 'Menú que cambia seguido y promociones por día actualizadas al momento.'],
  ['🍣', 'Restaurantes con reservación', 'Control de mesas por zona y confirmaciones automáticas por correo.'],
  ['🎉', 'Eventos y fines de semana', 'Gestiona alta demanda con comandas ordenadas y notas como "sin cebolla".'],
]

export default function Landing() {
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 50)
    else window.scrollTo(0, 0)
  }, [hash])

  return (
    <div>
      {/* Hero */}
      <section id="producto" className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(232,99,42,.22),transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-white/10 text-orange text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              Software para restaurantes
            </span>
            <h1 className="font-playfair font-bold text-4xl md:text-6xl text-white leading-tight">
              Pedidos, cocina y reservaciones en <span className="text-orange">un solo sistema</span>
            </h1>
            <p className="text-white/70 text-lg mt-5 max-w-xl">
              QuickBite conecta la tablet de tus mesas, la caja y un portal web para que atiendas más rápido y llenes tu restaurante.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/restaurantes" className="bg-orange hover:bg-orange-dark text-white font-bold px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5">
                Ver restaurantes que lo usan →
              </Link>
              <Link to="/prueba" className="border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors">
                Probar gratis 1 hora
              </Link>
            </div>
          </div>

          {/* Mockup */}
          <div className="relative flex justify-center">
            <div className="bg-white rounded-3xl p-3 shadow-2xl w-full max-w-md rotate-2">
              <div className="bg-cream rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-playfair font-bold text-navy">Mesa 5</span>
                  <span className="bg-orange text-white text-xs font-bold px-3 py-1 rounded-full">En cocina</span>
                </div>
                {[['🍔 Hamburguesa clásica', '$120', 'sin cebolla'], ['🍟 Papas gajo', '$55', ''], ['🥤 Limonada', '$35', '']].map(([n, p, nota]) => (
                  <div key={n} className="flex justify-between items-start py-2.5 border-b border-border last:border-0">
                    <div>
                      <p className="text-navy text-sm font-semibold">{n}</p>
                      {nota && <p className="text-sub text-xs">"{nota}"</p>}
                    </div>
                    <span className="text-orange font-bold text-sm">{p}</span>
                  </div>
                ))}
                <div className="flex justify-between mt-4 pt-3 border-t-2 border-border">
                  <span className="font-bold text-navy">Total</span>
                  <span className="font-bold text-navy">$210 MXN</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-2 bg-white rounded-2xl shadow-xl px-4 py-3 -rotate-3 hidden sm:block">
              <p className="text-xs text-sub">Reservación nueva</p>
              <p className="text-navy font-bold text-sm">📅 Sáb 8:00 pm · 4 personas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué es */}
      <AppsBento />

      {/* Cómo funciona */}
      <section id="como-funciona" className="bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <h2 className="font-playfair font-bold text-3xl md:text-4xl text-navy text-center mb-12">Cómo funciona</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PASOS.map(([n, t, d]) => (
              <div key={n}>
                <div className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center font-playfair font-bold text-xl mb-4">{n}</div>
                <h3 className="font-bold text-navy mb-1.5">{t}</h3>
                <p className="text-sub text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Casos de uso */}
      <section id="casos" className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-playfair font-bold text-3xl md:text-4xl text-navy">Casos de uso</h2>
          <p className="text-sub mt-3">QuickBite se adapta a distintos tipos de negocio.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {CASOS.map(([i, t, d]) => (
            <div key={t} className="flex gap-5 bg-white border border-border rounded-3xl p-6">
              <div className="text-4xl">{i}</div>
              <div>
                <h3 className="font-bold text-navy mb-1">{t}</h3>
                <p className="text-sub text-sm leading-relaxed">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-navy rounded-3xl px-8 py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(232,99,42,.2),transparent_60%)]" />
          <div className="relative">
            <h2 className="font-playfair font-bold text-3xl md:text-4xl text-white mb-3">Míralo funcionando</h2>
            <p className="text-white/60 mb-7">Explora los restaurantes que ya usan QuickBite y haz una reservación.</p>
            <Link to="/restaurantes" className="inline-block bg-orange hover:bg-orange-dark text-white font-bold px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5">
              Ver restaurantes →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
