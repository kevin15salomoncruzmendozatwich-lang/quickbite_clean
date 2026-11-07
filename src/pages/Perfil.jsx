import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

export default function Perfil() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre:    user?.nombre   || '',
    telefono:  '',
  })

  useEffect(() => {
    if (!user) return
    supabase.from('cliente').select('telefono, nombre')
      .eq('id_cliente', user.id_cliente).maybeSingle()
      .then(({ data }) => {
        if (data) setForm({ nombre: data.nombre || '', telefono: data.telefono || '' })
      })
  }, [])
  const [pass, setPass] = useState({ actual: '', nueva: '', confirmar: '' })
  const [loadingInfo, setLoadingInfo]   = useState(false)
  const [loadingPass, setLoadingPass]   = useState(false)
  const [successInfo, setSuccessInfo]   = useState(false)
  const [successPass, setSuccessPass]   = useState(false)
  const [errorInfo, setErrorInfo]       = useState('')
  const [errorPass, setErrorPass]       = useState('')

  const set  = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setP = (k, v) => setPass(f => ({ ...f, [k]: v }))

  async function guardarInfo(e) {
    e.preventDefault(); setErrorInfo(''); setLoadingInfo(true)
    try {
      const { error } = await supabase.from('cliente')
        .update({ nombre: form.nombre.trim(), telefono: form.telefono.trim() || null })
        .eq('id_cliente', user.id_cliente)
      if (error) throw error
      login({ ...user, nombre: form.nombre.trim() })
      setSuccessInfo(true)
      setTimeout(() => setSuccessInfo(false), 3000)
    } catch (e) { setErrorInfo('Error: ' + e.message) }
    finally { setLoadingInfo(false) }
  }

  async function cambiarPass(e) {
    e.preventDefault(); setErrorPass('')
    if (pass.nueva.length < 6) { setErrorPass('Mínimo 6 caracteres'); return }
    if (pass.nueva !== pass.confirmar) { setErrorPass('Las contraseñas no coinciden'); return }
    setLoadingPass(true)
    try {
      // Verificar contraseña actual
      const { data } = await supabase.from('cliente')
        .select('id_cliente').eq('id_cliente', user.id_cliente).eq('contrasena', pass.actual).maybeSingle()
      if (!data) { setErrorPass('Contraseña actual incorrecta'); setLoadingPass(false); return }

      const { error } = await supabase.from('cliente')
        .update({ contrasena: pass.nueva }).eq('id_cliente', user.id_cliente)
      if (error) throw error
      setPass({ actual: '', nueva: '', confirmar: '' })
      setSuccessPass(true)
      setTimeout(() => setSuccessPass(false), 3000)
    } catch (e) { setErrorPass('Error: ' + e.message) }
    finally { setLoadingPass(false) }
  }

  if (!user) { navigate('/'); return null }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <button onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sub text-sm font-medium
                         hover:text-navy transition-colors mb-8 group">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
             fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        Inicio
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center
                        text-white text-2xl font-bold font-playfair shadow-card">
          {user.nombre?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-playfair font-bold text-2xl text-navy">{user.nombre}</h1>
          <p className="text-sub text-sm">{user.email}</p>
        </div>
      </div>

      {/* Info personal */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-card mb-5">
        <h2 className="font-bold text-navy text-base mb-5 flex items-center gap-2">
          <span className="text-lg">👤</span> Información personal
        </h2>
        <form onSubmit={guardarInfo} className="space-y-4">
          <Field label="Nombre completo" required>
            <input value={form.nombre}
                   onChange={e => set('nombre', e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, ''))}
                   placeholder="Tu nombre completo" required />
          </Field>
          <Field label="Correo electrónico">
            <input value={user.email} disabled
                   className="w-full px-4 py-3 border-2 border-border rounded-xl text-sm
                              text-sub bg-cream/50 cursor-not-allowed" />
          </Field>
          <Field label="Teléfono (opcional)">
            <input type="tel" value={form.telefono}
                   onChange={e => set('telefono', e.target.value.replace(/[^0-9+\s-]/g, ''))}
                   placeholder="+52 000 000 0000" />
          </Field>
          {errorInfo && <ErrBox msg={errorInfo} />}
          {successInfo && <OkBox msg="¡Información actualizada!" />}
          <button type="submit" disabled={loadingInfo}
                  className="bg-navy hover:bg-orange text-white font-bold px-6 py-2.5
                             rounded-xl transition-all duration-200 disabled:opacity-60 text-sm">
            {loadingInfo ? <Spinner /> : 'Guardar cambios'}
          </button>
        </form>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-card mb-5">
        <h2 className="font-bold text-navy text-base mb-5 flex items-center gap-2">
          <span className="text-lg">🔒</span> Cambiar contraseña
        </h2>
        <form onSubmit={cambiarPass} className="space-y-4">
          <Field label="Contraseña actual" required>
            <input type="password" value={pass.actual}
                   onChange={e => setP('actual', e.target.value)}
                   placeholder="••••••••" required />
          </Field>
          <Field label="Nueva contraseña" required>
            <input type="password" value={pass.nueva}
                   onChange={e => setP('nueva', e.target.value)}
                   placeholder="Mínimo 6 caracteres" required />
          </Field>
          <Field label="Confirmar nueva contraseña" required>
            <input type="password" value={pass.confirmar}
                   onChange={e => setP('confirmar', e.target.value)}
                   placeholder="Repite la contraseña" required />
          </Field>
          {errorPass && <ErrBox msg={errorPass} />}
          {successPass && <OkBox msg="¡Contraseña actualizada!" />}
          <button type="submit" disabled={loadingPass}
                  className="bg-navy hover:bg-orange text-white font-bold px-6 py-2.5
                             rounded-xl transition-all duration-200 disabled:opacity-60 text-sm">
            {loadingPass ? <Spinner /> : 'Cambiar contraseña'}
          </button>
        </form>
      </div>

      {/* Cerrar sesión */}
      <button onClick={() => { logout(); navigate('/') }}
              className="w-full border-2 border-red-200 text-red-500 hover:bg-red-50
                         font-semibold py-3 rounded-xl transition-all duration-200 text-sm">
        🚪 Cerrar sesión
      </button>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-orange ml-0.5">*</span>}
      </label>
      {children.type === 'input' ? React.cloneElement(children, {
        className: `w-full px-4 py-3 border-2 border-border rounded-xl text-sm text-navy
                    outline-none focus:border-orange transition-colors bg-cream`
      }) : children}
    </div>
  )
}
function ErrBox({ msg }) {
  return <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm">⚠️ {msg}</div>
}
function OkBox({ msg }) {
  return <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-green-600 text-sm font-medium">✅ {msg}</div>
}
function Spinner() {
  return <span className="flex items-center justify-center gap-2">
    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
    Guardando…
  </span>
}

import React from 'react'
