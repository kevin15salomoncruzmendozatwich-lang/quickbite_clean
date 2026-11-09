import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import AuthModal from '../components/AuthModal'

const ERRORES = {
  ya_usada:      'Esta cuenta ya usó su prueba gratuita. Si quieres seguir con QuickBite, pronto podrás adquirir la licencia.',
  espera:        'Ya te enviamos el código hace un momento. Espera un par de minutos antes de pedirlo de nuevo.',
  no_registrado: 'No pudimos validar tu cuenta. Cierra sesión, vuelve a entrar e inténtalo otra vez.',
  sin_demo:      'La prueba no está disponible por ahora. Inténtalo más tarde.',
  correo:        'No pudimos enviar el correo. Inténtalo de nuevo en unos minutos.',
  server:        'Ocurrió un error. Inténtalo de nuevo.',
}

const PASOS = [
  ['1', 'Pide tu código', 'Te lo enviamos al correo con el que te registraste.'],
  ['2', 'Escríbelo en la app', 'En la app de PC o en la tablet, toca "Prueba gratuita".'],
  ['3', 'Prueba durante 1 hora', 'Usarás un restaurante de demostración con menú ya cargado.'],
]

export default function Prueba() {
  const { user } = useAuth()
  const [modal, setModal]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState('')
  const [error, setError]     = useState('')

  async function pedir() {
    setError(''); setLoading(true)
    try {
      const { data, error: err } = await supabase.functions.invoke('solicitar-prueba_index', {
        body: { id_cliente: user.id_cliente, email: user.email },
      })
      if (err) throw err
      if (data?.ok) setEnviado(data.email)
      else setError(ERRORES[data?.error] || ERRORES.server)
    } catch { setError(ERRORES.server) }
    finally { setLoading(false) }
  }

  return (
    <div>
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(232,99,42,.22),transparent_55%)]" />
        <div className="relative max-w-3xl mx-auto px-6 py-16 text-center">
          <span className="inline-block bg-white/10 text-orange text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            Prueba gratuita
          </span>
          <h1 className="font-playfair font-bold text-4xl md:text-5xl text-white">Prueba QuickBite 1 hora, gratis</h1>
          <p className="text-white/70 mt-4">Usa el sistema completo en un restaurante de demostración y decide si es para ti.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 -mt-8 relative">
        <div className="bg-white border border-border rounded-3xl shadow-lg p-8 text-center">
          {enviado ? (
            <>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h2 className="font-playfair font-bold text-2xl text-navy mb-2">¡Código enviado!</h2>
              <p className="text-sub text-sm">Lo mandamos a <strong className="text-navy">{enviado}</strong>. Si no lo ves, revisa tu carpeta de spam.</p>
            </>
          ) : user ? (
            <>
              <h2 className="font-playfair font-bold text-2xl text-navy mb-2">Hola, {user.nombre}</h2>
              <p className="text-sub text-sm mb-6">Te enviaremos el código a <strong className="text-navy">{user.email}</strong>.</p>
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm mb-5 text-left">{error}</div>
              )}
              <button onClick={pedir} disabled={loading}
                      className="bg-orange hover:bg-orange-dark text-white font-bold px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 disabled:opacity-60">
                {loading ? 'Enviando…' : 'Enviarme mi código'}
              </button>
            </>
          ) : (
            <>
              <h2 className="font-playfair font-bold text-2xl text-navy mb-2">Primero crea tu cuenta</h2>
              <p className="text-sub text-sm mb-6">Necesitas estar registrado para recibir tu código de prueba.</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={() => setModal('register')}
                        className="bg-orange hover:bg-orange-dark text-white font-bold px-7 py-3 rounded-full transition-all hover:-translate-y-0.5">
                  Registrarme
                </button>
                <button onClick={() => setModal('login')}
                        className="border border-border hover:border-navy text-navy font-semibold px-7 py-3 rounded-full transition-colors">
                  Ya tengo cuenta
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-3 gap-8">
          {PASOS.map(([n, t, d]) => (
            <div key={n} className="text-center">
              <div className="w-12 h-12 mx-auto bg-navy text-white rounded-full flex items-center justify-center font-playfair font-bold text-xl mb-4">{n}</div>
              <h3 className="font-bold text-navy mb-1.5">{t}</h3>
              <p className="text-sub text-sm">{d}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sub text-sm mt-12">
          ¿Quieres el software completo? <Link to="/software" className="text-orange font-semibold hover:underline">Conoce más →</Link>
        </p>
      </section>

      {modal && <AuthModal mode={modal} onClose={() => setModal(null)} onSwitch={setModal} />}
    </div>
  )
}
