// ============================================================
//  GlamBaddie.co — Catálogo de Productos (datos compartidos)
//  Usado por catalogo.js (tienda) y checkout.js (pago).
//  Añade nuevos productos aquí sin tocar el HTML.
// ============================================================

const PRODUCTOS = [
{ id:16, nombre:"Chicago Grey",         categoria:"lentes", precio:35000, descripcion:"Lente de contacto gris elegante con aro oscuro pronunciado. Diseño moderno que amplía la mirada con efecto sofisticado.", especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"], img:"Chicago-Grey.jpg", nuevo:false },
{ id:17, nombre:"Venice Brown",         categoria:"lentes", precio:35000, descripcion:"Lente de contacto marrón cálido con degradado natural. Efecto profundo y luminoso para una mirada irresistible.", especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 38%"], img:"Venice-Brown.jpg", nuevo:false },
{ id:6,  nombre:"Tiffany",              categoria:"lentes", precio:35000, descripcion:"Lente de contacto azul con matices amarillos.", especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"], img:"lente-tiffany.jpeg", nuevo:false, oferta:true, precioOferta:30000 },
{ id:8,  nombre:"Mermaid Green",        categoria:"lentes", precio:35000, descripcion:"Verde vibrante con degradado oscuro.", especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"], img:"mermaid-gree.jpg", video:"videos/mermaid-green.mp4", nuevo:false },
{ id:9,  nombre:"Pattaya Green",        categoria:"lentes", precio:35000, descripcion:"Verde intenso que ilumina la mirada.", especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"], img:"pattaya-green.jpg", nuevo:false },
{ id:11, nombre:"Pola Green",           categoria:"lentes", precio:35000, descripcion:"Lente de contacto verde natural con acabado suave y luminoso. Ideal para un look fresco y vibrante.", especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"], img:"pola-green.jpeg", nuevo:false },
{ id:13, nombre:"Russian Grey",         categoria:"lentes", precio:35000, descripcion:"Lente de contacto gris azulado con matices verdes. Efecto místico y elegante para una mirada única e irresistible.", especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"], img:"Russian-Grey.jpg", nuevo:false },
{ id:14, nombre:"OMG Gray",             categoria:"lentes", precio:35000, descripcion:"Lente de contacto gris natural con aro oscuro pronunciado. Diseño EYESHARE que amplía y profundiza la mirada.", especificaciones:["DIA: 14.0mm","Agua: 38%"], img:"OMG-Gray.jpg", nuevo:false },
{ id:15, nombre:"Makabaka Purple",      categoria:"lentes", precio:35000, descripcion:"Lente de contacto lila con efecto degradado suave. Tono púrpura romántico que transforma la mirada con estilo.", especificaciones:["DIA: 14.2mm","B.C: 8.5mm","Agua: 40%"], img:"Makabaka-Purple.jpg", nuevo:false }, 
{ id:34, nombre:"Stunna Girl Nadine",   categoria:"lentes", precio:35000, descripcion:"Lente de contacto gris verdoso con vetas doradas y aro definido. Diseño UYAAI que aporta una mirada natural y profunda.", especificaciones:["DIA: 14.20mm"], img:"Stunna-Girl-Nadine.jpg", nuevo:true },
{ id:35, nombre:"Sydney Green",         categoria:"lentes", precio:35000, descripcion:"Lente de contacto verde azulado con degradado luminoso y aro definido. Diseño EYESHARE de uso anual que resalta la mirada con brillo natural.", especificaciones:["DIA: 14.2mm","Uso: 1 año"], img:"Sydney-Green.jpg", nuevo:true },
{ id:36, nombre:"Mirage Gray",          categoria:"lentes", precio:35000, descripcion:"Lente de contacto gris claro con efecto difuminado y aro oscuro pronunciado. Diseño elegante que ilumina y amplía la mirada.", especificaciones:["DIA: 14.2mm"], img:"Mirage-Gray.jpg", nuevo:true },

// =========================
// NUEVAS REFERENCIAS
// =========================
{ id:38, nombre:"Sydney Green",         categoria:"lentes", precio:35000, descripcion:"Lente de contacto verde azulado con centro luminoso y aro gris oscuro. Diseño EYESHARE de uso anual que resalta la mirada con un efecto fresco e intenso.", especificaciones:["DIA: 14.2mm","Uso: 1 año"], img:"Sydney-Green.jpg", nuevo:true },

{ id:39, nombre:"Alice",                categoria:"lentes", precio:35000, descripcion:"Lente de contacto gris verdoso con acabado suave y natural. Diseño delicado que ilumina la mirada con un efecto tierno y sofisticado.", especificaciones:["Color: Alice"], img:"Alice.jpg", nuevo:true },

{ id:40, nombre:"Pattaya Brown",        categoria:"lentes", precio:35000, descripcion:"Lente de contacto marrón miel con destellos dorados y acabado natural. Diseño EYESHARE que aporta calidez, profundidad y brillo a la mirada.", especificaciones:["DIA: 14.2mm","Agua: 38%"], img:"Pattaya-Brown.jpg", nuevo:true },

{ id:41, nombre:"Millennial Spice",     categoria:"lentes", precio:35000, descripcion:"Lente de contacto gris ahumado con textura sutil y acabado sofisticado. Diseño intenso que aporta profundidad y dramatismo a la mirada.", especificaciones:["Color: Millennial Spice"], img:"Millennial-Spice.jpg", nuevo:true },

{ id:42, nombre:"Buff Brown",           categoria:"lentes", precio:35000, descripcion:"Lente de contacto marrón cálido con textura natural y aro definido. Diseño que aporta profundidad y un brillo dorado sutil a la mirada.", especificaciones:["DIA: 14.2mm","B.C: 8.6mm","Agua: 38%","Uso: 6 meses"], img:"Buff-Brown.jpg", nuevo:true },

{ id:43, nombre:"OMG Brown",            categoria:"lentes", precio:35000, descripcion:"Lente de contacto marrón avellana con degradado luminoso desde el centro. Diseño EYESHARE que ilumina la mirada con un efecto cálido y natural.", especificaciones:["DIA: 14.0mm","B.C: 8.5mm","Agua: 38%","Uso: 6 meses"], img:"OMG-Brown.jpg", nuevo:true },

{ id:44, nombre:"Shadow Gray",          categoria:"lentes", precio:35000, descripcion:"Lente de contacto gris ahumado con aro oscuro pronunciado. Diseño elegante que profundiza y amplía la mirada con un efecto sofisticado.", especificaciones:["DIA: 14.2mm","B.C: 8.6mm","Agua: 38%","Uso: 6 meses"], img:"Shadow-Gray.jpg", nuevo:true },
];
