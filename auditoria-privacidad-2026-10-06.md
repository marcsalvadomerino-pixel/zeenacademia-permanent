# Auditoría de privacidad, cookies y analítica — ZEENACADEMIA

**Fecha de revisión:** 6 de octubre de 2026  
**Estado:** correcciones técnicas en curso; la publicación de los textos legales queda condicionada a recibir los datos identificativos reales del responsable.

## Incidencias encontradas

La URL pública `https://zeentinelia.com/privacitat` devuelve una página 404. Ocurre lo mismo con `https://zeentinelia.com/cookies` y `https://zeentinelia.com/aviso-legal`. En el pie de página, los tres enlaces legales llevan a `#contacte`, no a documentos legales. Esto impide proporcionar información permanente, directa y gratuita sobre el prestador y sobre los tratamientos de datos.

El aviso legal no puede considerarse completo mientras falten nombre o razón social, domicilio, correo de contacto, NIF/CIF y, si procede, datos registrales y de autorización. El artículo 10 de la LSSI exige que esta información esté disponible por medios electrónicos de forma permanente, fácil, directa y gratuita. [1]

La página carga Google Analytics mediante `https://www.googletagmanager.com/gtag/js?id=G-X2BXDZZWZQ` y ejecuta `gtag('config', 'G-X2BXDZZWZQ')` en el HTML inicial. La carga se produce antes de que la persona pulse «Aceptar analítica» o «Continuar sin analítica». La comprobación de red en una visita sin elección previa confirmó la descarga del recurso de Google Tag Manager. Por tanto, la implementación no condiciona la analítica al consentimiento.

El banner visible es insuficiente para esa configuración: dice «Analítica respectuosa», pero no identifica al proveedor, no enlaza a una política de cookies funcional ni ofrece un panel de configuración. La guía de cookies de la AEPD exige información previa, un mecanismo claramente visible para aceptar y otro equivalente para rechazar, además de acceso directo a configuración cuando sea necesaria. [2]

El código contiene llamadas condicionadas para una posible analítica Umami, pero no se ha encontrado ningún cargador de Umami en los activos revisados. En cambio, Google Analytics sí se carga directamente. No debe describirse la medición como anónima ni como exenta de consentimiento sin comprobar su configuración y garantías. La AEPD admite una exención de medición de audiencia solo bajo condiciones estrictas: finalidad exclusiva de medición, datos estadísticos anónimos, ausencia de cruces o transmisiones incompatibles y, si hay proveedor, garantías contractuales y técnicas específicas. [3]

Tres flujos envían datos a `https://api.web3forms.com/submit`: solicitud de información (nombre, teléfono, correo, sede, curso, perfil y comentarios), boletín (correo y aceptación) e inscripción prioritaria de mantenimiento (nombre, correo, teléfono, empresa, perfil y aceptación de condiciones). La política de privacidad debe identificar este proveedor y los demás destinatarios o categorías de destinatarios, las finalidades, la base jurídica, conservación, transferencias internacionales si existen y los derechos de la persona. El artículo 13 del RGPD exige esa información en el momento de obtener los datos. [4]

No se ha encontrado en el cliente evidencia de doble opt-in para el boletín, de un mecanismo de baja ni de un registro verificable de la versión de la información de privacidad para los dos primeros formularios. El formulario principal también muestra un estado de éxito cuando la petición falla, por lo que puede dar una confirmación engañosa.

El `robots.txt` y el `sitemap.xml` señalan todavía `https://zeenacademia.netlify.app`, que no es la URL pública actual. Además, el sitemap enumera rutas legales que no existen.

## Correcciones prioritarias

1. Retirar o bloquear Google Analytics hasta contar con una configuración de consentimiento válida. Si se reintroduce analítica, cargar el proveedor solo después de una acción afirmativa y documentar proveedor, finalidad, duración, transferencias y mecanismo de retirada.
2. Crear y enlazar páginas reales de aviso legal, privacidad y cookies tras recibir la identificación jurídica real del responsable. No deben publicarse datos ficticios ni marcadores de posición.
3. Decidir si Web3Forms seguirá procesando formularios. Si continúa, documentar su rol y garantías, firmar o verificar el acuerdo de encargo que corresponda y definir plazos de conservación. Si no se puede verificar, sustituir temporalmente los formularios por contacto por correo o teléfono.
4. Añadir enlaces reales a la política de privacidad junto a cada consentimiento, un flujo de baja efectivo para el boletín y mensajes de éxito/error fieles al resultado de cada envío.
5. Corregir robots y sitemap para usar `https://zeentinelia.com/` y solo rutas existentes.

## Información pendiente para publicar textos correctos

Faltan nombre o razón social, NIF/CIF, domicilio postal, email para derechos y datos de Registro Mercantil o confirmación de que no aplican. También deben validarse los plazos de conservación, la relación contractual con Web3Forms y la política operativa de suscripción/baja del boletín.

Este documento es una revisión técnica e informativa, no sustituye la validación de una asesoría jurídica o de protección de datos.

## Referencias

[1]: https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758 "Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico"
[2]: https://www.aepd.es/guias/guia-cookies.pdf "Guía sobre el uso de las cookies"
[3]: https://www.aepd.es/guias/guia-cookies-analiticas-externas.pdf "Guía uso de cookies para herramientas de medición de audiencia"
[4]: https://eur-lex.europa.eu/eli/reg/2016/679/oj "Reglamento (UE) 2016/679, Reglamento General de Protección de Datos"
