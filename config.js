// Configuración de SyncMaster
const CONFIG = {
    // Información de la aplicación
    app: {
        name: 'SyncMaster',
        version: '1.0.0',
        description: 'Centro de Soporte Técnico y Atención al Cliente para LiveSync Pro',
        supportEmail: 'support@livesyncpro.com',
        supportPhone: '+1-800-LIVESYNC',
        website: 'https://livesyncpro.com',
        statusPage: 'https://status.livesyncpro.com'
    },

    // Configuración de LiveSync Pro (personalizable según el repositorio real)
    livesyncpro: {
        name: 'LiveSync Pro',
        version: '3.5.2',
        description: 'Solución avanzada de sincronización en tiempo real',
        repository: 'https://github.com/abrinay1997-stack/LiveSync-Pro',
        features: [
            'Sincronización en tiempo real',
            'Encriptación de extremo a extremo',
            'Gestión de conflictos inteligente',
            'Historial de versiones',
            'Soporte multiplataforma',
            'API REST completa',
            'Webhooks',
            'Sincronización selectiva'
        ],
        platforms: [
            'Windows 10/11',
            'macOS 10.15+',
            'Linux (Ubuntu, Debian, Fedora)',
            'iOS 14+',
            'Android 8+',
            'Web'
        ]
    },

    // Enlaces útiles
    links: {
        documentation: 'https://docs.livesyncpro.com',
        community: 'https://community.livesyncpro.com',
        github: 'https://github.com/abrinay1997-stack/LiveSync-Pro',
        changelog: 'https://livesyncpro.com/changelog',
        downloads: 'https://livesyncpro.com/downloads',
        pricing: 'https://livesyncpro.com/pricing'
    },

    // Planes y precios
    plans: {
        basic: {
            name: 'Básico',
            price: 9.99,
            currency: 'USD',
            interval: 'mes',
            features: [
                'Hasta 3 dispositivos',
                '50GB de almacenamiento',
                'Sincronización en tiempo real',
                'Encriptación E2E',
                'Soporte por email',
                'Historial de 30 días'
            ]
        },
        pro: {
            name: 'Pro',
            price: 19.99,
            currency: 'USD',
            interval: 'mes',
            features: [
                'Hasta 10 dispositivos',
                '500GB de almacenamiento',
                'Sincronización en tiempo real',
                'Encriptación E2E',
                'Soporte 24/7',
                'Historial de 90 días',
                'Sincronización prioritaria',
                'Webhooks',
                'API avanzada'
            ]
        },
        enterprise: {
            name: 'Enterprise',
            price: 'Personalizado',
            currency: 'USD',
            interval: 'mes',
            features: [
                'Dispositivos ilimitados',
                'Almacenamiento ilimitado',
                'Sincronización en tiempo real',
                'Encriptación E2E',
                'Soporte dedicado 24/7',
                'Historial ilimitado',
                'SLA garantizado',
                'Webhooks ilimitados',
                'API completa',
                'Implementación on-premise',
                'SSO/SAML',
                'Auditoría avanzada'
            ]
        }
    },

    // Categorías de soporte
    supportCategories: [
        { value: 'tecnico', label: 'Problema Técnico', icon: 'fa-tools' },
        { value: 'instalacion', label: 'Instalación', icon: 'fa-download' },
        { value: 'configuracion', label: 'Configuración', icon: 'fa-cog' },
        { value: 'sincronizacion', label: 'Sincronización', icon: 'fa-sync' },
        { value: 'rendimiento', label: 'Rendimiento', icon: 'fa-tachometer-alt' },
        { value: 'facturacion', label: 'Facturación', icon: 'fa-credit-card' },
        { value: 'otro', label: 'Otro', icon: 'fa-question' }
    ],

    // Niveles de prioridad
    priorityLevels: [
        { value: 'baja', label: 'Baja', color: '#3b82f6' },
        { value: 'media', label: 'Media', color: '#f59e0b' },
        { value: 'alta', label: 'Alta', color: '#f97316' },
        { value: 'critica', label: 'Crítica', color: '#ef4444' }
    ],

    // Tiempos de respuesta (en minutos)
    responseTime: {
        baja: 240,      // 4 horas
        media: 120,     // 2 horas
        alta: 60,       // 1 hora
        critica: 15     // 15 minutos
    },

    // Configuración de chat
    chat: {
        enabled: true,
        welcomeMessage: '¡Hola! Soy el asistente de SyncMaster. ¿En qué puedo ayudarte hoy con LiveSync Pro?',
        offlineMessage: 'En este momento no hay agentes disponibles. Por favor, deja un mensaje o crea un ticket.',
        maxMessageLength: 1000,
        typingIndicatorDelay: 1000,
        autoResponseDelay: 1500
    },

    // Horarios de soporte
    supportHours: {
        timezone: 'UTC',
        hours: '24/7',
        weekdays: 'Lunes a Domingo',
        holidays: 'Disponible en días festivos'
    },

    // Estadísticas (pueden ser dinámicas en una implementación real)
    stats: {
        averageResponseTime: 15,        // minutos
        customerSatisfaction: 4.8,       // de 5
        ticketsResolvedToday: 127,
        activeUsers: 1234,
        uptime: 99.9                     // porcentaje
    },

    // Recursos educativos
    resources: {
        videoTutorials: [
            {
                title: 'Introducción a LiveSync Pro',
                duration: '5:30',
                url: '#',
                thumbnail: 'https://via.placeholder.com/300x200?text=Tutorial+1'
            },
            {
                title: 'Configuración Avanzada',
                duration: '10:15',
                url: '#',
                thumbnail: 'https://via.placeholder.com/300x200?text=Tutorial+2'
            },
            {
                title: 'Solución de Problemas Comunes',
                duration: '8:45',
                url: '#',
                thumbnail: 'https://via.placeholder.com/300x200?text=Tutorial+3'
            }
        ],
        blogPosts: [
            {
                title: '10 Consejos para Optimizar tu Sincronización',
                date: '2026-01-05',
                url: '#'
            },
            {
                title: 'Nuevas Funciones en LiveSync Pro 3.5',
                date: '2026-01-03',
                url: '#'
            },
            {
                title: 'Mejores Prácticas de Seguridad',
                date: '2025-12-28',
                url: '#'
            }
        ]
    },

    // Integraciones disponibles
    integrations: [
        { name: 'Dropbox', icon: 'fa-dropbox', status: 'available' },
        { name: 'Google Drive', icon: 'fa-google-drive', status: 'available' },
        { name: 'OneDrive', icon: 'fa-microsoft', status: 'available' },
        { name: 'Slack', icon: 'fa-slack', status: 'available' },
        { name: 'Trello', icon: 'fa-trello', status: 'coming-soon' },
        { name: 'Jira', icon: 'fa-jira', status: 'coming-soon' }
    ],

    // Información del sistema
    systemInfo: {
        apiVersion: 'v1',
        apiEndpoint: 'https://api.livesyncpro.com',
        authEndpoint: 'https://auth.livesyncpro.com',
        statusEndpoint: 'https://status.livesyncpro.com',
        cdnEndpoint: 'https://cdn.livesyncpro.com'
    },

    // Configuración de notificaciones
    notifications: {
        enabled: true,
        types: {
            ticketCreated: true,
            ticketUpdated: true,
            ticketResolved: true,
            systemUpdate: true,
            maintenanceScheduled: true
        }
    }
};

// Exportar configuración para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
