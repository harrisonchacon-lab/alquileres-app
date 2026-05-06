# 🏢 Mis Locales — Control de Alquileres

App para llevar el control de pagos de alquileres de locales comerciales. Funciona en navegador web y puede instalarse como app en Android.

## ✨ Funciones

- Dashboard con estado del mes actual por local
- Marcar pagos como **Pagado / Pendiente / Atrasado**
- **Notas por mes** con plantillas rápidas (pagos parciales, prórrogas, etc.)
- Historial de los últimos 5 meses
- Editar datos de cada local
- **Guarda automáticamente** los datos en el dispositivo (localStorage)
- Diseño responsive optimizado para celular

---

## 🚀 Instalación y uso

### Requisitos
- Node.js 16 o superior
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/alquileres-app.git
cd alquileres-app

# 2. Instalar dependencias
npm install

# 3. Correr en desarrollo
npm start
```

La app abre en `http://localhost:3000`

### Build para producción

```bash
npm run build
```

Genera la carpeta `build/` lista para subir a cualquier hosting (Netlify, Vercel, GitHub Pages, etc.).

---

## 📱 Instalar en Android como app (PWA)

1. Abre la app en **Chrome para Android**
2. Toca el menú (⋮) → **"Añadir a pantalla de inicio"**
3. Confirma → ya aparece como app en tu celular

---

## 🌐 Deploy gratuito con Netlify

1. Haz `npm run build`
2. Ve a [netlify.com](https://netlify.com) → **"Deploy manually"**
3. Arrastra la carpeta `build/` → ¡listo, tienes URL pública!

O conecta directamente tu repo de GitHub para deploy automático.

---

## 🛠 Personalizar tus locales

Edita el archivo `src/App.js` y busca `INITIAL_LOCALES` al inicio del archivo. Cambia los nombres, inquilinos, montos y días de vencimiento con tus datos reales.

---

## 📁 Estructura del proyecto

```
alquileres-app/
├── public/
│   └── index.html
├── src/
│   ├── App.js          ← Componente principal
│   ├── index.js        ← Entrada de React
│   └── index.css       ← Estilos globales
├── package.json
└── README.md
```
