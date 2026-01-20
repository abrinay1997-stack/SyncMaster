// ========================================
// CONTENIDO DEL MANUAL LIVESYNC PRO
// Integrado directamente en la aplicación
// ========================================

const MANUAL_CONTENT = {
    parts: [
        {
            id: 'part-1',
            title: 'INTRODUCCIÓN Y HUB DE PROYECTOS',
            icon: '📚',
            sections: [
                {
                    id: 'welcome',
                    title: '1. BIENVENIDA A LIVESYNC PRO',
                    content: `
                        <h3>1. BIENVENIDA A LIVESYNC PRO</h3>
                        <p>LiveSync Pro es una plataforma web profesional que permite a ingenieros de audio diseñar, calcular y optimizar sistemas completos de sonido para eventos en vivo. La aplicación combina física acústica avanzada, modelado atmosférico y cálculos de ingeniería para generar reportes técnicos profesionales (Technical Riders) con precisión científica.</p>

                        <h4>¿Qué puedes hacer con LiveSync Pro?</h4>
                        <ul>
                            <li>✅ <strong>Diseñar sistemas PA completos:</strong> Line Arrays, Subwoofers, Delay Towers.</li>
                            <li>✅ <strong>Calcular delays geométricos:</strong> Con compensación atmosférica basada en la norma ISO 9613-1.</li>
                            <li>✅ <strong>Optimizar alineación de fase:</strong> Ajuste preciso entre el PA principal y el sistema de subgraves.</li>
                            <li>✅ <strong>Generar curvas de EQ:</strong> Ecualización correctiva automática para torres de delay según la distancia y el entorno.</li>
                            <li>✅ <strong>Calcular infraestructura:</strong> Análisis de carga eléctrica trifásica y seguridad en rigging.</li>
                            <li>✅ <strong>Exportar reportes técnicos:</strong> Generación de archivos PDF profesionales y planos CAD (DXF).</li>
                            <li>✅ <strong>Colaborar en tiempo real:</strong> Gestión de equipos de hasta 5 personas para proyectos compartidos (Plan Corporativo).</li>
                        </ul>
                    `
                },
                {
                    id: 'access',
                    title: '2. ACCESO A LA PLATAFORMA',
                    content: `
                        <h3>2. ACCESO A LA PLATAFORMA</h3>

                        <h4>2.1 Registro e Inicio de Sesión</h4>
                        <p>Al ingresar a <a href="https://livesyncpro.com" target="_blank">https://livesyncpro.com</a> verás la Landing Page con información detallada sobre las capacidades de la suite. Para comenzar a trabajar:</p>
                        <ol>
                            <li>Haz clic en el botón <strong>'Iniciar Sesión'</strong> (ubicado en la esquina superior derecha).</li>
                            <li>Selecciona tu método de autenticación:
                                <ul>
                                    <li><strong>Google OAuth:</strong> (Recomendado) Login instantáneo con tu cuenta profesional de Google.</li>
                                    <li><strong>Email/Password:</strong> Registro manual mediante correo electrónico y contraseña verificada.</li>
                                </ul>
                            </li>
                        </ol>

                        <h4>2.2 Planes de Suscripción</h4>
                        <p>LiveSync Pro ofrece niveles de servicio adaptados a la escala de tu producción:</p>
                        <table style="width: 100%; margin: 1rem 0; border-collapse: collapse;">
                            <thead>
                                <tr style="background: var(--bg-card); border-bottom: 1px solid var(--border-medium);">
                                    <th style="padding: 0.75rem; text-align: left;">Plan</th>
                                    <th style="padding: 0.75rem; text-align: left;">Precio</th>
                                    <th style="padding: 0.75rem; text-align: left;">Características Principales</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="border-bottom: 1px solid var(--border-subtle);">
                                    <td style="padding: 0.75rem;">Trial</td>
                                    <td style="padding: 0.75rem;">Gratis</td>
                                    <td style="padding: 0.75rem;">0 Proyectos, acceso limitado a base de datos de altavoces</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--border-subtle);">
                                    <td style="padding: 0.75rem;">Standard</td>
                                    <td style="padding: 0.75rem;">$99/año</td>
                                    <td style="padding: 0.75rem;">Proyectos ilimitados, exportación completa PDF/CAD</td>
                                </tr>
                                <tr style="border-bottom: 1px solid var(--border-subtle);">
                                    <td style="padding: 0.75rem;">Corporate</td>
                                    <td style="padding: 0.75rem;">$499/año</td>
                                    <td style="padding: 0.75rem;">Gestión de equipos (5 licencias), proyectos compartidos</td>
                                </tr>
                                <tr>
                                    <td style="padding: 0.75rem;">Partner</td>
                                    <td style="padding: 0.75rem;">Custom</td>
                                    <td style="padding: 0.75rem;">Licencias personalizadas para empresas de renta</td>
                                </tr>
                            </tbody>
                        </table>
                    `
                },
                {
                    id: 'project-hub',
                    title: '3. HUB DE PROYECTOS',
                    content: `
                        <h3>3. HUB DE PROYECTOS (PROJECT HUB)</h3>
                        <p>Una vez autenticado, accederás al <strong>Project Hub</strong>, tu centro de comando donde se centralizan todos los diseños de ingeniería.</p>

                        <h4>3.1 Interfaz del Hub</h4>
                        <p>El Hub se divide en componentes clave para agilizar el flujo de trabajo:</p>

                        <p><strong>A. Encabezado Superior (Global Header):</strong></p>
                        <ul>
                            <li><strong>Título 'Project Hub':</strong> Indica que te encuentras en la raíz de tus archivos.</li>
                            <li><strong>Widget de Equipo:</strong> Muestra el estado de tu suscripción corporativa y miembros activos.</li>
                            <li><strong>Barra de Búsqueda:</strong> Filtro inteligente por nombre de proyecto o cliente.</li>
                            <li><strong>Botón de Sincronización ⟳:</strong> Fuerza la actualización de datos con la base de datos Supabase.</li>
                            <li><strong>Botón 'Nuevo Proyecto':</strong> Botón cyan para iniciar un flujo de diseño desde cero.</li>
                        </ul>

                        <p><strong>B. Grilla de Proyectos (Project Grid):</strong></p>
                        <p>Cada tarjeta de proyecto funciona como un resumen ejecutivo que incluye:</p>
                        <ul>
                            <li><strong>Nombre del Proyecto:</strong> Identificador único (ej: 'Festival Estéreo Picnic').</li>
                            <li><strong>Cliente:</strong> Nombre de la productora o artista contratante.</li>
                            <li><strong>Tipo de Proyecto:</strong>
                                <ul>
                                    <li>🔒 <strong>PRIV (Privado):</strong> Solo tú puedes verlo y editarlo</li>
                                    <li>👥 <strong>TEAM (Compartido):</strong> Visible y editable por todo tu equipo</li>
                                </ul>
                            </li>
                            <li><strong>Última Modificación:</strong> Fecha y hora de la última sincronización en la nube.</li>
                        </ul>
                    `
                }
            ]
        },
        {
            id: 'part-2',
            title: 'CONFIGURACIÓN DE PROYECTOS',
            icon: '⚙️',
            sections: [
                {
                    id: 'environment',
                    title: '6. ENTORNO Y ATMÓSFERA',
                    content: `
                        <h3>6. ENTORNO Y ATMÓSFERA</h3>
                        <p>La sección de Environment en LiveSync Pro es el corazón del modelado físico del sonido. Aquí defines las condiciones atmosféricas y geográficas que afectan la propagación de las ondas acústicas.</p>

                        <h4>Parámetros Atmosféricos Básicos</h4>
                        <ul>
                            <li><strong>Temperatura:</strong> 15°C a 35°C - Afecta la velocidad del sonido (331.3 + 0.6×T m/s)</li>
                            <li><strong>Humedad Relativa:</strong> 20% a 90% - Controla la absorción de alta frecuencia</li>
                            <li><strong>Altitud:</strong> 0 a 3000m - Modifica la presión atmosférica y la densidad del aire</li>
                            <li><strong>Presión Atmosférica:</strong> Calculada automáticamente según altitud</li>
                        </ul>

                        <div style="background: rgba(14, 165, 233, 0.1); border-left: 3px solid var(--primary-light); padding: 1rem; margin: 1rem 0;">
                            <p><strong>💡 Consejo Pro:</strong> En ciudades de alta altitud (ej: Ciudad de México a 2240m), el sistema calculará automáticamente una pérdida de ~2dB SPL comparado con el nivel del mar. Compensa esto con más cajas o mayor potencia.</p>
                        </div>
                    `
                },
                {
                    id: 'pa-system',
                    title: '7. SISTEMA PRINCIPAL (PA)',
                    content: `
                        <h3>7. SISTEMA PRINCIPAL (PA)</h3>
                        <p>El PA System es el núcleo de tu diseño. Aquí defines el tipo de altavoces, configuración y geometría del sistema principal.</p>

                        <h4>7.1 Configuración del Line Array</h4>
                        <p><strong>Tipos de configuración:</strong></p>
                        <ul>
                            <li><strong>Left/Right (L/R):</strong> Configuración estéreo estándar - dos arrays principales</li>
                            <li><strong>Mono Center:</strong> Array central único - ideal para discursos/corporativos</li>
                            <li><strong>Arrays Laterales:</strong> Configuración multi-punto para venues anchos</li>
                        </ul>

                        <h4>7.2 Selección de Modelo</h4>
                        <p>LiveSync Pro incluye más de 100 modelos de altavoces profesionales:</p>
                        <ul>
                            <li><strong>L-Acoustics:</strong> K1, K2, K3, Kara, Kara II, LA12X</li>
                            <li><strong>d&b audiotechnik:</strong> GSL, KSL, V-Series, Y-Series</li>
                            <li><strong>Meyer Sound:</strong> LEO, LYON, LEOPARD, LINA</li>
                            <li><strong>JBL:</strong> VTX A12, V20, M20</li>
                            <li><strong>Adamson:</strong> S-Series, E-Series</li>
                        </ul>

                        <h4>7.3 Ángulos Splay</h4>
                        <p>La curvatura del array define la cobertura vertical:</p>
                        <ul>
                            <li><strong>0-1°:</strong> Throw largo (>50m) - Suma coherente</li>
                            <li><strong>2-4°:</strong> Throw medio (30-50m) - Balance</li>
                            <li><strong>5-8°:</strong> Throw corto (<30m) - Cobertura amplia</li>
                        </ul>
                    `
                }
            ]
        },
        {
            id: 'part-3',
            title: 'ANÁLISIS Y RESULTADOS',
            icon: '📊',
            sections: [
                {
                    id: 'analysis',
                    title: 'ANÁLISIS DEL SISTEMA',
                    content: `
                        <h3>ANÁLISIS Y RESULTADOS</h3>
                        <p>Una vez configurado el sistema, LiveSync Pro realiza más de 50 cálculos simultáneos para generar un análisis técnico completo.</p>

                        <h4>Métricas Principales</h4>
                        <ul>
                            <li><strong>SPL Máximo:</strong> Nivel de presión sonora teórico en el FOH</li>
                            <li><strong>Array Limit:</strong> Distancia de transición Fresnel/Fraunhofer</li>
                            <li><strong>Power Alley:</strong> Suma de subwoofers en el eje central (+6dB)</li>
                            <li><strong>Ground Bounce:</strong> Reflexiones del suelo y filtrado en peine</li>
                            <li><strong>Thermal Compression:</strong> Pérdida de SPL por calentamiento (~3dB en 2h)</li>
                        </ul>

                        <h4>Delays Geométricos</h4>
                        <p>El sistema calcula automáticamente:</p>
                        <ul>
                            <li>Delays para todas las torres (compensación de distancia)</li>
                            <li>Offset psicoacústico (+10ms para reforzar precedencia)</li>
                            <li>Thermal drift (compensación por cambio de temperatura)</li>
                            <li>Curvas de EQ correctivas (Air Loss Compensation)</li>
                        </ul>
                    `
                }
            ]
        },
        {
            id: 'part-4',
            title: 'INFRAESTRUCTURA Y POTENCIA',
            icon: '⚡',
            sections: [
                {
                    id: 'power',
                    title: 'ANÁLISIS ELÉCTRICO',
                    content: `
                        <h3>INFRAESTRUCTURA ELÉCTRICA</h3>
                        <p>LiveSync Pro calcula la distribución de potencia trifásica para todo el sistema.</p>

                        <h4>Cálculos Incluidos</h4>
                        <ul>
                            <li><strong>Consumo Total:</strong> Potencia RMS de todos los amplificadores</li>
                            <li><strong>Distribución de Fases:</strong> Balance L1/L2/L3 (mantener <20% desbalance)</li>
                            <li><strong>Corriente por Fase:</strong> Amperaje en 120V o 208V</li>
                            <li><strong>Factor de Potencia:</strong> PFC >0.95 en amplificadores modernos</li>
                            <li><strong>Voltage Drop:</strong> Caída de tensión por longitud de cable</li>
                            <li><strong>Damping Factor:</strong> Control de amortiguamiento (DF >100 recomendado)</li>
                        </ul>

                        <h4>Rigging y Seguridad</h4>
                        <ul>
                            <li>Peso total del sistema (arrays + hardware + cables)</li>
                            <li>Carga por punto de rigging</li>
                            <li>Factor de seguridad 5:1 (mínimo)</li>
                            <li>Altura de trim recomendada</li>
                        </ul>
                    `
                }
            ]
        },
        {
            id: 'part-5',
            title: 'EXPORTACIÓN Y REPORTES',
            icon: '📄',
            sections: [
                {
                    id: 'export',
                    title: 'GENERACIÓN DE REPORTES',
                    content: `
                        <h3>EXPORTACIÓN DE REPORTES</h3>
                        <p>LiveSync Pro genera documentación técnica profesional para producción.</p>

                        <h4>Formatos de Exportación</h4>
                        <ul>
                            <li><strong>PDF Technical Rider:</strong> Reporte completo con todos los cálculos y diagramas</li>
                            <li><strong>DXF (AutoCAD):</strong> Plano vectorial 2D para integración con CAD</li>
                            <li><strong>PNG/JPG:</strong> Renders del sistema para presentaciones</li>
                        </ul>

                        <h4>Contenido del Technical Rider (PDF)</h4>
                        <ol>
                            <li>Portada con logo del proyecto</li>
                            <li>Resumen ejecutivo (1 página)</li>
                            <li>Plano de planta (Top View)</li>
                            <li>Elevación lateral (Side View)</li>
                            <li>Especificaciones del PA principal</li>
                            <li>Tabla de delays y EQ por zona</li>
                            <li>IO List y Patch de amplificadores</li>
                            <li>Análisis eléctrico trifásico</li>
                            <li>Cable list (longitudes y calibres)</li>
                            <li>Especificaciones de rigging</li>
                        </ol>
                    `
                }
            ]
        },
        {
            id: 'part-6',
            title: 'PREGUNTAS FRECUENTES (FAQ)',
            icon: '❓',
            sections: [
                {
                    id: 'faq',
                    title: 'PREGUNTAS FRECUENTES',
                    content: `
                        <h3>PREGUNTAS FRECUENTES (FAQ)</h3>

                        <h4>¿Necesito conocimientos de física acústica?</h4>
                        <p>No es obligatorio, pero se recomienda. LiveSync Pro está diseñado para ingenieros con experiencia en refuerzo sonoro. El sistema hace los cálculos complejos por ti, pero debes entender los conceptos básicos de line arrays, delays y alineación de fase.</p>

                        <h4>¿Funciona offline?</h4>
                        <p>Sí, LiveSync Pro es una PWA (Progressive Web App). Una vez cargada, puedes trabajar sin conexión. Los cambios se sincronizan automáticamente cuando recuperas conexión.</p>

                        <h4>¿Puedo importar proyectos de otros softwares?</h4>
                        <p>Actualmente no. LiveSync Pro usa un formato propietario optimizado. Sin embargo, puedes exportar a DXF para integración con otros sistemas CAD.</p>

                        <h4>¿Qué tan precisos son los cálculos?</h4>
                        <p>Los cálculos están basados en normas ISO 9613-1 para propagación atmosférica y datos oficiales de fabricantes. La precisión típica es ±1dB comparado con mediciones reales en campo.</p>

                        <h4>¿Cuántos proyectos puedo tener?</h4>
                        <p>Plan Standard: Ilimitados. Plan Corporate: Ilimitados + compartidos con equipo.</p>
                    `
                }
            ]
        },
        {
            id: 'part-7',
            title: 'RECURSOS Y SOPORTE',
            icon: '🔧',
            sections: [
                {
                    id: 'resources',
                    title: 'RECURSOS ADICIONALES',
                    content: `
                        <h3>RECURSOS Y SOPORTE</h3>

                        <h4>Soporte Técnico</h4>
                        <ul>
                            <li><strong>Email:</strong> abrinay@livesyncpro.com</li>
                            <li><strong>Chat Automático:</strong> Disponible 24/7 en este sitio</li>
                            <li><strong>Tiempo de respuesta:</strong> <48 horas (días laborables)</li>
                        </ul>

                        <h4>Documentación Adicional</h4>
                        <ul>
                            <li><a href="https://livesyncpro.com" target="_blank">Sitio web principal</a></li>
                            <li><a href="https://livesyncpro.com/blog" target="_blank">Blog técnico</a></li>
                            <li><a href="https://livesyncpro.com/changelog" target="_blank">Changelog y actualizaciones</a></li>
                        </ul>

                        <h4>Tutoriales en Video</h4>
                        <p>Próximamente: Canal de YouTube con tutoriales paso a paso, casos de uso reales y tips de optimización.</p>

                        <h4>Actualizaciones</h4>
                        <p>LiveSync Pro recibe actualizaciones mensuales con:</p>
                        <ul>
                            <li>Nuevos modelos de altavoces</li>
                            <li>Mejoras en el motor de cálculo</li>
                            <li>Corrección de bugs</li>
                            <li>Nuevas funcionalidades</li>
                        </ul>

                        <div style="background: rgba(168, 85, 247, 0.1); border-left: 3px solid #a855f7; padding: 1rem; margin: 1rem 0;">
                            <p><strong>🎉 ¿Listo para empezar?</strong></p>
                            <p>Visita <a href="https://livesyncpro.com" target="_blank">livesyncpro.com</a> y crea tu primer proyecto. Si tienes dudas, usa el chatbot de esta página o escríbenos.</p>
                        </div>
                    `
                }
            ]
        }
    ]
};

// Exportar para uso en la aplicación
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MANUAL_CONTENT;
}

// Confirmar que el archivo se cargó
console.log('✅ manual-content.js loaded successfully -', MANUAL_CONTENT.parts.length, 'parts available');
