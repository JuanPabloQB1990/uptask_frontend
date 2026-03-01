# 📌 Uptask Frontend

**Uptask Frontend** es la aplicación web cliente construida para consumir la API de **Uptask Backend**.  
Está desarrollada con **React, TypeScript, Vite, Tailwind CSS** y se integra con Socket.IO para ofrecer **actualizaciones en tiempo real**.

La aplicación está diseñada para gestionar proyectos, tareas y equipo colaborativo con una experiencia de usuario fluida y moderna.

---

## 🚀 ¿Qué hace esta aplicación?

Uptask Frontend permite a los usuarios:

✔️ Registrarse e iniciar sesión  
✔️ Ver, crear y administrar proyectos  
✔️ Agregar colaboradores a los proyectos  
✔️ Crear, editar, mover y eliminar tareas  
✔️ Agregar notas a las tareas  
✔️ Visualizar actualizaciones en tiempo real mediante Socket.IO  
✔️ Administrar estado de tareas (status) con drag & drop  
✔️ Experiencia responsiva en desktop y mobile  

Esta interfaz se comunica con una API backend (Uptask Backend) para gestionar datos permanentes y notificaciones en tiempo real.

---

## 🛠️ Tecnologías y herramientas usadas

La aplicación está construida con:

- **React** – Biblioteca para construir interfaces web
- **TypeScript** – Superset de JavaScript que mejora la calidad del código
- **Vite** – Herramienta de bundling moderna y rápida
- **React Query** – Para manejo automático de estado de datos y caché
- **Axios** – Realiza peticiones HTTP al backend
- **Tailwind CSS** – Framework de utilidades para estilos
- **Socket.IO Client** – Comunicación bidireccional en tiempo real
- **React Router** – Ruteo de aplicaciones SPA
- **ESLint + Prettier** – Calidad de código y formateo consistente

---

## 🧪 Requisitos Previos

Antes de instalar, asegúrate de tener:

- **Node.js v16+**
- **npm o Yarn**
- El **backend de Uptask** desplegado y accesible (local o remoto)
- Variables de entorno correctamente configuradas

---

## 🛠️ Instalación y ejecución en local

## Videos tutoriales

- url video instruciones configuracion: https://youtu.be/9toS3fNNs34
- url video registro y verificacion de cuenta: https://youtu.be/uBVymFhi8LA
- crear proyecto: https://youtu.be/zXS4P7j6vww
- crear tarea: https://youtu.be/Mb-WmCWvpus
- editar tarea: https://youtu.be/MfyuQp2nuMk
- crear y eliminar nota: https://youtu.be/MSjrbO4SgMU
- agregar y eliminar miembros: https://youtu.be/6BltQfmYTt0
- cambios en tiempo real - miembros: https://youtu.be/a-RryNmIYtg
- cambios en tiempo real - tareas: https://youtu.be/83rDW_PKrRk
- editar perfil - cambio de password: https://youtu.be/YfXAWSWdpzA

### 1. Clonar el repositorio

```bash
git clone https://github.com/JuanPabloQB1990/uptask_frontend.git
```

## 2. Instalar dependencias

```js
cd uptask_frontend
```

```js
npm install
```

## 3. Crear archivo de variables de entorno

## 4. Ajusta tus variables de entorno

Ejemplo:
```js
VITE_API_URL=http://localhost:5000/api
VITE_API_URL_SOCKET=http://localhost:5000
```

Estas variables deben coincidir con la URL donde se despliega tu backend.

## 5. Ejecutar en desarrollo
```js
npm run dev
```


El proyecto correrá en:
```js
http://localhost:5173
```

