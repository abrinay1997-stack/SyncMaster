// Configuración de SyncMaster - Soporte para LiveSync Pro
const CONFIG = {
    // Información de la aplicación de soporte
    app: {
        name: 'SyncMaster',
        version: '1.0.0',
        description: 'Centro de Soporte Técnico para LiveSync Pro - Sistema de Diseño Acústico',
        supportEmail: 'support@livesyncpro.com',
        supportPhone: '+1-800-ACOUSTIC',
        website: 'https://abrinay1997-stack.github.io/SyncMaster',
        githubRepo: 'https://github.com/abrinay1997-stack/SyncMaster'
    },

    // Configuración de LiveSync Pro (información real del repositorio)
    livesyncpro: {
        name: 'LiveSync Pro',
        version: '1.0.0',
        description: 'Sistema Profesional de Diseño y Simulación Acústica - System Alignment Engine',
        fullDescription: 'LiveSync Pro es una aplicación avanzada para el diseño de sistemas de refuerzo sonoro. Permite calcular cobertura SPL, inteligibilidad (STI), tiempo de reverberación (RT60), y optimizar la posición de altavoces y torres de delay. Incluye visualización 3D, exportación a PDF/DXF, y asistente de IA.',
        repository: 'https://github.com/abrinay1997-stack/LiveSync-Pro',
        aiStudioUrl: 'https://ai.studio/apps/drive/18KB4IU6KzA9Jr39Z4tEdMPe08n6WLqB3',

        // Stack tecnológico real
        stack: {
            frontend: 'React 18.3.1 + TypeScript',
            buildTool: 'Vite',
            backend: 'Supabase',
            ai: 'Google Gemini API',
            graphics3D: 'Three.js 0.160.0',
            charts: 'Recharts 2.12.7',
            pdf: 'jsPDF 2.5.1 + autotable',
            icons: 'Lucide React',
            testing: 'Vitest + React Testing Library'
        },

        // Características principales
        features: [
            'Diseño de sistemas de refuerzo sonoro profesional',
            'Cálculo de cobertura SPL (Sound Pressure Level)',
            'Análisis de inteligibilidad (STI - Speech Transmission Index)',
            'Cálculo de tiempo de reverberación (RT60)',
            'Gestión de torres de delay y fill speakers',
            'Presets para diferentes tipos de eventos (Corporativo, Concierto, Festival)',
            'Visualización 3D interactiva con Three.js',
            'Exportación a PDF con reportes detallados',
            'Exportación a DXF para AutoCAD',
            'Sincronización en la nube con Supabase',
            'Colaboración en tiempo real',
            'Asistente de IA con Google Gemini',
            'Project Hub para gestión de múltiples proyectos',
            'Autenticación multi-nivel (PIN, códigos de equipo, licencias)'
        ],

        // Plataformas soportadas
        platforms: [
            'Web (acceso desde cualquier navegador moderno)',
            'AI Studio (versión alojada)',
            'Desarrollo local (Windows, macOS, Linux)'
        ],

        // Variables de entorno necesarias
        envVars: {
            'VITE_SUPABASE_URL': {
                description: 'URL del proyecto Supabase',
                required: true,
                example: 'https://tu-proyecto.supabase.co'
            },
            'VITE_SUPABASE_ANON_KEY': {
                description: 'Clave anónima de Supabase',
                required: true,
                example: 'tu_clave_anon_aqui'
            },
            'GEMINI_API_KEY': {
                description: 'Clave de API de Google Gemini para asistente IA',
                required: false,
                example: 'tu_clave_gemini_aqui'
            }
        },

        // Scripts disponibles
        scripts: {
            'npm run dev': 'Inicia servidor de desarrollo (localhost:5173)',
            'npm run build': 'Compila TypeScript y genera build de producción',
            'npm run preview': 'Vista previa del build',
            'npm test': 'Ejecuta suite de pruebas con Vitest',
            'npm run test:ui': 'Abre interfaz gráfica de pruebas',
            'npm run test:coverage': 'Genera reporte de cobertura de código',
            'npm run test:run': 'Ejecuta tests una sola vez (CI/CD)'
        }
    },

    // Enlaces útiles
    links: {
        documentation: 'https://abrinay1997-stack.github.io/SyncMaster/#conocimiento',
        repository: 'https://github.com/abrinay1997-stack/LiveSync-Pro',
        appRepository: 'https://ai.studio/apps/drive/18KB4IU6KzA9Jr39Z4tEdMPe08n6WLqB3',
        support: 'https://abrinay1997-stack.github.io/SyncMaster',
        supabase: 'https://app.supabase.com',
        geminiApi: 'https://makersuite.google.com/app/apikey',
        issues: 'https://github.com/abrinay1997-stack/LiveSync-Pro/issues'
    },

    // Tipos de eventos soportados
    eventTypes: {
        corporate: {
            name: 'Corporativo',
            description: 'Conferencias, presentaciones, eventos empresariales',
            targetRT60: 0.7,
            targetSTI: 0.75,
            targetSPL: 85,
            icon: 'fa-briefcase',
            characteristics: [
                'Prioridad en inteligibilidad de voz',
                'Reverberación controlada (0.6-0.8s)',
                'SPL moderado (75-85 dB)',
                'Cobertura uniforme'
            ]
        },
        concert: {
            name: 'Concierto',
            description: 'Conciertos, presentaciones musicales amplificadas',
            targetRT60: 1.0,
            targetSTI: 0.60,
            targetSPL: 102,
            icon: 'fa-music',
            characteristics: [
                'Mayor nivel de SPL (95-105 dB)',
                'Respuesta de bajos extendida',
                'Reverberación controlada (0.8-1.2s)',
                'Subwoofers requeridos'
            ]
        },
        festival: {
            name: 'Festival',
            description: 'Festivales, eventos al aire libre, grandes audiencias',
            targetRT60: 0.8,
            targetSTI: 0.65,
            targetSPL: 108,
            icon: 'fa-users',
            characteristics: [
                'Sistemas de largo alcance',
                'Múltiples torres de delay necesarias',
                'SPL elevado (100-110 dB)',
                'Cobertura para grandes áreas'
            ]
        },
        theater: {
            name: 'Teatro',
            description: 'Teatros, obras, presentaciones escénicas',
            targetRT60: 1.2,
            targetSTI: 0.70,
            targetSPL: 88,
            icon: 'fa-theater-masks',
            characteristics: [
                'Balance entre voz y música',
                'Reverberación moderada (1.0-1.4s)',
                'SPL moderado-alto (80-90 dB)',
                'Sonido natural'
            ]
        },
        other: {
            name: 'Otro',
            description: 'Configuración personalizada',
            targetRT60: 1.0,
            targetSTI: 0.65,
            targetSPL: 90,
            icon: 'fa-cog',
            characteristics: [
                'Parámetros personalizables',
                'Ajuste manual completo'
            ]
        }
    },

    // Categorías de soporte técnico
    supportCategories: [
        { value: 'instalacion', label: 'Instalación y Configuración', icon: 'fa-download' },
        { value: 'supabase', label: 'Problemas con Supabase', icon: 'fa-database' },
        { value: 'gemini', label: 'Problemas con IA Gemini', icon: 'fa-brain' },
        { value: 'calculos', label: 'Cálculos Acústicos', icon: 'fa-calculator' },
        { value: 'proyectos', label: 'Gestión de Proyectos', icon: 'fa-project-diagram' },
        { value: 'exportacion', label: 'Exportación PDF/DXF', icon: 'fa-file-export' },
        { value: 'visualizacion', label: 'Visualización 3D', icon: 'fa-cube' },
        { value: 'sincronizacion', label: 'Sincronización en la Nube', icon: 'fa-sync' },
        { value: 'rendimiento', label: 'Rendimiento y Optimización', icon: 'fa-tachometer-alt' },
        { value: 'bugs', label: 'Reportar Bug', icon: 'fa-bug' },
        { value: 'otro', label: 'Otro', icon: 'fa-question' }
    ],

    // Niveles de prioridad
    priorityLevels: [
        { value: 'baja', label: 'Baja', color: '#3b82f6', description: 'Consulta general, no urgente' },
        { value: 'media', label: 'Media', color: '#f59e0b', description: 'Problema que afecta trabajo pero tiene workaround' },
        { value: 'alta', label: 'Alta', color: '#f97316', description: 'Problema que bloquea trabajo' },
        { value: 'critica', label: 'Crítica', color: '#ef4444', description: 'Sistema no funcional, proyecto urgente' }
    ],

    // Tiempos de respuesta estimados (en minutos)
    responseTime: {
        baja: 240,      // 4 horas
        media: 120,     // 2 horas
        alta: 60,       // 1 hora
        critica: 15     // 15 minutos
    },

    // Configuración de chat
    chat: {
        enabled: true,
        welcomeMessage: '¡Hola! Soy el asistente de SyncMaster para LiveSync Pro. ¿En qué puedo ayudarte con tu diseño acústico?',
        offlineMessage: 'En este momento no hay agentes disponibles. Por favor, crea un ticket y te responderemos pronto.',
        maxMessageLength: 1000,
        typingIndicatorDelay: 800,
        autoResponseDelay: 1200
    },

    // Horarios de soporte
    supportHours: {
        timezone: 'UTC',
        hours: '24/7 (Chat automático siempre disponible)',
        humanSupport: 'Lunes a Viernes 9:00-18:00 UTC',
        holidays: 'Soporte limitado en días festivos'
    },

    // Estadísticas del sistema
    stats: {
        averageResponseTime: 12,         // minutos
        customerSatisfaction: 4.9,       // de 5
        projectsCreated: 856,
        activeUsers: 234,
        uptime: 99.8                     // porcentaje
    },

    // Parámetros acústicos comunes
    acousticParameters: {
        rt60Ranges: {
            speech: { min: 0.6, max: 0.8, description: 'Óptimo para palabra hablada' },
            amplified: { min: 0.8, max: 1.2, description: 'Música amplificada' },
            classical: { min: 1.5, max: 2.0, description: 'Música clásica' },
            theater: { min: 1.0, max: 1.4, description: 'Teatro y presentaciones' }
        },
        stiValues: {
            excellent: { min: 0.75, max: 1.0, description: 'Excelente inteligibilidad' },
            good: { min: 0.60, max: 0.75, description: 'Buena inteligibilidad' },
            fair: { min: 0.45, max: 0.60, description: 'Inteligibilidad razonable' },
            poor: { min: 0.30, max: 0.45, description: 'Pobre inteligibilidad' },
            bad: { min: 0.0, max: 0.30, description: 'Mala inteligibilidad' }
        },
        splRanges: {
            corporate: { target: 85, max: 90 },
            theater: { target: 88, max: 95 },
            concert: { target: 102, max: 110 },
            festival: { target: 108, max: 115 }
        }
    },

    // Materiales acústicos comunes (coeficientes de absorción)
    materials: {
        concrete: { name: 'Concreto', avgAbsorption: 0.02 },
        wood: { name: 'Madera', avgAbsorption: 0.09 },
        carpet: { name: 'Alfombra', avgAbsorption: 0.50 },
        curtains: { name: 'Cortinas pesadas', avgAbsorption: 0.30 },
        audience: { name: 'Audiencia sentada', avgAbsorption: 0.80 },
        glass: { name: 'Vidrio', avgAbsorption: 0.05 },
        acoustic_panel: { name: 'Panel acústico', avgAbsorption: 0.70 }
    },

    // Recursos educativos
    resources: {
        tutorials: [
            {
                title: 'Introducción a LiveSync Pro',
                description: 'Aprende los conceptos básicos del sistema',
                duration: '10 min',
                level: 'Principiante',
                topics: ['Instalación', 'Primer proyecto', 'Interfaz básica']
            },
            {
                title: 'Diseño Acústico Avanzado',
                description: 'Técnicas avanzadas de optimización',
                duration: '25 min',
                level: 'Avanzado',
                topics: ['RT60', 'STI', 'Torres de delay', 'Optimización']
            },
            {
                title: 'Exportación y Documentación',
                description: 'Genera reportes profesionales',
                duration: '15 min',
                level: 'Intermedio',
                topics: ['PDF', 'DXF', 'Reportes', 'Presentación al cliente']
            }
        ],
        glossary: {
            'SPL': 'Sound Pressure Level - Nivel de presión sonora medido en dB',
            'STI': 'Speech Transmission Index - Índice de transmisión del habla (0.0-1.0)',
            'RT60': 'Reverberation Time - Tiempo que tarda el sonido en decaer 60dB',
            'Delay Tower': 'Sistema de refuerzo adicional con delay para cobertura extendida',
            'Line Array': 'Sistema de altavoces en línea para largo alcance',
            'Sabine': 'Fórmula para calcular RT60 en función del volumen y absorción',
            'DXF': 'Drawing Exchange Format - Formato para planos CAD'
        }
    },

    // Información del sistema
    systemInfo: {
        version: '1.0.0',
        buildDate: '2026-01-10',
        environment: 'production',
        supportedBrowsers: ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+']
    },

    // Configuración de notificaciones
    notifications: {
        enabled: true,
        types: {
            ticketCreated: true,
            ticketUpdated: true,
            ticketResolved: true,
            newFeature: true,
            maintenance: true,
            tipOfTheDay: true
        }
    },

    // Tips y mejores prácticas
    tips: [
        'Siempre comienza con un preset apropiado para tu tipo de evento',
        'Verifica las dimensiones de la sala con planos arquitectónicos reales',
        'Ten en cuenta que la audiencia absorbe sonido (coef. ~0.80)',
        'Para eventos de voz, apunta a STI > 0.75',
        'Usa torres de delay para salas mayores a 30m de profundidad',
        'Exporta tu proyecto a JSON como respaldo antes de cambios grandes',
        'La visualización 3D te ayuda a detectar problemas de cobertura',
        'Revisa siempre los logs de sincronización en el footer',
        'Configura Supabase correctamente para evitar pérdida de datos',
        'El asistente IA puede sugerir optimizaciones valiosas'
    ]
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
