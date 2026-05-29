import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

export default function ActivarCuenta() {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const { login }  = useAuth()
  const idCliente  = params.get('id')

  const [cliente, setCliente]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState({ contrasena: '', confirmar: '' })
  const [error, setError]       = useState('')
  const [saving, setSaving]     = useState(false)
  const [success, setSuccess]   = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    if (!idCliente) { setLoading(false); return }
    supabase.from('cliente').select('id_cliente, nombre, email, contrasena')
      .eq('id_cliente', idCliente).maybeSingle()
      .then(({ data }) => { setCliente(data); setLoading(false) })
  }, [idCliente])

  async function activar(e) {
    e.preventDefault()
    setError('')
    if (form.contrasena.length < 6) { setError('Mínimo 6 caracteres'); return }
    if (form.contrasena !== form.confirmar) { setError('Las contraseñas no coinciden'); return }
    if (cliente?.contrasena) { setError('Esta cuenta ya fue activada'); return }

    setSaving(true)
    try {
      const { data, error: err } = await supabase.from('cliente')
        .update({ contrasena: form.contrasena })
        .eq('id_cliente', idCliente)
        .select('id_cliente, nombre, email').single()
      if (err) throw err
      login(data)
      setSuccess(true)
      setTimeout(() => navigate('/'), 3000)
    } catch (e) {
      setError('Error al activar: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-sub">
      <div className="spinner" /><span className="text-sm">Verificando enlace…</span>
    </div>
  )

  if (!idCliente || !cliente) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="text-6xl mb-4">🔗</div>
      <h2 className="font-playfair font-bold text-2xl text-navy mb-2">Enlace inválido</h2>
      <p className="text-sub text-sm mb-6">Este enlace no es válido o ya expiró.</p>
      <button onClick={() => navigate('/')}
              className="bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange transition-colors">
        Ir al inicio
      </button>
    </div>
  )

  if (cliente.contrasena && !success) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="text-6xl mb-4">✅</div>
      <h2 className="font-playfair font-bold text-2xl text-navy mb-2">Cuenta ya activa</h2>
      <p className="text-sub text-sm mb-6">Esta cuenta ya fue activada. Puedes iniciar sesión.</p>
      <button onClick={() => navigate('/')}
              className="bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange transition-colors">
        Ir al inicio
      </button>
    </div>
  )

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-6 py-16">
      <div className="w-full max-w-md">

        {success ? (
          <div className="text-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 text-5xl">🎉</div>
            <h2 className="font-playfair font-bold text-2xl text-navy mb-2">¡Cuenta activada!</h2>
            <p className="text-sub text-sm mb-1">Bienvenido, <strong>{cliente.nombre}</strong></p>
            <p className="text-sub text-xs">Redirigiendo al inicio…</p>
          </div>
        ) : (
          <>
            {/* Header card */}
            <div className="bg-navy rounded-3xl p-8 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(232,99,42,.15),transparent_55%)]" />
              <div className="relative">
                <div className="w-12 h-12 bg-orange/20 rounded-2xl flex items-center justify-center mb-4 text-2xl">🔐</div>
                <h1 className="font-playfair font-bold text-2xl text-white mb-1">Activa tu cuenta</h1>
                <p className="text-white/50 text-sm">
                  Hola <strong className="text-white/80">{cliente.nombre}</strong>, elige una contraseña para tu cuenta QuickBite.
                </p>
              </div>
            </div>

            <form onSubmit={activar} className="bg-white rounded-3xl border border-border p-8 space-y-5 shadow-card">
              {cliente.email && (
                <div className="flex items-center gap-3 bg-cream border border-border rounded-xl px-4 py-3">
                  <span className="text-orange">📧</span>
                  <span className="text-navy text-sm font-medium">{cliente.email}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-1.5">
                  Nueva contraseña <span className="text-orange">*</span>
                </label>
                <input type="password" value={form.contrasena}
                       onChange={e => set('contrasena', e.target.value)}
                       placeholder="Mínimo 6 caracteres" required autoFocus
                       className="w-full px-4 py-3 border-2 border-border rounded-xl text-sm text-navy
                                  outline-none focus:border-orange transition-colors bg-cream" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-1.5">
                  Confirmar contraseña <span className="text-orange">*</span>
                </label>
                <input type="password" value={form.confirmar}
                       onChange={e => set('confirmar', e.target.value)}
                       placeholder="Repite tu contraseña" required
                       className="w-full px-4 py-3 border-2 border-border rounded-xl text-sm text-navy
                                  outline-none focus:border-orange transition-colors bg-cream" />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <button type="submit" disabled={saving}
                      className="w-full bg-orange hover:bg-orange-dark text-white font-bold py-3.5
                                 rounded-xl transition-all duration-200 disabled:opacity-60 shadow-orange">
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Activando…
                  </span>
                ) : 'Activar cuenta →'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
