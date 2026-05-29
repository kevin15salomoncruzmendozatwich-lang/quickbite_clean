import emailjs from '@emailjs/browser'

const SERVICE_ID  = 'service_9qrea26'
const TEMPLATE_ID = 'template_r30jcaw'
const PUBLIC_KEY  = 'TiYP3dDCGJ3qL3sMq'

emailjs.init(PUBLIC_KEY)

export async function enviarConfirmacion({ to, nombre, restaurante, zona, fecha, hora, personas }) {
  if (!to) return
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      to_email:    to,
      to_name:     nombre,
      message:     'Tu reservación ha sido confirmada. ¡Te esperamos con gusto!',
      restaurante,
      zona,
      fecha,
      hora,
      personas: `${personas} persona${personas > 1 ? 's' : ''}`,
    })
  } catch (e) {
    console.warn('Email no enviado:', e)
  }
}
