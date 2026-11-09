import { Link } from 'react-router-dom'

const INCLUYE = [
  'App de escritorio para tu cocina y caja',
  'App Android para las tablets de tus mesas',
  'Tu restaurante visible en el portal web',
  'Reservaciones con confirmación por correo',
  'Licencia sin límite de tiempo',
]

export default function Software() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <span className="inline-block bg-orange-soft text-orange text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Próximamente</span>
        <h1 className="font-playfair font-bold text-4xl text-navy">QuickBite completo</h1>
        <p className="text-sub mt-3">Muy pronto podrás comprar tu licencia directamente aquí, con pago con tarjeta.</p>
      </div>

      <div className="bg-white border border-border border-t-2 border-t-orange rounded-3xl p-8 shadow-sm">
        <h2 className="font-playfair font-bold text-xl text-navy mb-4">Qué incluye</h2>
        <ul className="space-y-3">
          {INCLUYE.map(i => (
            <li key={i} className="flex items-start gap-3 text-sm text-navy">
              <svg className="w-5 h-5 text-orange shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              {i}
            </li>
          ))}
        </ul>
        <Link to="/prueba" className="mt-8 block text-center bg-orange hover:bg-orange-dark text-white font-bold px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5">
          Mientras tanto, prueba gratis 1 hora
        </Link>
      </div>
    </div>
  )
}
