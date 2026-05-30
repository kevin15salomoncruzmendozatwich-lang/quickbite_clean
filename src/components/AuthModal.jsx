import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

export default function AuthModal({ mode, onClose, onSwitch, onSuccess }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', contrasena: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function doLogin(e) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { data, error: err } = await supabase.from('cliente')
        .select('id_cliente, nombre, email')
        .eq('email', form.email.trim()).eq('contrasena', form.contrasena)
        .maybeSingle()
      if (err) throw err
      if (!data) { setError('Correo o contraseña incorrectos'); return }
      login(data); onClose(); onSuccess?.()
    } catch { setError('Error de conexión') }
    finally { setLoading(false) }
  }

  async function doRegister(e) {
    e.preventDefault(); setError(''); setLoading(true)
    if (form.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false); return
    }
    try {
      const { data: existe } = await supabase.from('cliente')
        .select('id_cliente').eq('email', form.email.trim()).maybeSingle()
      if (existe) { setError('Este correo ya está registrado'); setLoading(false); return }

      const body = { nombre: form.nombre.trim(), email: form.email.trim(), contrasena: form.contrasena }
      if (form.telefono) body.telefono = form.telefono.trim()

      const { data, error: err } = await supabase.from('cliente')
        .insert(body).select('id_cliente, nombre, email').single()
      if (err) throw err
      login(data); onClose(); onSuccess?.()
    } catch (e) { setError('Error al registrar: ' + e.message) }
    finally { setLoading(false) }
  }

  const isLogin = mode === 'login'

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50
                    flex items-center justify-center p-4"
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-modal anim-modalin overflow-hidden">

        {/* Header */}
        <div className="bg-navy px-8 pt-8 pb-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(232,99,42,.15),transparent_60%)]" />
          <button onClick={onClose}
                  className="absolute top-5 right-5 text-white/40 hover:text-white
                             transition-colors w-8 h-8 flex items-center justify-center
                             rounded-full hover:bg-white/10">
            ✕
          </button>
          <div className="relative">
            <div className="w-10 h-10 bg-orange/20 rounded-2xl flex items-center
                            justify-center mb-4">
              <span className="text-xl">{isLogin ? '👋' : '✨'}</span>
            </div>
            <h2 className="font-playfair font-bold text-2xl text-white">
              {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
            </h2>
            <p className="text-white/50 text-sm mt-1">
              {isLogin ? 'Inicia sesión para hacer tu reservación' : 'Regístrate para hacer reservaciones'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-7">
          <form onSubmit={isLogin ? doLogin : doRegister} className="space-y-4">
            {!isLogin && (
              <Field label="Nombre completo" required>
                <input value={form.nombre} onChange={e => set('nombre', e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, ''))}
                       placeholder="Tu nombre completo" required />
              </Field>
            )}
            <Field label="Correo electrónico" required>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                     placeholder="tu@email.com" required />
            </Field>
            {!isLogin && (
              <Field label="Teléfono (opcional)">
                <input type="tel" value={form.telefono} onChange={e => set('telefono', e.target.value.replace(/[^0-9+\s-]/g, ''))}
                       placeholder="+52 000 000 0000" />
              </Field>
            )}
            <Field label="Contraseña" required>
              <input type="password" value={form.contrasena} onChange={e => set('contrasena', e.target.value)}
                     placeholder="••••••••" required />
            </Field>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3
                              text-red-600 text-sm flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
                    className="w-full bg-orange hover:bg-orange-dark text-white font-bold
                               py-3.5 rounded-xl transition-all duration-200 disabled:opacity-60
                               hover:-translate-y-0.5 shadow-orange mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white
                                   rounded-full animate-spin" />
                  Cargando…
                </span>
              ) : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-center text-sm text-sub mt-5">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button onClick={() => onSwitch(isLogin ? 'register' : 'login')}
                    className="text-orange font-semibold hover:underline">
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy/70 uppercase
                        tracking-wider mb-1.5">
        {label}{required && <span className="text-orange ml-0.5">*</span>}
      </label>
      {React.cloneElement(children, {
        className: `w-full px-4 py-3 border-2 border-border rounded-xl text-sm
                    text-navy outline-none focus:border-orange transition-colors bg-cream`
      })}
    </div>
  )
}
