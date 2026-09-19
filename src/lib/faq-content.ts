import { Building2, CalendarDays, CreditCard, Settings, Users, type LucideIcon } from "lucide-react";

// Compartido por la página pública y el asistente comercial.
export const FAQ_CATEGORIES: { icon: LucideIcon; title: string; questions: [string, string][] }[] = [
 {icon:Building2,title:"Sobre UrbIA",questions:[
  ["¿Qué es UrbIA?","Con UrbIA tenés tu propia página web inmobiliaria por un plan mensual: diseño moderno y adaptable a celulares, tu marca, catálogo de propiedades y formularios de consulta. Incluye un panel para mantenerla actualizada."],
  ["¿Necesito saber programar?","No. Cargás fotos, descripciones y precios desde tu panel. La plataforma se ocupa de mostrar esa información en tu página web."],
  ["¿Puedo usar mi marca y dominio?","Podés personalizar nombre, logo, portada e información de contacto. Tenés un subdominio propio y los planes que lo habilitan permiten vincular un dominio verificado."],
 ]},
 {icon:Users,title:"Propiedades y clientes",questions:[
  ["¿Qué puedo publicar?","Propiedades en venta o alquiler con fotografías, descripción, características y precios. Un mismo inmueble puede tener ofertas de venta y alquiler independientes."],
  ["¿Los clientes necesitan registrarse para consultar?","No. Pueden enviar una consulta desde la ficha de una propiedad. Sus datos quedan registrados para que la inmobiliaria les responda."],
  ["¿Puedo reunir propietarios e interesados en una misma agenda?","Sí. La ficha de contacto admite distintos roles, como propietario, interesado, inquilino, comprador y garante, sin exigirles una cuenta de acceso."],
 ]},
 {icon:CalendarDays,title:"Gestión inmobiliaria",questions:[
  ["¿Cómo organizo las visitas?","Podés registrar propiedad, interesado, agente, horario y resultado. La agenda comprueba cruces de horario para el inmueble y el nombre del agente."],
  ["¿Puedo seguir una negociación?","Sí. Las operaciones tienen etapas de negociación, reserva, cierre y pérdida. Reservar o concretar una operación actualiza la disponibilidad de la oferta."],
  ["¿Qué incluye la administración de contratos?","Podés registrar inmueble, inquilino, importe, moneda, fechas y notas de actualización. Los documentos, la firma y los ajustes automáticos todavía no están disponibles."],
 ]},
 {icon:CreditCard,title:"Cobranzas y suscripción",questions:[
  ["¿Puedo registrar alquileres y expensas?","Podés cargar obligaciones por contrato o unidad de consorcio, registrar cobros recibidos y consultar saldos y pagos parciales. La liquidación automática de expensas y a propietarios todavía no está disponible."],
  ["¿Se pueden pagar alquileres o expensas online?","Todavía no. Los cobros inmobiliarios se registran manualmente cuando fueron recibidos. El pago de la suscripción de UrbIA es un circuito separado."],
  ["¿Cómo se contrata UrbIA?","Elegís un plan de suscripción mensual o anual, según las opciones disponibles. Los precios y los límites se muestran antes de contratar."],
  ["¿Hay un período de prueba?","Los planes que incluyen prueba muestran su duración durante el registro. La duración y las condiciones dependen del plan o promoción vigente."],
 ]},
 {icon:Settings,title:"Puesta en marcha y soporte",questions:[
  ["¿Necesito instalar algo?","La plataforma funciona desde el navegador de una computadora, tablet o celular."],
  ["¿Cómo accedo a mi inmobiliaria?","Usá Iniciar sesión para entrar a tu cuenta. Desde allí podés abrir el panel de tu inmobiliaria y administrar la suscripción."],
  ["¿Cómo contacto al equipo?","Usá Contactar al equipo en la página principal y dejá tu nombre y un medio de contacto para que podamos responderte."],
  ["¿Puedo ver mis contratos como inquilino o propietario?","El portal de propietarios e inquilinos todavía está en desarrollo. En esta versión, la gestión la realiza el equipo de la inmobiliaria."],
 ]},
];
