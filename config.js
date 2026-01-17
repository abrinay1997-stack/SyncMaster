// Configuración de Soporte LiveSync Pro - Asistencia Técnica
const CONFIG = {
    // Información de la aplicación de soporte
    app: {
        name: 'Soporte LiveSync Pro',
        version: '1.0.0',
        description: 'Centro de Soporte Técnico para LiveSync Pro - Sistema de Diseño Acústico',
        supportEmail: 'abrinay@livesyncpro.com',
        supportPhone: '+1-800-ACOUSTIC',
        website: 'https://abrinay1997-stack.github.io/SyncMaster'
    },

    // Información de LiveSync Pro
    livesyncpro: {
        name: 'LiveSync Pro',
        description: 'Sistema Profesional de Diseño y Simulación Acústica',
        fullDescription: 'LiveSync Pro es una aplicación avanzada para el diseño de sistemas de refuerzo sonoro. Permite calcular cobertura SPL, inteligibilidad (STI), tiempo de reverberación (RT60), y optimizar la posición de altavoces y torres de delay. Incluye visualización 3D, exportación a PDF/DXF, y asistente de IA.',

        // Características principales
        features: [
            'Diseño de sistemas de refuerzo sonoro profesional',
            'Cálculo de cobertura SPL (Sound Pressure Level)',
            'Análisis de inteligibilidad (STI - Speech Transmission Index)',
            'Cálculo de tiempo de reverberación (RT60)',
            'Gestión de torres de delay y fill speakers',
            'Presets para diferentes tipos de eventos',
            'Visualización 3D interactiva',
            'Exportación a PDF y DXF',
            'Guardado automático en la nube',
            'Colaboración en tiempo real',
            'Asistente de IA integrado',
            'Gestión de múltiples proyectos'
        ]
    },

    // Enlaces de soporte
    links: {
        documentation: 'https://abrinay1997-stack.github.io/SyncMaster/#conocimiento',
        support: 'https://abrinay1997-stack.github.io/SyncMaster',
        faq: 'https://abrinay1997-stack.github.io/SyncMaster/#faq'
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
        { value: 'proyecto', label: 'Ayuda con Proyecto', icon: 'fa-project-diagram' },
        { value: 'calculos', label: 'Cálculos Acústicos', icon: 'fa-calculator' },
        { value: 'exportacion', label: 'Exportación PDF/DXF', icon: 'fa-file-export' },
        { value: 'visualizacion', label: 'Visualización 3D', icon: 'fa-cube' },
        { value: 'guardado', label: 'Guardado y Sincronización', icon: 'fa-sync' },
        { value: 'ia', label: 'Asistente de IA', icon: 'fa-brain' },
        { value: 'rendimiento', label: 'Rendimiento', icon: 'fa-tachometer-alt' },
        { value: 'tecnico', label: 'Problema Técnico', icon: 'fa-wrench' },
        { value: 'otro', label: 'Otro', icon: 'fa-question' }
    ],

    // Niveles de prioridad
    priorityLevels: [
        { value: 'baja', label: 'Baja', color: '#3b82f6', description: 'Consulta general, no urgente' },
        { value: 'media', label: 'Media', color: '#f59e0b', description: 'Problema que afecta trabajo pero tiene solución temporal' },
        { value: 'alta', label: 'Alta', color: '#f97316', description: 'Problema que bloquea trabajo' },
        { value: 'critica', label: 'Crítica', color: '#ef4444', description: 'Sistema no funcional, proyecto urgente' }
    ],

    // Tiempos de respuesta estimados
    responseTime: {
        baja: '4-8 horas',
        media: '2-4 horas',
        alta: '1-2 horas',
        critica: '15-30 minutos'
    },

    // Configuración de chat
    chat: {
        enabled: true,
        welcomeMessage: '¡Hola! Soy el asistente de Soporte LiveSync Pro. ¿En qué puedo ayudarte?',
        maxMessageLength: 1000
    },

    // Horarios de soporte
    supportHours: {
        chat: 'Chat automático disponible 24/7',
        email: 'Respuesta por email en menos de 24 horas',
        humanSupport: 'Soporte personalizado: Lunes a Viernes 9:00-18:00 UTC'
    },

    // Estadísticas del sistema
    stats: {
        averageResponseTime: '< 15 minutos',
        customerSatisfaction: '4.9/5',
        activeUsers: '1000+'
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

    // Glosario de términos acústicos
    glossary: {
        'SPL': 'Sound Pressure Level - Nivel de presión sonora medido en dB',
        'STI': 'Speech Transmission Index - Índice de transmisión del habla (0.0-1.0)',
        'RT60': 'Reverberation Time - Tiempo que tarda el sonido en decaer 60dB',
        'Delay Tower': 'Sistema de refuerzo adicional con delay para cobertura extendida',
        'Line Array': 'Sistema de altavoces en línea para largo alcance',
        'Sabine': 'Fórmula para calcular RT60 en función del volumen y absorción',
        'DXF': 'Drawing Exchange Format - Formato para planos CAD',
        'Fill Speaker': 'Altavoz de relleno para cubrir zonas específicas',
        'Coverage Map': 'Mapa de cobertura que muestra distribución de SPL',
        'Absorption Coefficient': 'Coeficiente que indica cuánto sonido absorbe un material'
    },

    // Tips y mejores prácticas
    tips: [
        'Siempre comienza con un preset apropiado para tu tipo de evento',
        'Verifica las dimensiones de la sala antes de diseñar',
        'Ten en cuenta que la audiencia absorbe mucho sonido (coef. ~0.80)',
        'Para eventos de voz, apunta a STI > 0.75',
        'Usa torres de delay para salas mayores a 30m de profundidad',
        'Exporta tu proyecto a PDF para presentar a clientes',
        'La visualización 3D te ayuda a detectar problemas de cobertura',
        'Revisa el indicador de guardado en el footer',
        'El asistente IA puede sugerir optimizaciones valiosas',
        'Guarda versiones de respaldo antes de hacer cambios grandes'
    ]
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
