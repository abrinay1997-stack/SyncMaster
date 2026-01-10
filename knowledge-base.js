// Base de Conocimientos para LiveSync Pro - Sistema de Diseño Acústico
const KNOWLEDGE_BASE = {
    'instalacion': {
        title: 'Instalación de LiveSync Pro',
        content: `
            <h3>Requisitos del Sistema</h3>
            <ul>
                <li><strong>Node.js:</strong> Versión 18 o superior requerida</li>
                <li><strong>Navegador:</strong> Chrome, Firefox, Safari o Edge (últimas versiones)</li>
                <li><strong>Conexión a Internet:</strong> Requerida para sincronización en la nube</li>
                <li><strong>RAM:</strong> Mínimo 4GB, recomendado 8GB para proyectos grandes</li>
                <li><strong>Procesador:</strong> Procesador de 64 bits</li>
            </ul>

            <h3>Instalación para Desarrollo Local</h3>

            <h4>Paso 1: Clonar el Repositorio</h4>
            <pre><code>git clone https://github.com/abrinay1997-stack/LiveSync-Pro.git
cd LiveSync-Pro</code></pre>

            <h4>Paso 2: Instalar Dependencias</h4>
            <pre><code>npm install</code></pre>

            <h4>Paso 3: Configurar Variables de Entorno</h4>
            <p>Crea un archivo <code>.env.local</code> con las siguientes variables:</p>
            <pre><code>VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
GEMINI_API_KEY=tu_clave_api_gemini</code></pre>

            <p>Obtén tus credenciales de Supabase en:</p>
            <ul>
                <li>URL del proyecto: <a href="https://app.supabase.com/project/_/settings/api" target="_blank">Supabase Project Settings</a></li>
                <li>Clave anónima: En la misma página de configuración de API</li>
            </ul>

            <h4>Paso 4: Ejecutar la Aplicación</h4>
            <pre><code>npm run dev</code></pre>

            <p>La aplicación estará disponible en <code>http://localhost:5173</code></p>

            <h3>Uso de la Aplicación en AI Studio</h3>
            <p>También puedes acceder directamente a la aplicación alojada en AI Studio:</p>
            <ul>
                <li>URL: <a href="https://ai.studio/apps/drive/18KB4IU6KzA9Jr39Z4tEdMPe08n6WLqB3" target="_blank">LiveSync Pro en AI Studio</a></li>
                <li>No requiere instalación local</li>
                <li>Acceso inmediato desde cualquier navegador</li>
            </ul>

            <h3>Compilar para Producción</h3>
            <pre><code># Compilar TypeScript y generar build
npm run build

# Vista previa del build
npm run preview</code></pre>

            <h3>Verificación de Instalación</h3>
            <p>Para verificar que todo está correctamente instalado:</p>
            <ol>
                <li>La aplicación debe cargar sin errores en el navegador</li>
                <li>Deberías ver la pantalla de inicio de sesión</li>
                <li>La consola del navegador no debe mostrar errores críticos</li>
                <li>La conexión con Supabase debe establecerse correctamente</li>
            </ol>

            <h3>Solución de Problemas Comunes</h3>

            <h4>Error: "Cannot find module"</h4>
            <p><strong>Solución:</strong> Elimina node_modules y reinstala:</p>
            <pre><code>rm -rf node_modules package-lock.json
npm install</code></pre>

            <h4>Error de Supabase: "Invalid API key"</h4>
            <p><strong>Solución:</strong></p>
            <ul>
                <li>Verifica que las variables en .env.local sean correctas</li>
                <li>Asegúrate de usar VITE_ como prefijo</li>
                <li>Reinicia el servidor de desarrollo después de cambiar .env.local</li>
            </ul>

            <h4>Puerto 5173 ya en uso</h4>
            <p><strong>Solución:</strong> Especifica un puerto diferente:</p>
            <pre><code>npm run dev -- --port 3000</code></pre>
        `
    },

    'configuracion-inicial': {
        title: 'Configuración Inicial del Proyecto',
        content: `
            <h3>Primer Acceso a LiveSync Pro</h3>

            <h4>1. Autenticación</h4>
            <p>LiveSync Pro ofrece múltiples métodos de autenticación:</p>
            <ul>
                <li><strong>PIN Personal:</strong> Código de 4-6 dígitos para acceso rápido</li>
                <li><strong>Código de Equipo:</strong> Únete a proyectos compartidos con código de invitación</li>
                <li><strong>Validación de Licencia:</strong> Verifica tu licencia profesional</li>
            </ul>

            <h4>2. Crear tu Primer Proyecto</h4>
            <ol>
                <li>Accede a la aplicación e inicia sesión</li>
                <li>En el <strong>Project Hub</strong>, haz clic en "Nuevo Proyecto"</li>
                <li>Ingresa la información básica:
                    <ul>
                        <li>Nombre del proyecto</li>
                        <li>Tipo de evento (Corporativo, Concierto, Festival, etc.)</li>
                        <li>Fecha del evento</li>
                        <li>Cliente/Venue</li>
                    </ul>
                </li>
                <li>Haz clic en "Crear" para comenzar</li>
            </ol>

            <h3>Configuración de Parámetros del Proyecto</h3>

            <h4>Configuración Básica</h4>
            <p>En la pestaña <strong>Básico</strong> configura:</p>
            <ul>
                <li><strong>Dimensiones de la Sala:</strong>
                    <ul>
                        <li>Ancho (metros)</li>
                        <li>Largo (metros)</li>
                        <li>Altura (metros)</li>
                    </ul>
                </li>
                <li><strong>Sistema de Sonido Principal:</strong>
                    <ul>
                        <li>Modelo de altavoces</li>
                        <li>Cantidad de cajas</li>
                        <li>Configuración (L/R, estéreo, mono)</li>
                    </ul>
                </li>
                <li><strong>Posición del Escenario:</strong>
                    <ul>
                        <li>Ubicación (frente, centro, lateral)</li>
                        <li>Altura del escenario</li>
                    </ul>
                </li>
            </ul>

            <h4>Configuración Avanzada</h4>
            <p>En la pestaña <strong>Avanzado</strong> puedes configurar:</p>
            <ul>
                <li><strong>Propiedades Acústicas:</strong>
                    <ul>
                        <li>Coeficientes de absorción</li>
                        <li>Tiempo de reverberación deseado (RT60)</li>
                        <li>Materiales de paredes/techo/piso</li>
                    </ul>
                </li>
                <li><strong>Torres de Delay:</strong>
                    <ul>
                        <li>Agregar múltiples sistemas de refuerzo</li>
                        <li>Configurar posición y timing</li>
                        <li>Ajustar niveles y ecualización</li>
                    </ul>
                </li>
                <li><strong>Parámetros de Simulación:</strong>
                    <ul>
                        <li>Resolución del cálculo</li>
                        <li>Frecuencias de análisis</li>
                        <li>Criterios de cobertura</li>
                    </ul>
                </li>
            </ul>

            <h3>Uso de Presets</h3>
            <p>LiveSync Pro incluye presets optimizados para diferentes tipos de eventos:</p>

            <h4>Preset Corporativo</h4>
            <ul>
                <li>Optimizado para inteligibilidad de voz</li>
                <li>Reverberación controlada</li>
                <li>Cobertura uniforme</li>
            </ul>

            <h4>Preset Concierto</h4>
            <ul>
                <li>Mayor SPL (nivel de presión sonora)</li>
                <li>Respuesta de bajos extendida</li>
                <li>Optimizado para música en vivo</li>
            </ul>

            <h4>Preset Festival</h4>
            <ul>
                <li>Sistemas de largo alcance</li>
                <li>Múltiples torres de delay</li>
                <li>Cobertura para grandes audiencias</li>
            </ul>

            <h3>Sincronización en la Nube</h3>
            <p>Todos los proyectos se sincronizan automáticamente con Supabase:</p>
            <ul>
                <li><strong>Guardado automático:</strong> Cada cambio se guarda en la nube</li>
                <li><strong>Indicador de estado:</strong> Verifica el estado en el footer</li>
                <li><strong>Trabajo offline:</strong> Los cambios se sincronizan al reconectar</li>
                <li><strong>Versionado:</strong> Se mantiene historial de cambios</li>
            </ul>

            <h3>Colaboración en Equipo</h3>
            <p>Para trabajar en equipo:</p>
            <ol>
                <li>El propietario del proyecto genera un código de invitación</li>
                <li>Los miembros del equipo ingresan el código en "Unirse a Equipo"</li>
                <li>Todos pueden ver y editar el proyecto en tiempo real</li>
                <li>Los cambios se sincronizan automáticamente para todos</li>
            </ol>
        `
    },

    'primer-proyecto': {
        title: 'Crear tu Primer Proyecto Acústico',
        content: `
            <h3>Guía Paso a Paso: Proyecto de Evento Corporativo</h3>

            <h4>Escenario de Ejemplo</h4>
            <p>Vamos a diseñar el sistema de sonido para una conferencia corporativa en un salón de 30m x 20m x 4m de altura.</p>

            <h4>Paso 1: Crear el Proyecto</h4>
            <ol>
                <li>Inicia sesión en LiveSync Pro</li>
                <li>En el Project Hub, haz clic en "+ Nuevo Proyecto"</li>
                <li>Completa los datos:
                    <pre><code>Nombre: Conferencia TechCorp 2026
Tipo: Evento Corporativo
Fecha: 15/02/2026
Cliente: TechCorp Inc.
Venue: Hotel Marriott - Salón Principal</code></pre>
                </li>
                <li>Haz clic en "Crear Proyecto"</li>
            </ol>

            <h4>Paso 2: Configurar la Sala</h4>
            <p>En la sección <strong>Configuración Básica</strong>:</p>
            <ol>
                <li>Dimensiones de la Sala:
                    <ul>
                        <li>Ancho: 30 metros</li>
                        <li>Largo: 20 metros</li>
                        <li>Altura: 4 metros</li>
                    </ul>
                </li>
                <li>Selecciona "Aplicar Preset: Corporativo"</li>
                <li>El sistema configurará automáticamente:
                    <ul>
                        <li>Coeficientes de absorción óptimos</li>
                        <li>Tiempo de reverberación objetivo</li>
                        <li>Parámetros de inteligibilidad</li>
                    </ul>
                </li>
            </ol>

            <h4>Paso 3: Seleccionar el Sistema de Sonido</h4>
            <ol>
                <li>Sistema Principal:
                    <ul>
                        <li>Tipo: Line Array compacto</li>
                        <li>Modelo: JBL VTX A8 (ejemplo)</li>
                        <li>Cantidad: 4 cajas por lado (L/R)</li>
                        <li>Configuración: Estéreo</li>
                    </ul>
                </li>
                <li>Subwoofers:
                    <ul>
                        <li>Modelo: JBL VTX S28</li>
                        <li>Cantidad: 2 unidades</li>
                        <li>Configuración: Cardioide</li>
                    </ul>
                </li>
            </ol>

            <h4>Paso 4: Posicionar el Escenario</h4>
            <ul>
                <li>Ubicación: Frente de la sala</li>
                <li>Altura del escenario: 0.8 metros</li>
                <li>Profundidad del escenario: 5 metros</li>
            </ul>

            <h4>Paso 5: Ejecutar el Cálculo</h4>
            <ol>
                <li>Haz clic en "Calcular Sistema"</li>
                <li>Espera a que la simulación se complete (15-30 segundos)</li>
                <li>El sistema calculará:
                    <ul>
                        <li>Mapas de cobertura SPL</li>
                        <li>Distribución de frecuencias</li>
                        <li>Índice de inteligibilidad (STI)</li>
                        <li>Zonas de delay necesarias</li>
                    </ul>
                </li>
            </ol>

            <h4>Paso 6: Analizar Resultados</h4>
            <p>En la vista de <strong>Resultados</strong> podrás ver:</p>
            <ul>
                <li><strong>Mapa de Cobertura SPL:</strong>
                    <ul>
                        <li>Verde: Cobertura óptima (85-95 dB)</li>
                        <li>Amarillo: Cobertura aceptable (75-85 dB)</li>
                        <li>Rojo: Zonas con problemas</li>
                    </ul>
                </li>
                <li><strong>Índice STI (Inteligibilidad):</strong>
                    <ul>
                        <li>Objetivo: > 0.60 para voz</li>
                        <li>Ideal: > 0.75</li>
                    </ul>
                </li>
                <li><strong>Tiempo de Reverberación:</strong>
                    <ul>
                        <li>Objetivo: 0.6-0.8s para eventos corporativos</li>
                    </ul>
                </li>
            </ul>

            <h4>Paso 7: Optimizar el Diseño</h4>
            <p>Si los resultados no son óptimos:</p>
            <ol>
                <li><strong>Agregar Torres de Delay:</strong>
                    <ul>
                        <li>Haz clic en "+ Agregar Torre de Delay"</li>
                        <li>Posiciona en zonas con baja cobertura</li>
                        <li>Ajusta el timing (delay time)</li>
                        <li>Recalcula el sistema</li>
                    </ul>
                </li>
                <li><strong>Ajustar Parámetros Acústicos:</strong>
                    <ul>
                        <li>Modifica coeficientes de absorción</li>
                        <li>Ajusta materiales de superficie</li>
                        <li>Cambia tratamiento acústico</li>
                    </ul>
                </li>
                <li><strong>Modificar Sistema de Sonido:</strong>
                    <ul>
                        <li>Cambia modelo de altavoces</li>
                        <li>Ajusta cantidad de cajas</li>
                        <li>Modifica ángulos de apertura</li>
                    </ul>
                </li>
            </ol>

            <h4>Paso 8: Generar Documentación</h4>
            <p>Una vez satisfecho con el diseño:</p>
            <ol>
                <li><strong>Reporte PDF:</strong>
                    <ul>
                        <li>Haz clic en "Generar Reporte PDF"</li>
                        <li>Incluye mapas de cobertura, especificaciones, lista de equipos</li>
                        <li>Presenta al cliente o equipo técnico</li>
                    </ul>
                </li>
                <li><strong>Archivo DXF:</strong>
                    <ul>
                        <li>Exporta planos para AutoCAD</li>
                        <li>Incluye posiciones exactas de equipos</li>
                        <li>Útil para coordinación con montajistas</li>
                    </ul>
                </li>
                <li><strong>Copiar al Portapapeles:</strong>
                    <ul>
                        <li>Copia especificaciones técnicas</li>
                        <li>Pega en cotizaciones o propuestas</li>
                    </ul>
                </li>
            </ol>

            <h3>Mejores Prácticas</h3>
            <ul>
                <li>Siempre comienza con un preset apropiado</li>
                <li>Verifica dimensiones de la sala con planos reales</li>
                <li>Considera el tipo de contenido (voz vs. música)</li>
                <li>Ten en cuenta la ocupación del espacio (audiencia absorbe sonido)</li>
                <li>Valida resultados con mediciones en sitio cuando sea posible</li>
                <li>Guarda múltiples versiones del diseño para comparar</li>
            </ul>
        `
    },

    'sincronizacion-basica': {
        title: 'Sincronización y Gestión de Proyectos',
        content: `
            <h3>Sistema de Sincronización en la Nube</h3>
            <p>LiveSync Pro utiliza Supabase para sincronizar automáticamente todos tus proyectos en la nube.</p>

            <h4>Cómo Funciona</h4>
            <ul>
                <li><strong>Guardado Automático:</strong> Cada cambio se guarda automáticamente en la nube</li>
                <li><strong>Sincronización en Tiempo Real:</strong> Los cambios se sincronizan con otros dispositivos en segundos</li>
                <li><strong>Trabajo Offline:</strong> Puedes trabajar sin conexión y sincronizar al reconectar</li>
                <li><strong>Historial de Versiones:</strong> Se mantiene un registro de cambios</li>
            </ul>

            <h3>Indicador de Estado de Sincronización</h3>
            <p>En el footer de la aplicación verás el estado de sincronización:</p>
            <ul>
                <li>✅ <strong>Sincronizado:</strong> Todos los cambios están en la nube</li>
                <li>🔄 <strong>Sincronizando:</strong> Guardando cambios</li>
                <li>⚠️ <strong>Sin Conexión:</strong> Trabajando offline</li>
                <li>❌ <strong>Error:</strong> Problema de sincronización</li>
            </ul>

            <h3>Gestión de Proyectos</h3>

            <h4>Project Hub</h4>
            <p>El Project Hub es tu centro de control para todos los proyectos:</p>
            <ul>
                <li><strong>Ver Todos los Proyectos:</strong> Lista completa con vista previa</li>
                <li><strong>Buscar Proyectos:</strong> Filtrar por nombre, fecha o tipo</li>
                <li><strong>Crear Nuevo:</strong> Iniciar proyecto desde cero o template</li>
                <li><strong>Duplicar Proyecto:</strong> Crear copia para reutilizar configuraciones</li>
                <li><strong>Eliminar Proyecto:</strong> Borrar proyectos completados</li>
            </ul>

            <h4>Organización de Proyectos</h4>
            <p>Mantén tus proyectos organizados:</p>
            <ol>
                <li><strong>Nombre Descriptivo:</strong>
                    <pre><code>Formato recomendado:
[Cliente] - [Tipo de Evento] - [Fecha]
Ejemplo: TechCorp - Conferencia Anual - Feb 2026</code></pre>
                </li>
                <li><strong>Categorización:</strong>
                    <ul>
                        <li>Corporativo</li>
                        <li>Concierto</li>
                        <li>Festival</li>
                        <li>Teatro</li>
                        <li>Instalación permanente</li>
                        <li>Otro</li>
                    </ul>
                </li>
                <li><strong>Etiquetas de Estado:</strong>
                    <ul>
                        <li>En diseño</li>
                        <li>Aprobado</li>
                        <li>En producción</li>
                        <li>Completado</li>
                        <li>Archivado</li>
                    </ul>
                </li>
            </ol>

            <h3>Colaboración Multi-Usuario</h3>

            <h4>Crear Código de Equipo</h4>
            <ol>
                <li>Abre tu proyecto</li>
                <li>Haz clic en "Configuración de Equipo"</li>
                <li>Genera un código de invitación único</li>
                <li>Comparte el código con tu equipo</li>
                <li>El código expira en 24 horas por seguridad</li>
            </ol>

            <h4>Unirse a un Proyecto</h4>
            <ol>
                <li>En la pantalla de acceso, selecciona "Código de Equipo"</li>
                <li>Ingresa el código de 8 caracteres</li>
                <li>Accede al proyecto compartido</li>
                <li>Todos los cambios se sincronizan en tiempo real</li>
            </ol>

            <h4>Gestión de Permisos</h4>
            <ul>
                <li><strong>Propietario:</strong> Control total, puede eliminar proyecto</li>
                <li><strong>Editor:</strong> Puede modificar configuraciones y cálculos</li>
                <li><strong>Visualizador:</strong> Solo puede ver, no editar</li>
            </ul>

            <h3>Trabajo Offline</h3>
            <p>LiveSync Pro funciona sin conexión a internet:</p>
            <ul>
                <li>Todos los cálculos se realizan localmente</li>
                <li>Los cambios se guardan en el almacenamiento local</li>
                <li>Al reconectar, los cambios se sincronizan automáticamente</li>
                <li>Si hay conflictos, se prioriza la versión más reciente</li>
            </ul>

            <h3>Respaldo y Exportación</h3>

            <h4>Exportar Proyecto</h4>
            <pre><code>Formatos disponibles:
- JSON: Datos completos del proyecto
- PDF: Reporte visual con resultados
- DXF: Planos para AutoCAD
- CSV: Datos tabulados para análisis</code></pre>

            <h4>Importar Proyecto</h4>
            <ol>
                <li>En Project Hub, haz clic en "Importar"</li>
                <li>Selecciona archivo JSON exportado previamente</li>
                <li>El proyecto se restaura con todas sus configuraciones</li>
            </ol>

            <h3>Solución de Problemas</h3>

            <h4>Error: "No se pudo sincronizar"</h4>
            <p><strong>Causas:</strong></p>
            <ul>
                <li>Sin conexión a internet</li>
                <li>Problemas con Supabase</li>
                <li>Credenciales expiradas</li>
            </ul>
            <p><strong>Solución:</strong></p>
            <ol>
                <li>Verifica tu conexión a internet</li>
                <li>Refresca la aplicación (F5)</li>
                <li>Verifica el estado de Supabase</li>
                <li>Si persiste, exporta el proyecto como respaldo</li>
            </ol>

            <h4>Conflictos de Sincronización</h4>
            <p>Si múltiples usuarios editan simultáneamente:</p>
            <ul>
                <li>La aplicación detecta automáticamente los conflictos</li>
                <li>Se prioriza el cambio más reciente</li>
                <li>Se notifica a los usuarios afectados</li>
                <li>Recomendación: Coordinar ediciones en equipo</li>
            </ul>
        `
    },

    'problemas-conexion': {
        title: 'Solución de Problemas de Conexión',
        content: `
            <h3>Diagnóstico de Problemas de Conexión</h3>

            <h4>Verificar Estado de la Aplicación</h4>
            <p>Antes de diagnosticar, verifica:</p>
            <ul>
                <li>Estado de sincronización en el footer de la aplicación</li>
                <li>Mensajes de error en la consola del navegador (F12)</li>
                <li>Indicadores visuales de conexión</li>
            </ul>

            <h3>Problemas con Supabase</h3>

            <h4>Error: "Error al conectar con Supabase"</h4>
            <p><strong>Verificaciones:</strong></p>
            <ol>
                <li><strong>Variables de Entorno:</strong>
                    <pre><code># Verifica en .env.local
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon</code></pre>
                </li>
                <li><strong>Prefijo VITE_:</strong>
                    <ul>
                        <li>En Vite, las variables deben comenzar con VITE_</li>
                        <li>Sin el prefijo, no serán accesibles en el cliente</li>
                    </ul>
                </li>
                <li><strong>Reiniciar Servidor:</strong>
                    <pre><code># Detén el servidor (Ctrl+C)
# Inicia nuevamente
npm run dev</code></pre>
                </li>
            </ol>

            <h4>Error: "Invalid API Key"</h4>
            <p><strong>Solución:</strong></p>
            <ol>
                <li>Ve a <a href="https://app.supabase.com" target="_blank">Supabase Dashboard</a></li>
                <li>Selecciona tu proyecto</li>
                <li>Ve a Settings > API</li>
                <li>Copia la clave "anon/public" (no la "service_role")</li>
                <li>Actualiza VITE_SUPABASE_ANON_KEY en .env.local</li>
                <li>Reinicia el servidor de desarrollo</li>
            </ol>

            <h3>Problemas con la API de Gemini</h3>

            <h4>Error: "Gemini API Key no configurada"</h4>
            <p><strong>Pasos:</strong></p>
            <ol>
                <li>Obtén tu API Key de <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></li>
                <li>Agrega a .env.local:
                    <pre><code>GEMINI_API_KEY=tu-clave-api-gemini</code></pre>
                </li>
                <li>Reinicia el servidor</li>
            </ol>

            <h4>Error de Cuota Excedida</h4>
            <p>Si recibes errores de cuota:</p>
            <ul>
                <li>Verifica tu uso en Google AI Studio</li>
                <li>Considera actualizar tu plan</li>
                <li>Optimiza las llamadas a la API</li>
            </ul>

            <h3>Problemas de Red y Firewall</h3>

            <h4>Firewall Corporativo</h4>
            <p>Si estás en una red corporativa:</p>
            <ol>
                <li><strong>Dominios a permitir:</strong>
                    <ul>
                        <li>*.supabase.co</li>
                        <li>generativelanguage.googleapis.com</li>
                        <li>ai.studio (si usas la versión alojada)</li>
                    </ul>
                </li>
                <li><strong>Puertos necesarios:</strong>
                    <ul>
                        <li>443 (HTTPS)</li>
                        <li>5173 (desarrollo local)</li>
                    </ul>
                </li>
            </ol>

            <h4>Proxy Corporativo</h4>
            <p>Si necesitas configurar un proxy:</p>
            <pre><code># En tu sistema operativo
export HTTP_PROXY=http://proxy.empresa.com:8080
export HTTPS_PROXY=http://proxy.empresa.com:8080

# Luego ejecuta
npm run dev</code></pre>

            <h3>Problemas del Navegador</h3>

            <h4>CORS (Cross-Origin Resource Sharing)</h4>
            <p>Si ves errores de CORS:</p>
            <ul>
                <li>Verifica que la URL de Supabase sea correcta</li>
                <li>Asegúrate de que el dominio esté autorizado en Supabase</li>
                <li>En desarrollo local, debería funcionar sin problemas</li>
            </ul>

            <h4>LocalStorage Deshabilitado</h4>
            <p>LiveSync Pro usa LocalStorage para caché:</p>
            <ol>
                <li>Verifica que tu navegador permita cookies y almacenamiento</li>
                <li>Modo incógnito puede causar problemas</li>
                <li>Extensiones de privacidad pueden bloquear almacenamiento</li>
            </ol>

            <h3>Problemas de Rendimiento</h3>

            <h4>Carga Lenta de la Aplicación</h4>
            <p><strong>Soluciones:</strong></p>
            <ul>
                <li>Limpia caché del navegador (Ctrl+Shift+Del)</li>
                <li>Verifica tu conexión a internet</li>
                <li>Cierra otras pestañas que consuman recursos</li>
                <li>Usa un navegador moderno actualizado</li>
            </ul>

            <h4>Cálculos Acústicos Lentos</h4>
            <p>Si las simulaciones tardan mucho:</p>
            <ul>
                <li>Reduce la resolución de cálculo en configuración avanzada</li>
                <li>Limita el número de frecuencias analizadas</li>
                <li>Cierra otras aplicaciones pesadas</li>
                <li>Considera usar un equipo con más RAM</li>
            </ul>

            <h3>Herramientas de Diagnóstico</h3>

            <h4>Consola del Desarrollador</h4>
            <pre><code>1. Presiona F12 en tu navegador
2. Ve a la pestaña "Console"
3. Busca mensajes de error en rojo
4. Copia el mensaje completo para reportarlo</code></pre>

            <h4>Network Tab</h4>
            <pre><code>1. F12 > Network
2. Recarga la página (F5)
3. Verifica peticiones fallidas (en rojo)
4. Comprueba tiempos de respuesta</code></pre>

            <h4>Verificar Conexión con Supabase</h4>
            <pre><code>// En la consola del navegador
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
// Debería mostrar tu URL de Supabase</code></pre>

            <h3>Modo Debug</h3>
            <p>Para habilitar logging detallado:</p>
            <ol>
                <li>Abre la aplicación</li>
                <li>Presiona F12 para abrir DevTools</li>
                <li>Los logs de sincronización aparecerán en el footer</li>
                <li>Información detallada en la consola</li>
            </ol>

            <h3>Contactar Soporte</h3>
            <p>Si los problemas persisten, contacta a soporte con:</p>
            <ul>
                <li>Captura de pantalla del error</li>
                <li>Logs de la consola (F12 > Console)</li>
                <li>Versión del navegador</li>
                <li>Sistema operativo</li>
                <li>Pasos para reproducir el problema</li>
            </ul>
        `
    },

    'configuracion-avanzada': {
        title: 'Configuración Avanzada de Simulaciones Acústicas',
        content: `
            <h3>Parámetros Acústicos Avanzados</h3>

            <h4>Coeficientes de Absorción</h4>
            <p>Los coeficientes de absorción determinan cuánta energía sonora absorben las superficies:</p>

            <table border="1" style="width:100%; border-collapse: collapse; margin: 1rem 0;">
                <tr>
                    <th>Material</th>
                    <th>125 Hz</th>
                    <th>250 Hz</th>
                    <th>500 Hz</th>
                    <th>1 kHz</th>
                    <th>2 kHz</th>
                    <th>4 kHz</th>
                </tr>
                <tr>
                    <td>Concreto</td>
                    <td>0.01</td>
                    <td>0.01</td>
                    <td>0.02</td>
                    <td>0.02</td>
                    <td>0.02</td>
                    <td>0.03</td>
                </tr>
                <tr>
                    <td>Madera</td>
                    <td>0.15</td>
                    <td>0.11</td>
                    <td>0.10</td>
                    <td>0.07</td>
                    <td>0.06</td>
                    <td>0.07</td>
                </tr>
                <tr>
                    <td>Alfombra</td>
                    <td>0.08</td>
                    <td>0.24</td>
                    <td>0.57</td>
                    <td>0.69</td>
                    <td>0.71</td>
                    <td>0.73</td>
                </tr>
                <tr>
                    <td>Cortinas</td>
                    <td>0.05</td>
                    <td>0.12</td>
                    <td>0.35</td>
                    <td>0.45</td>
                    <td>0.38</td>
                    <td>0.36</td>
                </tr>
                <tr>
                    <td>Audiencia</td>
                    <td>0.60</td>
                    <td>0.74</td>
                    <td>0.88</td>
                    <td>0.96</td>
                    <td>0.93</td>
                    <td>0.85</td>
                </tr>
            </table>

            <h4>Tiempo de Reverberación (RT60)</h4>
            <p>Objetivos recomendados según tipo de evento:</p>
            <ul>
                <li><strong>Palabra hablada (conferencias):</strong> 0.6 - 0.8 segundos</li>
                <li><strong>Música amplificada:</strong> 0.8 - 1.2 segundos</li>
                <li><strong>Música clásica:</strong> 1.5 - 2.0 segundos</li>
                <li><strong>Teatro:</strong> 1.0 - 1.4 segundos</li>
            </ul>

            <p><strong>Fórmula de Sabine:</strong></p>
            <pre><code>RT60 = 0.161 × V / A

Donde:
V = Volumen de la sala (m³)
A = Absorción total (m² Sabine)
A = Σ(Si × αi)
Si = Área de superficie i
αi = Coeficiente de absorción</code></pre>

            <h3>Torres de Delay (Fill Speakers)</h3>

            <h4>Cuándo Usar Torres de Delay</h4>
            <ul>
                <li>Salas largas (>30m de profundidad)</li>
                <li>Zonas con obstáculos arquitectónicos</li>
                <li>Áreas de baja cobertura del sistema principal</li>
                <li>Balcones o niveles elevados</li>
            </ul>

            <h4>Cálculo del Delay Time</h4>
            <p><strong>Fórmula:</strong></p>
            <pre><code>Delay (ms) = Distancia (m) / 343 m/s × 1000

Ejemplo:
Torre de delay a 20m del sistema principal:
Delay = 20 / 343 × 1000 = 58.3 ms</code></pre>

            <p><strong>En LiveSync Pro:</strong></p>
            <ol>
                <li>Haz clic en "+ Agregar Torre de Delay"</li>
                <li>Posiciona en el mapa de la sala</li>
                <li>El sistema calcula automáticamente el delay óptimo</li>
                <li>Ajusta manualmente si es necesario</li>
            </ol>

            <h4>Niveles de Delay</h4>
            <p>El nivel de SPL del delay debe ser:</p>
            <ul>
                <li>6-10 dB más alto que el sistema principal en su zona</li>
                <li>Evitar suma excesiva (comb filtering)</li>
                <li>Mantener coherencia temporal</li>
            </ul>

            <h3>Parámetros de Calidad de Audio</h3>

            <h4>Índice de Transmisión del Habla (STI)</h4>
            <p>Mide la inteligibilidad del habla (0.0 a 1.0):</p>
            <ul>
                <li><strong>0.00 - 0.30:</strong> Mala (inaceptable)</li>
                <li><strong>0.30 - 0.45:</strong> Pobre</li>
                <li><strong>0.45 - 0.60:</strong> Razonable</li>
                <li><strong>0.60 - 0.75:</strong> Buena</li>
                <li><strong>0.75 - 1.00:</strong> Excelente</li>
            </ul>

            <h4>Niveles de Presión Sonora (SPL)</h4>
            <p>Objetivos por tipo de evento:</p>
            <table border="1" style="width:100%; border-collapse: collapse; margin: 1rem 0;">
                <tr>
                    <th>Tipo de Evento</th>
                    <th>SPL Objetivo (dB)</th>
                    <th>SPL Máximo (dB)</th>
                </tr>
                <tr>
                    <td>Conferencia/Corporativo</td>
                    <td>75-85</td>
                    <td>90</td>
                </tr>
                <tr>
                    <td>Teatro</td>
                    <td>80-90</td>
                    <td>95</td>
                </tr>
                <tr>
                    <td>Concierto (amplificado)</td>
                    <td>95-105</td>
                    <td>110</td>
                </tr>
                <tr>
                    <td>Festival/Arena</td>
                    <td>100-110</td>
                    <td>115</td>
                </tr>
            </table>

            <h3>Resolución de Simulación</h3>

            <h4>Configurar Resolución del Cálculo</h4>
            <p>En Configuración Avanzada > Parámetros de Simulación:</p>
            <ul>
                <li><strong>Baja (0.5m):</strong> Cálculo rápido, menos precisión</li>
                <li><strong>Media (0.25m):</strong> Balance rendimiento/precisión (recomendado)</li>
                <li><strong>Alta (0.125m):</strong> Máxima precisión, cálculo lento</li>
            </ul>

            <h4>Frecuencias de Análisis</h4>
            <p>Bandas de octava estándar:</p>
            <ul>
                <li>63 Hz, 125 Hz, 250 Hz (graves)</li>
                <li>500 Hz, 1 kHz, 2 kHz (medios)</li>
                <li>4 kHz, 8 kHz, 16 kHz (agudos)</li>
            </ul>

            <h3>Visualización 3D</h3>

            <h4>Activar Vista 3D</h4>
            <ol>
                <li>En la vista de resultados, haz clic en "Ver en 3D"</li>
                <li>La aplicación renderiza usando Three.js</li>
                <li>Navega con el mouse:
                    <ul>
                        <li>Click + arrastrar: Rotar</li>
                        <li>Scroll: Zoom</li>
                        <li>Click derecho + arrastrar: Pan</li>
                    </ul>
                </li>
            </ol>

            <h4>Capas Visualizables</h4>
            <ul>
                <li>Mapa de SPL (código de colores)</li>
                <li>Rayos de sonido (trazado de rayos)</li>
                <li>Zonas de cobertura</li>
                <li>Posiciones de altavoces</li>
                <li>Arquitectura de la sala</li>
            </ul>

            <h3>Exportación de Datos</h3>

            <h4>Formato DXF para CAD</h4>
            <p>Incluye:</p>
            <ul>
                <li>Planta de la sala con dimensiones exactas</li>
                <li>Posiciones de altavoces (coordenadas XYZ)</li>
                <li>Zonas de cobertura</li>
                <li>Referencias de montaje</li>
            </ul>

            <h4>Reporte PDF Completo</h4>
            <p>Secciones del reporte:</p>
            <ol>
                <li><strong>Portada:</strong> Información del proyecto</li>
                <li><strong>Especificaciones Técnicas:</strong>
                    <ul>
                        <li>Dimensiones de la sala</li>
                        <li>Parámetros acústicos</li>
                        <li>Lista de equipos</li>
                    </ul>
                </li>
                <li><strong>Mapas de Cobertura:</strong>
                    <ul>
                        <li>SPL por frecuencia</li>
                        <li>Índice STI</li>
                        <li>Distribución de delay</li>
                    </ul>
                </li>
                <li><strong>Análisis:</strong>
                    <ul>
                        <li>Gráficas de respuesta</li>
                        <li>Estadísticas de cobertura</li>
                        <li>Recomendaciones</li>
                    </ul>
                </li>
            </ol>

            <h3>Integración con IA (Gemini)</h3>

            <h4>Asistente de Optimización</h4>
            <p>LiveSync Pro usa Google Gemini para:</p>
            <ul>
                <li>Sugerir configuraciones óptimas</li>
                <li>Detectar problemas acústicos</li>
                <li>Recomendar posiciones de equipos</li>
                <li>Generar explicaciones técnicas</li>
            </ul>

            <h4>Activar Asistente IA</h4>
            <ol>
                <li>Configura GEMINI_API_KEY en .env.local</li>
                <li>En la aplicación, haz clic en el ícono de IA</li>
                <li>Haz preguntas sobre tu diseño</li>
                <li>Recibe recomendaciones personalizadas</li>
            </ol>
        `
    },

    'testing-debugging': {
        title: 'Testing y Debugging',
        content: `
            <h3>Suite de Pruebas</h3>

            <h4>Ejecutar Pruebas</h4>
            <p>LiveSync Pro utiliza Vitest para testing:</p>

            <pre><code># Ejecutar todas las pruebas
npm run test

# Modo watch (re-ejecuta al cambiar código)
npm run test:watch

# Interfaz gráfica de pruebas
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar una sola vez (CI/CD)
npm run test:run</code></pre>

            <h4>Cobertura de Código</h4>
            <p>Después de ejecutar <code>npm run test:coverage</code>:</p>
            <ul>
                <li>Se genera carpeta <code>coverage/</code></li>
                <li>Abre <code>coverage/index.html</code> en navegador</li>
                <li>Visualiza qué código está cubierto por pruebas</li>
            </ul>

            <h3>Debugging en el Navegador</h3>

            <h4>Chrome DevTools</h4>
            <ol>
                <li>Presiona F12 para abrir DevTools</li>
                <li><strong>Console:</strong> Ver logs y errores</li>
                <li><strong>Sources:</strong> Establecer breakpoints</li>
                <li><strong>Network:</strong> Monitorear peticiones</li>
                <li><strong>Application:</strong> Ver LocalStorage y caché</li>
            </ol>

            <h4>Breakpoints en Código</h4>
            <pre><code>// En cualquier parte del código
debugger;

// La ejecución se pausará aquí si DevTools está abierto</code></pre>

            <h4>Logs Útiles</h4>
            <pre><code>// Log simple
console.log('Valor:', variable);

// Log con tabla (para objetos)
console.table(arrayDeObjetos);

// Log con tiempo
console.time('operacion');
// ... código ...
console.timeEnd('operacion');

// Log condicional
console.assert(valor > 0, 'El valor debe ser positivo');</code></pre>

            <h3>Debugging de Cálculos Acústicos</h3>

            <h4>Verificar Parámetros de Entrada</h4>
            <pre><code>// Antes de calcular
console.log('Parámetros:', {
  dimensiones: {ancho, largo, altura},
  absorcion: coeficientes,
  sistema: equipoSeleccionado
});</code></pre>

            <h4>Inspeccionar Resultados</h4>
            <pre><code>// Después del cálculo
console.log('Resultados:', {
  spl: mapaDeCobertura,
  sti: indiceInteligibilidad,
  rt60: tiempoReverberacion
});</code></pre>

            <h3>Debugging de Sincronización</h3>

            <h4>Monitor de Estado Supabase</h4>
            <p>En el footer de la aplicación:</p>
            <ul>
                <li>Verde: Conectado y sincronizado</li>
                <li>Amarillo: Sincronizando</li>
                <li>Rojo: Error de conexión</li>
            </ul>

            <h4>Logs de Sincronización</h4>
            <pre><code>// Ver en consola
// Los logs de sync aparecen automáticamente

// Formato típico:
// [Sync] Guardando proyecto: nombre-proyecto
// [Sync] ✓ Proyecto guardado exitosamente
// [Sync] ✗ Error al guardar: mensaje-error</code></pre>

            <h3>Solución de Problemas Comunes</h3>

            <h4>Error: "Cannot read property of undefined"</h4>
            <p><strong>Causa:</strong> Intentar acceder a propiedad de objeto nulo/undefined</p>
            <p><strong>Solución:</strong></p>
            <pre><code>// Mal
const nombre = usuario.nombre;

// Bien (optional chaining)
const nombre = usuario?.nombre;

// O con valor por defecto
const nombre = usuario?.nombre || 'Sin nombre';</code></pre>

            <h4>Error: "State update on unmounted component"</h4>
            <p><strong>Causa:</strong> Actualizar estado después de desmontar componente</p>
            <p><strong>Solución:</strong></p>
            <pre><code>useEffect(() => {
  let isMounted = true;

  fetchData().then(data => {
    if (isMounted) {
      setData(data);
    }
  });

  return () => {
    isMounted = false;
  };
}, []);</code></pre>

            <h4>Cálculos Incorrectos</h4>
            <p><strong>Verificar:</strong></p>
            <ol>
                <li>Unidades de medida (metros vs pies)</li>
                <li>Conversiones numéricas (string a number)</li>
                <li>Límites de valores (min/max)</li>
                <li>Precisión decimal (usar .toFixed() para mostrar)</li>
            </ol>

            <h3>Profiling de Rendimiento</h3>

            <h4>React DevTools Profiler</h4>
            <ol>
                <li>Instala React DevTools en tu navegador</li>
                <li>Abre DevTools > Profiler</li>
                <li>Haz clic en Record</li>
                <li>Interactúa con la aplicación</li>
                <li>Detén el recording</li>
                <li>Analiza qué componentes renderizan lento</li>
            </ol>

            <h4>Performance API</h4>
            <pre><code>// Medir tiempo de operación
const start = performance.now();
realizarCalculo();
const end = performance.now();
console.log(\`Tiempo: \${end - start}ms\`);</code></pre>

            <h3>Reportar Bugs</h3>

            <h4>Información Necesaria</h4>
            <p>Al reportar un bug, incluye:</p>
            <ol>
                <li><strong>Descripción:</strong> Qué esperabas vs qué ocurrió</li>
                <li><strong>Pasos para reproducir:</strong>
                    <pre><code>1. Abrir proyecto X
2. Cambiar parámetro Y a valor Z
3. Hacer clic en calcular
4. Ver error</code></pre>
                </li>
                <li><strong>Entorno:</strong>
                    <ul>
                        <li>Navegador y versión</li>
                        <li>Sistema operativo</li>
                        <li>Versión de LiveSync Pro</li>
                    </ul>
                </li>
                <li><strong>Logs de error:</strong>
                    <ul>
                        <li>Captura de consola (F12)</li>
                        <li>Captura de pantalla</li>
                        <li>Datos del proyecto (si es relevante)</li>
                    </ul>
                </li>
            </ol>

            <h4>Template de Reporte</h4>
            <pre><code>## Descripción del Bug
[Descripción breve]

## Pasos para Reproducir
1.
2.
3.

## Comportamiento Esperado
[Qué debería ocurrir]

## Comportamiento Actual
[Qué ocurre realmente]

## Entorno
- Navegador:
- OS:
- Versión LiveSync Pro:

## Logs/Capturas
[Pegar logs o adjuntar capturas]</code></pre>
        `
    },

    'api-docs': {
        title: 'Estructura del Código y API Interna',
        content: `
            <h3>Arquitectura de la Aplicación</h3>

            <h4>Stack Tecnológico</h4>
            <ul>
                <li><strong>Frontend:</strong> React 18.3.1 + TypeScript</li>
                <li><strong>Build Tool:</strong> Vite</li>
                <li><strong>Backend/DB:</strong> Supabase</li>
                <li><strong>IA:</strong> Google Gemini API</li>
                <li><strong>3D Graphics:</strong> Three.js</li>
                <li><strong>Charts:</strong> Recharts</li>
                <li><strong>PDF:</strong> jsPDF + autotable</li>
                <li><strong>Testing:</strong> Vitest + React Testing Library</li>
            </ul>

            <h4>Estructura de Carpetas</h4>
            <pre><code>LiveSync-Pro/
├── components/          # Componentes React
│   ├── AppHeader.tsx
│   ├── ConfigurationView.tsx
│   ├── ResultsView.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useProjects.ts
│   ├── useCalculations.ts
│   └── ...
├── services/           # Lógica de negocio
│   ├── supabase.ts
│   ├── acoustics.ts
│   ├── gemini.ts
│   └── ...
├── lib/                # Utilidades y helpers
│   ├── calculations.ts
│   ├── export.ts
│   └── ...
├── utils/              # Funciones auxiliares
│   └── ...
├── tests/              # Pruebas unitarias
│   └── ...
├── App.tsx             # Componente raíz
├── index.tsx           # Entry point
├── types.ts            # Type definitions
└── constants.ts        # Constantes de la app</code></pre>

            <h3>Componentes Principales</h3>

            <h4>App.tsx</h4>
            <p>Componente raíz que gestiona:</p>
            <pre><code>interface AppState {
  view: 'landing' | 'login' | 'checking' | 'locked' | 'app';
  currentProject: Project | null;
  user: User | null;
  showHelp: boolean;
  show3D: boolean;
}</code></pre>

            <h4>ConfigurationView.tsx</h4>
            <p>Editor de parámetros del proyecto:</p>
            <pre><code>interface ConfigurationViewProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
  onCalculate: () => void;
}</code></pre>

            <h4>ResultsView.tsx</h4>
            <p>Visualización de resultados:</p>
            <pre><code>interface ResultsViewProps {
  results: CalculationResults;
  project: Project;
  onExportPDF: () => void;
  onExportDXF: () => void;
  onShow3D: () => void;
}</code></pre>

            <h3>Tipos TypeScript Principales</h3>

            <h4>Project</h4>
            <pre><code>interface Project {
  id: string;
  name: string;
  client?: string;
  venue?: string;
  eventDate?: Date;
  eventType: 'corporate' | 'concert' | 'festival' | 'theater' | 'other';

  // Dimensiones
  roomWidth: number;
  roomLength: number;
  roomHeight: number;

  // Sistema de sonido
  mainSystem: SoundSystem;
  delayTowers: DelayTower[];

  // Acústica
  absorptionCoefficients: AbsorptionData;
  targetRT60: number;

  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}</code></pre>

            <h4>SoundSystem</h4>
            <pre><code>interface SoundSystem {
  model: string;
  manufacturer: string;
  quantity: number;
  configuration: 'stereo' | 'mono' | 'lcr';
  position: Position3D;
  angle: {
    horizontal: number;
    vertical: number;
  };
  spl: number; // @ 1m
  coverage: {
    horizontal: number;
    vertical: number;
  };
}</code></pre>

            <h4>CalculationResults</h4>
            <pre><code>interface CalculationResults {
  spl: {
    map: number[][]; // Matriz 2D de SPL
    max: number;
    min: number;
    average: number;
  };
  sti: {
    map: number[][];
    average: number;
  };
  rt60: {
    measured: number;
    target: number;
    perFrequency: Record<number, number>;
  };
  coverage: {
    excellent: number; // % de área
    good: number;
    fair: number;
    poor: number;
  };
}</code></pre>

            <h3>Servicios</h3>

            <h4>Supabase Service</h4>
            <pre><code>// services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const projectsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    return { data, error };
  },

  async create(project: Project) {
    const { data, error } = await supabase
      .from('projects')
      .insert(project);
    return { data, error };
  },

  async update(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id);
    return { data, error };
  },

  async delete(id: string) {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    return { data, error };
  }
};</code></pre>

            <h4>Acoustics Service</h4>
            <pre><code>// services/acoustics.ts
export const acousticsService = {
  calculateSPL(
    system: SoundSystem,
    roomDimensions: Dimensions,
    resolution: number
  ): number[][] {
    // Implementación del cálculo de SPL
    // Usa ecuaciones de propagación sonora
    // Considera atenuación por distancia
    // Aplica directividad del altavoz
  },

  calculateSTI(
    splMap: number[][],
    rt60: number,
    backgroundNoise: number
  ): number[][] {
    // Cálculo del índice STI
    // Basado en modulación de transferencia
  },

  calculateRT60(
    volume: number,
    surfaceAreas: SurfaceArea[],
    absorptionCoefficients: AbsorptionData
  ): number {
    // Fórmula de Sabine
    const totalAbsorption = surfaceAreas.reduce((sum, surface) => {
      return sum + (surface.area * absorptionCoefficients[surface.material]);
    }, 0);

    return 0.161 * volume / totalAbsorption;
  }
};</code></pre>

            <h4>Gemini Service</h4>
            <pre><code>// services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(
  import.meta.env.GEMINI_API_KEY
);

export const geminiService = {
  async optimize(project: Project): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = \`
      Analiza este diseño acústico y sugiere optimizaciones:
      - Sala: \${project.roomWidth}x\${project.roomLength}x\${project.roomHeight}m
      - Sistema: \${project.mainSystem.model}
      - Tipo de evento: \${project.eventType}

      Proporciona recomendaciones específicas.
    \`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  },

  async explain(concept: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(
      \`Explica el concepto de \${concept} en diseño acústico.\`
    );
    return result.response.text();
  }
};</code></pre>

            <h3>Custom Hooks</h3>

            <h4>useProjects</h4>
            <pre><code>// hooks/useProjects.ts
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const { data, error } = await projectsService.getAll();
      if (error) throw error;
      setProjects(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function createProject(project: Partial<Project>) {
    const { data, error } = await projectsService.create(project);
    if (!error) {
      setProjects([...projects, data]);
    }
    return { data, error };
  }

  async function updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await projectsService.update(id, updates);
    if (!error) {
      setProjects(projects.map(p => p.id === id ? {...p, ...updates} : p));
    }
    return { data, error };
  }

  async function deleteProject(id: string) {
    const { error } = await projectsService.delete(id);
    if (!error) {
      setProjects(projects.filter(p => p.id !== id));
    }
    return { error };
  }

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    reload: loadProjects
  };
}</code></pre>

            <h3>Constantes</h3>

            <h4>constants.ts</h4>
            <pre><code>// Presets de eventos
export const EVENT_PRESETS = {
  corporate: {
    targetRT60: 0.7,
    targetSTI: 0.75,
    targetSPL: 85,
    absorptionProfile: 'high'
  },
  concert: {
    targetRT60: 1.0,
    targetSTI: 0.60,
    targetSPL: 102,
    absorptionProfile: 'medium'
  },
  festival: {
    targetRT60: 0.8,
    targetSTI: 0.65,
    targetSPL: 108,
    absorptionProfile: 'low'
  }
};

// Materiales comunes
export const MATERIALS = {
  concrete: {
    name: 'Concreto',
    absorption: {
      125: 0.01, 250: 0.01, 500: 0.02,
      1000: 0.02, 2000: 0.02, 4000: 0.03
    }
  },
  // ... más materiales
};

// Modelos de altavoces
export const SPEAKER_MODELS = [
  {
    manufacturer: 'JBL',
    model: 'VTX A8',
    type: 'line-array',
    spl: 136,
    coverage: { h: 110, v: 10 }
  },
  // ... más modelos
];</code></pre>
        `
    }
};
