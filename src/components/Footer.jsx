import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-navy mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="QuickBite" className="h-10 w-auto rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105" />
            <span className="font-playfair font-bold text-xl text-white">
              Quick<span className="text-orange">Bite</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[
              ['Política de privacidad', '/privacidad'],
              ['Términos de uso', '/terminos'],
            ].map(([label, to]) => (
              <Link key={to} to={to}
                    className="text-white/70 hover:text-orange text-sm transition-colors font-medium">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center
                        justify-between gap-3 text-white/30 text-xs">
          <p>Copyright © {year} QuickBite. Todos los derechos reservados.</p>
          <p>Hecho con ❤️ en Veracruz, México</p>
        </div>
      </div>
    </footer>
  )
}
