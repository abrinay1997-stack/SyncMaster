// Base de Conocimientos para LiveSync Pro
const KNOWLEDGE_BASE = {
    'instalacion': {
        title: 'Instalación de LiveSync Pro',
        content: `
            <h3>Requisitos del Sistema</h3>
            <ul>
                <li><strong>Windows:</strong> Windows 10 (64-bit) o superior</li>
                <li><strong>macOS:</strong> macOS 10.15 (Catalina) o superior</li>
                <li><strong>Linux:</strong> Ubuntu 20.04+, Debian 10+, Fedora 33+</li>
                <li><strong>RAM:</strong> Mínimo 4GB, recomendado 8GB</li>
                <li><strong>Espacio en disco:</strong> 500MB para la aplicación + espacio para archivos sincronizados</li>
                <li><strong>Conexión a Internet:</strong> Requerida para sincronización</li>
            </ul>

            <h3>Pasos de Instalación</h3>
            <h4>Windows</h4>
            <ol>
                <li>Descarga el instalador <code>LiveSyncPro-Setup.exe</code> desde la página oficial</li>
                <li>Haz doble clic en el archivo descargado</li>
                <li>Si aparece el Control de Cuentas de Usuario (UAC), haz clic en "Sí"</li>
                <li>Sigue el asistente de instalación:
                    <ul>
                        <li>Acepta los términos de licencia</li>
                        <li>Elige la carpeta de instalación (por defecto: C:\\Program Files\\LiveSync Pro)</li>
                        <li>Selecciona si deseas crear un acceso directo en el escritorio</li>
                    </ul>
                </li>
                <li>Haz clic en "Instalar" y espera a que finalice</li>
                <li>Marca "Iniciar LiveSync Pro" y haz clic en "Finalizar"</li>
            </ol>

            <h4>macOS</h4>
            <ol>
                <li>Descarga el archivo <code>LiveSyncPro.dmg</code></li>
                <li>Abre el archivo .dmg descargado</li>
                <li>Arrastra el icono de LiveSync Pro a la carpeta Applications</li>
                <li>Abre la carpeta Applications y ejecuta LiveSync Pro</li>
                <li>Si aparece un mensaje de seguridad, ve a Preferencias del Sistema > Seguridad y Privacidad y haz clic en "Abrir de todos modos"</li>
            </ol>

            <h4>Linux</h4>
            <p><strong>Debian/Ubuntu:</strong></p>
            <pre><code>wget https://download.livesyncpro.com/linux/livesync-pro_latest_amd64.deb
sudo dpkg -i livesync-pro_latest_amd64.deb
sudo apt-get install -f</code></pre>

            <p><strong>Fedora/Red Hat:</strong></p>
            <pre><code>wget https://download.livesyncpro.com/linux/livesync-pro_latest.rpm
sudo dnf install livesync-pro_latest.rpm</code></pre>

            <h3>Primera Configuración</h3>
            <ol>
                <li>Al iniciar por primera vez, verás la pantalla de bienvenida</li>
                <li>Elige "Crear cuenta nueva" o "Iniciar sesión"</li>
                <li>Si creas una cuenta nueva:
                    <ul>
                        <li>Ingresa tu email</li>
                        <li>Crea una contraseña segura</li>
                        <li>Verifica tu email</li>
                    </ul>
                </li>
                <li>Elige tu plan (Básico, Pro o Enterprise)</li>
                <li>Selecciona las carpetas que deseas sincronizar</li>
                <li>Configura las preferencias iniciales</li>
                <li>¡Listo! La sincronización comenzará automáticamente</li>
            </ol>

            <h3>Verificación de Instalación</h3>
            <p>Para verificar que LiveSync Pro está instalado correctamente:</p>
            <ul>
                <li>Debería aparecer el icono en la bandeja del sistema (Windows/Linux) o barra de menú (macOS)</li>
                <li>Puedes abrir la interfaz principal desde el icono</li>
                <li>En Ayuda > Acerca de, verifica que la versión sea la más reciente</li>
                <li>La sincronización debe iniciarse automáticamente si configuraste carpetas</li>
            </ul>

            <h3>Solución de Problemas Comunes</h3>
            <p><strong>La instalación falla en Windows:</strong></p>
            <ul>
                <li>Desactiva temporalmente el antivirus</li>
                <li>Ejecuta el instalador como Administrador</li>
                <li>Verifica que tienes espacio suficiente en disco</li>
            </ul>

            <p><strong>No puedo abrir la app en macOS:</strong></p>
            <ul>
                <li>Ve a Preferencias del Sistema > Seguridad y Privacidad</li>
                <li>Haz clic en "Abrir de todos modos"</li>
                <li>O ejecuta: <code>xattr -cr /Applications/LiveSyncPro.app</code></li>
            </ul>
        `
    },

    'configuracion-inicial': {
        title: 'Configuración Inicial',
        content: `
            <h3>Configuración Básica</h3>
            <p>Después de instalar LiveSync Pro, es importante configurar correctamente la aplicación para obtener el mejor rendimiento.</p>

            <h4>1. Configuración de Cuenta</h4>
            <ul>
                <li><strong>Información de perfil:</strong> Ve a Configuración > Cuenta y completa tu información</li>
                <li><strong>Autenticación de dos factores:</strong> Recomendamos habilitar 2FA en Seguridad</li>
                <li><strong>Foto de perfil:</strong> Opcional, ayuda a identificar tu cuenta</li>
            </ul>

            <h4>2. Selección de Carpetas</h4>
            <p>Para agregar carpetas a sincronizar:</p>
            <ol>
                <li>Haz clic en el icono de LiveSync Pro</li>
                <li>Selecciona "Agregar carpeta"</li>
                <li>Navega y elige la carpeta deseada</li>
                <li>Configura opciones específicas:
                    <ul>
                        <li><strong>Sincronización bidireccional:</strong> Cambios en cualquier dirección</li>
                        <li><strong>Solo subida:</strong> Solo envía archivos al servidor</li>
                        <li><strong>Solo descarga:</strong> Solo descarga archivos del servidor</li>
                    </ul>
                </li>
                <li>Haz clic en "Confirmar"</li>
            </ol>

            <h4>3. Preferencias de Sincronización</h4>
            <p>En Configuración > Sincronización:</p>
            <ul>
                <li><strong>Modo automático:</strong> Sincroniza cambios al detectarlos (recomendado)</li>
                <li><strong>Modo manual:</strong> Sincroniza solo cuando lo solicites</li>
                <li><strong>Programado:</strong> Sincroniza en horarios específicos</li>
                <li><strong>Límite de ancho de banda:</strong> Controla la velocidad de transferencia</li>
                <li><strong>Pausar durante:</strong> Configura horarios de pausa automática</li>
            </ul>

            <h4>4. Gestión de Conflictos</h4>
            <p>Configura cómo resolver conflictos:</p>
            <ul>
                <li><strong>Mantener ambas versiones:</strong> Crea copias con timestamp</li>
                <li><strong>Priorizar más reciente:</strong> Mantiene el archivo modificado más recientemente</li>
                <li><strong>Preguntar siempre:</strong> Te solicita decidir en cada conflicto</li>
                <li><strong>Priorizar local/remoto:</strong> Elige la fuente prioritaria</li>
            </ul>

            <h4>5. Exclusiones y Filtros</h4>
            <p>Excluye archivos o carpetas de la sincronización:</p>
            <ul>
                <li>Archivos temporales: <code>*.tmp, *.temp</code></li>
                <li>Archivos de sistema: <code>.DS_Store, Thumbs.db</code></li>
                <li>Carpetas de dependencias: <code>node_modules/, .git/</code></li>
                <li>Por tamaño: Excluye archivos mayores a X MB</li>
            </ul>

            <h4>6. Notificaciones</h4>
            <p>Personaliza las notificaciones:</p>
            <ul>
                <li>Sincronización completada</li>
                <li>Errores o conflictos</li>
                <li>Espacio de almacenamiento bajo</li>
                <li>Actualizaciones disponibles</li>
            </ul>

            <h3>Configuración Avanzada</h3>
            <h4>Variables de Entorno</h4>
            <p>Puedes configurar variables para personalizar el comportamiento:</p>
            <pre><code>LIVESYNC_CACHE_SIZE=1024
LIVESYNC_LOG_LEVEL=debug
LIVESYNC_PROXY=http://proxy.example.com:8080</code></pre>

            <h4>Configuración de Red</h4>
            <ul>
                <li><strong>Proxy:</strong> Configura si estás detrás de un proxy corporativo</li>
                <li><strong>Puertos:</strong> Puertos predeterminados: 443 (HTTPS), 8883 (MQTT)</li>
                <li><strong>Timeout:</strong> Ajusta tiempos de espera de conexión</li>
            </ul>
        `
    },

    'sincronizacion-basica': {
        title: 'Sincronización Básica',
        content: `
            <h3>Cómo Funciona la Sincronización</h3>
            <p>LiveSync Pro utiliza sincronización en tiempo real basada en eventos del sistema de archivos.</p>

            <h4>Tipos de Sincronización</h4>
            <ul>
                <li><strong>Tiempo Real:</strong> Los cambios se sincronizan inmediatamente al detectarse</li>
                <li><strong>Incremental:</strong> Solo se sincronizan los bloques modificados</li>
                <li><strong>Delta Sync:</strong> Transferencia eficiente de diferencias</li>
            </ul>

            <h3>Operaciones Básicas</h3>

            <h4>Sincronizar Manualmente</h4>
            <ol>
                <li>Haz clic en el icono de LiveSync Pro</li>
                <li>Selecciona la carpeta a sincronizar</li>
                <li>Haz clic en el botón de sincronización</li>
                <li>Espera a que se complete</li>
            </ol>

            <h4>Pausar/Reanudar Sincronización</h4>
            <p>Para pausar temporalmente:</p>
            <ul>
                <li>Haz clic derecho en el icono de LiveSync Pro</li>
                <li>Selecciona "Pausar sincronización"</li>
                <li>Para reanudar, selecciona "Reanudar sincronización"</li>
            </ul>

            <h4>Ver Estado de Sincronización</h4>
            <p>El icono muestra el estado actual:</p>
            <ul>
                <li>✅ Verde: Sincronizado</li>
                <li>🔄 Azul: Sincronizando</li>
                <li>⏸️ Gris: Pausado</li>
                <li>⚠️ Amarillo: Advertencia</li>
                <li>❌ Rojo: Error</li>
            </ul>

            <h3>Sincronización Selectiva</h3>
            <p>Puedes elegir qué archivos o carpetas sincronizar:</p>
            <ol>
                <li>Haz clic derecho en una carpeta sincronizada</li>
                <li>Selecciona "Configuración de sincronización"</li>
                <li>Marca/desmarca subcarpetas o archivos</li>
                <li>Los elementos desmarcados no se sincronizarán</li>
            </ol>

            <h3>Optimización de Rendimiento</h3>
            <ul>
                <li><strong>Limita el ancho de banda</strong> si tienes conexión lenta</li>
                <li><strong>Excluye archivos grandes</strong> que no necesitas sincronizar</li>
                <li><strong>Usa sincronización programada</strong> para archivos no críticos</li>
                <li><strong>Pausa durante tareas intensivas</strong> como videollamadas</li>
            </ul>

            <h3>Verificación de Integridad</h3>
            <p>Para verificar que los archivos están correctamente sincronizados:</p>
            <ol>
                <li>Ve a Configuración > Avanzado</li>
                <li>Haz clic en "Verificar integridad"</li>
                <li>LiveSync Pro comparará checksums de todos los archivos</li>
                <li>Cualquier discrepancia se reportará</li>
            </ol>

            <h3>Consejos y Mejores Prácticas</h3>
            <ul>
                <li>Mantén LiveSync Pro actualizado para mejores optimizaciones</li>
                <li>No sincronices carpetas del sistema operativo</li>
                <li>Organiza archivos en carpetas lógicas para mejor gestión</li>
                <li>Revisa regularmente el log de sincronización</li>
                <li>Haz backups periódicos además de la sincronización</li>
            </ul>
        `
    },

    'problemas-conexion': {
        title: 'Solución de Problemas de Conexión',
        content: `
            <h3>Diagnóstico de Problemas de Conexión</h3>

            <h4>1. Verificar Conectividad Básica</h4>
            <p>Primero, verifica que tienes conexión a internet:</p>
            <ul>
                <li>Abre un navegador web e intenta acceder a varios sitios</li>
                <li>Ejecuta: <code>ping 8.8.8.8</code> en el terminal</li>
                <li>Verifica que otros servicios en línea funcionen</li>
            </ul>

            <h4>2. Verificar Estado del Servicio</h4>
            <p>Comprueba si los servidores de LiveSync Pro están operativos:</p>
            <ul>
                <li>Visita: <a href="https://status.livesyncpro.com">status.livesyncpro.com</a></li>
                <li>Verifica el estado en tiempo real de todos los servicios</li>
                <li>Consulta incidencias reportadas</li>
            </ul>

            <h3>Problemas Comunes y Soluciones</h3>

            <h4>Error: "No se puede conectar al servidor"</h4>
            <p><strong>Causas posibles:</strong></p>
            <ul>
                <li>Firewall bloqueando la conexión</li>
                <li>Configuración de proxy incorrecta</li>
                <li>Problemas de DNS</li>
            </ul>
            <p><strong>Soluciones:</strong></p>
            <ol>
                <li><strong>Configurar Firewall:</strong>
                    <ul>
                        <li>Agrega LiveSync Pro a las excepciones del firewall</li>
                        <li>Puertos necesarios: 443 (HTTPS), 8883 (MQTT)</li>
                        <li>Windows: Panel de Control > Firewall de Windows > Permitir aplicación</li>
                    </ul>
                </li>
                <li><strong>Verificar Proxy:</strong>
                    <ul>
                        <li>Ve a Configuración > Red > Proxy</li>
                        <li>Prueba "Detección automática" o configura manualmente</li>
                        <li>Formato: <code>http://proxy.ejemplo.com:8080</code></li>
                    </ul>
                </li>
                <li><strong>Cambiar DNS:</strong>
                    <ul>
                        <li>Usa DNS públicos como Google (8.8.8.8) o Cloudflare (1.1.1.1)</li>
                        <li>Reinicia la aplicación después de cambiar</li>
                    </ul>
                </li>
            </ol>

            <h4>Error: "Tiempo de espera agotado"</h4>
            <p><strong>Soluciones:</strong></p>
            <ul>
                <li>Aumenta el timeout en Configuración > Avanzado > Timeout de red (por defecto: 30s)</li>
                <li>Verifica tu velocidad de internet</li>
                <li>Intenta conectarte en otro horario con menos congestión</li>
            </ul>

            <h4>Conexión Intermitente</h4>
            <p><strong>Diagnóstico:</strong></p>
            <ol>
                <li>Verifica la estabilidad de tu conexión a internet</li>
                <li>Revisa los logs: Ayuda > Ver Logs</li>
                <li>Busca patrones en las desconexiones</li>
            </ol>
            <p><strong>Soluciones:</strong></p>
            <ul>
                <li>Activa "Modo resiliente" en Configuración > Avanzado</li>
                <li>Aumenta el intervalo de reconexión</li>
                <li>Usa conexión por cable en lugar de WiFi si es posible</li>
            </ul>

            <h4>Error de Certificado SSL</h4>
            <p><strong>Mensaje:</strong> "El certificado SSL no es válido"</p>
            <p><strong>Soluciones:</strong></p>
            <ul>
                <li>Verifica que la fecha y hora de tu sistema sean correctas</li>
                <li>Actualiza los certificados raíz: Windows Update o equivalente</li>
                <li>Desactiva temporalmente software de seguridad que intercepte SSL</li>
                <li>Como último recurso: Configuración > Avanzado > "Ignorar errores SSL" (no recomendado en producción)</li>
            </ul>

            <h3>Herramientas de Diagnóstico</h3>

            <h4>Test de Conectividad Integrado</h4>
            <ol>
                <li>Ve a Ayuda > Diagnóstico</li>
                <li>Haz clic en "Test de conectividad"</li>
                <li>La herramienta verificará:
                    <ul>
                        <li>Resolución DNS</li>
                        <li>Accesibilidad de puertos</li>
                        <li>Latencia y velocidad</li>
                        <li>Estado de autenticación</li>
                    </ul>
                </li>
                <li>Guarda el reporte para compartir con soporte si es necesario</li>
            </ol>

            <h4>Comandos Útiles de Terminal</h4>
            <pre><code># Verificar conexión a servidores de LiveSync Pro
ping sync.livesyncpro.com

# Test de puerto HTTPS
telnet sync.livesyncpro.com 443

# Traceroute para ver la ruta de red
tracert sync.livesyncpro.com   # Windows
traceroute sync.livesyncpro.com # macOS/Linux

# Verificar DNS
nslookup sync.livesyncpro.com</code></pre>

            <h3>Configuración de Red Avanzada</h3>

            <h4>Para Redes Corporativas</h4>
            <p>Si estás en una red corporativa con restricciones:</p>
            <ul>
                <li>Solicita a IT que permita los dominios:
                    <ul>
                        <li>*.livesyncpro.com</li>
                        <li>sync.livesyncpro.com</li>
                        <li>api.livesyncpro.com</li>
                    </ul>
                </li>
                <li>Puertos necesarios: 443, 8883</li>
                <li>Considera usar el "Modo corporativo" en Configuración</li>
            </ul>

            <h3>Contactar Soporte</h3>
            <p>Si los problemas persisten, contacta a soporte con:</p>
            <ul>
                <li>Logs de la aplicación (Ayuda > Exportar Logs)</li>
                <li>Reporte del test de conectividad</li>
                <li>Información de tu red (tipo de conexión, ISP)</li>
                <li>Pasos ya realizados para solucionar el problema</li>
            </ul>
        `
    },

    'configuracion-avanzada': {
        title: 'Configuración Avanzada',
        content: `
            <h3>Configuración Avanzada de LiveSync Pro</h3>
            <p>Esta sección está dirigida a usuarios experimentados que desean personalizar al máximo LiveSync Pro.</p>

            <h4>Archivo de Configuración</h4>
            <p>Ubicación del archivo de configuración:</p>
            <ul>
                <li><strong>Windows:</strong> <code>%APPDATA%\\LiveSyncPro\\config.json</code></li>
                <li><strong>macOS:</strong> <code>~/Library/Application Support/LiveSyncPro/config.json</code></li>
                <li><strong>Linux:</strong> <code>~/.config/livesyncpro/config.json</code></li>
            </ul>

            <p><strong>⚠️ Advertencia:</strong> Edita este archivo solo si sabes lo que estás haciendo. Una configuración incorrecta puede causar mal funcionamiento.</p>

            <h3>Opciones de Configuración</h3>

            <h4>Sincronización</h4>
            <pre><code>{
  "sync": {
    "mode": "realtime",          // realtime, manual, scheduled
    "interval": 300,              // segundos entre sincronizaciones (modo scheduled)
    "retryAttempts": 3,           // intentos de reintento en caso de error
    "retryDelay": 5000,           // milisegundos entre reintentos
    "chunkSize": 5242880,         // tamaño de chunk en bytes (5MB)
    "parallelUploads": 3,         // número de uploads paralelos
    "parallelDownloads": 5,       // número de downloads paralelos
    "checksumAlgorithm": "sha256" // algoritmo de checksum
  }
}</code></pre>

            <h4>Red y Conexión</h4>
            <pre><code>{
  "network": {
    "timeout": 30000,             // timeout en milisegundos
    "maxRetries": 3,              // máximo de reintentos
    "keepAliveInterval": 60,      // intervalo de keep-alive en segundos
    "bandwidthLimit": {
      "upload": 0,                // 0 = ilimitado (bytes/segundo)
      "download": 0
    },
    "proxy": {
      "enabled": false,
      "host": "",
      "port": 8080,
      "username": "",
      "password": "",
      "type": "http"              // http, https, socks5
    }
  }
}</code></pre>

            <h4>Caché y Almacenamiento</h4>
            <pre><code>{
  "cache": {
    "enabled": true,
    "maxSize": 1073741824,        // tamaño máximo en bytes (1GB)
    "cleanupInterval": 86400,     // limpieza cada 24h (segundos)
    "strategy": "lru"             // lru, fifo, lfu
  },
  "storage": {
    "localPath": "",              // ruta personalizada para archivos locales
    "tempPath": "",               // ruta para archivos temporales
    "reservedSpace": 1073741824   // espacio reservado en disco (1GB)
  }
}</code></pre>

            <h4>Seguridad y Encriptación</h4>
            <pre><code>{
  "security": {
    "encryption": {
      "enabled": true,
      "algorithm": "aes-256-gcm",
      "keyDerivation": "pbkdf2",
      "iterations": 100000
    },
    "ssl": {
      "verifyPeer": true,
      "verifyHost": true,
      "allowInsecure": false      // ⚠️ solo para debugging
    },
    "twoFactorAuth": {
      "enabled": true,
      "method": "totp"            // totp, sms, email
    }
  }
}</code></pre>

            <h4>Logging y Depuración</h4>
            <pre><code>{
  "logging": {
    "level": "info",              // debug, info, warn, error
    "maxFileSize": 10485760,      // tamaño máximo de archivo log (10MB)
    "maxFiles": 5,                // número de archivos de log a mantener
    "console": false,             // mostrar logs en consola
    "syslog": false,              // enviar a syslog (Linux/macOS)
    "remote": {
      "enabled": false,
      "endpoint": ""              // enviar logs a servidor remoto
    }
  }
}</code></pre>

            <h4>Notificaciones</h4>
            <pre><code>{
  "notifications": {
    "enabled": true,
    "types": {
      "syncComplete": true,
      "syncError": true,
      "conflictDetected": true,
      "lowStorage": true,
      "updateAvailable": true
    },
    "sound": true,
    "badge": true                 // mostrar badge con número de notificaciones
  }
}</code></pre>

            <h3>Variables de Entorno</h3>
            <p>Puedes usar variables de entorno para sobrescribir configuraciones:</p>

            <pre><code># Nivel de logging
export LIVESYNC_LOG_LEVEL=debug

# Deshabilitar verificación SSL (⚠️ no recomendado)
export LIVESYNC_SSL_VERIFY=false

# Proxy personalizado
export LIVESYNC_PROXY=http://proxy.example.com:8080

# Ruta de configuración personalizada
export LIVESYNC_CONFIG_PATH=/custom/path/config.json

# Límite de memoria
export LIVESYNC_MEMORY_LIMIT=2048  # MB

# Modo de desarrollo
export LIVESYNC_DEV_MODE=true</code></pre>

            <h3>Línea de Comandos</h3>
            <p>LiveSync Pro puede ejecutarse desde la línea de comandos:</p>

            <pre><code># Iniciar con configuración específica
livesync --config=/path/to/config.json

# Modo headless (sin interfaz gráfica)
livesync --headless

# Sincronizar carpeta específica
livesync sync --path=/path/to/folder

# Ver estado
livesync status

# Pausar/reanudar
livesync pause
livesync resume

# Exportar logs
livesync export-logs --output=/path/to/logs.zip

# Verificar integridad
livesync verify --path=/path/to/folder</code></pre>

            <h3>Integración con Scripts</h3>
            <p>Puedes automatizar tareas con scripts:</p>

            <h4>PowerShell (Windows)</h4>
            <pre><code># Backup antes de sincronizar
$backupPath = "C:\\Backups\\$(Get-Date -Format 'yyyy-MM-dd')"
New-Item -ItemType Directory -Path $backupPath
Copy-Item "C:\\SyncFolder\\*" -Destination $backupPath -Recurse
& "C:\\Program Files\\LiveSync Pro\\livesync.exe" sync</code></pre>

            <h4>Bash (Linux/macOS)</h4>
            <pre><code>#!/bin/bash
# Script de sincronización automatizada

# Crear backup
BACKUP_DIR="$HOME/backups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"
cp -r "$HOME/SyncFolder" "$BACKUP_DIR/"

# Sincronizar
livesync sync --path="$HOME/SyncFolder"

# Verificar resultado
if [ $? -eq 0 ]; then
    echo "Sincronización exitosa"
    # Enviar notificación
    notify-send "LiveSync Pro" "Sincronización completada"
else
    echo "Error en sincronización"
    # Enviar alerta
    mail -s "Error en LiveSync" admin@example.com
fi</code></pre>

            <h3>Optimización de Rendimiento</h3>

            <h4>Para Archivos Grandes</h4>
            <ul>
                <li>Aumenta <code>chunkSize</code> a 10MB o más</li>
                <li>Incrementa <code>parallelUploads</code> si tienes buen ancho de banda</li>
                <li>Considera usar sincronización programada en horarios de poco uso</li>
            </ul>

            <h4>Para Muchos Archivos Pequeños</h4>
            <ul>
                <li>Reduce <code>chunkSize</code> a 1-2MB</li>
                <li>Aumenta <code>parallelUploads</code> y <code>parallelDownloads</code></li>
                <li>Habilita caché agresivo</li>
            </ul>

            <h4>Para Conexiones Lentas</h4>
            <ul>
                <li>Reduce <code>parallelUploads</code> y <code>parallelDownloads</code> a 1-2</li>
                <li>Aumenta <code>timeout</code> y <code>retryDelay</code></li>
                <li>Configura límites de ancho de banda</li>
            </ul>
        `
    },

    'api-docs': {
        title: 'Documentación de API',
        content: `
            <h3>API de LiveSync Pro</h3>
            <p>LiveSync Pro ofrece una API REST completa para integración con otras aplicaciones.</p>

            <h4>Autenticación</h4>
            <p>Todas las peticiones requieren autenticación mediante API Key o OAuth 2.0.</p>

            <h5>API Key</h5>
            <pre><code>curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.livesyncpro.com/v1/files</code></pre>

            <h5>OAuth 2.0</h5>
            <pre><code># 1. Obtener token de autorización
POST https://auth.livesyncpro.com/oauth/authorize
Content-Type: application/json

{
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "grant_type": "client_credentials"
}

# 2. Usar el token en las peticiones
curl -H "Authorization: Bearer ACCESS_TOKEN" \\
     https://api.livesyncpro.com/v1/files</code></pre>

            <h3>Endpoints Principales</h3>

            <h4>Archivos</h4>

            <h5>Listar Archivos</h5>
            <pre><code>GET /v1/files?path=/folder&recursive=true

Respuesta:
{
  "files": [
    {
      "id": "file_abc123",
      "name": "document.pdf",
      "path": "/folder/document.pdf",
      "size": 1048576,
      "modified": "2026-01-08T10:30:00Z",
      "checksum": "sha256:abc123...",
      "syncStatus": "synced"
    }
  ],
  "total": 1,
  "page": 1,
  "perPage": 100
}</code></pre>

            <h5>Subir Archivo</h5>
            <pre><code>POST /v1/files/upload
Content-Type: multipart/form-data

FormData:
- file: (binary)
- path: /folder/document.pdf
- overwrite: true

Respuesta:
{
  "id": "file_abc123",
  "name": "document.pdf",
  "path": "/folder/document.pdf",
  "size": 1048576,
  "checksum": "sha256:abc123...",
  "uploadedAt": "2026-01-08T10:30:00Z"
}</code></pre>

            <h5>Descargar Archivo</h5>
            <pre><code>GET /v1/files/download/:fileId

Respuesta: Binary stream del archivo</code></pre>

            <h5>Eliminar Archivo</h5>
            <pre><code>DELETE /v1/files/:fileId

Respuesta:
{
  "success": true,
  "message": "File deleted successfully"
}</code></pre>

            <h4>Sincronización</h4>

            <h5>Estado de Sincronización</h5>
            <pre><code>GET /v1/sync/status

Respuesta:
{
  "status": "syncing",
  "progress": 75,
  "currentFile": "large-file.zip",
  "bytesTransferred": 78643200,
  "totalBytes": 104857600,
  "filesRemaining": 3,
  "estimatedTimeRemaining": 45
}</code></pre>

            <h5>Iniciar Sincronización</h5>
            <pre><code>POST /v1/sync/start
Content-Type: application/json

{
  "path": "/folder",
  "direction": "both"  // both, upload, download
}

Respuesta:
{
  "syncId": "sync_xyz789",
  "status": "started",
  "startedAt": "2026-01-08T10:30:00Z"
}</code></pre>

            <h5>Pausar/Reanudar</h5>
            <pre><code>POST /v1/sync/pause
POST /v1/sync/resume

Respuesta:
{
  "status": "paused",  // o "resumed"
  "timestamp": "2026-01-08T10:30:00Z"
}</code></pre>

            <h4>Historial de Versiones</h4>

            <h5>Listar Versiones</h5>
            <pre><code>GET /v1/files/:fileId/versions

Respuesta:
{
  "versions": [
    {
      "versionId": "v3",
      "timestamp": "2026-01-08T10:30:00Z",
      "size": 1048576,
      "checksum": "sha256:abc123...",
      "author": "user@example.com"
    },
    {
      "versionId": "v2",
      "timestamp": "2026-01-07T15:20:00Z",
      "size": 1024000,
      "checksum": "sha256:def456...",
      "author": "user@example.com"
    }
  ]
}</code></pre>

            <h5>Restaurar Versión</h5>
            <pre><code>POST /v1/files/:fileId/restore
Content-Type: application/json

{
  "versionId": "v2"
}

Respuesta:
{
  "success": true,
  "currentVersion": "v4",
  "restoredFrom": "v2"
}</code></pre>

            <h4>Webhooks</h4>

            <h5>Registrar Webhook</h5>
            <pre><code>POST /v1/webhooks
Content-Type: application/json

{
  "url": "https://your-server.com/webhook",
  "events": ["file.uploaded", "file.deleted", "sync.completed"],
  "secret": "your_webhook_secret"
}

Respuesta:
{
  "id": "webhook_abc123",
  "url": "https://your-server.com/webhook",
  "events": ["file.uploaded", "file.deleted", "sync.completed"],
  "createdAt": "2026-01-08T10:30:00Z"
}</code></pre>

            <h5>Formato de Evento</h5>
            <pre><code>POST https://your-server.com/webhook
X-LiveSync-Signature: sha256=abc123...
Content-Type: application/json

{
  "event": "file.uploaded",
  "timestamp": "2026-01-08T10:30:00Z",
  "data": {
    "fileId": "file_abc123",
    "name": "document.pdf",
    "path": "/folder/document.pdf",
    "size": 1048576
  }
}</code></pre>

            <h3>SDKs Oficiales</h3>

            <h4>JavaScript/TypeScript</h4>
            <pre><code>npm install @livesyncpro/sdk

import { LiveSyncClient } from '@livesyncpro/sdk';

const client = new LiveSyncClient({
  apiKey: 'YOUR_API_KEY'
});

// Subir archivo
await client.files.upload('/path/to/file.pdf', {
  path: '/remote/folder/file.pdf'
});

// Listar archivos
const files = await client.files.list('/folder');

// Iniciar sincronización
const sync = await client.sync.start('/folder');</code></pre>

            <h4>Python</h4>
            <pre><code>pip install livesyncpro

from livesyncpro import LiveSyncClient

client = LiveSyncClient(api_key='YOUR_API_KEY')

# Subir archivo
client.files.upload('/path/to/file.pdf',
                   remote_path='/remote/folder/file.pdf')

# Listar archivos
files = client.files.list('/folder')

# Iniciar sincronización
sync = client.sync.start('/folder')</code></pre>

            <h3>Límites de API</h3>
            <ul>
                <li><strong>Rate Limit:</strong> 1000 peticiones/hora por API key</li>
                <li><strong>Tamaño máximo de archivo:</strong> 5GB por petición</li>
                <li><strong>Webhooks:</strong> Máximo 10 por cuenta</li>
                <li><strong>Concurrent uploads:</strong> 10 por cuenta</li>
            </ul>

            <p>Headers de rate limit en cada respuesta:</p>
            <pre><code>X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1641643200</code></pre>
        `
    }
};
