// SyncMaster - Sistema de Soporte para LiveSync Pro
// Gestión de navegación
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initChat();
    initQuickActions();
});

// Navegación entre secciones
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');

            // Actualizar enlaces activos
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Mostrar sección correspondiente
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });

            // Actualizar URL sin recargar
            window.history.pushState({}, '', `#${targetSection}`);
        });
    });

    // Manejar navegación con botón atrás
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1) || 'inicio';
        const targetLink = document.querySelector(`[data-section="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    });

    // Cargar sección inicial desde URL
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        const targetLink = document.querySelector(`[data-section="${initialHash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }
}

// Sistema de Chat Inteligente
function initChat() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    const quickReplies = document.querySelectorAll('.quick-reply');

    // Rate limiting: máximo 10 mensajes por minuto
    let messageTimestamps = [];
    const MAX_MESSAGES_PER_MINUTE = 10;
    const RATE_LIMIT_WINDOW = 60000; // 1 minuto en ms

    // Enviar mensaje al presionar Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });

    // Enviar mensaje al hacer clic en el botón
    sendButton.addEventListener('click', sendChatMessage);

    // Respuestas rápidas
    quickReplies.forEach(button => {
        button.addEventListener('click', () => {
            chatInput.value = button.getAttribute('data-message');
            sendChatMessage();
        });
    });

    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Rate limiting check
        const now = Date.now();
        messageTimestamps = messageTimestamps.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

        if (messageTimestamps.length >= MAX_MESSAGES_PER_MINUTE) {
            showNotification('Has enviado demasiados mensajes. Por favor espera un momento.', 'warning');
            return;
        }

        messageTimestamps.push(now);

        // Agregar mensaje del usuario
        addMessage(message, 'user');
        chatInput.value = '';

        // Simular respuesta del bot después de un breve retraso
        setTimeout(() => {
            const response = generateBotResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

        const content = document.createElement('div');
        content.className = 'message-content';

        const messageText = document.createElement('p');
        messageText.textContent = text;

        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        content.appendChild(messageText);
        content.appendChild(time);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateBotResponse(userMessage) {
        const msg = userMessage.toLowerCase().trim();

        // === SALUDOS Y CONVERSACIÓN ===
        if (/^(hola|hey|hi|buenas|buenos dias|buenas tardes|buenas noches|que tal|saludos)/.test(msg)) {
            return '👋 ¡Hola! Soy el asistente de LiveSync Pro.\n\nPuedo ayudarte con:\n• Diseño de sistemas PA\n• Line arrays y delay towers\n• Configuración FOH y monitores\n• Rigging y potencia eléctrica\n• Precios y suscripciones\n• Exportación de diseños\n\n¿En qué puedo ayudarte?';
        }

        if (/gracias|thanks|thx/.test(msg)) {
            return '😊 ¡De nada! Si necesitas algo más sobre LiveSync Pro, aquí estoy.';
        }

        if (/(quiero|necesito|puedes|podrias).*(pregunta|ayuda|saber|consulta)/.test(msg)) {
            return '¡Claro! Pregúntame lo que necesites sobre LiveSync Pro. Puedo ayudarte con:\n\n• Diseño de PA Systems\n• Line arrays (L-Acoustics, Meyer, d&b, JBL, etc.)\n• Delay towers y FOH\n• Rigging y electricidad\n• Precios y funcionalidades\n• Exportación DXF/PDF\n\n¿Qué te gustaría saber?';
        }

        // === QUÉ ES LIVESYNC PRO ===
        if (/que es|qué es|what is|que hace/.test(msg) && /(livesync|sistema|aplicaci[oó]n|app|programa|software)/.test(msg)) {
            return '🎯 **LiveSync Pro** es un sistema profesional de diseño de **PA Systems** para refuerzo sonoro en vivo.\n\n**Lo usas para:**\n• Diseñar line arrays y configurar delays\n• Calcular posicionamiento de torres de delay\n• Configurar FOH y sistemas de monitores\n• Analizar rigging y cargas estructurales\n• Calcular potencia eléctrica (3 fases)\n• Configurar redes Dante/AVB\n• Predecir drift térmico\n• Exportar a CAD (DXF) y PDF\n\n**Precio:** $97 USD anuales\n\n¿Quieres saber más sobre alguna función específica?';
        }

        // === PA SYSTEMS ===
        if (/(pa system|sistema pa|sistema de audio|sistema de sonido|refuerzo sonoro|sound system)/.test(msg)) {
            return '🔊 **PA Systems (Public Address)** = Sistemas de refuerzo sonoro para eventos en vivo.\n\n**LiveSync Pro te ayuda a diseñar:**\n\n📍 **Main PA:**\n• Line arrays (K2, Panther, GSL8, VTX A12)\n• Configuración stereo/mono\n• Cálculo de cobertura SPL\n\n📍 **Delay Towers:**\n• Posicionamiento óptimo\n• Cálculo de delays (ms)\n• Alineación temporal\n\n📍 **Subwoofers:**\n• Arreglos: omni, cardioid, end-fire\n• Alineación de fase\n\n📍 **FOH + Monitores:**\n• Wedges, sidefills, IEMs\n• Consolas y procesadores\n\n¿Sobre qué parte necesitas ayuda?';
        }

        // === LINE ARRAYS ===
        if (/(line array|linea|arreglo lineal|sistema lineal)/.test(msg)) {
            return '📡 **Line Arrays** - Arreglos lineales de altavoces\n\n**LiveSync Pro soporta 100+ modelos:**\n\n🔷 **L-Acoustics:** K1, K2, K3, Kara II, Kiva II, KS28\n🔷 **Meyer Sound:** Panther, LEO-M, Lyon-M, Leopard, LINA\n🔷 **d&b audiotechnik:** GSL8, KSL8, J8, V8, Y8, SL-SUB\n🔷 **JBL:** VTX A12, VTX V25, VTX A8, VTX B28\n🔷 **Adamson:** E15, E12, S10, CS10, E219\n🔷 **RCF:** HDL 50-A, HDL 30-A, HDL 20-A\n\n**Funciones:**\n✓ Calcular cantidad de cajas necesarias\n✓ Configurar ángulos y splay\n✓ Predecir cobertura SPL\n✓ Análisis de rigging y peso\n✓ Ajuste por temperatura (thermal drift)\n\n¿Qué marca usas o quieres conocer?';
        }

        // === DELAY TOWERS ===
        if (/(delay tower|torre de delay|delay|torres|fill)/.test(msg)) {
            return '🗼 **Delay Towers (Torres de Delay)**\n\nCuando el PA principal no cubre toda la audiencia, las delay towers extienden la cobertura con sincronización temporal.\n\n**LiveSync Pro calcula:**\n• Posición óptima de cada torre\n• Delay time (milisegundos) exacto\n• SPL en cada zona objetivo\n• Alineación con el main PA\n• Configuración stereo o mono\n\n**Ajuste automático por temperatura:**\nLa velocidad del sonido cambia con la temperatura:\n• 20°C = 343 m/s\n• 30°C = 349 m/s\nLiveSync ajusta los delays automáticamente.\n\n**Exportas:**\n✓ Plano DXF con posiciones\n✓ PDF con delays y niveles\n✓ IO list para patcheo\n\n¿Necesitas ayuda con tu configuración de delay towers?';
        }

        // === FOH ===
        if (/(foh|front of house|consola|mixer|mezclador)/.test(msg)) {
            return '🎛️ **FOH (Front of House)** - Posición de mezcla principal\n\n**LiveSync Pro te ayuda con:**\n\n📍 **Configuración de consola:**\n• Cálculo de distancia óptima FOH\n• Procesamiento y matriz de salidas\n• Routing y patcheo\n\n📍 **Procesadores soportados:**\n• Lake LM44, LM26\n• XTA DP448, DP446\n• dbx DriveRack 4800, VENU360\n• BSS BLU-160, BLU-100\n• Q-SYS Core 110f, Core 8 Flex\n• Meyer Galaxy 816, 408\n• L-Acoustics P1\n\n📍 **Exportación:**\n✓ IO lists automáticas\n✓ Patching de señal\n✓ Configuración de red Dante/AVB\n\n¿Qué consola o procesador usas?';
        }

        // === MONITORES ===
        if (/(monitor|monitoreo|wedge|sidefill|iem|in[-\s]?ear)/.test(msg)) {
            return '🔈 **Sistemas de Monitores**\n\n**LiveSync Pro configura:**\n\n🎸 **Wedges (Monitores de piso):**\n• L-Acoustics X15 HiQ, X12\n• d&b M2, M4, MAX2\n• Meyer MJF-212A, MJF-210\n• JBL VTX M22, VTX M20, SRX812P\n• RCF TT 25-CXA, NX 12-SMA\n\n🎤 **Sidefills:**\n• Line arrays como sidefill\n• Cálculo de niveles y cobertura\n\n🎧 **IEMs (In-Ear Monitors):**\n• Configuración de RF\n• Gestión de canales\n\n**Análisis incluye:**\n✓ SPL en posición de artista\n✓ Potencia necesaria\n✓ Patcheo y routing\n✓ Configuración de aux mixes\n\n¿Qué tipo de monitoreo necesitas diseñar?';
        }

        // === RIGGING ===
        if (/(rigging|colgado|suspens|truss|bridle|motor|cadena|carga)/.test(msg)) {
            return '⚙️ **Rigging (Colgado y Estructuras)**\n\n**LiveSync Pro calcula seguridad estructural:**\n\n🔩 **Análisis de cargas:**\n• Peso total del sistema\n• Peso de bumpers y accesorios\n• Peso de cables (0.5 kg/m)\n• Cálculo de vectores\n\n🔗 **Configuración de bridles:**\n• Ángulos de suspensión\n• Distribución de peso\n• Límites de carga segura\n\n⚠️ **Alertas de seguridad:**\n• Carga máxima excedida\n• Ángulos peligrosos\n• Factor de seguridad < 5:1\n\n**Ejemplos de peso:**\n• L-Acoustics K1: 106 kg\n• Meyer Panther: 68 kg\n• d&b GSL8: 80 kg\n• Bumper grande: ~100 kg\n\n📋 Exportas reporte con vectores y especificaciones.\n\n¿Necesitas calcular rigging para tu sistema?';
        }

        // === POTENCIA ELÉCTRICA ===
        if (/(potencia|el[ée]ctric|power|ampli|watts?|voltage|corriente|fase|cable|distribuci[oó]n)/.test(msg)) {
            return '⚡ **Análisis de Potencia Eléctrica**\n\n**LiveSync Pro calcula:**\n\n🔌 **Amplificadores soportados:**\n• Lab.gruppen PLM 20000Q, PLM 12K44\n• Powersoft X8, Quattrocanali 8804\n• d&b D80, D20, D12\n• Crown I-Tech 12000 HD\n• QSC PLD 4.5, DCA 3022\n• L-Acoustics LA12X, LA8, LA4X\n• Meyer MPS-488HP\n\n📊 **Análisis incluye:**\n• Consumo total (kW)\n• Distribución trifásica (3 fases)\n• Voltage drop en cables\n• Damping factor\n• Corriente por fase (Amperes)\n• Inrush current (arranque)\n\n🔴 **Diferencia Class-D vs Class-AB:**\n• Class-D: PF ~0.95-0.98 (eficiente)\n• Class-AB: PF ~0.65-0.70 (menos eficiente)\n\n📋 Exportas: Diagrama eléctrico y requerimientos de generador.\n\n¿Necesitas calcular potencia para tu sistema?';
        }

        // === REDES DANTE/AVB ===
        if (/(dante|avb|red|network|bandwidth|ancho de banda|digital|ethernet)/.test(msg)) {
            return '🌐 **Redes de Audio Digital**\n\n**LiveSync Pro calcula ancho de banda para:**\n\n🔷 **Dante:**\n• 48kHz/24bit: ~1.15 Mbps/canal\n• 96kHz/24bit: ~2.3 Mbps/canal\n• Overhead: 20%\n• Switches recomendados\n\n🔷 **AVB (Audio Video Bridging):**\n• Overhead: 10%\n• Configuración de streams\n• Latencia garantizada\n\n📡 **Análisis incluye:**\n• Total de canales\n• Bandwidth necesario (Mbps)\n• Configuración de switches\n• Límites de cable Cat6: 90m\n• Redundancia primaria/secundaria\n\n**Ejemplo:**\nSistema con 64 canales @ 48/24:\n64 × 1.15 × 1.2 = ~88 Mbps\n\n¿Cuántos canales necesitas en tu red?';
        }

        // === PRECIO / SUSCRIPCIÓN ===
        if (/(precio|cuanto cuesta|cost|suscripci[oó]n|pago|licencia|plan)/.test(msg)) {
            return '💰 **Precio de LiveSync Pro**\n\n**Suscripción Anual:** $97 USD/año\n\n✅ **Incluye:**\n• Todas las funcionalidades PRO\n• 100+ modelos de speakers\n• Exportación DXF y PDF ilimitada\n• Sincronización en la nube\n• Uso en múltiples dispositivos (laptop + tablet)\n• Todas las actualizaciones\n• Soporte técnico\n\n♻️ **Renovación automática** cada año\n\n🔒 **Garantía:** 7 días de satisfacción o reembolso 100%\n\n💻 **Sin instalación:** Es una PWA (Progressive Web App)\n\n¿Quieres saber cómo funciona offline o en múltiples dispositivos?';
        }

        // === OFFLINE / INSTALACIÓN ===
        if (/(offline|sin internet|funciona sin|instalaci[oó]n|descargar|windows|mac|ios|android)/.test(msg)) {
            return '💻 **Compatibilidad y Modo Offline**\n\n**¿Funciona sin internet?**\n✅ Sí. Solo necesitas internet para el acceso inicial.\nDespués funciona 100% offline en el show.\n\n**¿Necesito instalar algo?**\n❌ No. LiveSync Pro es una **PWA** (Progressive Web App).\nFunciona en cualquier navegador moderno.\n\n**Plataformas compatibles:**\n• Windows (Chrome, Edge)\n• Mac (Safari, Chrome)\n• iPad (Safari)\n• Tablets Android (Chrome)\n\n**¿Múltiples dispositivos?**\n✅ Tu licencia permite:\n• Laptop + Tablet simultáneamente\n• Sincronización automática en la nube\n• Todos tus proyectos disponibles en todos los dispositivos\n\n**Cálculos locales:**\nTodo se procesa en tu dispositivo. No depende de servidores.\n\n¿Listo para empezar a diseñar?';
        }

        // === EXPORTACIÓN ===
        if (/(export|exporta|dxf|pdf|cad|autocad|vectorworks|sketchup|plano|reporte)/.test(msg)) {
            return '📤 **Exportación de Diseños**\n\n**LiveSync Pro exporta a:**\n\n📐 **DXF (CAD):**\n• Compatible con AutoCAD, Vectorworks, SketchUp\n• Plano 2D con posiciones exactas\n• Speakers, torres, FOH, cables\n• Medidas precisas en metros\n• Listo para importar en CAD\n\n📄 **PDF Técnico:**\n• Reporte completo del sistema\n• Especificaciones de equipos\n• Lista de delays calculados\n• Niveles SPL por zona\n• Configuración de rigging\n• Análisis de potencia eléctrica\n• IO lists y patcheo\n• Configuración de red Dante/AVB\n\n✅ **Exportación ilimitada** con suscripción activa.\n\n📧 Compartes fácilmente con tu equipo de montaje.\n\n¿Necesitas diseñar algo específico?';
        }

        // === COMPARACIÓN CON OTRAS HERRAMIENTAS ===
        if (/(smaart|soundvision|ease|mapp|reemplaz|compar|vs|versus|mejor que)/.test(msg)) {
            return '🔄 **LiveSync Pro vs Otras Herramientas**\n\n**¿Reemplaza a Smaart o Soundvision?**\n❌ No, los **complementa**.\n\n**Cada herramienta tiene su función:**\n\n🎯 **Soundvision / MAPP / EASE:**\nPredicen SPL y cobertura (modelado 3D)\n\n🎯 **Smaart:**\nMide FFT en tiempo real (tuning)\n\n🎯 **LiveSync Pro:**\n• Calcula **delays de torres** automáticamente\n• Alinea **subs** (cardioid, end-fire)\n• Ajusta por **temperatura** (thermal drift)\n• Analiza **rigging** y **potencia eléctrica**\n• Configura **redes Dante/AVB**\n• Genera **IO lists** y patcheo\n\n💡 **Es el "puente matemático"** entre el diseño y la implementación real.\n\nLiveSync te dice **CÓMO implementar** el sistema:\n• Dónde poner las torres\n• Qué delay configurar\n• Cuánta potencia necesitas\n• Cómo patchear todo\n\n¿Eso responde tu duda?';
        }

        // === CREAR PROYECTO ===
        if (/(crear|nuevo|empezar|comenzar|iniciar).*(proyecto|diseño|sistema)/.test(msg)) {
            return '🚀 **Cómo crear un proyecto en LiveSync Pro**\n\n**Paso a paso:**\n\n1️⃣ **Inicia sesión** con tu licencia\n\n2️⃣ **Crea nuevo proyecto:**\n   • Nombre del evento\n   • Tipo de venue (outdoor, indoor)\n   • Temperatura ambiente\n   • Dimensiones del área\n\n3️⃣ **Selecciona tu PA:**\n   • Marca (L-Acoustics, Meyer, d&b, JBL, etc.)\n   • Modelo (K2, Panther, GSL8, VTX, etc.)\n   • Cantidad de cajas\n   • Configuración (stereo/mono)\n\n4️⃣ **Configura elementos:**\n   • Subwoofers (omni/cardioid/end-fire)\n   • Delay towers (posición y delay)\n   • Monitores (wedges, sidefills)\n   • FOH (consola y procesadores)\n\n5️⃣ **Análisis automático:**\n   LiveSync calcula todo y te muestra resultados.\n\n6️⃣ **Exporta:**\n   DXF para CAD + PDF técnico\n\n¿Quieres más detalles sobre algún paso?';
        }

        // === TEMPERATURA / THERMAL DRIFT ===
        if (/(temperatura|thermal|drift|calor|frio|clima)/.test(msg)) {
            return '🌡️ **Thermal Drift (Ajuste por Temperatura)**\n\n**¿Por qué importa la temperatura?**\nLa velocidad del sonido cambia con la temperatura:\n\n❄️ **10°C** = 337.5 m/s\n🌤️ **20°C** = 343.2 m/s\n🔥 **30°C** = 349.0 m/s\n🔥 **40°C** = 354.7 m/s\n\n**Impacto en delays:**\nEn 50 metros de distancia:\n• @20°C: Delay = 145.7 ms\n• @30°C: Delay = 143.3 ms\n• Diferencia: **2.4 ms** ❗\n\n**LiveSync Pro calcula:**\n• Temperatura al configurar (setup)\n• Temperatura durante el show (showtime)\n• Ajusta delays automáticamente\n• Te alerta si el cambio es significativo\n\n💡 **Configuración típica:**\nSetup = 20°C (tarde)\nShowtime = 15°C (noche)\n→ LiveSync ajusta los delays para el show.\n\n¿Necesitas ajustar por temperatura tu sistema?';
        }

        // === SOPORTE / CONTACTO ===
        if (/(soporte|ayuda|contacto|support|help|problema|error|bug)/.test(msg)) {
            return '📞 **Soporte Técnico LiveSync Pro**\n\n**Email:** abrinay@livesyncpro.com\n\n**Este chatbot:**\nResuelve preguntas frecuentes sobre funcionalidades, precios y uso de LiveSync Pro.\n\n**Para soporte personalizado:**\n• Reportar bugs\n• Problemas técnicos\n• Consultas de licencia\n• Solicitar nuevas funcionalidades\n\n👉 Escribe directamente a: **abrinay@livesyncpro.com**\n\n¿Hay algo más en lo que pueda ayudarte sobre LiveSync Pro?';
        }

        // === RESPUESTA GENÉRICA ===
        return '🤔 No estoy seguro de entender tu pregunta.\n\n**Puedo ayudarte con:**\n• ¿Qué es LiveSync Pro?\n• Line arrays y delay towers\n• FOH y sistemas de monitores\n• Rigging y potencia eléctrica\n• Redes Dante/AVB\n• Precios y suscripciones\n• Exportación DXF/PDF\n• Comparación con otras herramientas\n• Modo offline y compatibilidad\n\n**Ejemplos de preguntas:**\n• "¿Qué es un sistema PA?"\n• "¿Cómo configuro delay towers?"\n• "¿Cuánto cuesta LiveSync Pro?"\n• "¿Puedo exportar a AutoCAD?"\n• "¿Funciona sin internet?"\n\nIntenta reformular tu pregunta o escribe: **abrinay@livesyncpro.com**';
    }
}

// Acciones rápidas
function initQuickActions() {
    const actionCards = document.querySelectorAll('.action-card');

    actionCards.forEach(card => {
        card.addEventListener('click', () => {
            const action = card.getAttribute('data-action');
            const navLink = document.querySelector(`[data-section="${action}"]`);

            if (navLink) {
                navLink.click();
            }
        });
    });
}

// Utilidades
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#06b6d4'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${colors[type] || colors.success};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Animaciones y efectos adicionales
document.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
});
