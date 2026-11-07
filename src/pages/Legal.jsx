import { useEffect } from 'react'

// Pega tu texto dentro de las comillas invertidas (`...`). Cada línea en blanco = nuevo párrafo.
// Si una línea empieza con "# " se muestra como subtítulo.
const TERMINOS = `
# Términos y Condiciones de Uso de QuickBiteMX

**Última actualización:** 7 de noviembre de 2026

**Sitio web:** https://quickbitemx.online

## 1. Introducción

Bienvenido a QuickBiteMX, una plataforma digital diseñada para facilitar la búsqueda de restaurantes y la gestión de reservaciones mediante una experiencia accesible, rápida y organizada.

Al acceder, registrarse o utilizar los servicios disponibles en QuickBiteMX, el usuario acepta los presentes Términos y Condiciones de Uso.

Se recomienda leer cuidadosamente este documento antes de utilizar la plataforma.

## 2. Identificación del responsable

QuickBiteMX es una plataforma administrada por **[nombre completo o razón social del responsable]**, con domicilio en **[domicilio del responsable]**.

Para consultas relacionadas con el servicio, los usuarios podrán comunicarse mediante el correo electrónico **[correo de contacto]**.

## 3. Descripción de los servicios

QuickBiteMX proporciona herramientas digitales que permiten a los usuarios:

- Explorar información de restaurantes disponibles en la plataforma.
- Consultar los detalles y características de los establecimientos.
- Crear y administrar una cuenta personal.
- Realizar reservaciones en restaurantes participantes.
- Consultar el historial y estado de sus reservaciones.
- Cancelar reservaciones mediante las opciones disponibles.
- Recibir notificaciones relacionadas con sus cuentas y reservaciones.

Las funcionalidades podrán modificarse o ampliarse conforme evolucione la plataforma.

## 4. Registro y cuentas de usuario

Para acceder a determinadas funciones, el usuario deberá crear una cuenta proporcionando información verdadera, completa y actualizada.

El usuario será responsable de mantener la confidencialidad de sus credenciales de acceso y de las actividades realizadas mediante su cuenta, salvo aquellas derivadas de circunstancias que legalmente no le sean imputables.

QuickBiteMX podrá implementar mecanismos de verificación de correo electrónico para proteger la seguridad de las cuentas.

No se permite utilizar identidades falsas, suplantar a terceros ni acceder sin autorización a cuentas ajenas.

## 5. Reservaciones

Las reservaciones realizadas mediante QuickBiteMX estarán sujetas a la disponibilidad del restaurante seleccionado y a las condiciones informadas durante el proceso.

El usuario será responsable de proporcionar correctamente la fecha, hora, número de personas y demás información necesaria.

La recepción de una solicitud o un correo electrónico no implica necesariamente la aceptación definitiva de la reservación. Su estado deberá consultarse mediante la confirmación correspondiente.

QuickBiteMX funciona como plataforma tecnológica de gestión de reservaciones. Los servicios de alimentación, atención presencial y demás prestaciones propias de cada establecimiento corresponden al restaurante participante, sin perjuicio de las responsabilidades que legalmente correspondan a QuickBiteMX.

## 6. Cancelaciones y modificaciones

Los usuarios podrán cancelar sus reservaciones mediante las funciones habilitadas en la plataforma o los canales de atención correspondientes.

Las condiciones de cancelación, modificación, cargos o restricciones aplicables deberán comunicarse claramente antes de confirmar una reservación.

Cuando un establecimiento tenga políticas particulares, estas deberán ser informadas al usuario y respetar la legislación aplicable.

QuickBiteMX no aplicará penalizaciones que no hayan sido previamente informadas y aceptadas conforme a la legislación correspondiente.

## 7. Precios y pagos

La consulta de restaurantes y la gestión de reservaciones estarán sujetas a las condiciones económicas informadas expresamente en la plataforma.

Cualquier cargo por reservación, anticipo, depósito o servicio adicional deberá comunicarse al usuario antes de su aceptación.

Los precios de alimentos, bebidas y servicios proporcionados por los restaurantes serán establecidos por cada establecimiento y deberán mostrarse conforme a las disposiciones legales aplicables.

## 8. Uso adecuado de la plataforma

El usuario se compromete a utilizar QuickBiteMX de forma lícita y responsable.

Queda prohibido:

- Realizar reservaciones fraudulentas o proporcionar información deliberadamente falsa.
- Intentar acceder sin autorización a sistemas, servidores o cuentas.
- Utilizar herramientas automatizadas para afectar el funcionamiento del servicio.
- Distribuir código malicioso o realizar actividades que comprometan la seguridad de la plataforma.
- Utilizar la plataforma para actividades contrarias a la legislación vigente.

QuickBiteMX podrá restringir el acceso cuando existan incumplimientos debidamente identificados, respetando los derechos de los usuarios.

## 9. Disponibilidad del servicio

QuickBiteMX procurará mantener la plataforma disponible y funcionando correctamente.

Sin embargo, podrán presentarse interrupciones temporales por mantenimiento, actualizaciones, fallas técnicas o situaciones ajenas a su control.

Cuando sea posible, se informará oportunamente sobre interrupciones programadas.

Lo anterior no limita los derechos y garantías que correspondan legalmente a los usuarios.

## 10. Propiedad intelectual

Los diseños, elementos gráficos, logotipos, textos, código y demás contenidos originales de QuickBiteMX se encuentran protegidos por la legislación aplicable en materia de propiedad intelectual.

El usuario podrá acceder a dichos contenidos para utilizar los servicios conforme a estos términos.

No se autoriza su reproducción, distribución o explotación no permitida por la legislación o sin autorización de sus titulares.

Las marcas, fotografías y materiales proporcionados por restaurantes participantes pertenecen a sus respectivos titulares.

## 11. Protección de datos personales

El tratamiento de los datos personales de los usuarios se realizará conforme al Aviso de Privacidad de QuickBiteMX y a las disposiciones legales aplicables en México.

Se recomienda consultar dicho documento para conocer qué información se recopila, cómo se utiliza y los mecanismos disponibles para ejercer los derechos de protección de datos personales.

## 12. Modificaciones de los términos

QuickBiteMX podrá actualizar los presentes Términos y Condiciones para reflejar cambios en sus servicios o en la normativa aplicable.

Las modificaciones se publicarán en esta sección, indicando su fecha de actualización.

Cuando los cambios sean sustanciales, se comunicarán oportunamente por los medios disponibles y se solicitará la aceptación correspondiente cuando resulte necesaria.

## 13. Legislación aplicable

Estos Términos y Condiciones se interpretarán conforme a la legislación vigente de los Estados Unidos Mexicanos.

Cualquier controversia será atendida mediante los mecanismos de solución previstos en la legislación aplicable, respetando los derechos de las personas consumidoras y las competencias de las autoridades correspondientes.

## 14. Contacto

Para dudas, aclaraciones o comentarios sobre estos términos, los usuarios podrán contactar al responsable mediante:

**Plataforma:** QuickBiteMX  
**Sitio web:** https://quickbitemx.online  
**Correo electrónico:** [correo de contacto]  
**Domicilio:** [domicilio del responsable]

---

Al utilizar QuickBiteMX, el usuario reconoce haber tenido acceso a estos Términos y Condiciones y acepta aquellos que resulten aplicables conforme a la legislación vigente.
`

const PRIVACIDAD = `
# Política de Privacidad de QuickBiteMX

**Aviso de Privacidad Integral**

**Última actualización:** 7 de noviembre de 2026

**Sitio web:** https://quickbitemx.online

## 1. Introducción

En QuickBiteMX reconocemos la importancia de proteger la privacidad y la información personal de nuestros usuarios.

La presente Política de Privacidad explica cómo recopilamos, utilizamos, almacenamos, compartimos y protegemos los datos personales proporcionados al utilizar nuestros servicios de búsqueda de restaurantes y gestión de reservaciones.

El tratamiento de datos personales se sujetará a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y demás disposiciones aplicables en México.

## 2. Identidad del responsable

El responsable del tratamiento de los datos personales es **[nombre completo o razón social]**, administrador de QuickBiteMX, con domicilio en **[domicilio completo del responsable]**.

Los usuarios podrán comunicarse para cualquier asunto relacionado con sus datos personales mediante:

**Correo electrónico:** [correo de privacidad]  
**Sitio web:** https://quickbitemx.online

## 3. Datos personales recopilados

QuickBiteMX podrá recopilar las siguientes categorías de información, según las funcionalidades utilizadas.

**Datos de identificación y contacto:**
- Nombre y apellidos.
- Dirección de correo electrónico.
- Número telefónico, cuando se solicite.
- Datos relacionados con el perfil del usuario.

**Datos de cuenta:**
- Identificador de usuario.
- Información necesaria para la autenticación.
- Estado de verificación de la cuenta.

**Datos de reservaciones:**
- Restaurante seleccionado.
- Fecha y hora de la reservación.
- Número de personas.
- Estado e historial de reservaciones.
- Información adicional proporcionada voluntariamente, cuando exista ese campo.

**Datos técnicos:**

Podrán recopilarse datos técnicos necesarios para la operación y seguridad de la plataforma, como dirección IP, información del navegador, registros de acceso e identificadores de sesión, según los servicios utilizados.

QuickBiteMX no solicita datos personales sensibles como requisito general para registrarse o reservar. Se recomienda no incluir información sensible en campos de texto libre.

Si alguna funcionalidad requiere tratar datos sensibles, se informará específicamente al usuario y se obtendrá el consentimiento correspondiente cuando la ley lo exija.

## 4. Finalidades del tratamiento

Los datos personales serán utilizados para las siguientes finalidades principales:

- Crear y administrar cuentas de usuario.
- Verificar direcciones de correo electrónico.
- Permitir el acceso seguro a la plataforma.
- Registrar, gestionar y consultar reservaciones.
- Comunicar la información necesaria al restaurante correspondiente.
- Enviar notificaciones operativas sobre reservaciones y cuentas.
- Atender solicitudes de soporte.
- Detectar actividades no autorizadas.
- Mantener y mejorar el funcionamiento técnico del servicio.
- Cumplir las obligaciones legales aplicables.

**Finalidades secundarias:**

Cuando estas funciones se encuentren habilitadas, QuickBiteMX podrá utilizar datos de contacto para enviar promociones, novedades o encuestas de satisfacción.

Los usuarios podrán rechazar estas finalidades secundarias sin que ello impida el acceso a los servicios principales.

Para hacerlo, podrán escribir a **[correo de privacidad]** o utilizar los mecanismos de preferencias disponibles en la plataforma.

## 5. Uso de proveedores tecnológicos

Para prestar sus servicios, QuickBiteMX utiliza o puede utilizar proveedores tecnológicos especializados, entre ellos:

**Supabase:** servicios de autenticación, almacenamiento y administración de información relacionada con las cuentas y reservaciones.

**Resend:** procesamiento y envío de correos electrónicos transaccionales, como mensajes de verificación y notificaciones.

**Netlify:** alojamiento y distribución de los archivos y recursos de la aplicación web.

Estos proveedores podrán procesar determinados datos conforme a sus funciones, contratos y medidas de protección aplicables.

Dependiendo de su infraestructura, el tratamiento de información podrá involucrar sistemas ubicados fuera de México, sujeto a las obligaciones legales correspondientes.

## 6. Comunicación de datos a restaurantes

Para gestionar una reservación, QuickBiteMX podrá comunicar al restaurante seleccionado los datos estrictamente necesarios para atender la solicitud.

Esta información podrá incluir el nombre del usuario, datos de contacto y detalles de la reservación.

La comunicación se realizará conforme a las bases legales aplicables y, cuando sea necesario, con el consentimiento del titular.

Los restaurantes que reciban información como responsables independientes deberán utilizarla de acuerdo con sus propias obligaciones legales y finalidades informadas.

QuickBiteMX no comercializará bases de datos personales de sus usuarios sin cumplir los requisitos legales correspondientes.

## 7. Protección y seguridad

QuickBiteMX deberá mantener medidas administrativas y técnicas apropiadas para proteger los datos personales frente a accesos no autorizados, alteraciones, pérdidas o divulgaciones indebidas.

Entre estas medidas se contemplan mecanismos de autenticación, controles de acceso y herramientas de seguridad proporcionadas por los servicios tecnológicos utilizados.

Aunque se adoptan medidas para reducir riesgos, ningún sistema conectado a Internet puede garantizar seguridad absoluta.

En caso de una vulneración que afecte significativamente los derechos de las personas titulares, se realizarán las notificaciones legalmente correspondientes.

## 8. Conservación de la información

Los datos personales se conservarán únicamente durante el tiempo necesario para cumplir las finalidades informadas, mantener la relación con los usuarios y atender obligaciones legales aplicables.

Cuando los datos dejen de ser necesarios, se eliminarán o bloquearán conforme a las disposiciones correspondientes.

La solicitud de eliminación de una cuenta no implica necesariamente la eliminación inmediata de información que deba conservarse por mandato legal o por responsabilidades pendientes.

## 9. Derechos ARCO

Los usuarios podrán ejercer sus derechos de:

**Acceso:** conocer los datos personales que se tienen y cómo se utilizan.

**Rectificación:** solicitar la corrección de datos incorrectos o desactualizados.

**Cancelación:** solicitar la cancelación de datos personales cuando legalmente corresponda.

**Oposición:** oponerse al tratamiento de sus datos en los supuestos previstos por la ley.

Para ejercer estos derechos, deberán enviar una solicitud a **[correo de privacidad]**, indicando:

1. Nombre completo y medio para recibir notificaciones.
2. Derecho que desean ejercer.
3. Descripción de los datos relacionados con su solicitud.
4. Información que permita verificar su identidad o representación legal.
5. Documentación adicional necesaria, cuando corresponda.

QuickBiteMX comunicará su determinación en un plazo máximo de 20 días hábiles a partir de la recepción de la solicitud completa y, cuando proceda, la hará efectiva dentro de los 15 días hábiles siguientes, salvo las ampliaciones legalmente permitidas.

## 10. Revocación del consentimiento

Los usuarios podrán solicitar la revocación del consentimiento otorgado para el tratamiento de sus datos personales, cuando legalmente proceda.

La solicitud podrá realizarse mediante el correo **[correo de privacidad]**, indicando la información necesaria para identificar la cuenta y el tratamiento al que se refiere.

La revocación no tendrá efectos retroactivos y podrá estar sujeta a las excepciones previstas por la legislación aplicable.

## 11. Cookies y tecnologías similares

QuickBiteMX podrá utilizar cookies, almacenamiento local u otras tecnologías necesarias para mantener sesiones de usuario, permitir el funcionamiento de la aplicación y proteger el acceso a las cuentas.

En caso de incorporar herramientas de análisis, publicidad o seguimiento no esencial, se informará sobre su funcionamiento y se implementarán los mecanismos de consentimiento o control que correspondan.

Los usuarios podrán administrar determinadas tecnologías desde la configuración de su navegador, aunque deshabilitarlas podría afectar algunas funcionalidades.

## 12. Limitación del uso de los datos

Los usuarios podrán solicitar la limitación del uso o divulgación de sus datos personales cuando corresponda.

Para ello podrán comunicarse al correo **[correo de privacidad]** o utilizar las opciones de privacidad disponibles en la aplicación.

La decisión de no recibir comunicaciones promocionales no impedirá recibir mensajes operativos necesarios para el funcionamiento de una cuenta o reservación.

## 13. Cambios en la Política de Privacidad

QuickBiteMX podrá modificar la presente Política de Privacidad para reflejar cambios tecnológicos, operativos o legales.

Las actualizaciones serán publicadas en este sitio web, indicando la fecha correspondiente.

Cuando las modificaciones impliquen nuevas finalidades o tratamientos que requieran consentimiento, se informará a los usuarios y se obtendrá dicho consentimiento cuando sea necesario.

## 14. Contacto para asuntos de privacidad

Para consultas relacionadas con esta Política de Privacidad, los usuarios podrán dirigirse a:

**Responsable:** [nombre completo o razón social]  
**Plataforma:** QuickBiteMX  
**Sitio web:** https://quickbitemx.online  
**Correo electrónico:** [correo de privacidad]  
**Domicilio:** [domicilio completo]

---

QuickBiteMX se compromete a tratar los datos personales de manera responsable, transparente y conforme a las disposiciones legales aplicables, priorizando la seguridad de la información y el respeto a los derechos de sus usuarios.
`

const DOCS = {
  terminos:   { titulo: 'Términos de uso', texto: TERMINOS },
  privacidad: { titulo: 'Política de privacidad', texto: PRIVACIDAD },
}

export default function Legal({ tipo }) {
  useEffect(() => { window.scrollTo(0, 0) }, [tipo])
  const { titulo, texto } = DOCS[tipo]
  const bloques = texto.trim().split(/\n\s*\n/)

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="font-playfair font-bold text-3xl md:text-4xl text-navy mb-8">{titulo}</h1>
      <div className="bg-white border border-border rounded-3xl p-8 space-y-4">
        {bloques.map((b, i) => b.startsWith('# ')
          ? <h2 key={i} className="font-playfair font-bold text-xl text-navy pt-2">{b.slice(2)}</h2>
          : <p key={i} className="text-sub text-sm leading-relaxed whitespace-pre-line">{b}</p>)}
      </div>
    </div>
  )
}
