import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

export default function ReservaModal({ restaurante, onClose }) {
  const { user } = useAuth()

  const [zonas, setZonas] = useState([])
  const [form, setForm] = useState({
    nombre:   user?.nombre || '',
    telefono: '',
    email:    user?.email  || '',
    zona:     '',
    personas: 2,
    fecha:    '',
    hora:     '',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.from('zona')
      .select('id_zona, nombre_zona')
      .eq('id_restaurante', restaurante.id_restaurante)
      .then(({ data }) => {
        if (data?.length) {
          setZonas(data)
          setForm(f => ({ ...f, zona: data[0].nombre_zona }))
        }
      })
  }, [])

  const hoy = new Date().toISOString().split('T')[0]
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function confirmar(e) {
    e.preventDefault()
    const err = {}
    if (!form.nombre.trim()) err.nombre = 'Ingresa tu nombre'
    if (!form.fecha)         err.fecha  = 'Selecciona una fecha'
    if (!form.hora)          err.hora   = 'Selecciona una hora'

    const ahora = new Date()
    const selec = new Date(`${form.fecha}T${form.hora}`)
    if (form.fecha < hoy)    err.fecha = 'No puedes elegir una fecha pasada'
    else if (selec <= ahora) err.hora  = 'No puedes elegir una hora pasada'

    setErrors(err)
    if (Object.keys(err).length) return

    setLoading(true)
    try {
      const fechaHora = new Date(`${form.fecha}T${form.hora}:00`).toISOString()

      const { error: errR } = await supabase.from('reservacion').insert({
        id_restaurante:    restaurante.id_restaurante,
        nombre:            form.nombre.trim(),
        telefono:          form.telefono.trim() || null,
        email:             form.email.trim()    || null,
        zona:              form.zona,
        fecha_reservacion: fechaHora,
        numero_personas:   Number(form.personas),
        estado:            'pendiente',
      })
      if (errR) throw errR

      // Email se envía desde la app PC al confirmar

      setSuccess(true)
      setTimeout(onClose, 4500)
    } catch (e) {
      setErrors({ general: e.message || 'Error al guardar la reservación' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-modal anim-modalin overflow-hidden">

        {/* Header */}
        <div className="bg-navy px-8 pt-8 pb-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(232,99,42,.12),transparent_55%)]" />
          <button onClick={onClose}
                  className="absolute top-5 right-5 text-white/40 hover:text-white w-8 h-8
                             flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">✕</button>
          <div className="relative">
            <div className="w-10 h-10 bg-orange/20 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-orange" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h2 className="font-playfair font-bold text-2xl text-white">Nueva Reservación</h2>
            <p className="text-white/50 text-sm mt-0.5">en {restaurante.nombre}</p>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-7 max-h-[70vh] overflow-y-auto">
          {success ? (
            <SuccessView form={form} restaurante={restaurante} />
          ) : (
            <form onSubmit={confirmar} className="space-y-4">

              {/* Nombre */}
              <Field label="Nombre completo" required>
                <input value={form.nombre} onChange={e => set('nombre', e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, ''))}
                       placeholder="¿Cómo te llamamos?" required autoFocus />
              </Field>
              {errors.nombre && <p className="text-red-500 text-xs -mt-2">{errors.nombre}</p>}

              {/* Teléfono */}
              <Field label="Teléfono"required>
                <input type="tel" value={form.telefono} onChange={e => set('telefono', e.target.value.replace(/[^0-9+\s-]/g, ''))}
                       placeholder="+52 000 000 0000" />
              </Field>

              {/* Email */}
              <Field label="Correo"required>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                       placeholder="Para recibir confirmación" />
              </Field>
              {form.email && (
                <p className="text-xs text-sub -mt-2">📧 Te enviaremos confirmación a este correo</p>
              )}

              {/* Zona */}
              <div>
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-1.5">
                  Zona
                </label>
                <div className="flex gap-2 flex-wrap">
                  {zonas.length === 0 && (
                    <p className="text-sub text-xs py-2">Cargando zonas...</p>
                  )}
                  {zonas.map(z => (
                    <button key={z.id_zona} type="button" onClick={() => set('zona', z.nombre_zona)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-bold border-2 transition-all ${
                              form.zona === z.nombre_zona
                                ? 'bg-navy text-white border-navy'
                                : 'bg-white text-sub border-border hover:border-navy hover:text-navy'
                            }`}>
                      {z.nombre_zona}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personas */}
              <div>
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-1.5">
                  Personas
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <button key={n} type="button" onClick={() => set('personas', n)}
                            className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all ${
                              form.personas === n
                                ? 'bg-navy text-white border-navy'
                                : 'bg-white text-sub border-border hover:border-navy hover:text-navy'
                            }`}>
                      {n}{n===8?'+':''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-1.5">
                  Fecha <span className="text-orange">*</span>
                </label>
                <input type="date" min={hoy} value={form.fecha} onChange={e => set('fecha', e.target.value)}
                       className={`w-full px-4 py-3 border-2 rounded-xl text-sm text-navy outline-none transition-colors bg-cream
                                   ${errors.fecha ? 'border-red-400' : 'border-border focus:border-orange'}`} />
                {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
              </div>

              {/* Hora */}
              <div>
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wider mb-1.5">
                  Hora <span className="text-orange">*</span>
                </label>
                <input type="time" value={form.hora} onChange={e => set('hora', e.target.value)}
                       className={`w-full px-4 py-3 border-2 rounded-xl text-sm text-navy outline-none transition-colors bg-cream
                                   ${errors.hora ? 'border-red-400' : 'border-border focus:border-orange'}`} />
                {errors.hora && <p className="text-red-500 text-xs mt-1">{errors.hora}</p>}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-red-600 text-sm flex items-center gap-2">
                  <span>⚠️</span> {errors.general}
                </div>
              )}

              <button type="submit" disabled={loading}
                      className="w-full bg-orange hover:bg-orange-dark text-white font-bold py-3.5
                                 rounded-xl transition-all duration-200 disabled:opacity-60 shadow-orange">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Guardando…
                  </span>
                ) : 'Confirmar reservación ✓'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function SuccessView({ form, restaurante }) {
  return (
    <div className="text-center py-2">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✅</div>
      <p className="font-playfair font-bold text-xl text-navy mb-1">¡Reservación confirmada!</p>
      <p className="text-sub text-sm mb-4">
        Te esperamos el <strong>{form.fecha}</strong> a las <strong>{form.hora}</strong>
      </p>
      <div className="bg-cream border border-border rounded-2xl px-5 py-4 text-left space-y-2 mb-3">
        {[
          ['🏠', restaurante.nombre],
          ['👤', form.nombre],
          ['📍', form.zona],
          ['👥', `${form.personas} persona${form.personas > 1 ? 's' : ''}`],
          ['📅', `${form.fecha} · ${form.hora}`],
        ].map(([icon, label]) => (
          <div key={label} className="flex items-center gap-2 text-sm text-navy">
            <span>{icon}</span><span>{label}</span>
          </div>
        ))}
      </div>
      {form.email && (
        <p className="text-xs text-sub bg-cream border border-border rounded-xl px-4 py-3">
          📧 Confirmación enviada a <strong>{form.email}</strong>
        </p>
      )}
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
        className: `w-full px-4 py-3 border-2 border-border rounded-xl text-sm text-navy outline-none focus:border-orange transition-colors bg-cream`
      })}
    </div>
  )
}
