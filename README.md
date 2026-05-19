# 💖 Glambaddie.co

Tienda online de lentes de contacto y accesorios de belleza. Bogotá, Colombia.

## Estructura del proyecto

```
glambaddie/
├── index.html      ← Estructura y contenido HTML
├── style.css       ← Todos los estilos (paleta rosa-morado-azul)
├── catalogo.js     ← Array de productos + lógica JS (carrito, modal, etc.)
└── README.md
```

## Agregar o editar productos

Abre `catalogo.js` y edita el array `PRODUCTOS`. Cada producto tiene esta forma:

```js
{
  id: 16,                          // número único
  nombre: "Mi Lente Nuevo",
  categoria: "lentes",             // "lentes" o "accesorios"
  precio: 35000,                   // precio en COP
  descripcion: "Descripción...",
  especificaciones: ["DIA: 14.2mm", "Agua: 40%"],
  img: "nombre-imagen.jpg",        // imagen en la misma carpeta
  nuevo: true                      // false si no es novedad
}
```

¡No necesitas tocar el HTML ni el CSS para agregar productos!

## Despliegue en GitHub Pages

1. Sube la carpeta a un repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En *Source* selecciona la rama `main` y la carpeta `/root` (o `/docs` si mueves los archivos ahí).
4. Guarda y espera ~1 minuto. Tu sitio estará en `https://<usuario>.github.io/<repositorio>/`.

## Tecnologías

- HTML5 semántico
- CSS3 con variables y animaciones
- JavaScript vanilla (sin frameworks)
- Google Fonts: Fredoka One + Nunito
- Compatible con todos los navegadores modernos
