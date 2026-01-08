# SyncMaster 🎧

**Centro de Soporte Técnico y Atención al Cliente para LiveSync Pro**

SyncMaster es una aplicación web moderna y completa para proporcionar soporte técnico y atención al cliente para LiveSync Pro. Desarrollada con tecnologías web estándar y optimizada para GitHub Pages.

## 🌟 Características

### Sistema de Chat en Vivo
- Chat inteligente con respuestas automáticas
- Asistente virtual con conocimiento de LiveSync Pro
- Respuestas rápidas predefinidas
- Interfaz intuitiva y moderna

### Sistema de Tickets
- Creación y gestión de tickets de soporte
- Categorización automática
- Niveles de prioridad
- Seguimiento del estado
- Almacenamiento local de tickets

### Base de Conocimientos
- Documentación completa y organizada
- Guías de instalación y configuración
- Tutoriales paso a paso
- Solución de problemas
- Búsqueda integrada

### Preguntas Frecuentes (FAQ)
- Respuestas a las preguntas más comunes
- Diseño de acordeón
- Fácil navegación

### Diseño Responsive
- Optimizado para móviles, tablets y desktop
- Interfaz moderna y profesional
- Animaciones suaves
- Accesibilidad mejorada

## 🚀 Tecnologías Utilizadas

- **HTML5**: Estructura semántica moderna
- **CSS3**: Diseño responsive con Grid y Flexbox
- **JavaScript ES6+**: Lógica de aplicación
- **Font Awesome**: Iconografía
- **LocalStorage**: Persistencia de datos del lado del cliente

## 📦 Estructura del Proyecto

```
SyncMaster/
├── index.html              # Página principal
├── styles.css              # Estilos globales
├── app.js                  # Lógica de la aplicación
├── config.js               # Configuración
├── knowledge-base.js       # Base de conocimientos
└── README.md              # Este archivo
```

## 🛠️ Instalación y Configuración

### Opción 1: GitHub Pages (Recomendado)

1. **Fork o clone este repositorio**
   ```bash
   git clone https://github.com/abrinay1997-stack/SyncMaster.git
   cd SyncMaster
   ```

2. **Configurar GitHub Pages**
   - Ve a Settings > Pages en tu repositorio
   - Selecciona la rama `main` o `master`
   - Selecciona la carpeta raíz `/`
   - Guarda los cambios
   - Tu aplicación estará disponible en: `https://[tu-usuario].github.io/SyncMaster/`

3. **Personalización**
   - Edita `config.js` para personalizar la configuración
   - Modifica `knowledge-base.js` para agregar o editar artículos
   - Actualiza los enlaces y referencias a LiveSync Pro

### Opción 2: Servidor Local

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/abrinay1997-stack/SyncMaster.git
   cd SyncMaster
   ```

2. **Iniciar un servidor local**

   Usando Python:
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   Usando Node.js:
   ```bash
   npx http-server
   ```

   Usando PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Acceder a la aplicación**
   - Abre tu navegador en `http://localhost:8000`

### Opción 3: Otros Servicios de Hosting

SyncMaster es una aplicación estática que puede desplegarse en:
- **Netlify**: Arrastra la carpeta del proyecto
- **Vercel**: Conecta tu repositorio de GitHub
- **Cloudflare Pages**: Conecta tu repositorio
- **AWS S3 + CloudFront**: Para hosting de alto rendimiento
- **Firebase Hosting**: Para integración con servicios de Google

## ⚙️ Configuración

### Personalizar para tu Producto

Edita el archivo `config.js`:

```javascript
const CONFIG = {
    app: {
        name: 'Tu Aplicación de Soporte',
        supportEmail: 'tu-email@ejemplo.com',
        // ... más configuraciones
    },
    livesyncpro: {
        name: 'Tu Producto',
        repository: 'https://github.com/tu-usuario/tu-repo',
        // ... más configuraciones
    }
};
```

### Agregar Conocimiento del Repositorio LiveSync Pro

Una vez que tengas acceso al repositorio de LiveSync Pro:

1. **Analizar el Repositorio**
   - Revisa la documentación existente
   - Identifica las funcionalidades principales
   - Documenta problemas comunes

2. **Actualizar la Base de Conocimientos**
   - Edita `knowledge-base.js`
   - Agrega nuevos artículos
   - Actualiza información técnica

3. **Mejorar las Respuestas del Chat**
   - Edita la función `generateBotResponse()` en `app.js`
   - Agrega palabras clave específicas de tu producto
   - Personaliza las respuestas

### Integrar con APIs Reales

Para conectar con servicios backend reales:

```javascript
// En app.js, reemplaza el almacenamiento local con llamadas API
async function createTicket(ticketData) {
    const response = await fetch('https://tu-api.com/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY'
        },
        body: JSON.stringify(ticketData)
    });
    return response.json();
}
```

## 📚 Uso

### Navegación

La aplicación tiene 5 secciones principales:

1. **Inicio**: Página de bienvenida con acciones rápidas
2. **Chat en Vivo**: Comunicación en tiempo real
3. **Tickets**: Sistema de gestión de tickets
4. **Base de Conocimientos**: Documentación y guías
5. **FAQ**: Preguntas frecuentes

### Sistema de Chat

El chat incluye:
- Respuestas automáticas inteligentes
- Botones de respuesta rápida
- Historial de conversación
- Indicadores de estado

Palabras clave reconocidas:
- Instalación, configuración, sincronización
- Problemas de conexión, errores
- Seguridad, encriptación
- Precios, planes, facturación
- Y más...

### Crear un Ticket

1. Ve a la sección "Tickets"
2. Completa el formulario con:
   - Nombre y email
   - Categoría del problema
   - Prioridad
   - Descripción detallada
3. Haz clic en "Enviar Ticket"
4. Recibirás un ID de ticket único

### Buscar en la Base de Conocimientos

1. Ve a "Base de Conocimientos"
2. Usa la barra de búsqueda o navega por categorías:
   - Primeros Pasos
   - Configuración
   - Solución de Problemas
   - Seguridad
   - API y Desarrollo
   - Aplicaciones Móviles

## 🎨 Personalización de Estilos

### Cambiar Colores

Edita las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #2563eb;      /* Color principal */
    --primary-dark: #1e40af;       /* Color primario oscuro */
    --secondary-color: #10b981;    /* Color secundario */
    --danger-color: #ef4444;       /* Color de error */
    /* ... más variables */
}
```

### Fuentes

Para cambiar la fuente, actualiza en `styles.css`:

```css
body {
    font-family: 'Tu Fuente', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

## 🔧 Funcionalidades Avanzadas

### Agregar Nuevos Artículos

En `knowledge-base.js`:

```javascript
const KNOWLEDGE_BASE = {
    'nuevo-articulo': {
        title: 'Título del Artículo',
        content: `
            <h3>Sección</h3>
            <p>Contenido...</p>
        `
    },
    // ... más artículos
};
```

### Agregar Categorías de Tickets

En `config.js`:

```javascript
supportCategories: [
    { value: 'nueva-categoria', label: 'Nueva Categoría', icon: 'fa-icon' },
    // ... más categorías
]
```

### Personalizar el Chatbot

Edita la función `generateBotResponse()` en `app.js`:

```javascript
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Agrega nuevas condiciones
    if (message.includes('tu-palabra-clave')) {
        return 'Tu respuesta personalizada...';
    }

    // ... más condiciones
}
```

## 📊 Analytics (Opcional)

Para agregar Google Analytics:

```html
<!-- En index.html, antes de </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Seguridad

### Buenas Prácticas

- No almacenes información sensible en el código del cliente
- Usa HTTPS en producción
- Valida todas las entradas del usuario
- Implementa rate limiting en el backend
- No expongas API keys en el código frontend

### Integración con Backend Seguro

Para producción, considera:
- Autenticación JWT
- Encriptación de datos sensibles
- CORS configurado correctamente
- Validación server-side

## 🐛 Solución de Problemas

### La aplicación no carga en GitHub Pages

1. Verifica que GitHub Pages esté habilitado
2. Asegúrate de que la rama correcta esté seleccionada
3. Limpia la caché del navegador
4. Revisa la consola del navegador por errores

### Los estilos no se aplican

1. Verifica que `styles.css` esté en la raíz del proyecto
2. Comprueba la ruta en `index.html`
3. Limpia la caché del navegador

### El chat no responde

1. Abre la consola del navegador (F12)
2. Busca errores de JavaScript
3. Verifica que `app.js` esté cargado correctamente

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

### Próximas Funcionalidades

- [ ] Sistema de autenticación de usuarios
- [ ] Panel de administración
- [ ] Integración con APIs de ticketing (Zendesk, Freshdesk)
- [ ] Chat en tiempo real con WebSockets
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Soporte multiidioma
- [ ] Analytics integrado
- [ ] Exportación de conversaciones
- [ ] Sistema de calificación de soporte

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Soporte

Si necesitas ayuda con SyncMaster:

- 📧 Email: support@livesyncpro.com
- 💬 Chat: Disponible en la aplicación
- 🐛 Issues: [GitHub Issues](https://github.com/abrinay1997-stack/SyncMaster/issues)
- 📖 Documentación: [Docs](https://docs.livesyncpro.com)

## 🙏 Agradecimientos

- [Font Awesome](https://fontawesome.com) por los iconos
- [Google Fonts](https://fonts.google.com) por las fuentes
- Comunidad open source por las inspiraciones y recursos

---

Desarrollado con ❤️ para proporcionar el mejor soporte a los usuarios de LiveSync Pro

**Versión**: 1.0.0
**Última actualización**: Enero 2026
