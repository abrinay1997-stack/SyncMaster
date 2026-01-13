// Base de Conocimientos para LiveSync Pro - Guía de Usuario
const KNOWLEDGE_BASE = {
    'comenzar': {
        title: 'Primeros Pasos con LiveSync Pro',
        content: `
            <h3>Bienvenido a LiveSync Pro</h3>
            <p>LiveSync Pro es un sistema profesional de diseño y simulación acústica que te permite diseñar sistemas de refuerzo sonoro con precisión.</p>

            <h4>¿Qué puedes hacer con LiveSync Pro?</h4>
            <ul>
                <li>Diseñar sistemas de sonido profesionales</li>
                <li>Calcular cobertura SPL (nivel de presión sonora)</li>
                <li>Analizar inteligibilidad (STI)</li>
                <li>Optimizar tiempo de reverberación (RT60)</li>
                <li>Posicionar torres de delay</li>
                <li>Visualizar resultados en 3D</li>
                <li>Exportar reportes y planos</li>
                <li>Colaborar en tiempo real con tu equipo</li>
            </ul>

            <h4>Acceso a la Aplicación</h4>
            <p>Para acceder a LiveSync Pro:</p>
            <ol>
                <li>Abre LiveSync Pro en tu navegador</li>
                <li>Inicia sesión con tus credenciales (PIN, código de equipo, o validación de licencia)</li>
                <li>Accede al Project Hub para ver tus proyectos</li>
            </ol>

            <h4>Requisitos del Sistema</h4>
            <ul>
                <li><strong>Navegador:</strong> Chrome, Firefox, Safari o Edge (versiones recientes)</li>
                <li><strong>Conexión a Internet:</strong> Requerida para sincronización en la nube</li>
                <li><strong>RAM:</strong> Mínimo 4GB, recomendado 8GB para proyectos grandes</li>
            </ul>

            <h4>Tu Primer Proyecto</h4>
            <p>Para crear tu primer proyecto acústico:</p>
            <ol>
                <li>En el Project Hub, haz clic en "+ Nuevo Proyecto"</li>
                <li>Ingresa nombre, cliente y tipo de evento</li>
                <li>Configura dimensiones de la sala</li>
                <li>Selecciona un preset apropiado (Corporativo, Concierto, Festival, Teatro)</li>
                <li>Haz clic en "Calcular Sistema"</li>
                <li>Revisa los resultados y optimiza según sea necesario</li>
            </ol>

            <h4>Navegación de la Interfaz</h4>
            <ul>
                <li><strong>Project Hub:</strong> Centro de control de proyectos</li>
                <li><strong>Configuración Básica:</strong> Dimensiones y sistema principal</li>
                <li><strong>Configuración Avanzada:</strong> Parámetros acústicos detallados</li>
                <li><strong>Resultados:</strong> Mapas de cobertura y análisis</li>
                <li><strong>Vista 3D:</strong> Visualización interactiva</li>
            </ul>
        `
    },

    'crear-proyecto': {
        title: 'Crear un Proyecto Acústico',
        content: `
            <h3>Guía Completa para Crear Proyectos</h3>

            <h4>Paso 1: Información Básica del Proyecto</h4>
            <p>En el Project Hub, completa los datos iniciales:</p>
            <ul>
                <li><strong>Nombre del Proyecto:</strong> Usa un nombre descriptivo (ej: "Conferencia TechCorp 2026")</li>
                <li><strong>Cliente:</strong> Nombre del cliente o empresa</li>
                <li><strong>Venue:</strong> Lugar del evento</li>
                <li><strong>Tipo de Evento:</strong> Selecciona entre Corporativo, Concierto, Festival, Teatro u Otro</li>
                <li><strong>Fecha:</strong> Fecha programada del evento</li>
            </ul>

            <h4>Paso 2: Dimensiones de la Sala</h4>
            <p>Define el espacio donde se realizará el evento:</p>
            <ul>
                <li><strong>Ancho:</strong> Ancho de la sala en metros</li>
                <li><strong>Largo:</strong> Profundidad/largo de la sala en metros</li>
                <li><strong>Altura:</strong> Altura del techo en metros</li>
            </ul>
            <p><strong>Tip:</strong> Usa planos reales o mediciones precisas para mejores resultados.</p>

            <h4>Paso 3: Seleccionar Preset</h4>
            <p>Los presets configuran automáticamente parámetros óptimos:</p>
            <ul>
                <li><strong>Corporativo:</strong> Optimizado para voz, alta inteligibilidad</li>
                <li><strong>Concierto:</strong> Balance entre voz y música, SPL elevado</li>
                <li><strong>Festival:</strong> Largo alcance, múltiples torres de delay</li>
                <li><strong>Teatro:</strong> Sonido natural, moderada reverberación</li>
            </ul>

            <h4>Paso 4: Sistema de Sonido Principal</h4>
            <p>Configura el sistema principal:</p>
            <ul>
                <li><strong>Modelo de Altavoces:</strong> Selecciona el modelo que usarás</li>
                <li><strong>Cantidad:</strong> Número de cajas por lado</li>
                <li><strong>Configuración:</strong> Estéreo (L/R), Mono, o LCR</li>
                <li><strong>Posición del Escenario:</strong> Frente, centro o lateral</li>
            </ul>

            <h4>Paso 5: Ejecutar Cálculo</h4>
            <p>Haz clic en "Calcular Sistema" para obtener:</p>
            <ul>
                <li>Mapa de cobertura SPL</li>
                <li>Distribución de frecuencias</li>
                <li>Índice de inteligibilidad (STI)</li>
                <li>Tiempo de reverberación (RT60)</li>
                <li>Zonas que requieren delay</li>
            </ul>

            <h4>Paso 6: Analizar Resultados</h4>
            <p>Revisa los mapas de cobertura:</p>
            <ul>
                <li><strong>Verde:</strong> Cobertura óptima</li>
                <li><strong>Amarillo:</strong> Cobertura aceptable</li>
                <li><strong>Rojo:</strong> Zonas con problemas, requieren atención</li>
            </ul>

            <h4>Paso 7: Optimizar (si es necesario)</h4>
            <p>Si los resultados no son óptimos:</p>
            <ul>
                <li>Agrega torres de delay en zonas de baja cobertura</li>
                <li>Ajusta parámetros acústicos (absorción, materiales)</li>
                <li>Modifica el sistema de sonido (modelo, cantidad, posición)</li>
                <li>Usa el asistente de IA para sugerencias</li>
            </ul>
        `
    },

    'parametros-acusticos': {
        title: 'Entender los Parámetros Acústicos',
        content: `
            <h3>Parámetros Acústicos Principales</h3>

            <h4>SPL (Sound Pressure Level)</h4>
            <p>Nivel de presión sonora medido en decibeles (dB).</p>

            <p><strong>Niveles recomendados por tipo de evento:</strong></p>
            <ul>
                <li><strong>Corporativo/Conferencias:</strong> 75-85 dB</li>
                <li><strong>Teatro:</strong> 80-90 dB</li>
                <li><strong>Concierto:</strong> 95-105 dB</li>
                <li><strong>Festival:</strong> 100-110 dB</li>
            </ul>

            <p><strong>Interpretación del mapa SPL:</strong></p>
            <ul>
                <li>Verde: Cobertura óptima para el tipo de evento</li>
                <li>Amarillo: Nivel aceptable pero podría mejorar</li>
                <li>Rojo: Nivel insuficiente o excesivo</li>
            </ul>

            <h4>STI (Speech Transmission Index)</h4>
            <p>Índice de transmisión del habla, mide inteligibilidad (escala 0.0 a 1.0).</p>

            <p><strong>Escala de calidad:</strong></p>
            <ul>
                <li><strong>0.75 - 1.00:</strong> Excelente (ideal para voz)</li>
                <li><strong>0.60 - 0.75:</strong> Buena (aceptable para voz y música)</li>
                <li><strong>0.45 - 0.60:</strong> Razonable (solo música)</li>
                <li><strong>0.30 - 0.45:</strong> Pobre (problemas de comprensión)</li>
                <li><strong>0.00 - 0.30:</strong> Mala (inaceptable)</li>
            </ul>

            <p><strong>Objetivos recomendados:</strong></p>
            <ul>
                <li>Conferencias/Corporativo: STI > 0.75</li>
                <li>Teatro: STI > 0.70</li>
                <li>Concierto: STI > 0.60</li>
                <li>Festival: STI > 0.65</li>
            </ul>

            <h4>RT60 (Reverberation Time)</h4>
            <p>Tiempo en segundos que tarda el sonido en decaer 60 dB.</p>

            <p><strong>Rangos óptimos:</strong></p>
            <ul>
                <li><strong>Palabra hablada:</strong> 0.6 - 0.8 segundos</li>
                <li><strong>Música amplificada:</strong> 0.8 - 1.2 segundos</li>
                <li><strong>Teatro:</strong> 1.0 - 1.4 segundos</li>
                <li><strong>Música clásica:</strong> 1.5 - 2.0 segundos</li>
            </ul>

            <p><strong>Efectos del RT60:</strong></p>
            <ul>
                <li><strong>RT60 muy bajo:</strong> Sonido "seco", sin ambiente</li>
                <li><strong>RT60 óptimo:</strong> Sonido natural y claro</li>
                <li><strong>RT60 muy alto:</strong> Ecos, pérdida de inteligibilidad</li>
            </ul>

            <h4>Coeficientes de Absorción</h4>
            <p>Indican cuánta energía sonora absorbe cada material (0.0 a 1.0).</p>

            <p><strong>Materiales comunes:</strong></p>
            <ul>
                <li><strong>Concreto:</strong> 0.02 (muy reflectivo)</li>
                <li><strong>Madera:</strong> 0.09</li>
                <li><strong>Vidrio:</strong> 0.05</li>
                <li><strong>Alfombra gruesa:</strong> 0.50</li>
                <li><strong>Cortinas pesadas:</strong> 0.30</li>
                <li><strong>Paneles acústicos:</strong> 0.70</li>
                <li><strong>Audiencia sentada:</strong> 0.80 (¡muy importante!)</li>
            </ul>

            <p><strong>Tip:</strong> La audiencia absorbe mucho sonido. Siempre considera la ocupación esperada en tu diseño.</p>
        `
    },

    'torres-delay': {
        title: 'Torres de Delay y Fill Speakers',
        content: `
            <h3>Sistemas de Refuerzo Adicional</h3>

            <h4>¿Qué son las Torres de Delay?</h4>
            <p>Sistemas de altavoces adicionales que refuerzan el sistema principal en zonas alejadas o con obstáculos.</p>

            <h4>¿Cuándo Usar Torres de Delay?</h4>
            <ul>
                <li><strong>Salas largas:</strong> Profundidad mayor a 30 metros</li>
                <li><strong>Obstáculos:</strong> Columnas, balcones, niveles elevados</li>
                <li><strong>Zonas de baja cobertura:</strong> Áreas rojas en el mapa SPL</li>
                <li><strong>Audiencias grandes:</strong> Festivales, estadios, arenas</li>
            </ul>

            <h4>Cómo Agregar Torres de Delay</h4>
            <ol>
                <li>En la vista de resultados, identifica zonas de baja cobertura</li>
                <li>Haz clic en "+ Agregar Torre de Delay"</li>
                <li>Posiciona la torre en el mapa de la sala</li>
                <li>LiveSync Pro calcula automáticamente el delay time óptimo</li>
                <li>Ajusta manualmente si es necesario</li>
                <li>Recalcula el sistema para ver el efecto</li>
            </ol>

            <h4>Principios del Delay Time</h4>
            <p>El delay (retardo) sincroniza el sonido del sistema de delay con el sistema principal.</p>

            <p><strong>Fórmula básica:</strong></p>
            <p>Delay (milisegundos) = Distancia (metros) / 343 × 1000</p>

            <p><strong>Ejemplo:</strong></p>
            <p>Torre a 20m del sistema principal:<br>
            Delay = 20 / 343 × 1000 = 58.3 ms</p>

            <p><strong>En LiveSync Pro:</strong> El cálculo es automático basado en la posición que selecciones.</p>

            <h4>Niveles de Delay</h4>
            <p>El nivel SPL del delay debe ser:</p>
            <ul>
                <li>6-10 dB más alto que el sistema principal en su zona de cobertura</li>
                <li>Suficiente para "dominar" sobre el sistema lejano</li>
                <li>No tan alto que cause suma excesiva (comb filtering)</li>
            </ul>

            <h4>Fill Speakers</h4>
            <p>Altavoces de relleno para zonas específicas:</p>
            <ul>
                <li><strong>Front Fill:</strong> Primeras filas directamente bajo el sistema principal</li>
                <li><strong>Side Fill:</strong> Zonas laterales fuera de cobertura</li>
                <li><strong>Under Balcony:</strong> Áreas cubiertas por balcones</li>
            </ul>

            <h4>Mejores Prácticas</h4>
            <ul>
                <li>Coloca delays en línea con el sistema principal</li>
                <li>Evita solapamientos excesivos entre zonas</li>
                <li>Usa el mismo modelo de altavoces para consistencia tonal</li>
                <li>Verifica que el timing sea coherente en toda la sala</li>
                <li>Prueba con mediciones reales en sitio cuando sea posible</li>
            </ul>
        `
    },

    'presets': {
        title: 'Presets de Eventos',
        content: `
            <h3>Configuraciones Predefinidas</h3>
            <p>LiveSync Pro incluye presets optimizados para diferentes tipos de eventos.</p>

            <h4>Preset Corporativo</h4>
            <p><strong>Ideal para:</strong> Conferencias, presentaciones, eventos empresariales</p>
            <p><strong>Parámetros:</strong></p>
            <ul>
                <li>RT60 objetivo: 0.7 segundos</li>
                <li>STI objetivo: 0.75 (excelente inteligibilidad)</li>
                <li>SPL objetivo: 85 dB</li>
                <li>Perfil de absorción: Alto</li>
            </ul>
            <p><strong>Características:</strong></p>
            <ul>
                <li>Prioridad máxima en inteligibilidad de voz</li>
                <li>Reverberación muy controlada</li>
                <li>SPL moderado y confortable</li>
                <li>Cobertura uniforme en toda el área</li>
            </ul>

            <h4>Preset Concierto</h4>
            <p><strong>Ideal para:</strong> Conciertos, presentaciones musicales amplificadas</p>
            <p><strong>Parámetros:</strong></p>
            <ul>
                <li>RT60 objetivo: 1.0 segundos</li>
                <li>STI objetivo: 0.60 (buena inteligibilidad)</li>
                <li>SPL objetivo: 102 dB</li>
                <li>Perfil de absorción: Medio</li>
            </ul>
            <p><strong>Características:</strong></p>
            <ul>
                <li>Mayor nivel de SPL (95-105 dB)</li>
                <li>Respuesta de bajos extendida</li>
                <li>Reverberación moderada para ambiente musical</li>
                <li>Subwoofers recomendados</li>
            </ul>

            <h4>Preset Festival</h4>
            <p><strong>Ideal para:</strong> Festivales, eventos al aire libre, grandes audiencias</p>
            <p><strong>Parámetros:</strong></p>
            <ul>
                <li>RT60 objetivo: 0.8 segundos</li>
                <li>STI objetivo: 0.65 (buena inteligibilidad)</li>
                <li>SPL objetivo: 108 dB</li>
                <li>Perfil de absorción: Bajo (outdoor)</li>
            </ul>
            <p><strong>Características:</strong></p>
            <ul>
                <li>Sistemas de largo alcance (line arrays grandes)</li>
                <li>Múltiples torres de delay necesarias</li>
                <li>SPL muy elevado (100-110 dB)</li>
                <li>Cobertura para áreas extensas</li>
            </ul>

            <h4>Preset Teatro</h4>
            <p><strong>Ideal para:</strong> Teatros, obras, presentaciones escénicas</p>
            <p><strong>Parámetros:</strong></p>
            <ul>
                <li>RT60 objetivo: 1.2 segundos</li>
                <li>STI objetivo: 0.70 (buena inteligibilidad)</li>
                <li>SPL objetivo: 88 dB</li>
                <li>Perfil de absorción: Medio</li>
            </ul>
            <p><strong>Características:</strong></p>
            <ul>
                <li>Balance óptimo entre voz y música</li>
                <li>Reverberación moderada para naturalidad</li>
                <li>SPL moderado-alto (80-90 dB)</li>
                <li>Sonido natural y envolvente</li>
            </ul>

            <h4>Cómo Aplicar un Preset</h4>
            <ol>
                <li>En Configuración Básica, selecciona el tipo de evento</li>
                <li>Haz clic en "Aplicar Preset"</li>
                <li>El sistema configura automáticamente:
                    <ul>
                        <li>Coeficientes de absorción</li>
                        <li>Tiempo de reverberación objetivo</li>
                        <li>Parámetros de inteligibilidad</li>
                        <li>Niveles de SPL recomendados</li>
                    </ul>
                </li>
                <li>Puedes ajustar manualmente después si es necesario</li>
            </ol>

            <h4>Personalización</h4>
            <p>Los presets son puntos de partida. Ajusta según:</p>
            <ul>
                <li>Características específicas de la sala</li>
                <li>Preferencias del cliente</li>
                <li>Equipamiento disponible</li>
                <li>Requisitos especiales del evento</li>
            </ul>
        `
    },

    'exportacion': {
        title: 'Exportar Proyectos y Reportes',
        content: `
            <h3>Opciones de Exportación</h3>

            <h4>Reporte PDF Completo</h4>
            <p><strong>Contenido del reporte:</strong></p>
            <ul>
                <li><strong>Portada:</strong> Nombre del proyecto, cliente, fecha</li>
                <li><strong>Especificaciones Técnicas:</strong>
                    <ul>
                        <li>Dimensiones de la sala</li>
                        <li>Parámetros acústicos (RT60, STI, SPL)</li>
                        <li>Lista completa de equipos</li>
                    </ul>
                </li>
                <li><strong>Mapas de Cobertura:</strong>
                    <ul>
                        <li>SPL por bandas de frecuencia</li>
                        <li>Índice STI</li>
                        <li>Distribución de delay</li>
                    </ul>
                </li>
                <li><strong>Análisis y Resultados:</strong>
                    <ul>
                        <li>Gráficas de respuesta</li>
                        <li>Estadísticas de cobertura</li>
                        <li>Recomendaciones del sistema</li>
                    </ul>
                </li>
            </ul>

            <p><strong>Cómo generar:</strong></p>
            <ol>
                <li>Completa tu diseño y cálculos</li>
                <li>En la vista de resultados, haz clic en "Generar Reporte PDF"</li>
                <li>El archivo se descarga automáticamente</li>
                <li>Revisa y comparte con clientes o equipo técnico</li>
            </ol>

            <h4>Exportación DXF (AutoCAD)</h4>
            <p><strong>Contenido del archivo DXF:</strong></p>
            <ul>
                <li>Planta de la sala con dimensiones exactas</li>
                <li>Posiciones de altavoces (coordenadas XYZ)</li>
                <li>Zonas de cobertura marcadas</li>
                <li>Referencias de montaje</li>
                <li>Escala y acotaciones</li>
            </ul>

            <p><strong>Usos del DXF:</strong></p>
            <ul>
                <li>Coordinación con arquitectos e ingenieros</li>
                <li>Planos para equipos de montaje</li>
                <li>Integración con planos arquitectónicos existentes</li>
                <li>Documentación técnica precisa</li>
            </ul>

            <p><strong>Cómo exportar:</strong></p>
            <ol>
                <li>Haz clic en "Exportar DXF"</li>
                <li>Selecciona qué elementos incluir (altavoces, zonas, referencias)</li>
                <li>El archivo se descarga en formato compatible con AutoCAD</li>
                <li>Abre en tu software CAD preferido</li>
            </ol>

            <h4>Copiar al Portapapeles</h4>
            <p>Copia rápidamente especificaciones técnicas:</p>
            <ul>
                <li>Información del proyecto</li>
                <li>Lista de equipos</li>
                <li>Parámetros acústicos</li>
                <li>Resultados de cálculos</li>
            </ul>
            <p>Útil para pegar en cotizaciones, emails o propuestas.</p>

            <h4>Exportar Proyecto Completo (JSON)</h4>
            <p><strong>Backup completo del proyecto:</strong></p>
            <ul>
                <li>Todas las configuraciones</li>
                <li>Resultados de cálculos</li>
                <li>Historial de cambios</li>
                <li>Posiciones de equipos</li>
            </ul>

            <p><strong>Cómo usar:</strong></p>
            <ol>
                <li>En el menú del proyecto, selecciona "Exportar Proyecto"</li>
                <li>Guarda el archivo JSON</li>
                <li>Para restaurar: "Importar Proyecto" y selecciona el archivo</li>
            </ol>

            <h4>Mejores Prácticas</h4>
            <ul>
                <li>Exporta a PDF para presentaciones a clientes</li>
                <li>Usa DXF para coordinación técnica con otros equipos</li>
                <li>Guarda backups JSON antes de hacer cambios importantes</li>
                <li>Revisa los reportes antes de compartirlos</li>
                <li>Mantén versiones numeradas (ej: Proyecto_v1.pdf, Proyecto_v2.pdf)</li>
            </ul>
        `
    },

    'visualizacion-3d': {
        title: 'Visualización 3D',
        content: `
            <h3>Vista 3D Interactiva</h3>

            <h4>Activar Visualización 3D</h4>
            <ol>
                <li>Completa tu diseño y ejecuta el cálculo</li>
                <li>En la vista de resultados, haz clic en "Ver en 3D"</li>
                <li>La aplicación carga el renderizado 3D (puede tardar unos segundos)</li>
            </ol>

            <h4>Controles de Navegación</h4>
            <ul>
                <li><strong>Click izquierdo + arrastrar:</strong> Rotar la vista</li>
                <li><strong>Scroll del mouse:</strong> Zoom in/out</li>
                <li><strong>Click derecho + arrastrar:</strong> Desplazar (pan)</li>
                <li><strong>Doble click:</strong> Centrar en el punto seleccionado</li>
            </ul>

            <h4>Capas Visualizables</h4>
            <p>Activa o desactiva diferentes capas:</p>
            <ul>
                <li><strong>Mapa de SPL:</strong> Código de colores mostrando nivel de presión sonora
                    <ul>
                        <li>Rojo: SPL alto</li>
                        <li>Verde: SPL óptimo</li>
                        <li>Azul: SPL bajo</li>
                    </ul>
                </li>
                <li><strong>Rayos de Sonido:</strong> Trazado de rayos desde altavoces</li>
                <li><strong>Zonas de Cobertura:</strong> Áreas de influencia de cada sistema</li>
                <li><strong>Posiciones de Altavoces:</strong> Modelos 3D de equipos</li>
                <li><strong>Arquitectura:</strong> Paredes, techo, piso de la sala</li>
                <li><strong>Audiencia:</strong> Representación del área de público</li>
            </ul>

            <h4>Utilidades de la Vista 3D</h4>
            <ul>
                <li><strong>Detectar problemas de cobertura:</strong> Identifica visualmente zonas sin cobertura</li>
                <li><strong>Verificar obstrucciones:</strong> Revisa si hay columnas o estructuras que bloquean el sonido</li>
                <li><strong>Planificar montaje:</strong> Visualiza posiciones exactas para el equipo de instalación</li>
                <li><strong>Presentar a clientes:</strong> Muestra el diseño de forma comprensible y profesional</li>
                <li><strong>Validar alturas:</strong> Verifica que las alturas de montaje sean correctas</li>
            </ul>

            <h4>Captura de Pantalla</h4>
            <ol>
                <li>Posiciona la vista 3D en el ángulo deseado</li>
                <li>Haz clic en el botón "Capturar Vista"</li>
                <li>La imagen se descarga automáticamente</li>
                <li>Úsala en reportes o presentaciones</li>
            </ol>

            <h4>Rendimiento</h4>
            <p>Para mejorar el rendimiento en proyectos grandes:</p>
            <ul>
                <li>Desactiva capas que no necesites visualizar</li>
                <li>Reduce la resolución de cálculo si el renderizado es lento</li>
                <li>Cierra otras aplicaciones que consuman recursos</li>
                <li>Usa un navegador actualizado (Chrome recomendado)</li>
            </ul>

            <h4>Consejos de Visualización</h4>
            <ul>
                <li>Usa la vista 3D para explicar diseños a personas no técnicas</li>
                <li>Rota la vista para ver la sala desde diferentes ángulos</li>
                <li>Combina con los mapas 2D para análisis completo</li>
                <li>Exporta capturas en diferentes ángulos para documentación</li>
            </ul>
        `
    },

    'guardado-nube': {
        title: 'Guardado en la Nube y Sincronización',
        content: `
            <h3>Sistema de Sincronización Automática</h3>

            <h4>Cómo Funciona</h4>
            <ul>
                <li><strong>Guardado Automático:</strong> Cada cambio se guarda automáticamente en la nube</li>
                <li><strong>Sincronización en Tiempo Real:</strong> Los cambios se sincronizan en segundos</li>
                <li><strong>Acceso Multi-Dispositivo:</strong> Accede desde cualquier dispositivo</li>
                <li><strong>Historial de Versiones:</strong> Se mantiene un registro de cambios</li>
            </ul>

            <h4>Indicador de Estado</h4>
            <p>En el footer de la aplicación verás el estado de sincronización:</p>
            <ul>
                <li>🟢 <strong>Verde (Sincronizado):</strong> Todos los cambios están guardados en la nube</li>
                <li>🔵 <strong>Azul (Sincronizando):</strong> Guardando cambios actualmente</li>
                <li>🟡 <strong>Amarillo (Sin Conexión):</strong> Trabajando offline, se sincronizará al reconectar</li>
                <li>🔴 <strong>Rojo (Error):</strong> Problema de sincronización, revisa tu conexión</li>
            </ul>

            <h4>Trabajo Offline</h4>
            <p>LiveSync Pro funciona sin conexión a internet:</p>
            <ul>
                <li>Todos los cálculos se realizan localmente en tu navegador</li>
                <li>Los cambios se guardan en almacenamiento local</li>
                <li>Al reconectar, los cambios se sincronizan automáticamente</li>
                <li>Si hay conflictos, se prioriza la versión más reciente</li>
            </ul>

            <h4>Colaboración en Equipo</h4>
            <p><strong>Crear Código de Equipo:</strong></p>
            <ol>
                <li>Abre tu proyecto</li>
                <li>Haz clic en "Configuración de Equipo"</li>
                <li>Genera un código de invitación único (8 caracteres)</li>
                <li>Comparte el código con tu equipo</li>
                <li>El código expira en 24 horas por seguridad</li>
            </ol>

            <p><strong>Unirse a un Proyecto:</strong></p>
            <ol>
                <li>En la pantalla de acceso, selecciona "Código de Equipo"</li>
                <li>Ingresa el código de 8 caracteres</li>
                <li>Accede al proyecto compartido</li>
                <li>Todos los cambios se sincronizan en tiempo real entre miembros</li>
            </ol>

            <h4>Permisos de Usuario</h4>
            <ul>
                <li><strong>Propietario:</strong> Control total, puede eliminar el proyecto</li>
                <li><strong>Editor:</strong> Puede modificar configuraciones y cálculos</li>
                <li><strong>Visualizador:</strong> Solo puede ver, no editar</li>
            </ul>

            <h4>Gestión de Proyectos</h4>
            <p><strong>Project Hub - Tu centro de control:</strong></p>
            <ul>
                <li>Ver todos tus proyectos con vista previa</li>
                <li>Buscar y filtrar por nombre, fecha o tipo</li>
                <li>Crear nuevo proyecto desde cero o template</li>
                <li>Duplicar proyecto para reutilizar configuraciones</li>
                <li>Eliminar proyectos completados o archivados</li>
            </ul>

            <h4>Organización Recomendada</h4>
            <p><strong>Nombres de Proyecto:</strong></p>
            <pre>[Cliente] - [Tipo de Evento] - [Fecha]
Ejemplo: TechCorp - Conferencia Anual - Feb 2026</pre>

            <h4>Resolución de Problemas</h4>
            <p><strong>Error: "No se pudo sincronizar"</strong></p>
            <ol>
                <li>Verifica tu conexión a internet</li>
                <li>Actualiza la página (F5 o Ctrl+R)</li>
                <li>Si persiste, exporta el proyecto como backup (JSON)</li>
                <li>Contacta soporte si el problema continúa</li>
            </ol>

            <p><strong>Conflictos de Sincronización:</strong></p>
            <ul>
                <li>Si múltiples usuarios editan simultáneamente, se prioriza el cambio más reciente</li>
                <li>Se notifica a los usuarios afectados</li>
                <li>Recomendación: Coordina ediciones importantes con el equipo</li>
            </ul>

            <h4>Backup y Seguridad</h4>
            <ul>
                <li>Todos los datos están cifrados en tránsito y en reposo</li>
                <li>Se mantienen backups automáticos diarios</li>
                <li>Puedes exportar tu proyecto completo en cualquier momento</li>
                <li>Los proyectos eliminados van a papelera por 30 días antes de eliminarse permanentemente</li>
            </ul>
        `
    },

    'asistente-ia': {
        title: 'Asistente de IA',
        content: `
            <h3>Asistente Inteligente de Optimización</h3>

            <h4>¿Qué puede hacer el Asistente de IA?</h4>
            <ul>
                <li>Sugerir configuraciones óptimas para tu sala específica</li>
                <li>Detectar problemas acústicos potenciales</li>
                <li>Recomendar posiciones ideales de altavoces y torres de delay</li>
                <li>Explicar conceptos técnicos de forma comprensible</li>
                <li>Analizar resultados y proponer mejoras</li>
                <li>Comparar diferentes opciones de diseño</li>
            </ul>

            <h4>Cómo Activar el Asistente</h4>
            <ol>
                <li>Ubica el ícono de IA (🤖) en la barra superior de la aplicación</li>
                <li>Haz clic para abrir el panel del asistente</li>
                <li>Escribe tu pregunta o solicitud</li>
                <li>Recibe recomendaciones personalizadas basadas en tu proyecto actual</li>
            </ol>

            <h4>Ejemplos de Preguntas</h4>
            <ul>
                <li>"¿Cómo puedo mejorar la inteligibilidad en las últimas filas?"</li>
                <li>"¿Necesito torres de delay para este diseño?"</li>
                <li>"¿Por qué mi RT60 es muy alto?"</li>
                <li>"Sugiere la mejor posición para el sistema principal"</li>
                <li>"¿Qué materiales debo usar para reducir la reverberación?"</li>
                <li>"Analiza mi diseño y dame recomendaciones"</li>
            </ul>

            <h4>Análisis Automático</h4>
            <p>El asistente analiza automáticamente:</p>
            <ul>
                <li><strong>Geometría de la Sala:</strong> Proporciones, volumen, altura</li>
                <li><strong>Acústica:</strong> RT60, absorción, reflexiones</li>
                <li><strong>Sistema de Sonido:</strong> Modelo, posición, cobertura</li>
                <li><strong>Resultados:</strong> SPL, STI, zonas problemáticas</li>
            </ul>

            <h4>Recomendaciones Típicas</h4>
            <p><strong>Inteligibilidad Baja:</strong></p>
            <ul>
                <li>Reducir RT60 agregando absorción</li>
                <li>Agregar torres de delay en zonas alejadas</li>
                <li>Ajustar ángulo de altavoces principales</li>
                <li>Considerar sistema con mejor directividad</li>
            </ul>

            <p><strong>Cobertura Irregular:</strong></p>
            <ul>
                <li>Reposicionar sistema principal</li>
                <li>Agregar fill speakers en zonas débiles</li>
                <li>Ajustar cantidad de cajas en el array</li>
                <li>Modificar ángulos de apertura</li>
            </ul>

            <p><strong>RT60 Problemático:</strong></p>
            <ul>
                <li>Sugerencias de materiales absorbentes</li>
                <li>Áreas específicas donde aplicar tratamiento</li>
                <li>Cálculos de cuánto material se necesita</li>
            </ul>

            <h4>Explicación de Conceptos</h4>
            <p>Pregunta al asistente sobre cualquier término técnico:</p>
            <ul>
                <li>"¿Qué es el STI y por qué es importante?"</li>
                <li>"Explica el comb filtering"</li>
                <li>"¿Cómo funciona el delay time?"</li>
                <li>"¿Qué significa coeficiente de absorción?"</li>
            </ul>

            <h4>Limitaciones</h4>
            <ul>
                <li>El asistente proporciona recomendaciones basadas en cálculos, pero la decisión final es tuya</li>
                <li>Siempre valida sugerencias con mediciones reales cuando sea posible</li>
                <li>Considera factores adicionales como presupuesto y disponibilidad de equipos</li>
            </ul>

            <h4>Consejos de Uso</h4>
            <ul>
                <li>Sé específico en tus preguntas para mejores respuestas</li>
                <li>Proporciona contexto (tipo de evento, restricciones, objetivos)</li>
                <li>Usa el asistente durante todo el proceso de diseño, no solo al final</li>
                <li>Compara múltiples sugerencias antes de decidir</li>
            </ul>
        `
    },

    'solucion-problemas': {
        title: 'Solución de Problemas Comunes',
        content: `
            <h3>Problemas y Soluciones</h3>

            <h4>Problemas de Cálculo</h4>

            <p><strong>Los cálculos tardan mucho tiempo</strong></p>
            <ul>
                <li><strong>Causa:</strong> Resolución de simulación muy alta o sala muy grande</li>
                <li><strong>Solución:</strong>
                    <ul>
                        <li>En Configuración Avanzada > Parámetros de Simulación</li>
                        <li>Reduce la resolución de cálculo (usa 0.25m en lugar de 0.125m)</li>
                        <li>Limita las bandas de frecuencia analizadas</li>
                        <li>Cierra otras aplicaciones pesadas</li>
                    </ul>
                </li>
            </ul>

            <p><strong>Resultados inconsistentes o extraños</strong></p>
            <ul>
                <li><strong>Verifica:</strong>
                    <ul>
                        <li>Dimensiones de la sala correctas (en metros, no pies)</li>
                        <li>Sistema de sonido configurado apropiadamente</li>
                        <li>Coeficientes de absorción realistas (0.0 a 1.0)</li>
                        <li>Posiciones de equipos dentro de la sala</li>
                    </ul>
                </li>
            </ul>

            <h4>Problemas de Guardado</h4>

            <p><strong>El proyecto no se guarda</strong></p>
            <ul>
                <li><strong>Verifica el indicador de estado:</strong> Footer de la aplicación</li>
                <li><strong>Si está en rojo:</strong>
                    <ol>
                        <li>Revisa tu conexión a internet</li>
                        <li>Actualiza la página (F5)</li>
                        <li>Exporta el proyecto como backup (JSON)</li>
                    </ol>
                </li>
                <li><strong>Si está en amarillo:</strong> Estás offline, se guardará al reconectar</li>
            </ul>

            <p><strong>Perdí cambios recientes</strong></p>
            <ul>
                <li>Revisa el historial de versiones en el menú del proyecto</li>
                <li>Si trabajabas en equipo, pregunta a otros miembros</li>
                <li>Contacta soporte para recuperación de datos</li>
            </ul>

            <h4>Problemas de Exportación</h4>

            <p><strong>El PDF no se genera</strong></p>
            <ul>
                <li>Asegúrate de que el proyecto tenga resultados calculados</li>
                <li>Verifica que el navegador permita descargas</li>
                <li>Prueba con un navegador diferente (Chrome recomendado)</li>
                <li>Desactiva bloqueadores de pop-ups temporalmente</li>
            </ul>

            <p><strong>El archivo DXF no abre correctamente</strong></p>
            <ul>
                <li>Asegúrate de usar software CAD compatible (AutoCAD, DraftSight, etc.)</li>
                <li>Verifica la versión del archivo DXF</li>
                <li>Ajusta las unidades en tu software CAD (metros)</li>
            </ul>

            <h4>Problemas de Rendimiento</h4>

            <p><strong>La aplicación va lenta</strong></p>
            <ul>
                <li>Limpia caché del navegador (Ctrl+Shift+Del)</li>
                <li>Cierra pestañas innecesarias</li>
                <li>Cierra otras aplicaciones que consuman recursos</li>
                <li>Actualiza tu navegador a la última versión</li>
                <li>Considera usar un equipo con más RAM para proyectos grandes</li>
            </ul>

            <p><strong>La vista 3D no carga o es muy lenta</strong></p>
            <ul>
                <li>Desactiva capas innecesarias en la vista 3D</li>
                <li>Reduce la resolución de cálculo</li>
                <li>Verifica que tu navegador soporte WebGL (prueba en Chrome)</li>
                <li>Actualiza los drivers de tu tarjeta gráfica</li>
            </ul>

            <h4>Problemas de Acceso</h4>

            <p><strong>No puedo iniciar sesión</strong></p>
            <ul>
                <li>Verifica tu PIN o código de equipo</li>
                <li>Asegúrate de tener licencia válida</li>
                <li>Limpia caché y cookies del navegador</li>
                <li>Contacta a tu administrador para verificar tu cuenta</li>
            </ul>

            <p><strong>No veo proyectos compartidos</strong></p>
            <ul>
                <li>Verifica que el código de equipo sea correcto</li>
                <li>Confirma que el código no haya expirado (válido 24 horas)</li>
                <li>Actualiza la página</li>
                <li>Pide al propietario que genere un nuevo código</li>
            </ul>

            <h4>Problemas de Visualización</h4>

            <p><strong>Los mapas de cobertura se ven incorrectos</strong></p>
            <ul>
                <li>Verifica que los cálculos se hayan completado correctamente</li>
                <li>Revisa la escala de colores (puede necesitar ajuste)</li>
                <li>Recalcula el sistema si cambiaste parámetros</li>
                <li>Exporta a PDF para ver con mejor resolución</li>
            </ul>

            <h4>Contactar Soporte</h4>
            <p>Si los problemas persisten, contacta soporte con:</p>
            <ul>
                <li>Descripción detallada del problema</li>
                <li>Pasos para reproducirlo</li>
                <li>Captura de pantalla del error</li>
                <li>Navegador y sistema operativo que usas</li>
                <li>ID del proyecto (si es relevante)</li>
            </ul>

            <p><strong>Canales de soporte:</strong></p>
            <ul>
                <li>Email: abrinay@livesyncpro.com</li>
                <li>Tickets: Sección Tickets en esta plataforma</li>
                <li>Chat: Asistente automático 24/7</li>
            </ul>
        `
    },

    'mejores-practicas': {
        title: 'Mejores Prácticas y Consejos',
        content: `
            <h3>Consejos para Diseños Exitosos</h3>

            <h4>Antes de Empezar</h4>
            <ul>
                <li><strong>Obtén planos reales:</strong> Usa mediciones precisas de la sala, no estimaciones</li>
                <li><strong>Visita el sitio:</strong> Si es posible, visita el venue antes de diseñar</li>
                <li><strong>Conoce el evento:</strong> Tipo de contenido, duración, audiencia esperada</li>
                <li><strong>Verifica equipamiento:</strong> Confirma disponibilidad del equipo que planeas usar</li>
                <li><strong>Define restricciones:</strong> Presupuesto, puntos de rigging, límites de peso</li>
            </ul>

            <h4>Durante el Diseño</h4>
            <ul>
                <li><strong>Comienza con un preset:</strong> Usa el preset apropiado como punto de partida</li>
                <li><strong>Valida dimensiones:</strong> Verifica dos veces que las medidas sean correctas</li>
                <li><strong>Considera la audiencia:</strong> El público absorbe ~80% del sonido cuando está sentado</li>
                <li><strong>Piensa en 3D:</strong> No solo cobertura horizontal, también vertical</li>
                <li><strong>Usa la vista 3D:</strong> Ayuda a detectar problemas no evidentes en 2D</li>
            </ul>

            <h4>Objetivos por Tipo de Evento</h4>

            <p><strong>Eventos Corporativos:</strong></p>
            <ul>
                <li>Prioridad #1: Inteligibilidad (STI > 0.75)</li>
                <li>RT60 bajo (0.6-0.8s) para claridad máxima</li>
                <li>Cobertura uniforme en toda el área</li>
                <li>SPL moderado (no debe ser fatigante)</li>
            </ul>

            <p><strong>Conciertos y Música:</strong></p>
            <ul>
                <li>Balance entre claridad y ambiente</li>
                <li>RT60 moderado (0.8-1.2s)</li>
                <li>Respuesta de bajos adecuada (subwoofers necesarios)</li>
                <li>SPL elevado pero controlado</li>
            </ul>

            <p><strong>Festivales al Aire Libre:</strong></p>
            <ul>
                <li>Largo alcance es crucial</li>
                <li>Múltiples torres de delay casi siempre necesarias</li>
                <li>Considera el viento y temperatura</li>
                <li>Sistema robusto y confiable</li>
            </ul>

            <h4>Torres de Delay</h4>
            <ul>
                <li><strong>Usa en salas >30m:</strong> Profundidad mayor a 30m casi siempre requiere delay</li>
                <li><strong>Timing es crítico:</strong> Ajusta el delay time con precisión</li>
                <li><strong>Niveles correctos:</strong> 6-10dB más alto que el sistema principal en su zona</li>
                <li><strong>Posicionamiento:</strong> Alinea con el sistema principal cuando sea posible</li>
            </ul>

            <h4>Materiales y Acústica</h4>
            <ul>
                <li><strong>Audiencia = absorción:</strong> Nunca olvides considerar al público</li>
                <li><strong>Superficies duras:</strong> Concreto, vidrio son muy reflectivos</li>
                <li><strong>Tratamiento:</strong> Cortinas, alfombras ayudan a controlar RT60</li>
                <li><strong>Sabine válido:</strong> La fórmula de Sabine funciona bien en salas >100m³</li>
            </ul>

            <h4>Validación y Verificación</h4>
            <ul>
                <li><strong>Revisa todos los parámetros:</strong> SPL, STI, RT60 deben estar en rango</li>
                <li><strong>No confíes solo en números:</strong> Usa el mapa de cobertura visual</li>
                <li><strong>Pide segunda opinión:</strong> Comparte con colegas experimentados</li>
                <li><strong>Usa el asistente IA:</strong> Pide análisis y recomendaciones</li>
                <li><strong>Mediciones reales:</strong> Valida con mediciones en sitio cuando sea posible</li>
            </ul>

            <h4>Documentación</h4>
            <ul>
                <li><strong>Exporta a PDF:</strong> Crea reportes profesionales para clientes</li>
                <li><strong>Planos DXF:</strong> Proporciona coordenadas exactas al equipo de montaje</li>
                <li><strong>Versiones numeradas:</strong> Mantén historial (v1, v2, v3...)</li>
                <li><strong>Notas detalladas:</strong> Documenta decisiones y consideraciones especiales</li>
            </ul>

            <h4>Trabajo en Equipo</h4>
            <ul>
                <li><strong>Comparte proyectos:</strong> Usa códigos de equipo para colaboración</li>
                <li><strong>Coordina ediciones:</strong> Evita conflictos editando simultáneamente</li>
                <li><strong>Comunica cambios:</strong> Notifica al equipo sobre modificaciones importantes</li>
                <li><strong>Backup regular:</strong> Exporta JSON antes de cambios grandes</li>
            </ul>

            <h4>Errores Comunes a Evitar</h4>
            <ul>
                <li>❌ Olvidar considerar la absorción de la audiencia</li>
                <li>❌ Usar dimensiones incorrectas (confundir metros con pies)</li>
                <li>❌ No agregar delay en salas largas</li>
                <li>❌ Sobrediseñar (más altavoces no siempre es mejor)</li>
                <li>❌ Ignorar obstrucciones (columnas, balcones)</li>
                <li>❌ No verificar límites de peso en puntos de rigging</li>
                <li>❌ Confiar solo en cálculos sin validación práctica</li>
            </ul>

            <h4>Optimización Final</h4>
            <ul>
                <li>Revisa zonas rojas en el mapa de cobertura</li>
                <li>Ajusta posiciones para maximizar uniformidad</li>
                <li>Minimiza zonas de suma destructiva (comb filtering)</li>
                <li>Verifica que el diseño sea realizable físicamente</li>
                <li>Confirma que el presupuesto sea viable</li>
            </ul>

            <h4>Día del Evento</h4>
            <ul>
                <li>Lleva copias impresas del diseño y reportes</li>
                <li>Ten backup digital en múltiples dispositivos</li>
                <li>Realiza mediciones con analizador en sitio</li>
                <li>Ajusta según condiciones reales (temperatura, humedad, ocupación)</li>
                <li>Documenta el setup final para referencia futura</li>
            </ul>
        `
    }
};

// Exportar base de conocimientos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KNOWLEDGE_BASE;
}
