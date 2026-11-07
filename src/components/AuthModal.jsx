import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

const EDGE_FN_URL = 'https://qtunqfselgbxypfimzwe.supabase.co/functions/v1/send-verification'
const ANON_KEY    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dW5xZnNlbGdieHlwZmltendlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTEyODcsImV4cCI6MjA5MDgyNzI4N30.7B7nfAeTM50xRCe0vqB6SGo-YolikHQNcqVq0vpMPck'

function codigoRandom() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

async function enviarCodigo(email, codigo, nombre) {
  try {
    await fetch(EDGE_FN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ email, codigo, nombre }),
    })
  } catch (e) {
    console.warn('Email error:', e)
  }
}

export default function AuthModal({ mode, onClose, onSwitch, onSuccess }) {
  const { login } = useAuth()
  const [form, setForm]         = useState({ nombre: '', email: '', telefono: '', contrasena: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [paso, setPaso]         = useState('form') // 'form' | 'verificar'
  const [codigo, setCodigo]     = useState('')
  const [inputCodigo, setInputCodigo] = useState('')
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

      // Generar y guardar código
      const c = codigoRandom()
      setCodigo(c)

      // Guardar en Supabase
      await supabase.from('verificacion_email').insert({
        email:  form.email.trim(),
        codigo: c,
      })

      // Enviar email
      await enviarCodigo(form.email.trim(), c, form.nombre.trim())

      setPaso('verificar')
    } catch (e) { setError('Error: ' + e.message) }
    finally { setLoading(false) }
  }

  async function verificar(e) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      // Verificar código en Supabase (máx 10 min)
      const { data } = await supabase.from('verificacion_email')
        .select('*')
        .eq('email', form.email.trim())
        .eq('codigo', inputCodigo.trim())
        .gte('created_at', new Date(Date.now() - 10 * 60 * 1000).toISOString())
        .maybeSingle()

      if (!data) { setError('Código incorrecto o expirado'); setLoading(false); return }

      // Crear cuenta
      const body = { nombre: form.nombre.trim(), email: form.email.trim(), contrasena: form.contrasena }
      if (form.telefono) body.telefono = form.telefono.trim()

      const { data: cliente, error: err } = await supabase.from('cliente')
        .insert(body).select('id_cliente, nombre, email').single()
      if (err) throw err

      // Limpiar código usado
      await supabase.from('verificacion_email').delete().eq('email', form.email.trim())

      login(cliente); onClose(); onSuccess?.()
    } catch (e) { setError('Error: ' + e.message) }
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
                             w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
          <div className="relative">
            <div className="w-10 h-10 bg-orange/20 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-xl">
                {paso === 'verificar' ? '📧' : isLogin ? '👋' : '✨'}
              </span>
            </div>
            <h2 className="font-playfair font-bold text-2xl text-white">
              {paso === 'verificar' ? 'Verifica tu correo' : isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
            </h2>
            <p className="text-white/50 text-sm mt-1">
              {paso === 'verificar'
                ? `Enviamos un código a ${form.email}`
                : isLogin ? 'Inicia sesión para hacer tu reservación' : 'Regístrate para hacer reservaciones'}
            </p>
          </div>
        </div>

        <div className="px-8 py-7">
          {paso === 'verificar' ? (
            <form onSubmit={verificar} className="space-y-4">
              <div className="text-center py-2">
                <p className="text-sub text-sm mb-4">Ingresa el código de 6 dígitos que te enviamos</p>
                <input
                  value={inputCodigo}
                  onChange={e => setInputCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  autoFocus
                  className="w-full text-center text-3xl font-bold tracking-widest px-4 py-4
                             border-2 border-border rounded-xl outline-none focus:border-orange
                             transition-colors bg-cream text-navy"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3
                                text-red-600 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}
              <button type="submit" disabled={loading || inputCodigo.length < 6}
                      className="w-full bg-orange hover:bg-orange-dark text-white font-bold
                                 py-3.5 rounded-xl transition-all duration-200 disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Verificando…
                  </span>
                ) : 'Verificar y crear cuenta'}
              </button>
              <button type="button" onClick={() => { setPaso('form'); setError('') }}
                      className="w-full text-sub text-sm hover:text-navy transition-colors">
                ← Volver
              </button>
            </form>
          ) : (
            <form onSubmit={isLogin ? doLogin : doRegister} className="space-y-4">
              {!isLogin && (
                <Field label="Nombre completo" required>
                  <input value={form.nombre}
                         onChange={e => set('nombre', e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, ''))}
                         placeholder="Tu nombre completo" required />
                </Field>
              )}
              <Field label="Correo electrónico" required>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                       placeholder="tu@email.com" required />
              </Field>
              {!isLogin && (
                <Field label="Teléfono (opcional)">
                  <input type="tel" value={form.telefono}
                         onChange={e => set('telefono', e.target.value.replace(/[^0-9+\s-]/g, ''))}
                         placeholder="+52 000 000 0000" />
                </Field>
              )}
              <Field label="Contraseña" required>
                <input type="password" value={form.contrasena}
                       onChange={e => set('contrasena', e.target.value)}
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
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {isLogin ? 'Cargando…' : 'Enviando código…'}
                  </span>
                ) : isLogin ? 'Iniciar sesión' : 'Continuar →'}
              </button>
            </form>
          )}

          {paso !== 'verificar' && (
            <p className="text-center text-sm text-sub mt-5">
              {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
              <button onClick={() => onSwitch(isLogin ? 'register' : 'login')}
                      className="text-orange font-semibold hover:underline">
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-orange ml-0.5">*</span>}
      </label>
      {React.cloneElement(children, {
        className: `w-full px-4 py-3 border-2 border-border rounded-xl text-sm
                    text-navy outline-none focus:border-orange transition-colors bg-cream`
      })}
    </div>
  )
}
