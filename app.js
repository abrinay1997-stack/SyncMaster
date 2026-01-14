// SyncMaster - Sistema de Soporte para LiveSync Pro (v2.0 - Optimizado)
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

// ========================================
// SISTEMA DE CHAT INTELIGENTE (OPTIMIZADO)
// ========================================

// Estado del chatbot
let chatState = {
    messageCount: 0,
    lastMessages: [], // Memoria de últimos 3 mensajes
    lastTopic: null,  // Último tema detectado
    showCTA: false    // Alternar CTAs (cada 3 mensajes)
};

function initChat() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    // Rate limiting: 30 mensajes por minuto (mejorado)
    let messageTimestamps = [];
    const MAX_MESSAGES_PER_MINUTE = 30;
    const RATE_LIMIT_WINDOW = 60000;

    // Enviar mensaje al presionar Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    // Enviar mensaje al hacer clic en el botón
    sendButton.addEventListener('click', sendChatMessage);

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

        // Guardar en memoria de contexto
        chatState.lastMessages.push(message);
        if (chatState.lastMessages.length > 3) {
            chatState.lastMessages.shift(); // Mantener solo últimos 3
        }

        // Mostrar indicador "typing..."
        showTypingIndicator();

        // Simular respuesta del bot con delay más corto (400ms)
        setTimeout(() => {
            hideTypingIndicator();
            const response = generateBotResponse(message);
            addMessage(response, 'bot');

            // Incrementar contador de mensajes
            chatState.messageCount++;

            // Alternar CTA cada 3 mensajes
            if (chatState.messageCount % 3 === 0) {
                chatState.showCTA = true;
            } else {
                chatState.showCTA = false;
            }
        }, 400); // Reducido de 1000ms a 400ms
    }

    // ========================================
    // INDICADOR "TYPING..." (NUEVO)
    // ========================================
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message bot';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content" style="padding: 0.75rem 1rem;">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // ========================================
    // AGREGAR MENSAJE CON MARKDOWN (MEJORADO)
    // ========================================
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

        const content = document.createElement('div');
        content.className = 'message-content';

        // Renderizar markdown y HTML (NUEVO)
        const messageHTML = parseMarkdownToHTML(text);
        content.innerHTML = messageHTML;

        // Agregar timestamp
        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        content.appendChild(time);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Agregar event listeners a botones de acción rápida
        const quickButtons = content.querySelectorAll('.quick-action-btn');
        quickButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                chatInput.value = action;
                sendChatMessage();
            });
        });
    }

    // ========================================
    // PARSEAR MARKDOWN A HTML (NUEVO)
    // ========================================
    function parseMarkdownToHTML(text) {
        let html = text;

        // Convertir **bold** a <strong>
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Convertir URLs a links clickeables
        html = html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: var(--cyan-400); text-decoration: underline;">$1</a>');

        // Convertir \n\n a <br><br> (doble salto)
        html = html.replace(/\n\n/g, '<br><br>');

        // Convertir \n simple a <br>
        html = html.replace(/\n/g, '<br>');

        // Convertir bullets • a <li>
        html = html.replace(/^• (.+)$/gm, '<li style="margin-left: 1rem;">$1</li>');

        return html;
    }

    // ========================================
    // GENERAR RESPUESTA DEL BOT (REFACTORIZADO)
    // ========================================
    function generateBotResponse(userMessage) {
        const msg = userMessage.toLowerCase().trim();

        // Detección de idioma
        const isEnglish = /(what|how|where|when|why|can|does|is|specs?|price|cost|work)/i.test(userMessage) &&
                         !/(que|como|donde|cuando|precio|costo|funciona|configurar)/i.test(userMessage);

        // CTA inteligente (solo cada 3 mensajes)
        const cta = chatState.showCTA ? '\n\n🚀 <strong>Accede:</strong> https://livesyncpro.app' : '';

        // ===================================
        // BÚSQUEDA DE MODELOS (CON FUZZY MATCHING MEJORADO)
        // ===================================
        const modelMatch = msg.match(/(k[12i3]|kara|kiva|ks28|sb28|x1[25]|panther|pantheer|panterr|leo|lyon|leopard|lina|gsl8|gsl|ksl8|j8|v8|y8|sl[-\s]?sub|j[-\s]?sub|m[24]|vtx[-\s]?[agbm]\d+|e1[25]|s10|cs10|e219|hdl[-\s]?\d+|sub[-\s]?\d+)/);
        if (modelMatch) {
            const found = findSpeakerModel(modelMatch[0]);
            if (found) {
                chatState.lastTopic = 'model-specs';
                return `🔊 <strong>${found.brand} ${found.name}</strong>\n\n📊 <strong>Especificaciones:</strong>\n• SPL máximo: ${found.spl} dB\n• Peso: ${found.weight} kg\n• Impedancia: ${found.impedance}Ω\n• Dispersión: ${found.dispersion}°\n• Categoría: ${found.category}\n\n💡 Disponible en LiveSync Pro para cálculo de cobertura.${cta}`;
            }
        }

        // Contexto: Si el último tema fue specs, detectar "y el X?"
        if (chatState.lastTopic === 'model-specs' && /(y el|vs|versus|compar)/i.test(msg)) {
            const contextMatch = msg.match(/(k[123]|panther|gsl8|leo|vtx|kara)/i);
            if (contextMatch) {
                const found = findSpeakerModel(contextMatch[0]);
                if (found) {
                    return `🔊 <strong>${found.brand} ${found.name}</strong>\n\n📊 <strong>Especificaciones:</strong>\n• SPL: ${found.spl} dB, Peso: ${found.weight} kg\n• Impedancia: ${found.impedance}Ω, Dispersión: ${found.dispersion}°${cta}`;
                }
            }
        }

        // ===================================
        // COMPARACIÓN (VERSIÓN CORTA)
        // ===================================
        if (/(compar|diferencia|versus|vs).*(k[123]|panther|gsl8|leo|vtx)/i.test(msg)) {
            chatState.lastTopic = 'comparison';
            return `⚖️ <strong>Top Line Arrays</strong>\n\n🥇 <strong>Meyer Panther:</strong> SPL 150, 68kg\n🥈 <strong>d&b GSL8:</strong> SPL 150, 80kg\n🥉 <strong>K1:</strong> SPL 149, 106kg\n🏅 <strong>K2:</strong> SPL 147, 56kg${cta}`;
        }

        // ===================================
        // CALCULADORA DANTE (COMPACTA)
        // ===================================
        const danteCalcMatch = msg.match(/(\d+)\s*(canales?|channels?|ch).*(dante|bandwidth|ancho)/i);
        if (danteCalcMatch) {
            const channels = parseInt(danteCalcMatch[1]);
            const is96k = /96\s*k|96000/i.test(msg);
            const calc = calculateDanteBandwidth(channels, is96k ? 96 : 48);
            chatState.lastTopic = 'dante-calc';
            return `🌐 <strong>Dante Bandwidth</strong>\n\n• Canales: ${calc.channels}\n• Sample rate: ${calc.sampleRate}kHz/24bit\n• <strong>Total: ${calc.totalMbps} Mbps</strong>\n• ${calc.recommendation}${cta}`;
        }

        // ===================================
        // CALCULADORA DELAY (COMPACTA)
        // ===================================
        const delayCalcMatch = msg.match(/(\d+)\s*m.*(\d+)\s*[°c]/i);
        if (delayCalcMatch || (/delay.*\d+.*metro|calcul.*delay/i.test(msg) && /\d+/.test(msg))) {
            const distMatch = msg.match(/(\d+)\s*m/i);
            const tempMatch = msg.match(/(\d+)\s*[°c]/i);
            if (distMatch) {
                const distance = parseInt(distMatch[1]);
                const temp = tempMatch ? parseInt(tempMatch[1]) : 20;
                const calc = calculateDelayByTemp(distance, temp);
                chatState.lastTopic = 'delay-calc';
                return `🗼 <strong>Calculadora de Delay</strong>\n\n• Distancia: ${calc.distance}m @ ${calc.temperature}°C\n• Velocidad sonido: ${calc.speedOfSound} m/s\n• <strong>Delay: ${calc.delayMs} ms</strong>${cta}`;
            }
        }

        // ===================================
        // CASOS DE USO (VERSIÓN ULTRA CORTA CON BOTONES)
        // ===================================
        if (/(festival|concierto|outdoor).*(config|setup|sistema)/i.test(msg)) {
            chatState.lastTopic = 'festival';
            return `🎪 <strong>Setup Festival Outdoor</strong>\n\n<strong>Main PA:</strong> 12-16 K2/Panther por lado\n<strong>Subs:</strong> 8-12 KS28/1100-LFC (cardioid)\n<strong>Delay Towers:</strong> @ 40m, 70m\n<strong>FOH:</strong> DiGiCo SD7/Avid S6L\n<strong>Potencia:</strong> 80-120 kW${cta}\n\n<button class="quick-action-btn" data-action="¿Cómo calculo delays?">🧮 Calcular delays</button> <button class="quick-action-btn" data-action="¿Cuánto cuesta LiveSync Pro?">💰 Ver precios</button>`;
        }

        if (/(teatro|corporativo|indoor).*(config|setup)/i.test(msg)) {
            chatState.lastTopic = 'teatro';
            return `🎭 <strong>Setup Teatro Indoor</strong>\n\n<strong>Main PA:</strong> 6-10 K3/Kara II por lado\n<strong>Subs:</strong> 4-6 SB28 (end-fire)\n<strong>FOH:</strong> Yamaha CL5/dLive\n<strong>Potencia:</strong> 15-30 kW\n<strong>Sin delay towers</strong> (<30m)${cta}`;
        }

        // ===================================
        // SALUDOS (CON BOTONES DE ACCIÓN RÁPIDA)
        // ===================================
        if (/^(hola|hey|hi|buenas|buenos dias|hello)/.test(msg)) {
            chatState.lastTopic = 'greeting';
            return isEnglish
                ? `👋 Hi! I'm the LiveSync Pro assistant.\n\nI can help with PA Systems, line arrays, delays, and more.\n\n🚀 https://livesyncpro.app\n\n<button class="quick-action-btn" data-action="Specs del K2">📊 K2 Specs</button> <button class="quick-action-btn" data-action="48 canales dante">🌐 Dante Calc</button> <button class="quick-action-btn" data-action="¿Cuánto cuesta?">💰 Pricing</button>`
                : `👋 ¡Hola! Soy el asistente de LiveSync Pro.\n\nPuedo ayudarte con PA Systems, line arrays, delays, y más.\n\n🚀 https://livesyncpro.app\n\n<button class="quick-action-btn" data-action="Specs del K2">📊 Specs K2</button> <button class="quick-action-btn" data-action="48 canales dante">🌐 Calcular Dante</button> <button class="quick-action-btn" data-action="¿Cuánto cuesta?">💰 Precios</button>`;
        }

        if (/gracias|thanks/i.test(msg)) {
            return isEnglish
                ? '😊 You\'re welcome!'
                : '😊 ¡De nada! ¿Algo más?';
        }

        // ===================================
        // QUÉ ES LIVESYNC PRO (VERSIÓN CORTA)
        // ===================================
        if (/que es|qué es|what is/.test(msg) && /(livesync|app|software)/.test(msg)) {
            chatState.lastTopic = 'about';
            return `🎯 <strong>LiveSync Pro</strong> es un sistema profesional de diseño de <strong>PA Systems</strong>.\n\nCalcula line arrays, delay towers, rigging, potencia, redes Dante/AVB y exporta a CAD.\n\n💰 <strong>$97 USD/año</strong>\n\n🚀 https://livesyncpro.app\n\n<button class="quick-action-btn" data-action="¿Funciona offline?">💻 ¿Offline?</button> <button class="quick-action-btn" data-action="¿Cómo exporto?">📤 Exportar</button>`;
        }

        // ===================================
        // PRECIO (VERSIÓN ULTRA CORTA)
        // ===================================
        if (/(precio|cuanto cuesta|cost|suscripci[oó]n|pago)/.test(msg)) {
            chatState.lastTopic = 'pricing';
            return `💰 <strong>LiveSync Pro</strong>\n\n<strong>$97 USD/año</strong>\n\n✅ 100+ modelos de speakers\n✅ Exportación DXF/PDF ilimitada\n✅ Sincronización multi-dispositivo\n✅ Todas las actualizaciones\n\n🔒 Garantía 7 días\n\n🚀 https://livesyncpro.app`;
        }

        // ===================================
        // OFFLINE / INSTALACIÓN (COMPACTA)
        // ===================================
        if (/(offline|sin internet|instalaci[oó]n|windows|mac)/.test(msg)) {
            chatState.lastTopic = 'offline';
            return `💻 <strong>Modo Offline</strong>\n\n✅ Funciona <strong>100% offline</strong> después del acceso inicial\n❌ <strong>No necesitas instalar nada</strong> (es una PWA)\n✅ Compatible: Windows, Mac, iPad, Android\n✅ Licencia: Laptop + Tablet simultáneamente${cta}`;
        }

        // ===================================
        // LINE ARRAYS (COMPACTA)
        // ===================================
        if (/(line array|l[íi]nea|arreglo)/.test(msg)) {
            chatState.lastTopic = 'line-arrays';
            return `📡 <strong>Line Arrays soportados:</strong>\n\n🔷 L-Acoustics: K1, K2, K3, Kara II, KS28\n🔷 Meyer: Panther, LEO-M, Leopard, LINA\n🔷 d&b: GSL8, KSL8, J8, V8, SL-SUB\n🔷 JBL: VTX A12, V25, A8, B28\n🔷 Adamson: E15, E12, S10\n\n💡 Escribe el modelo (ej: "K2", "Panther")${cta}`;
        }

        // ===================================
        // DELAY TOWERS (COMPACTA)
        // ===================================
        if (/(delay tower|torre de delay|torres)/.test(msg) && !/(festival|config)/i.test(msg)) {
            chatState.lastTopic = 'delay-towers';
            return `🗼 <strong>Delay Towers</strong>\n\nLiveSync calcula:\n• Posición óptima de cada torre\n• Delay time (ms) exacto\n• Ajuste por temperatura automático\n• SPL en cada zona\n\n💡 Tip: "delay 50m 25°C"${cta}`;
        }

        // ===================================
        // FOH (COMPACTA)
        // ===================================
        if (/(foh|front of house|consola|mixer)/.test(msg)) {
            chatState.lastTopic = 'foh';
            return `🎛️ <strong>FOH Configuration</strong>\n\nProcesadores soportados:\n• Lake LM44, LM26\n• XTA DP448\n• BSS BLU-160\n• Q-SYS Core\n• Meyer Galaxy\n• L-Acoustics P1\n\nGenera IO lists automáticas y patcheo Dante/AVB.${cta}`;
        }

        // ===================================
        // MONITORES (COMPACTA)
        // ===================================
        if (/(monitor|monitoreo|wedge|sidefill|iem)/.test(msg)) {
            chatState.lastTopic = 'monitors';
            return `🔈 <strong>Sistemas de Monitores</strong>\n\n<strong>Wedges:</strong> X15, X12, M2, M4, MJF-212A, VTX M22\n<strong>Sidefills:</strong> Line arrays como sidefill\n<strong>IEMs:</strong> Configuración RF\n\nCalcula SPL, potencia, y patcheo.${cta}`;
        }

        // ===================================
        // RIGGING (COMPACTA)
        // ===================================
        if (/(rigging|colgado|suspens|truss|bridle|carga)/.test(msg)) {
            chatState.lastTopic = 'rigging';
            return `⚙️ <strong>Análisis de Rigging</strong>\n\nCalcula:\n• Peso total del sistema\n• Distribución de carga en bridles\n• Alertas de seguridad (factor 5:1)\n\n<strong>Ejemplos peso:</strong>\n• K1: 106 kg\n• Panther: 68 kg\n• GSL8: 80 kg${cta}`;
        }

        // ===================================
        // POTENCIA (COMPACTA)
        // ===================================
        if (/(potencia|el[ée]ctric|power|ampli|watts?|voltage)/.test(msg)) {
            chatState.lastTopic = 'power';
            return `⚡ <strong>Análisis de Potencia</strong>\n\nAmplificadores:\n• Lab.gruppen PLM 20000Q\n• Powersoft X8, Quattrocanali\n• L-Acoustics LA12X, LA8\n• d&b D80, D20\n\nCalcula consumo (kW), distribución trifásica, voltage drop.${cta}`;
        }

        // ===================================
        // DANTE/AVB (COMPACTA)
        // ===================================
        if (/(dante|avb|red|network|bandwidth)/.test(msg) && !/\d+.*canal/i.test(msg)) {
            chatState.lastTopic = 'network';
            return `🌐 <strong>Redes Dante/AVB</strong>\n\n<strong>Dante:</strong>\n• 48kHz: ~1.15 Mbps/canal\n• 96kHz: ~2.3 Mbps/canal\n• Overhead: 20%\n\n<strong>AVB:</strong> Overhead 10%\n\n💡 Tip: "48 canales dante"${cta}`;
        }

        // ===================================
        // EXPORTACIÓN (COMPACTA)
        // ===================================
        if (/(export|exporta|dxf|pdf|cad|autocad|plano)/.test(msg)) {
            chatState.lastTopic = 'export';
            return `📤 <strong>Exportación</strong>\n\n<strong>DXF (CAD):</strong>\nPlano 2D con posiciones, compatible AutoCAD, Vectorworks, SketchUp\n\n<strong>PDF Técnico:</strong>\nReporte completo: specs, delays, SPL, rigging, potencia, IO lists${cta}`;
        }

        // ===================================
        // TEMPERATURA (COMPACTA)
        // ===================================
        if (/(temperatura|thermal|drift|calor)/.test(msg) && !/\d+\s*m.*\d+\s*°?c/i.test(msg)) {
            chatState.lastTopic = 'thermal';
            return `🌡️ <strong>Thermal Drift</strong>\n\nLa velocidad del sonido cambia con temperatura:\n• 10°C = 337.5 m/s\n• 20°C = 343.2 m/s\n• 30°C = 349.0 m/s\n\n<strong>Impacto en 50m:</strong>\n20°C → 30°C = 2.4 ms diferencia\n\nLiveSync ajusta delays automáticamente.${cta}`;
        }

        // ===================================
        // SOPORTE (COMPACTA)
        // ===================================
        if (/(soporte|contacto|support|problema|error)/.test(msg) && !/(quiero|necesito)/i.test(msg)) {
            chatState.lastTopic = 'support';
            return `📞 <strong>Soporte Técnico</strong>\n\n📧 <strong>Email:</strong> abrinay@livesyncpro.com\n\nPara bugs, problemas técnicos o consultas de licencia.\n\n🚀 https://livesyncpro.app`;
        }

        // ===================================
        // RESPUESTA GENÉRICA (CON SUGERENCIAS)
        // ===================================
        return `🤔 No estoy seguro de entender.\n\n<strong>Prueba con:</strong>\n• "Specs del K2"\n• "48 canales dante"\n• "delay 80m 25°C"\n• "K2 vs Panther"\n• "setup festival"\n• "¿Cuánto cuesta?"\n\n🚀 https://livesyncpro.app\n\n<button class="quick-action-btn" data-action="¿Qué es LiveSync Pro?">ℹ️ ¿Qué es LiveSync Pro?</button> <button class="quick-action-btn" data-action="Contactar soporte">📞 Soporte</button>`;
    }
}

// ========================================
// FUZZY MATCHING MEJORADO (NUEVO)
// ========================================
function findSpeakerModel(query) {
    const normalized = query.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // Búsqueda exacta
    if (SPEAKER_DATABASE[normalized]) {
        return SPEAKER_DATABASE[normalized];
    }

    // Fuzzy matching: correcciones comunes
    const typoCorrections = {
        'pantheer': 'panther',
        'panterr': 'panther',
        'ksl': 'ksl8',
        'gsl': 'gsl8',
        'ks-28': 'ks28',
        'sb-28': 'sb28',
        'k-2': 'k2',
        'k-1': 'k1',
        'k-3': 'k3'
    };

    if (typoCorrections[normalized]) {
        const corrected = typoCorrections[normalized];
        if (SPEAKER_DATABASE[corrected]) {
            return SPEAKER_DATABASE[corrected];
        }
    }

    // Búsqueda parcial
    for (const [key, model] of Object.entries(SPEAKER_DATABASE)) {
        if (key.includes(normalized) || normalized.includes(key)) {
            return model;
        }
        if (model.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))) {
            return model;
        }
    }

    // Levenshtein distance para typos más complejos
    let bestMatch = null;
    let minDistance = 3; // Máximo 3 caracteres de diferencia

    for (const [key, model] of Object.entries(SPEAKER_DATABASE)) {
        const distance = levenshteinDistance(normalized, key);
        if (distance <= minDistance) {
            minDistance = distance;
            bestMatch = model;
        }
    }

    return bestMatch;
}

// Levenshtein distance para fuzzy matching
function levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i-1) === str1.charAt(j-1)) {
                matrix[i][j] = matrix[i-1][j-1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i-1][j-1] + 1,
                    matrix[i][j-1] + 1,
                    matrix[i-1][j] + 1
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
}

// ========================================
// ACCIONES RÁPIDAS
// ========================================
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

// ========================================
// UTILIDADES
// ========================================
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
