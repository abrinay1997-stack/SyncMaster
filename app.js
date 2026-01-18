// Soporte LiveSync Pro - Sistema de Asistencia Técnica (v2.0 - Optimizado)
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

// ========================================
// ERROR HANDLING - UTILIDADES SEGURAS
// ========================================

/**
 * Lee de localStorage de forma segura con manejo de errores
 */
function safeLocalStorageGet(key, defaultValue) {
    try {
        const item = localStorage.getItem(key);
        if (!item) return defaultValue;
        return JSON.parse(item);
    } catch (e) {
        console.error(`Error leyendo localStorage[${key}]:`, e.message);
        // Si JSON está corrupto, limpiar y retornar default
        try {
            localStorage.removeItem(key);
        } catch (cleanupError) {
            // Ignorar errores de cleanup
        }
        return defaultValue;
    }
}

/**
 * Escribe a localStorage de forma segura con manejo de errores
 */
function safeLocalStorageSet(key, value) {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.warn(`localStorage lleno. Limpiando datos antiguos...`);
            // Intentar limpiar datos antiguos
            try {
                // Limpiar historial viejo (mantener solo últimos 50)
                if (key === 'syncmaster-history' && Array.isArray(value)) {
                    const trimmed = value.slice(-50);
                    localStorage.setItem(key, JSON.stringify(trimmed));
                    return true;
                }
            } catch (retryError) {
                console.error(`Error guardando ${key} después de cleanup:`, retryError.message);
            }
        } else {
            console.error(`Error guardando localStorage[${key}]:`, e.message);
        }
        return false;
    }
}

/**
 * Elimina de localStorage de forma segura
 */
function safeLocalStorageRemove(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error(`Error eliminando localStorage[${key}]:`, e.message);
        return false;
    }
}

// Estado del chatbot
let chatState = {
    messageCount: 0,
    lastMessages: [], // Memoria de últimos 3 mensajes
    lastTopic: null,  // Último tema detectado
    lastModel: null,  // NUEVO: Último modelo consultado (para contexto)
    showCTA: false    // Alternar CTAs (cada 3 mensajes)
};

// NUEVO: Sistema de feedback con localStorage (SEGURO)
let feedbackData = safeLocalStorageGet('syncmaster-feedback', {
    helpful: [],
    notHelpful: [],
    responses: {}
});

// NUEVO: Historial persistente (SEGURO)
let chatHistory = safeLocalStorageGet('syncmaster-history', []);

// ========================================
// FASE 1+2: NLP & CONTEXTO AVANZADO
// ========================================
let conversationContext = null;
let lastAnalysisResult = null; // Variable temporal para el último análisis

if (typeof ConversationContext !== 'undefined') {
    conversationContext = new ConversationContext();
    console.log('✅ NLP Engine activado - Fase 1+2 cargadas');
}

function initChat() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    // NUEVO: Cargar historial al iniciar
    loadChatHistory();

    // NUEVO: Event listener para botón de limpiar historial
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearChatHistory);

        // Efecto hover
        clearHistoryBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            this.style.borderColor = '#ef4444';
        });
        clearHistoryBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
            this.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        });
    }

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

    // NUEVO: Prevenir múltiples envíos rápidos
    let isSending = false;

    function sendChatMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        // NUEVO: Prevenir envíos múltiples
        if (isSending) return;

        // Rate limiting check
        const now = Date.now();
        messageTimestamps = messageTimestamps.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

        if (messageTimestamps.length >= MAX_MESSAGES_PER_MINUTE) {
            showNotification('Has enviado demasiados mensajes. Por favor espera un momento.', 'warning');
            return;
        }

        messageTimestamps.push(now);

        // NUEVO: Bloquear envíos temporalmente
        isSending = true;
        sendButton.disabled = true;
        chatInput.disabled = true;

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

            // CRÍTICO 1 & 3: Capturar respuesta con análisis en closure
            const result = generateBotResponse(message);

            // Extraer texto y análisis
            const responseText = typeof result === 'string' ? result : result.text;
            const responseAnalysis = typeof result === 'object' ? result.analysis : null;

            addMessage(responseText, 'bot');

            // CRÍTICO 3 CORREGIDO: Usar análisis del closure (no global)
            if (conversationContext && responseAnalysis) {
                conversationContext.addTurn(message, responseText, responseAnalysis);
                console.log('💾 Contexto actualizado. Turns:', conversationContext.turns.length);
                console.log('👤 Expertise detectado:', conversationContext.userProfile.expertise);
            }

            // Incrementar contador de mensajes
            chatState.messageCount++;

            // Alternar CTA cada 3 mensajes
            if (chatState.messageCount % 3 === 0) {
                chatState.showCTA = true;
            } else {
                chatState.showCTA = false;
            }

            // NUEVO: Desbloquear envíos
            isSending = false;
            sendButton.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
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
    // SCROLL SUAVE OPTIMIZADO (NUEVO)
    // ========================================
    function scrollToBottom(smooth = true) {
        // Usar requestAnimationFrame para evitar jank
        requestAnimationFrame(() => {
            if (smooth) {
                chatMessages.scrollTo({
                    top: chatMessages.scrollHeight,
                    behavior: 'smooth'
                });
            } else {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }

    // ========================================
    // CARGAR HISTORIAL (MEJORADO)
    // ========================================
    function loadChatHistory() {
        if (chatHistory.length === 0) return;

        // Limpiar mensajes existentes (excepto el mensaje de bienvenida)
        const welcomeMessage = chatMessages.querySelector('.message.bot');
        chatMessages.innerHTML = '';
        if (welcomeMessage) {
            chatMessages.appendChild(welcomeMessage);
        }

        // Cargar mensajes del historial
        chatHistory.forEach(msg => {
            addMessageToDOM(msg.text, msg.sender, false); // false = no guardar en historial de nuevo
        });

        // Scroll al final sin animación (más rápido al cargar historial)
        scrollToBottom(false);
    }

    // ========================================
    // LIMPIAR HISTORIAL (NUEVO)
    // ========================================
    function clearChatHistory() {
        if (confirm('¿Estás seguro de que quieres borrar todo el historial de la conversación?')) {
            chatHistory = [];
            safeLocalStorageRemove('syncmaster-history');

            // Limpiar visualmente
            chatMessages.innerHTML = '';

            // Agregar mensaje de bienvenida de nuevo
            addMessageToDOM(`👋 ¡Hola! Soy el asistente automático de LiveSync Pro.\n\nPuedo ayudarte con:\n• Diseño de PA Systems (line arrays, delay towers)\n• Configuración FOH y monitores\n• Rigging, potencia eléctrica y redes Dante/AVB\n• Precios, exportación y funcionalidades\n\n💡 Para soporte técnico personalizado: abrinay@livesyncpro.com`, 'bot', false);

            showNotification('Historial borrado correctamente', 'success');
        }
    }

    // ========================================
    // AGREGAR MENSAJE CON MARKDOWN Y FEEDBACK (MEJORADO)
    // ========================================
    function addMessage(text, sender) {
        // Guardar en historial persistente
        chatHistory.push({
            text: text,
            sender: sender,
            timestamp: Date.now()
        });

        // Limitar historial a últimos 100 mensajes
        if (chatHistory.length > 100) {
            chatHistory = chatHistory.slice(-100);
        }

        // Guardar en localStorage (SEGURO)
        safeLocalStorageSet('syncmaster-history', chatHistory);

        // Agregar al DOM
        addMessageToDOM(text, sender, false);
    }

    // ========================================
    // AGREGAR MENSAJE AL DOM (REFACTORIZADO)
    // ========================================
    function addMessageToDOM(text, sender, saveToHistory = true) {
        if (saveToHistory) {
            chatHistory.push({
                text: text,
                sender: sender,
                timestamp: Date.now()
            });
            safeLocalStorageSet('syncmaster-history', chatHistory);
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        messageDiv.setAttribute('data-message-id', messageId);

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

        const content = document.createElement('div');
        content.className = 'message-content';

        // Renderizar markdown y HTML
        const messageHTML = parseMarkdownToHTML(text);
        content.innerHTML = messageHTML;

        // NUEVO: Agregar botones de feedback para mensajes del bot
        if (sender === 'bot') {
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'feedback-buttons';
            feedbackDiv.style.cssText = 'margin-top: 0.5rem; display: flex; gap: 0.5rem; opacity: 0.6;';
            feedbackDiv.innerHTML = `
                <button class="feedback-btn feedback-helpful" data-feedback="helpful" title="Esta respuesta me ayudó" style="background: none; border: 1px solid rgba(34, 211, 238, 0.3); color: var(--cyan-400); padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.85rem; transition: all 0.2s;">
                    👍 Útil
                </button>
                <button class="feedback-btn feedback-not-helpful" data-feedback="notHelpful" title="No me ayudó" style="background: none; border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 0.25rem 0.5rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.85rem; transition: all 0.2s;">
                    👎 No útil
                </button>
            `;
            content.appendChild(feedbackDiv);
        }

        // Agregar timestamp
        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        content.appendChild(time);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        chatMessages.appendChild(messageDiv);

        // MEJORADO: Scroll suave optimizado
        scrollToBottom(true);

        // MEJORADO: No agregamos listeners individuales aquí
        // Se usan event delegation global (ver abajo)
    }

    // ========================================
    // EVENT DELEGATION PARA BOTONES (NUEVO - Evita memory leaks)
    // ========================================
    chatMessages.addEventListener('click', function(e) {
        // Quick action buttons
        if (e.target.closest('.quick-action-btn')) {
            const btn = e.target.closest('.quick-action-btn');
            const action = btn.getAttribute('data-action');
            chatInput.value = action;
            sendChatMessage();
            return;
        }

        // Feedback buttons
        if (e.target.closest('.feedback-btn')) {
            const btn = e.target.closest('.feedback-btn');
            const messageDiv = btn.closest('.message');
            const messageId = messageDiv.getAttribute('data-message-id');
            const messageText = messageDiv.querySelector('.message-content').textContent;
            const feedbackType = btn.getAttribute('data-feedback');
            handleFeedback(messageId, messageText, feedbackType, btn);
            return;
        }
    });

    // ========================================
    // MANEJAR FEEDBACK (NUEVO)
    // ========================================
    function handleFeedback(messageId, responseText, feedbackType, buttonElement) {
        // Guardar feedback
        if (feedbackType === 'helpful') {
            feedbackData.helpful.push({
                messageId,
                response: responseText,
                timestamp: Date.now()
            });
        } else {
            feedbackData.notHelpful.push({
                messageId,
                response: responseText,
                timestamp: Date.now()
            });
        }

        // Guardar en localStorage (SEGURO)
        safeLocalStorageSet('syncmaster-feedback', feedbackData);

        // Feedback visual
        const allButtons = buttonElement.parentElement.querySelectorAll('.feedback-btn');
        allButtons.forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.3';
            btn.style.cursor = 'not-allowed';
        });

        buttonElement.style.opacity = '1';
        buttonElement.style.transform = 'scale(1.1)';

        if (feedbackType === 'helpful') {
            buttonElement.style.borderColor = 'var(--cyan-400)';
            buttonElement.style.backgroundColor = 'rgba(34, 211, 238, 0.1)';
        } else {
            buttonElement.style.borderColor = '#ef4444';
            buttonElement.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        }

        // Mostrar agradecimiento
        setTimeout(() => {
            showNotification(
                feedbackType === 'helpful'
                    ? '¡Gracias! Tu feedback nos ayuda a mejorar.'
                    : 'Gracias. Trabajaremos en mejorar esta respuesta.',
                'success'
            );
        }, 200);
    }

    // ========================================
    // PARSEAR MARKDOWN A HTML (NUEVO)
    // ========================================
    /**
     * SEGURIDAD: Sanitiza HTML para prevenir XSS
     * Preserva etiquetas seguras (strong, em, br, button, a) pero escapa las peligrosas
     */
    function sanitizeHTML(text) {
        // WHITELIST de etiquetas seguras a preservar
        const safeTags = [];

        // 1. Preservar <button> con atributos
        let sanitized = text.replace(/(<button[^>]*>.*?<\/button>)/gi, (match) => {
            const placeholder = `__SAFE_TAG_${safeTags.length}__`;
            safeTags.push(match);
            return placeholder;
        });

        // 2. Preservar <a> con atributos seguros
        sanitized = sanitized.replace(/(<a\s+[^>]*href=["'][^"']*["'][^>]*>.*?<\/a>)/gi, (match) => {
            const placeholder = `__SAFE_TAG_${safeTags.length}__`;
            safeTags.push(match);
            return placeholder;
        });

        // 3. Preservar etiquetas simples seguras: strong, em, br
        sanitized = sanitized.replace(/(<\/?(?:strong|em|br)\s*\/?>)/gi, (match) => {
            const placeholder = `__SAFE_TAG_${safeTags.length}__`;
            safeTags.push(match);
            return placeholder;
        });

        // 4. Escapar TODO el HTML restante (etiquetas peligrosas)
        const div = document.createElement('div');
        div.textContent = sanitized; // Escapa automáticamente script, iframe, etc.
        sanitized = div.innerHTML;

        // 5. Restaurar etiquetas seguras
        safeTags.forEach((tag, index) => {
            sanitized = sanitized.replace(`__SAFE_TAG_${index}__`, tag);
        });

        return sanitized;
    }

    /**
     * Convierte markdown a HTML de forma segura
     * CRÍTICO: Sanitiza input para prevenir XSS
     */
    function parseMarkdownToHTML(text) {
        // PASO 1: Sanitizar input (escapar HTML malicioso)
        let html = sanitizeHTML(text);

        // PASO 2: Convertir **bold** a <strong>
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // PASO 3: Convertir URLs a links clickeables (solo http/https)
        html = html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: var(--cyan-400); text-decoration: underline;">$1</a>');

        // PASO 4: Convertir \n\n a <br><br> (doble salto)
        html = html.replace(/\n\n/g, '<br><br>');

        // PASO 5: Convertir \n simple a <br>
        html = html.replace(/\n/g, '<br>');

        // PASO 6: Convertir bullets • a <li>
        html = html.replace(/^• (.+)$/gm, '<li style="margin-left: 1rem;">$1</li>');

        return html;
    }

    // ========================================
    // NLP BÁSICO - EXTRACCIÓN DE ENTIDADES CON VALIDACIÓN (NUEVO)
    // ========================================
    function extractEntities(message) {
        const msg = message.toLowerCase();
        const entities = {
            distance: null,
            temperature: null,
            people: null,
            channels: null,
            sampleRate: null,
            eventType: null,
            characteristics: [],
            validationErrors: []
        };

        // Extraer distancia (metros) con validación
        const distMatch = msg.match(/(\d+)\s*m(?:etros?)?(?!\s*hz)/i);
        if (distMatch) {
            const dist = parseInt(distMatch[1]);
            if (dist < 1 || dist > 500) {
                entities.validationErrors.push(`Distancia ${dist}m fuera de rango válido (1-500m)`);
            } else {
                entities.distance = dist;
            }
        }

        // Extraer temperatura con validación
        const tempMatch = msg.match(/(\d+)\s*[°º]?c/i);
        if (tempMatch) {
            const temp = parseInt(tempMatch[1]);
            if (temp < -20 || temp > 50) {
                entities.validationErrors.push(`Temperatura ${temp}°C fuera de rango válido (-20 a 50°C)`);
            } else {
                entities.temperature = temp;
            }
        }

        // Extraer cantidad de personas con validación
        const peopleMatch = msg.match(/(\d+)\s*(personas?|gente|audiencia|público)/i);
        if (peopleMatch) {
            const people = parseInt(peopleMatch[1]);
            if (people < 10 || people > 100000) {
                entities.validationErrors.push(`Cantidad ${people} personas fuera de rango válido (10-100,000)`);
            } else {
                entities.people = people;
            }
        }

        // Extraer canales con validación
        const channelsMatch = msg.match(/(\d+)\s*(canales?|ch)/i);
        if (channelsMatch) {
            const ch = parseInt(channelsMatch[1]);
            if (ch < 1 || ch > 512) {
                entities.validationErrors.push(`${ch} canales fuera de rango válido (1-512 ch)`);
            } else {
                entities.channels = ch;
            }
        }

        // Extraer sample rate
        if (/96\s*k|96000/i.test(msg)) entities.sampleRate = 96;
        else if (/48\s*k|48000/i.test(msg)) entities.sampleRate = 48;

        // Detectar tipo de evento
        if (/(festival|outdoor|masivo)/i.test(msg)) entities.eventType = 'festival';
        else if (/(teatro|indoor|sala)/i.test(msg)) entities.eventType = 'teatro';
        else if (/(corporativo|conferencia|empresa)/i.test(msg)) entities.eventType = 'corporativo';

        // Detectar características buscadas
        if (/(potente|fuerte|alto spl|mucho volumen)/i.test(msg)) entities.characteristics.push('high-spl');
        if (/(ligero|liviano|poco peso)/i.test(msg)) entities.characteristics.push('light');
        if (/(cardio|direccional|rechazo)/i.test(msg)) entities.characteristics.push('cardioid');
        if (/(largo alcance|distancia|lejos)/i.test(msg)) entities.characteristics.push('long-throw');
        if (/(compacto|pequeño|mediano)/i.test(msg)) entities.characteristics.push('compact');

        return entities;
    }

    // ========================================
    // BÚSQUEDA INTELIGENTE POR CARACTERÍSTICAS
    // ========================================
    function searchByCharacteristics(characteristics, eventType, distance) {
        const results = [];

        // Buscar en base de datos
        for (const [key, model] of Object.entries(SPEAKER_DATABASE)) {
            let score = 0;

            // Scoring por características
            if (characteristics.includes('high-spl') && model.spl >= 145) score += 3;
            if (characteristics.includes('light') && model.weight <= 60) score += 2;
            if (characteristics.includes('long-throw') && model.category === 'Line Array Large') score += 3;
            if (characteristics.includes('compact') && model.category === 'Line Array Medium') score += 2;

            // Scoring por tipo de evento
            if (eventType === 'festival' && model.category === 'Line Array Large') score += 3;
            if (eventType === 'teatro' && model.category === 'Line Array Medium') score += 3;

            // Scoring por distancia
            if (distance) {
                if (distance > 80 && model.category === 'Line Array Large') score += 3;
                if (distance >= 30 && distance <= 80 && model.category === 'Line Array Medium') score += 2;
            }

            if (score > 0) {
                results.push({ model, score });
            }
        }

        // Ordenar por score descendente
        results.sort((a, b) => b.score - a.score);

        return results.slice(0, 3); // Top 3
    }

    // ========================================
    // CONTEXTO - DETECTAR PREGUNTAS DE SEGUIMIENTO
    // ========================================
    function detectContextualQuestion(message, chatState) {
        const msg = message.toLowerCase();

        // Detectar referencias pronominales
        const followUpPatterns = [
            /^(y |¿?y )/,  // "y el panther?", "y para 50m?"
            /^(cuántos?|cuantos?|cu[aá]ntos?) /,  // "cuántos necesito?"
            /^(qué|que|cual|cuál) (es )?mejor/,  // "cuál es mejor?"
            /^(sirve|funciona|va bien)/,  // "sirve para outdoor?"
            /^(recomiendas?|sugieres?)/,  // "recomiendas otro?"
            /^(y )?para (\d+)/  // "para 50m?" "y para 100 personas?"
        ];

        const isFollowUp = followUpPatterns.some(pattern => pattern.test(msg));

        if (!isFollowUp) return null;

        // Contexto de modelo anterior
        if (chatState.lastTopic === 'model-specs' && chatState.lastModel) {
            return {
                type: 'model-followup',
                lastModel: chatState.lastModel
            };
        }

        // Contexto de configuración
        if (chatState.lastTopic === 'festival' || chatState.lastTopic === 'teatro') {
            return {
                type: 'config-followup',
                eventType: chatState.lastTopic
            };
        }

        return null;
    }

    // ========================================
    // SUGERENCIAS INTELIGENTES
    // ========================================
    function generateSmartSuggestions(message) {
        const msg = message.toLowerCase();
        const suggestions = [];

        // Analizar palabras clave
        const keywords = msg.match(/\b\w{4,}\b/g) || []; // Palabras de 4+ letras

        // Detectar temas relacionados
        if (keywords.some(k => ['festival', 'outdoor', 'grande', 'masivo'].includes(k))) {
            suggestions.push('Setup festival');
            suggestions.push('K2 specs');
            suggestions.push('Delay towers');
        }

        if (keywords.some(k => ['teatro', 'indoor', 'sala'].includes(k))) {
            suggestions.push('Setup teatro');
            suggestions.push('Kara II specs');
        }

        if (keywords.some(k => ['delay', 'torre', 'tiempo', 'distancia'].includes(k))) {
            suggestions.push('delay 50m 20°C');
            suggestions.push('Delay towers');
        }

        if (keywords.some(k => ['dante', 'red', 'network', 'canales'].includes(k))) {
            suggestions.push('48 canales dante');
            suggestions.push('Redes Dante');
        }

        if (keywords.some(k => ['precio', 'costo', 'cuanto', 'pago'].includes(k))) {
            suggestions.push('¿Cuánto cuesta?');
        }

        if (keywords.some(k => ['potente', 'fuerte', 'spl', 'volumen'].includes(k))) {
            suggestions.push('K2 vs Panther');
            suggestions.push('Line arrays');
        }

        // Si no hay sugerencias específicas, dar genéricas
        if (suggestions.length === 0) {
            suggestions.push('¿Qué es LiveSync Pro?');
            suggestions.push('Specs del K2');
            suggestions.push('Setup festival');
        }

        return [...new Set(suggestions)].slice(0, 4); // Únicas, máx 4
    }

    // ========================================
    // HELPER: FORMATEAR RESPUESTA CON ANÁLISIS (CRÍTICO 1 FIX)
    // ========================================
    function formatBotResponse(text, analysis = null) {
        return {
            text: text,
            analysis: analysis
        };
    }

    // ========================================
    // GENERAR RESPUESTA DEL BOT (REFACTORIZADO + CORRECCIONES)
    // ========================================
    function generateBotResponse(userMessage) {
        const msg = userMessage.toLowerCase().trim();

        // ========================================
        // FASE 1+2: ANÁLISIS NLP AVANZADO (CORREGIDO)
        // ========================================
        let analysisResult = null;
        let entities = null;
        let intent = null;

        // CRÍTICO 2: Validar SPEAKER_DATABASE antes de usar (CON ERROR HANDLING)
        if (typeof analyzeMessage !== 'undefined' &&
            conversationContext &&
            typeof SPEAKER_DATABASE !== 'undefined' &&
            SPEAKER_DATABASE !== null) {

            try {
                // Usar motor NLP avanzado (FIX NLP #5: Pasar conversationContext)
                analysisResult = analyzeMessage(userMessage, SPEAKER_DATABASE, conversationContext);
                entities = analysisResult.entities;
                intent = analysisResult.intent;

                console.log('🧠 NLP Analysis:', {
                    intent: intent.intent,
                    confidence: intent.confidence,
                    entities: Object.keys(entities).filter(k => entities[k] !== null && (Array.isArray(entities[k]) ? entities[k].length > 0 : true)),
                    inferredFromContext: entities.inferredFromContext || [] // Debug NLP #5
                });
            } catch (nlpError) {
                console.error('Error en NLP engine:', nlpError);
                // Fallback a sistema antiguo si NLP falla
                entities = extractEntities(userMessage);
            }
        } else {
            // Fallback a sistema antiguo
            entities = extractEntities(userMessage);
        }

        // NUEVO: Verificar errores de validación
        if (entities.validationErrors && entities.validationErrors.length > 0) {
            const errors = entities.validationErrors.map(err => `• ${err}`).join('\n');

            // CRÍTICO 1: Retornar objeto con analysis para closure
            return {
                text: `⚠️ <strong>Valores fuera de rango</strong>\n\n${errors}\n\n💡 Verifica los valores e intenta de nuevo.`,
                analysis: analysisResult
            };
        }

        // Obtener expertise del usuario
        const expertise = conversationContext ? conversationContext.userProfile.expertise : 'intermedio';

        // NUEVO: Detectar preguntas de seguimiento (mejorado con contexto)
        let contextInfo = null;
        if (conversationContext && conversationContext.isFollowUpQuestion(userMessage)) {
            // Resolver referencias
            const reference = conversationContext.resolveReference(userMessage);
            if (reference && reference.resolved) {
                contextInfo = {
                    type: reference.type,
                    resolved: reference.resolved,
                    confidence: reference.confidence
                };
            }
        }

        // Fallback a detección antigua si no hay contexto avanzado
        if (!contextInfo) {
            contextInfo = detectContextualQuestion(userMessage, chatState);
        }

        // Detección de idioma
        const isEnglish = /(what|how|where|when|why|can|does|is|specs?|price|cost|work)/i.test(userMessage) &&
                         !/(que|como|donde|cuando|precio|costo|funciona|configurar)/i.test(userMessage);

        // CTA inteligente (solo cada 3 mensajes)
        const cta = chatState.showCTA ? '\n\n🚀 <strong>Accede:</strong> https://livesyncpro.com' : '';

        // ===================================
        // PREGUNTAS DE SEGUIMIENTO CONTEXTUALES (NUEVO)
        // ===================================
        if (contextInfo) {
            if (contextInfo.type === 'model-followup') {
                const lastModel = contextInfo.lastModel;

                // "cuántos necesito?" después de specs
                if (/(cu[aá]ntos?|cuantos?|cantidad).*necesito/i.test(msg)) {
                    if (entities.distance || entities.people) {
                        const dist = entities.distance || (entities.people > 1000 ? 80 : 40);
                        const qty = Math.ceil(dist / 8) + 4; // Aproximación simple
                        return formatBotResponse(`📊 <strong>Para ${dist}m aproximadamente:</strong>\n\n• ${qty}-${qty+4} ${lastModel.name} por lado (Main PA)\n• Configuración típica para esa distancia\n\n💡 LiveSync Pro calcula la cantidad exacta según cobertura y SPL objetivo.${cta}\n\n<button class="quick-action-btn" data-action="Setup festival">🎪 Ver setup completo</button>`, analysisResult);
                    }
                    return formatBotResponse(`❓ ¿Para qué distancia? Ej: "cuántos ${lastModel.name} para 50m"`, analysisResult);
                }

                // "sirve para outdoor?" después de specs
                if (/(sirve|funciona|va bien|recomendado).*para/i.test(msg)) {
                    const uso = entities.eventType === 'festival' ? 'festivales grandes' :
                                entities.eventType === 'teatro' ? 'teatros indoor' : 'ese tipo de evento';

                    if (lastModel.category === 'Line Array Large' && entities.eventType === 'festival') {
                        return formatBotResponse(`✅ <strong>Sí, ${lastModel.name} es ideal para ${uso}</strong>\n\n• SPL: ${lastModel.spl}dB (suficiente para grandes distancias)\n• Categoría: ${lastModel.category}\n• Alcance: >80m\n\n💡 Perfecto para outdoor masivo.${cta}`, analysisResult);
                    } else if (lastModel.category === 'Line Array Medium' && entities.eventType === 'teatro') {
                        return formatBotResponse(`✅ <strong>Sí, ${lastModel.name} funciona bien para ${uso}</strong>\n\n• Dispersión: ${lastModel.dispersion}° (ideal indoor)\n• SPL: ${lastModel.spl}dB\n• Alcance: 30-50m\n\n💡 Excelente para salas y teatros.${cta}`, analysisResult);
                    }
                }

                // "y para 50m?" después de specs
                if (/(y )?para (\d+)m/i.test(msg) && entities.distance) {
                    if (entities.distance > 80 && lastModel.category !== 'Line Array Large') {
                        return formatBotResponse(`⚠️ <strong>${lastModel.name} puede quedarse corto para ${entities.distance}m</strong>\n\n<strong>Mejor opción:</strong>\n• K1, Panther, GSL8 (>80m)\n• Line Arrays Large con alto SPL\n\n<button class="quick-action-btn" data-action="K2 vs Panther">⚖️ Comparar modelos</button>`, analysisResult);
                    } else {
                        return formatBotResponse(`✅ <strong>${lastModel.name} funciona para ${entities.distance}m</strong>\n\n• SPL @ ${entities.distance}m: ~${lastModel.spl - Math.ceil(entities.distance/10)}dB\n• Configuración recomendada: ${Math.ceil(entities.distance/8)}-${Math.ceil(entities.distance/6)} cajas por lado\n\n💡 LiveSync calcula SPL exacto.${cta}`, analysisResult);
                    }
                }
            }
        }

        // ===================================
        // SUGERENCIAS PROACTIVAS INTELIGENTES (NUEVO - MEJORA #4)
        // ===================================
        // Detectar queries incompletas y pedir información proactivamente

        // Usuario dice "necesito un line array" o "busco un PA" SIN especificar detalles
        if (/(necesito|busco|quiero|requiero).*(line array|pa|sistema|speaker|altavoz)/i.test(msg) &&
            !entities.eventType && !entities.distance && !entities.people) {

            chatState.lastTopic = 'proactive-recommendation';

            const clarificationMsg = typeof getAdaptiveResponse !== 'undefined'
                ? getAdaptiveResponse('clarification', expertise)
                : '🎯 Para darte la mejor recomendación, necesito saber:';

            return formatBotResponse(`${clarificationMsg}

<strong>🎪 ¿Para qué tipo de evento?</strong>
<button class="quick-action-btn" data-action="festival outdoor">🎪 Festival</button>
<button class="quick-action-btn" data-action="teatro indoor">🎭 Teatro</button>
<button class="quick-action-btn" data-action="corporativo">🏢 Corporativo</button>

<strong>📏 ¿Qué distancia necesitas cubrir?</strong>
<button class="quick-action-btn" data-action="necesito sistema para 30 metros">30m</button>
<button class="quick-action-btn" data-action="necesito sistema para 60 metros">60m</button>
<button class="quick-action-btn" data-action="necesito sistema para 100 metros">100m</button>

<strong>👥 ¿Cuántas personas aproximadamente?</strong>
<button class="quick-action-btn" data-action="evento 500 personas">500</button>
<button class="quick-action-btn" data-action="evento 2000 personas">2000</button>
<button class="quick-action-btn" data-action="evento 5000 personas">5000</button>

💡 O dime todo junto, ej: "Necesito PA para festival de 3000 personas a 80m"`, analysisResult);
        }

        // Usuario pregunta "cuál es mejor?" sin contexto
        if (/(cu[aá]l.*mejor|qu[eé].*recomiend|qu[eé].*conviene)/i.test(msg) &&
            msg.length < 40 && // Query corta = probablemente incompleta
            !entities.speakerModels.length &&
            !entities.eventType) {

            chatState.lastTopic = 'proactive-clarification';

            return formatBotResponse(`🤔 Para recomendarte el mejor equipo, ayúdame con esto:

<strong>¿Qué tipo de equipo buscas?</strong>
<button class="quick-action-btn" data-action="mejor line array">Line Array</button>
<button class="quick-action-btn" data-action="mejor subwoofer">Subwoofer</button>
<button class="quick-action-btn" data-action="mejor monitor">Monitor</button>

<strong>¿Para qué aplicación?</strong>
<button class="quick-action-btn" data-action="mejor para festival">Festival</button>
<button class="quick-action-btn" data-action="mejor para teatro">Teatro</button>
<button class="quick-action-btn" data-action="mejor para corporativo">Corporativo</button>

O pregunta directamente, ej: "Mejor line array para teatro 40m"`, analysisResult);
        }

        // Usuario pregunta por precio/costo sin especificar qué
        if (/(cuánto|precio|costo)/i.test(msg) &&
            msg.length < 25 && // Query muy corta
            !/(livesync|plan|membres[ií]a|suscripci[oó]n)/i.test(msg)) {

            chatState.lastTopic = 'proactive-pricing';

            return formatBotResponse(`💰 ¿Qué precio necesitas saber?

<strong>Planes de LiveSync Pro:</strong>
<button class="quick-action-btn" data-action="¿Cuánto cuesta LiveSync Pro?">💰 Ver Planes</button>

<strong>O si buscas precio de equipos:</strong>
LiveSync Pro es un software de diseño, no vendemos equipos. Pero puedo darte specs de modelos para que cotices con tu proveedor.

¿Qué modelo te interesa? Ej: "specs del K2"`, analysisResult);
        }

        // Usuario pregunta "cómo calculo..." sin especificar qué
        if (/(c[oó]mo.*calcul|calcul.*c[oó]mo)/i.test(msg) &&
            !entities.distance && !entities.channels && msg.length < 35) {

            chatState.lastTopic = 'proactive-calculation';

            return formatBotResponse(`🧮 ¿Qué necesitas calcular?

<button class="quick-action-btn" data-action="calcular delay 50m 20°C">⏱️ Delay (tiempo de alineación)</button>
<button class="quick-action-btn" data-action="48 canales dante">🌐 Dante Bandwidth</button>
<button class="quick-action-btn" data-action="calcular potencia">⚡ Potencia Eléctrica</button>
<button class="quick-action-btn" data-action="calcular rigging">🔗 Carga de Rigging</button>

O dímelo directamente, ej: "delay para 60 metros a 25°C"`, analysisResult);
        }

        // ===================================
        // PROCESAMIENTO NLP - PREGUNTAS COMPLEJAS (NUEVO)
        // ===================================

        // "mejor line array para teatro 25m 300 personas"
        if (/(mejor|recomien|sugier|qué.*necesito|que.*necesito).*line array/i.test(msg) ||
            /(line array|sistema|pa).*(mejor|recomien|para)/i.test(msg)) {

            const results = searchByCharacteristics(entities.characteristics, entities.eventType, entities.distance);

            if (results.length > 0) {
                chatState.lastTopic = 'smart-search';
                let response = `🎯 <strong>Recomendaciones para tu caso:</strong>\n\n`;

                results.slice(0, 3).forEach((r, idx) => {
                    const emoji = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
                    response += `${emoji} <strong>${r.model.brand} ${r.model.name}</strong>\n`;
                    response += `   • SPL: ${r.model.spl}dB | Peso: ${r.model.weight}kg | ${r.model.category}\n\n`;
                });

                if (entities.distance) response += `📏 Distancia: ${entities.distance}m\n`;
                if (entities.people) response += `👥 Audiencia: ${entities.people} personas\n`;
                if (entities.eventType) response += `🎪 Tipo: ${entities.eventType}\n`;

                response += `\n💡 LiveSync calcula la configuración exacta automáticamente.${cta}`;

                return formatBotResponse(response, analysisResult);
            }
        }

        // "calcula delay para 50 metros" (formato natural)
        if (/(calcul|necesito|dame).*delay/i.test(msg) && entities.distance) {
            const temp = entities.temperature || 20;
            const calc = calculateDelayByTemp(entities.distance, temp);
            chatState.lastTopic = 'delay-calc';
            return formatBotResponse(`🗼 <strong>Calculadora de Delay</strong>\n\n• Distancia: ${calc.distance}m @ ${calc.temperature}°C\n• Velocidad sonido: ${calc.speedOfSound} m/s\n• <strong>Delay: ${calc.delayMs} ms</strong>${cta}`, analysisResult);
        }

        // "cuántos canales dante para 64 canales" (formato natural)
        if (/(calcul|necesito|cu[aá]nto).*dante/i.test(msg) && entities.channels) {
            const calc = calculateDanteBandwidth(entities.channels, entities.sampleRate || 48);
            chatState.lastTopic = 'dante-calc';
            return formatBotResponse(`🌐 <strong>Dante Bandwidth</strong>\n\n• Canales: ${calc.channels}\n• Sample rate: ${calc.sampleRate}kHz/24bit\n• <strong>Total: ${calc.totalMbps} Mbps</strong>\n• ${calc.recommendation}${cta}`, analysisResult);
        }

        // "configuración para 5000 personas festival"
        if (/(config|setup|sistema|necesito).*festival|festival.*(config|setup)/i.test(msg) && entities.people) {
            const isLarge = entities.people > 3000;
            if (isLarge) {
                chatState.lastTopic = 'festival';
                return formatBotResponse(`🎪 <strong>Setup Festival Grande (${entities.people} personas)</strong>\n\n<strong>Main PA:</strong> 14-18 K1/Panther por lado\n→ <em>Cobertura >100m, SPL 105-110dB @ FOH</em>\n\n<strong>Subs:</strong> 10-16 KS28 (cardioid)\n<strong>Delay Towers:</strong> 3 torres @ 40m, 70m, 100m\n<strong>Potencia:</strong> 100-150 kW\n\n💡 LiveSync dimensiona automáticamente según tu audiencia.${cta}`, analysisResult);
            }
        }

        // ===================================
        // BÚSQUEDA DE MODELOS (CON FUZZY MATCHING MEJORADO)
        // ===================================
        const modelMatch = msg.match(/(k[12i3]|kara|kiva|ks28|sb28|x1[25]|panther|pantheer|panterr|leo|lyon|leopard|lina|gsl8|gsl|ksl8|j8|v8|y8|sl[-\s]?sub|j[-\s]?sub|m[24]|vtx[-\s]?[agbm]\d+|e1[25]|s10|cs10|e219|hdl[-\s]?\d+|sub[-\s]?\d+)/);
        if (modelMatch) {
            const found = findSpeakerModel(modelMatch[0]);
            if (found) {
                chatState.lastTopic = 'model-specs';
                chatState.lastModel = found; // NUEVO: Guardar modelo en contexto

                // Determinar uso recomendado según categoría
                let uso = '';
                if (found.category === 'Line Array Large') {
                    uso = '\n\n<strong>Uso recomendado:</strong> Festivales grandes, estadios, eventos outdoor masivos';
                } else if (found.category === 'Line Array Medium') {
                    uso = '\n\n<strong>Uso recomendado:</strong> Teatros, conciertos medianos, corporativos, delay towers';
                } else if (found.category === 'Subwoofer') {
                    uso = '\n\n<strong>Uso recomendado:</strong> Refuerzo de graves, configuración omni/cardioid/end-fire';
                } else if (found.category === 'Monitor') {
                    uso = '\n\n<strong>Uso recomendado:</strong> Monitores de piso (wedges), sidefills, escenario';
                }

                return formatBotResponse(`🔊 <strong>${found.brand} ${found.name}</strong>\n\n📊 <strong>Especificaciones:</strong>\n• SPL máximo: ${found.spl} dB\n• Peso: ${found.weight} kg\n• Impedancia: ${found.impedance}Ω\n• Dispersión: ${found.dispersion}°\n• Categoría: ${found.category}${uso}\n\n💡 En LiveSync Pro puedes simular este modelo con cálculo de cobertura, delays y rigging.${cta}`, analysisResult);
            } else {
                // NUEVO: Sistema "Did You Mean?" para typos
                const suggestion = suggestModelCorrection(modelMatch[0], SPEAKER_DATABASE);
                if (suggestion) {
                    chatState.lastTopic = 'did-you-mean';
                    return formatBotResponse(generateDidYouMeanMessage(modelMatch[0], suggestion), analysisResult);
                }
            }
        }

        // Contexto: Si el último tema fue specs, detectar "y el X?"
        if (chatState.lastTopic === 'model-specs' && /(y el|vs|versus|compar)/i.test(msg)) {
            const contextMatch = msg.match(/(k[123]|panther|gsl8|leo|vtx|kara)/i);
            if (contextMatch) {
                const found = findSpeakerModel(contextMatch[0]);
                if (found) {
                    return formatBotResponse(`🔊 <strong>${found.brand} ${found.name}</strong>\n\n📊 <strong>Especificaciones:</strong>\n• SPL: ${found.spl} dB, Peso: ${found.weight} kg\n• Impedancia: ${found.impedance}Ω, Dispersión: ${found.dispersion}°${cta}`, analysisResult);
                }
            }
        }

        // ===================================
        // COMPARACIONES CONTEXTUALES (FASE 2 - NUEVO)
        // ===================================
        // "cuál es más ligero?", "cuál es mejor?" después de mencionar modelos
        if (/(cu[aá]l|cual|qui[eé]n|quien)\s+(es\s+)?(m[aá]s|mejor)/i.test(msg)) {
            if (conversationContext && typeof compareModelsInContext !== 'undefined') {
                const recentModels = conversationContext.getRecentModels(2);
                if (recentModels.length >= 2) {
                    const property = msg; // Toda la pregunta
                    const comparison = compareModelsInContext(recentModels, property, expertise);
                    chatState.lastTopic = 'comparison';
                    return formatBotResponse(comparison, analysisResult);
                }
            }
        }

        // ===================================
        // COMPARACIÓN (VERSIÓN MEJORADA CON CONTEXTO)
        // ===================================
        if (/(compar|diferencia|versus|vs).*(k[123]|panther|gsl8|leo|vtx)/i.test(msg)) {
            chatState.lastTopic = 'comparison';
            return formatBotResponse(`⚖️ <strong>Comparación Line Arrays</strong>\n\n<strong>ULTRA LARGO ALCANCE (Festivales grandes):</strong>\n🥇 Meyer Panther: 150dB, 68kg - Más ligero\n🥈 d&b GSL8: 150dB, 80kg - Muy potente\n🥉 K1: 149dB, 106kg - Dispersión 5° (tight)\n\n<strong>MEDIO-LARGO (Conciertos, corporativos):</strong>\n🏅 K2: 147dB, 56kg - Muy versátil, peso ideal\n🏅 VTX V25: 147dB, 88kg - Potente\n\n<strong>Criterio de selección:</strong>\n• <strong>Distancia >50m:</strong> Panther, GSL8, K1\n• <strong>30-50m:</strong> K2, V25\n• <strong>Peso crítico:</strong> K2 (56kg) o Panther (68kg)\n\n💡 LiveSync Pro calcula automáticamente qué modelo necesitas según distancia y SPL objetivo.${cta}`, analysisResult);
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
            return formatBotResponse(`🌐 <strong>Dante Bandwidth</strong>\n\n• Canales: ${calc.channels}\n• Sample rate: ${calc.sampleRate}kHz/24bit\n• <strong>Total: ${calc.totalMbps} Mbps</strong>\n• ${calc.recommendation}${cta}`, analysisResult);
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
                return formatBotResponse(`🗼 <strong>Calculadora de Delay</strong>\n\n• Distancia: ${calc.distance}m @ ${calc.temperature}°C\n• Velocidad sonido: ${calc.speedOfSound} m/s\n• <strong>Delay: ${calc.delayMs} ms</strong>${cta}`, analysisResult);
            }
        }

        // ===================================
        // CASOS DE USO (VERSIÓN MEJORADA CON LÓGICA)
        // ===================================
        // Soporta ambos órdenes: "festival setup" Y "setup festival"
        if (/(festival|concierto|outdoor).*(config|setup|sistema)/i.test(msg) ||
            /(config|setup|sistema).*(festival|concierto|outdoor)/i.test(msg)) {
            chatState.lastTopic = 'festival';
            return formatBotResponse(`🎪 <strong>Setup Festival Outdoor</strong>\n\n<strong>Main PA:</strong> 12-16 K2/Panther por lado\n→ <em>Cobertura 80-100m con SPL >105dB @ FOH</em>\n\n<strong>Subs:</strong> 8-12 KS28/1100-LFC (cardioid)\n→ <em>Rechazo trasero -20dB, protege FOH y backstage</em>\n\n<strong>Delay Towers:</strong> @ 40m, 70m\n→ <em>Mantener SPL uniforme, calcular con temperatura del evento</em>\n\n<strong>FOH:</strong> DiGiCo SD7/Avid S6L\n<strong>Potencia:</strong> 80-120 kW (distribución trifásica)\n\n💡 LiveSync calcula automáticamente cantidades exactas según distancia y audiencia.${cta}\n\n<button class="quick-action-btn" data-action="delay 80m 25°C">🧮 Calcular delays</button> <button class="quick-action-btn" data-action="¿Cuánto cuesta LiveSync Pro?">💰 Ver precios</button>`, analysisResult);
        }

        if (/(teatro|corporativo|indoor).*(config|setup)/i.test(msg) ||
            /(config|setup).*(teatro|corporativo|indoor)/i.test(msg)) {
            chatState.lastTopic = 'teatro';
            return formatBotResponse(`🎭 <strong>Setup Teatro Indoor</strong>\n\n<strong>Main PA:</strong> 6-10 K3/Kara II por lado\n→ <em>Dispersión 10°, ideal para <30m en indoor</em>\n\n<strong>Subs:</strong> 4-6 SB28 (end-fire)\n→ <em>Direccional, evita reflexiones en paredes traseras</em>\n\n<strong>FOH:</strong> Yamaha CL5/dLive\n<strong>Potencia:</strong> 15-30 kW\n<strong>Sin delay towers</strong> (distancia <30m)\n\n💡 En salas con acústica controlada, priorizar direccionalidad sobre potencia bruta.${cta}`, analysisResult);
        }

        // ===================================
        // SALUDOS (CON RESPUESTAS ADAPTATIVAS - FASE 2)
        // ===================================
        if (/^(hola|hey|hi|buenas|buenos dias|hello)/.test(msg)) {
            chatState.lastTopic = 'greeting';

            // Usar respuestas adaptativas si están disponibles
            if (typeof getAdaptiveResponse !== 'undefined') {
                const greeting = getAdaptiveResponse('greeting', expertise);
                return formatBotResponse(greeting + '\n\n🚀 https://livesyncpro.com\n\n<button class="quick-action-btn" data-action="Specs del K2">📊 Specs K2</button> <button class="quick-action-btn" data-action="48 canales dante">🌐 Calcular Dante</button> <button class="quick-action-btn" data-action="¿Cuánto cuesta?">💰 Precios</button>', analysisResult);
            }

            return formatBotResponse(isEnglish
                ? `👋 Hi! I'm the LiveSync Pro assistant.\n\nI can help with PA Systems, line arrays, delays, and more.\n\n🚀 https://livesyncpro.com\n\n<button class="quick-action-btn" data-action="Specs del K2">📊 K2 Specs</button> <button class="quick-action-btn" data-action="48 canales dante">🌐 Dante Calc</button> <button class="quick-action-btn" data-action="¿Cuánto cuesta?">💰 Pricing</button>`
                : `👋 ¡Hola! Soy el asistente de LiveSync Pro.\n\nPuedo ayudarte con PA Systems, line arrays, delays, y más.\n\n🚀 https://livesyncpro.com\n\n<button class="quick-action-btn" data-action="Specs del K2">📊 Specs K2</button> <button class="quick-action-btn" data-action="48 canales dante">🌐 Calcular Dante</button> <button class="quick-action-btn" data-action="¿Cuánto cuesta?">💰 Precios</button>`, analysisResult);
        }

        if (/gracias|thanks/i.test(msg)) {
            // Usar respuestas variables
            if (typeof getAdaptiveResponse !== 'undefined') {
                return formatBotResponse(getAdaptiveResponse('thanks', expertise), analysisResult);
            }

            return formatBotResponse(isEnglish
                ? '😊 You\'re welcome!'
                : '😊 ¡De nada! ¿Algo más?', analysisResult);
        }

        // ===================================
        // QUÉ ES LIVESYNC PRO (VERSIÓN CORTA)
        // ===================================
        if (/que es|qué es|what is/.test(msg) && /(livesync|app|software)/.test(msg)) {
            chatState.lastTopic = 'about';
            return formatBotResponse(`🎯 <strong>LiveSync Pro</strong> es un sistema profesional de diseño de <strong>PA Systems</strong>.\n\nCalcula line arrays, delay towers, rigging, potencia, redes Dante/AVB y exporta a CAD.\n\n💰 <strong>$97 USD/año</strong>\n\n🚀 https://livesyncpro.com\n\n<button class="quick-action-btn" data-action="¿Funciona offline?">💻 ¿Offline?</button> <button class="quick-action-btn" data-action="¿Cómo exporto?">📤 Exportar</button>`, analysisResult);
        }

        // ===================================
        // PRECIO CON TODAS LAS MEMBRESÍAS (MEJORADO)
        // ===================================
        if (/(precio|cuanto cuesta|cost|suscripci[oó]n|pago|membres[ií]a|plan)/.test(msg)) {
            chatState.lastTopic = 'pricing';

            // Detectar si preguntan por membresía específica
            if (/(partner|empresas? peque|rental.*local|visibilidad)/i.test(msg)) {
                return formatBotResponse(`🏢 <strong>Partner Estándar</strong> - $199/año\n\n✅ 1 Licencia Pro incluida\n✅ Visibilidad Básica en Directorio\n✅ Perfil de empresa público\n✅ Badge 'Partner Verificado'\n✅ Todas las features Pro\n\n<strong>Ideal para:</strong> Empresas pequeñas de audio, rental shops locales\n\n🚀 https://livesyncpro.com`, analysisResult);
            }

            if (/(corporativo|corporate|equipos?|teams?|5 licencias|empresas? grande)/i.test(msg)) {
                return formatBotResponse(`🏆 <strong>Corporativo PRO</strong> - $499/año\n\n✅ 5 Licencias Pro incluidas\n✅ Gestión de Equipos (Teams)\n✅ Posicionamiento TOP en Directorio\n✅ Perfil Verificado con Badges Premium\n✅ Analytics avanzados\n✅ Soporte prioritario\n\n<strong>Ideal para:</strong> Empresas grandes de producción, rental houses profesionales\n\n🚀 https://livesyncpro.com`, analysisResult);
            }

            // Respuesta general con todos los planes
            return formatBotResponse(`💰 <strong>Planes LiveSync Pro</strong>\n\n<strong>🎯 Individual</strong> - $97/año\n→ Técnicos independientes, freelancers\n\n<strong>🏢 Partner Estándar</strong> - $199/año\n→ 1 Licencia + Visibilidad en Directorio\n→ Empresas pequeñas, rental shops\n\n<strong>🏆 Corporativo PRO</strong> - $499/año\n→ 5 Licencias + Teams + TOP positioning\n→ Empresas grandes, rental houses\n\n🔒 Garantía 7 días en todos los planes\n\n🚀 https://livesyncpro.com\n\n<button class="quick-action-btn" data-action="Plan Partner Estándar">🏢 Detalles Partner</button> <button class="quick-action-btn" data-action="Plan Corporativo PRO">🏆 Detalles Corporativo</button>`, analysisResult);
        }

        // ===================================
        // OFFLINE / INSTALACIÓN (COMPACTA)
        // ===================================
        if (/(offline|sin internet|instalaci[oó]n|windows|mac)/.test(msg)) {
            chatState.lastTopic = 'offline';
            return formatBotResponse(`💻 <strong>Modo Offline</strong>\n\n✅ Funciona <strong>100% offline</strong> después del acceso inicial\n❌ <strong>No necesitas instalar nada</strong> (es una PWA)\n✅ Compatible: Windows, Mac, iPad, Android\n✅ Licencia: Laptop + Tablet simultáneamente${cta}`, analysisResult);
        }

        // ===================================
        // LINE ARRAYS (COMPACTA)
        // ===================================
        if (/(line array|l[íi]nea|arreglo)/.test(msg)) {
            chatState.lastTopic = 'line-arrays';
            return formatBotResponse(`📡 <strong>Line Arrays soportados:</strong>\n\n🔷 L-Acoustics: K1, K2, K3, Kara II, KS28\n🔷 Meyer: Panther, LEO-M, Leopard, LINA\n🔷 d&b: GSL8, KSL8, J8, V8, SL-SUB\n🔷 JBL: VTX A12, V25, A8, B28\n🔷 Adamson: E15, E12, S10\n\n💡 Escribe el modelo (ej: "K2", "Panther")${cta}`, analysisResult);
        }

        // ===================================
        // DELAY TOWERS (MEJORADA CON EJEMPLOS PRÁCTICOS)
        // ===================================
        if (/(delay tower|torre de delay|torres)/.test(msg) && !/(festival|config)/i.test(msg)) {
            chatState.lastTopic = 'delay-towers';
            return formatBotResponse(`🗼 <strong>Delay Towers</strong>\n\nLiveSync calcula:\n• <strong>Posición óptima:</strong> Cada 30-40m en outdoor, 20-25m indoor\n• <strong>Delay time exacto:</strong> Ej: 50m @ 20°C = 145.7 ms\n• <strong>Gain shading:</strong> Torre más cerca del PA = -3dB típico\n• <strong>SPL uniforme:</strong> Mantener 95-105dB en toda la audiencia\n\n<strong>Criterio:</strong>\n• <strong>Distancia PA >50m:</strong> Necesaria 1 torre\n• <strong>>80m:</strong> 2 torres (@ 40m, 70m)\n• <strong>>120m:</strong> 3+ torres\n\n💡 Temperatura afecta el delay: mídela siempre antes del show.${cta}`, analysisResult);
        }

        // ===================================
        // FOH (COMPACTA)
        // ===================================
        if (/(foh|front of house|consola|mixer)/.test(msg)) {
            chatState.lastTopic = 'foh';
            return formatBotResponse(`🎛️ <strong>FOH Configuration</strong>\n\nProcesadores soportados:\n• Lake LM44, LM26\n• XTA DP448\n• BSS BLU-160\n• Q-SYS Core\n• Meyer Galaxy\n• L-Acoustics P1\n\nGenera IO lists automáticas y patcheo Dante/AVB.${cta}`, analysisResult);
        }

        // ===================================
        // MONITORES (MEJORADA CON RECOMENDACIONES POR TIPO)
        // ===================================
        if (/(monitor|monitoreo|wedge|sidefill|iem)/.test(msg)) {
            chatState.lastTopic = 'monitors';
            return formatBotResponse(`🔈 <strong>Sistemas de Monitores</strong>\n\n<strong>WEDGES (Piso):</strong>\n• Rock/Metal: X15, M2 (>138dB, alta potencia)\n• Acústico/Jazz: X12, M4 (136-138dB, controlado)\n• Corporativo: Cualquier modelo (90-100dB suficiente)\n\n<strong>SIDEFILLS:</strong>\n• Line arrays pequeños (Kiva II, Y8, LINA)\n• Objetivo: 105-110dB en escenario\n\n<strong>IEMs:</strong> Shure PSM1000, Sennheiser EW IEM G4\n→ <em>Elimina wedges, mejor control de gain before feedback</em>\n\n💡 LiveSync calcula patcheo mono/estéreo y potencia por mix.${cta}`, analysisResult);
        }

        // ===================================
        // RIGGING (MEJORADA CON CONTEXTO DE SEGURIDAD)
        // ===================================
        if (/(rigging|colgado|suspens|truss|bridle|carga)/.test(msg)) {
            chatState.lastTopic = 'rigging';
            return formatBotResponse(`⚙️ <strong>Análisis de Rigging</strong>\n\nLiveSync calcula:\n• <strong>Peso total:</strong> Array + accesorios (bumpers, frames)\n• <strong>Distribución en bridles:</strong> Front/rear según ángulo\n• <strong>Factor de seguridad 5:1 mínimo</strong> (normativa internacional)\n\n<strong>Ejemplos configuración grande:</strong>\n• 12x K2 = 672kg → Requiere truss 520kg WLL (factor 5:1 = 3360kg total)\n• 10x Panther = 680kg → Truss similar pero array más ligero/caja\n\n⚠️ <strong>CRÍTICO:</strong> Nunca exceder WLL (Working Load Limit) del truss.\n\n💡 LiveSync alerta automáticamente si superas límites de seguridad.${cta}`, analysisResult);
        }

        // ===================================
        // POTENCIA (MEJORADA CON EJEMPLOS DE CÁLCULO)
        // ===================================
        if (/(potencia|el[ée]ctric|power|ampli|watts?|voltage)/.test(msg)) {
            chatState.lastTopic = 'power';
            return formatBotResponse(`⚡ <strong>Análisis de Potencia</strong>\n\nAmplificadores soportados:\n• Lab.gruppen PLM 20000Q (20kW)\n• Powersoft X8 (8kW), Quattrocanali (10kW)\n• L-Acoustics LA12X (8.4kW), LA8 (3.3kW)\n• d&b D80 (4kW), D20 (2kW)\n\n<strong>Ejemplo setup festival:</strong>\n• 32x K2 + subs = 12x LA12X\n• Consumo: ~60kW continuo, 80kW peak\n• Trifásica 400V/32A por fase\n\n<strong>Criterio:</strong> Factor 0.6-0.7 (eficiencia amplificador clase D)\n\n💡 LiveSync calcula distribución por rack y voltage drop en cables.${cta}`, analysisResult);
        }

        // ===================================
        // DANTE/AVB (MEJORADA CON EJEMPLOS CONCRETOS)
        // ===================================
        if (/(dante|avb|red|network|bandwidth)/.test(msg) && !/\d+.*canal/i.test(msg)) {
            chatState.lastTopic = 'network';
            return formatBotResponse(`🌐 <strong>Redes Dante/AVB</strong>\n\n<strong>Dante:</strong>\n• 48kHz/24bit: ~1.15 Mbps/canal\n• 96kHz/24bit: ~2.3 Mbps/canal\n• Overhead: 20%\n\n<strong>Ejemplos:</strong>\n• 64 ch @ 48kHz = 88 Mbps → Switch Gigabit OK\n• 128 ch @ 48kHz = 176 Mbps → Gigabit con margen\n• 64 ch @ 96kHz = 176 Mbps → Requiere switch de calidad\n• >400 ch → Múltiples switches o 10Gb\n\n<strong>Regla:</strong> Mantener <70% uso del switch (headroom para QoS)\n\n💡 Usa switches con QoS/DSCP para audio (Cisco SG, Netgear M4300).${cta}`, analysisResult);
        }

        // ===================================
        // EXPORTACIÓN (COMPACTA)
        // ===================================
        if (/(export|exporta|dxf|pdf|cad|autocad|plano)/.test(msg)) {
            chatState.lastTopic = 'export';
            return formatBotResponse(`📤 <strong>Exportación</strong>\n\n<strong>DXF (CAD):</strong>\nPlano 2D con posiciones, compatible AutoCAD, Vectorworks, SketchUp\n\n<strong>PDF Técnico:</strong>\nReporte completo: specs, delays, SPL, rigging, potencia, IO lists${cta}`, analysisResult);
        }

        // ===================================
        // TEMPERATURA (MEJORADA CON RECOMENDACIÓN PRÁCTICA)
        // ===================================
        if (/(temperatura|thermal|drift|calor)/.test(msg) && !/\d+\s*m.*\d+\s*°?c/i.test(msg)) {
            chatState.lastTopic = 'thermal';
            return formatBotResponse(`🌡️ <strong>Thermal Drift</strong>\n\nLa velocidad del sonido cambia con temperatura:\n• 10°C = 337.5 m/s (invierno)\n• 20°C = 343.2 m/s (estándar)\n• 30°C = 349.0 m/s (verano/calor)\n\n<strong>Impacto real en 50m:</strong>\n20°C → 30°C = 2.4 ms diferencia\n→ <em>Delay towers se "desalinean" si no ajustas</em>\n\n<strong>RECOMENDACIÓN CRÍTICA:</strong>\n✅ Medir temperatura @ FOH antes del soundcheck\n✅ Re-medir antes del show (puede cambiar 5-10°C tarde vs día)\n✅ Usar LiveSync para recalcular delays si cambió >3°C\n\n💡 En outdoor, temperatura baja al atardecer = delays más largos.${cta}`, analysisResult);
        }

        // ===================================
        // SOPORTE (COMPACTA)
        // ===================================
        if (/(soporte|contacto|support|problema|error)/.test(msg) && !/(quiero|necesito)/i.test(msg)) {
            chatState.lastTopic = 'support';
            return formatBotResponse(`📞 <strong>Soporte Técnico</strong>\n\n📧 <strong>Email:</strong> abrinay@livesyncpro.com\n\nPara bugs, problemas técnicos o consultas de licencia.\n\n🚀 https://livesyncpro.com`, analysisResult);
        }

        // ===================================
        // CONCEPTOS TÉCNICOS AVANZADOS (KNOWLEDGE_BASE)
        // ===================================

        // EFECTO HAAS / PRECEDENCIA
        if (/(haas|precedencia|precedence|efecto.*temporal)/.test(msg)) {
            chatState.lastTopic = 'haas';
            return formatBotResponse(`🎯 <strong>Efecto Haas (Precedencia)</strong>\n\n${KNOWLEDGE_BASE.environmental.haasEffect.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.environmental.haasEffect.advanced}\n\n💡 ${KNOWLEDGE_BASE.environmental.haasEffect.proTip}${cta}`, analysisResult);
        }

        // POWER ALLEY
        if (/(power alley|callej[oó]n.*potencia|centro.*bajo|bass center)/.test(msg)) {
            chatState.lastTopic = 'power-alley';
            return formatBotResponse(`⚡ <strong>Power Alley</strong>\n\n${KNOWLEDGE_BASE.analysis.powerAlley.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.powerAlley.advanced}\n\n<strong>Boost:</strong> ${KNOWLEDGE_BASE.analysis.powerAlley.boost}\n\n💡 ${KNOWLEDGE_BASE.analysis.powerAlley.proTip}${cta}`, analysisResult);
        }

        // ARRAY LIMIT / TRANSICIÓN FRESNEL
        if (/(array limit|l[íi]mite.*array|fresnel|fraunhofer|transici[oó]n)/.test(msg)) {
            chatState.lastTopic = 'array-limit';
            return formatBotResponse(`📐 <strong>Array Limit (Transición)</strong>\n\n${KNOWLEDGE_BASE.analysis.arrayLimit.basic}\n\n<strong>Fórmula:</strong> ${KNOWLEDGE_BASE.analysis.arrayLimit.formula}\n\n<strong>Atenuación:</strong>\n• Campo cercano: ${KNOWLEDGE_BASE.analysis.arrayLimit.attenuation.nearField}\n• Campo lejano: ${KNOWLEDGE_BASE.analysis.arrayLimit.attenuation.farField}${cta}`, analysisResult);
        }

        // ROOM MODES / MODOS PROPIOS
        if (/(room mode|modo.*propio|resonancia.*sala|standing wave)/.test(msg)) {
            chatState.lastTopic = 'room-modes';
            return formatBotResponse(`🏛️ <strong>Modos Propios (Room Modes)</strong>\n\n${KNOWLEDGE_BASE.analysis.roomModes.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.roomModes.advanced}\n\n💡 ${KNOWLEDGE_BASE.analysis.roomModes.proTip}${cta}`, analysisResult);
        }

        // WST / GRATING LOBES
        if (/(wst|wavefront|grating lobe|l[oó]bulo.*rejilla|coherencia.*line array)/.test(msg)) {
            chatState.lastTopic = 'wst';
            return formatBotResponse(`🌊 <strong>WST & Grating Lobes</strong>\n\n${KNOWLEDGE_BASE.analysis.wst.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.wst.advanced}\n\n<strong>Espaciado:</strong> ${KNOWLEDGE_BASE.analysis.wst.spacing}\n\n💡 ${KNOWLEDGE_BASE.analysis.wst.proTip}${cta}`, analysisResult);
        }

        // SPLAY ANGLES / ÁNGULOS
        if (/(splay|[aá]ngulo.*inter.*caja|curvatura|banana)/.test(msg)) {
            chatState.lastTopic = 'splay';
            return formatBotResponse(`📐 <strong>Ángulos Splay (Curvatura)</strong>\n\n${KNOWLEDGE_BASE.systemConfig.splayAngles.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.systemConfig.splayAngles.advanced}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.splayAngles.proTip}${cta}`, analysisResult);
        }

        // GAIN SHADING
        if (/(gain shading|nivel.*torre|volumen.*delay.*tower)/.test(msg)) {
            chatState.lastTopic = 'gain-shading';
            return formatBotResponse(`🎚️ <strong>Gain Shading</strong>\n\n${KNOWLEDGE_BASE.delayAlignment.gainShading.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.delayAlignment.gainShading.advanced}\n\n<strong>Recomendación:</strong> ${KNOWLEDGE_BASE.delayAlignment.gainShading.recommendation}${cta}`, analysisResult);
        }

        // GROUND BOUNCE / EFECTO SUELO
        if (/(ground bounce|efecto suelo|rebote.*piso|comb filter.*ground)/.test(msg)) {
            chatState.lastTopic = 'ground-bounce';
            return formatBotResponse(`🌊 <strong>Ground Bounce (Rebote de Suelo)</strong>\n\n${KNOWLEDGE_BASE.analysis.groundBounce.basic}\n\n<strong>Fórmula:</strong> ${KNOWLEDGE_BASE.analysis.groundBounce.formula}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.groundBounce.advanced}${cta}`, analysisResult);
        }

        // COMPRESIÓN TÉRMICA
        if (/(compresi[oó]n.*t[ée]rmica|thermal compression|altavoz.*caliente|power.*loss.*heat)/.test(msg)) {
            chatState.lastTopic = 'thermal-comp';
            return formatBotResponse(`🔥 <strong>Compresión Térmica</strong>\n\n${KNOWLEDGE_BASE.analysis.thermalCompression.basic}\n\n<strong>Pérdida:</strong> ${KNOWLEDGE_BASE.analysis.thermalCompression.loss}\n\n💡 ${KNOWLEDGE_BASE.analysis.thermalCompression.proTip}${cta}`, analysisResult);
        }

        // HUMEDAD
        if (/(humedad|humidity|aire.*seco|high.*frequency.*loss)/.test(msg)) {
            chatState.lastTopic = 'humidity';
            return formatBotResponse(`💧 <strong>Humedad Relativa</strong>\n\n${KNOWLEDGE_BASE.environmental.humidity.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.environmental.humidity.advanced}\n\n💡 ${KNOWLEDGE_BASE.environmental.humidity.proTip}${cta}`, analysisResult);
        }

        // VIENTO
        if (/(viento|wind|refracci[oó]n.*sonido)/.test(msg) && !/(festival|config)/i.test(msg)) {
            chatState.lastTopic = 'wind';
            return formatBotResponse(`🌬️ <strong>Viento y Refracción</strong>\n\n${KNOWLEDGE_BASE.environmental.wind.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.environmental.wind.advanced}\n\n💡 ${KNOWLEDGE_BASE.environmental.wind.proTip}${cta}`, analysisResult);
        }

        // ARREGLOS DE SUBWOOFERS
        if (/(arreglo.*sub|sub.*array|cardioid|end.*fire|omni.*sub)/.test(msg)) {
            chatState.lastTopic = 'sub-array';
            const types = KNOWLEDGE_BASE.subwoofers.arrayTopology.types;
            return formatBotResponse(`🔊 <strong>Topología de Subgraves</strong>\n\n${KNOWLEDGE_BASE.subwoofers.arrayTopology.basic}\n\n<strong>OMNI:</strong> ${types.omni.description} - ${types.omni.efficiency}\n<strong>CARDIOID:</strong> ${types.cardioid.description} - Rechazo: ${types.cardioid.rearRejection}\n<strong>END-FIRE:</strong> ${types.endFire.description} - Rechazo: ${types.endFire.rearRejection}\n\n💡 ${KNOWLEDGE_BASE.subwoofers.arrayTopology.proTip}${cta}`, analysisResult);
        }

        // SPL TARGETS / OBJETIVOS
        if (/(spl.*target|objetivo.*spl|cu[aá]nto.*spl|volumen.*ideal)/.test(msg)) {
            chatState.lastTopic = 'spl-targets';
            const targets = KNOWLEDGE_BASE.systemConfig.targets.rules.spl;
            return formatBotResponse(`🎯 <strong>Objetivos SPL</strong>\n\n<strong>Corporativo:</strong> ${targets.corporativo}\n<strong>Concierto:</strong> ${targets.concierto}\n<strong>Festival:</strong> ${targets.festival}\n\n<strong>FOH:</strong> ${KNOWLEDGE_BASE.systemConfig.targets.rules.fohPosition}\n<strong>Distancia PA-FOH:</strong> ${KNOWLEDGE_BASE.systemConfig.targets.rules.paToFoh.ideal}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.targets.proTip}${cta}`, analysisResult);
        }

        // DIRECTIVIDAD OLSON
        if (/(olson|directividad.*linear|off.*axis.*loss|foh.*elevation)/.test(msg)) {
            chatState.lastTopic = 'olson';
            return formatBotResponse(`📊 <strong>Directividad Lineal (Olson)</strong>\n\n${KNOWLEDGE_BASE.analysis.olsonDirectivity.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.olsonDirectivity.advanced}${cta}`, analysisResult);
        }

        // ===================================
        // TÓPICOS ADICIONALES (NUEVO)
        // ===================================

        // ANÁLISIS FÍSICO DEL SISTEMA
        if (/(an[aá]lisis.*f[ií]sico|f[ií]sica.*sistema|salud.*sistema|velocidad.*sonido.*actual)/.test(msg)) {
            chatState.lastTopic = 'physics';
            return formatBotResponse(`🔬 <strong>Análisis Físico del Sistema</strong>\n\n${KNOWLEDGE_BASE.analysis.physics.basic}\n\n<strong>Métricas clave:</strong>\n• ${KNOWLEDGE_BASE.analysis.physics.metrics.join('\n• ')}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.physics.advanced}${cta}`, analysisResult);
        }

        // LOGÍSTICA Y CREW
        if (/(log[ií]stica|crew|personal|trucks?|camiones|metros.*cable)/.test(msg)) {
            chatState.lastTopic = 'logistics';
            return formatBotResponse(`🚛 <strong>Logística y Crew</strong>\n\n${KNOWLEDGE_BASE.analysis.logistics.basic}\n\n<strong>Estimados incluyen:</strong>\n• Cable: ${KNOWLEDGE_BASE.analysis.logistics.estimates.cable}\n• Crew: ${KNOWLEDGE_BASE.analysis.logistics.estimates.crew}\n• Trucks: ${KNOWLEDGE_BASE.analysis.logistics.estimates.trucks}\n\n💡 LiveSync calcula automáticamente según tu configuración.${cta}`, analysisResult);
        }

        // PESO TOTAL Y RIGGING LOAD
        if (/(peso.*total|carga.*rigging|cu[aá]nto.*pesa|weight.*total)/.test(msg)) {
            chatState.lastTopic = 'weight';
            return formatBotResponse(`⚖️ <strong>Peso Total del Sistema</strong>\n\n${KNOWLEDGE_BASE.analysis.weight.basic}\n\n<strong>Incluye:</strong>\n• Altavoces + bumpers\n• Top grid y hardware\n• Cables: ${KNOWLEDGE_BASE.analysis.weight.cableWeight}\n\n⚠️ <strong>Factor de seguridad:</strong> ${KNOWLEDGE_BASE.analysis.weight.safetyFactor}\n\n💡 ${KNOWLEDGE_BASE.analysis.weight.proTip}${cta}`, analysisResult);
        }

        // CABLEADO / SNAKE SYSTEM
        if (/(snake|cableado|multipar|fibra.*[oó]ptica|cat6.*audio)/.test(msg) && !/(dante|avb)/i.test(msg)) {
            chatState.lastTopic = 'cable-system';
            return formatBotResponse(`🔌 <strong>Sistema de Cableado (Snake)</strong>\n\n${KNOWLEDGE_BASE.analysis.cableSystem.basic}\n\n<strong>Tipos:</strong>\n• Analógico: ${KNOWLEDGE_BASE.analysis.cableSystem.types.analog}\n• CAT6: ${KNOWLEDGE_BASE.analysis.cableSystem.types.cat6}\n• Fibra: ${KNOWLEDGE_BASE.analysis.cableSystem.types.fiber}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.cableSystem.advanced}${cta}`, analysisResult);
        }

        // FINGERPRINT / VERIFICACIÓN DE ARRAY
        if (/(fingerprint|verificar.*array|salud.*array|curvatura.*array|array.*health)/.test(msg)) {
            chatState.lastTopic = 'fingerprint';
            return formatBotResponse(`🎯 <strong>Array Health (Fingerprint)</strong>\n\n${KNOWLEDGE_BASE.analysis.fingerprint.basic}\n\n<strong>Forma ideal:</strong> ${KNOWLEDGE_BASE.analysis.fingerprint.idealShape}\n\n<strong>Ángulos recomendados:</strong>\n• Superiores: ${KNOWLEDGE_BASE.analysis.fingerprint.upperAngles}\n• Inferiores: ${KNOWLEDGE_BASE.analysis.fingerprint.lowerAngles}\n\n💡 ${KNOWLEDGE_BASE.analysis.fingerprint.proTip}${cta}`, analysisResult);
        }

        // TIPO DE PA SYSTEM
        if (/(tipo.*pa|tipo.*sistema.*principal|line array.*vs.*mono|configuraci[oó]n.*pa)/.test(msg) && !/(setup|festival|teatro)/i.test(msg)) {
            chatState.lastTopic = 'pa-type';
            const types = KNOWLEDGE_BASE.systemConfig.mainPA.types;
            return formatBotResponse(`🔊 <strong>Tipos de PA System</strong>\n\n<strong>LINE ARRAY:</strong> ${types.lineArray}\n→ <em>Máximo control direccional, ideal >30m</em>\n\n<strong>LEFT/RIGHT:</strong> ${types.leftRight}\n→ <em>Configuración clásica, teatro y conciertos</em>\n\n<strong>MONO CENTER:</strong> ${types.monoCenter}\n→ <em>Discursos, corporativos, inteligibilidad</em>\n\n💡 ${KNOWLEDGE_BASE.systemConfig.mainPA.advanced}${cta}`, analysisResult);
        }

        // ===================================
        // GLOSARIO TÉCNICO LIVESYNC PRO (NUEVO)
        // ===================================
        if (typeof LIVESYNC_GLOSSARY !== 'undefined' && LIVESYNC_GLOSSARY !== null) {
            // Detectar consultas sobre términos técnicos del glosario
            if (/(qu[eé] es|que es|explica|explicame|define|definici[oó]n|concepto|t[ée]rmino)/i.test(msg)) {
                // Extraer el término buscado
                let searchTerm = null;
                let foundEntry = null;

                // Buscar directamente en el glosario por coincidencia de claves
                for (const [key, entry] of Object.entries(LIVESYNC_GLOSSARY)) {
                    // Normalizar para búsqueda
                    const normalizedKey = key.toLowerCase();
                    const normalizedMsg = msg.toLowerCase();

                    // Buscar coincidencia exacta o parcial
                    if (normalizedMsg.includes(normalizedKey) ||
                        normalizedMsg.includes(normalizedKey.replace(/ /g, ''))) {
                        searchTerm = key;
                        foundEntry = entry;
                        break;
                    }

                    // También buscar en términos relacionados
                    if (entry.relatedTerms) {
                        for (const relatedTerm of entry.relatedTerms) {
                            if (normalizedMsg.includes(relatedTerm.toLowerCase())) {
                                searchTerm = key;
                                foundEntry = entry;
                                break;
                            }
                        }
                        if (foundEntry) break;
                    }
                }

                // Si encontramos el término, formatear respuesta
                if (foundEntry && searchTerm) {
                    chatState.lastTopic = 'glossary-' + searchTerm.replace(/ /g, '-');

                    let response = `${foundEntry.icon || '📖'} <strong>${searchTerm.toUpperCase()}</strong>\n\n`;
                    response += `<em>${foundEntry.category}</em>\n\n`;
                    response += `${foundEntry.full}\n\n`;

                    // Agregar fórmula si existe
                    if (foundEntry.formula) {
                        response += `<strong>Fórmula:</strong>\n${foundEntry.formula}\n\n`;
                    }

                    // Agregar rangos si existen
                    if (foundEntry.ranges) {
                        response += `<strong>Rangos:</strong>\n`;
                        for (const [range, description] of Object.entries(foundEntry.ranges)) {
                            response += `• <strong>${range}:</strong> ${description}\n`;
                        }
                        response += '\n';
                    }

                    // Agregar clasificación si existe (ej: RT60)
                    if (foundEntry.classification) {
                        response += `<strong>Clasificación:</strong>\n`;
                        for (const [range, description] of Object.entries(foundEntry.classification)) {
                            response += `• <strong>${range}:</strong> ${description}\n`;
                        }
                        response += '\n';
                    }

                    // Agregar directions si existen (ej: dirección del viento)
                    if (foundEntry.directions) {
                        response += `<strong>Direcciones:</strong>\n`;
                        for (const [dir, description] of Object.entries(foundEntry.directions)) {
                            response += `• <strong>${dir}:</strong> ${description}\n`;
                        }
                        response += '\n';
                    }

                    // Agregar types si existen (ej: ground effect)
                    if (foundEntry.types) {
                        response += `<strong>Tipos:</strong>\n`;
                        for (const [type, description] of Object.entries(foundEntry.types)) {
                            response += `• <strong>${type}:</strong> ${description}\n`;
                        }
                        response += '\n';
                    }

                    // Agregar ejemplo si existe
                    if (foundEntry.example) {
                        response += `<strong>Ejemplo:</strong>\n${foundEntry.example}\n\n`;
                    }

                    // Agregar términos relacionados
                    if (foundEntry.relatedTerms && foundEntry.relatedTerms.length > 0) {
                        response += `💡 <strong>Ver también:</strong> ${foundEntry.relatedTerms.join(', ')}`;
                    }

                    response += cta;

                    return formatBotResponse(response, analysisResult);
                }
            }
        }

        // ===================================
        // RESPUESTA GENÉRICA CON SUGERENCIAS INTELIGENTES (FASE 2)
        // ===================================
        const smartSuggestions = generateSmartSuggestions(userMessage);
        let suggestionButtons = '';

        smartSuggestions.forEach(suggestion => {
            suggestionButtons += `<button class="quick-action-btn" data-action="${suggestion}">${suggestion}</button> `;
        });

        // Usar respuesta adaptativa para "unknown"
        let unknownResponse = `🤔 No entendí completamente tu pregunta.\n\n<strong>¿Te refieres a alguno de estos temas?</strong>\n\n${suggestionButtons}\n\n💡 O prueba con:\n• "Specs del K2"\n• "mejor line array para 50m"\n• "delay 80m 25°C"\n• "cuánto cuesta"\n\n🚀 https://livesyncpro.com`;

        if (typeof getAdaptiveResponse !== 'undefined') {
            const adaptiveUnknown = getAdaptiveResponse('unknown', expertise);
            if (adaptiveUnknown) {
                unknownResponse = adaptiveUnknown + '\n\n' + suggestionButtons;
            }
        }

        // CRÍTICO 1: Retornar formato {text, analysis}
        return formatBotResponse(unknownResponse, analysisResult);
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
// SISTEMA "DID YOU MEAN?" - CORRECCIÓN DE TYPOS
// ========================================
/**
 * Sugiere correcciones para modelos mal escritos
 * @param {string} query - Texto ingresado por el usuario
 * @param {object} speakerDatabase - Base de datos de speakers
 * @returns {object|null} - {suggestion, distance} o null si no hay sugerencia
 */
function suggestModelCorrection(query, speakerDatabase) {
    const queryLower = query.toLowerCase().trim();
    const models = Object.entries(speakerDatabase);

    // Buscar modelos con distancia Levenshtein ≤ 3 (permite 1-3 errores)
    const suggestions = [];

    for (const [key, model] of models) {
        // Comparar con el nombre del modelo
        const nameDistance = levenshteinDistance(queryLower, model.name.toLowerCase());
        if (nameDistance <= 3 && nameDistance > 0) {
            suggestions.push({
                key,
                name: model.name,
                brand: model.brand,
                distance: nameDistance,
                matchType: 'name'
            });
        }

        // Comparar con la key (k2, panther, etc.)
        const keyDistance = levenshteinDistance(queryLower, key.toLowerCase());
        if (keyDistance <= 2 && keyDistance > 0) {
            suggestions.push({
                key,
                name: model.name,
                brand: model.brand,
                distance: keyDistance,
                matchType: 'key'
            });
        }
    }

    // Ordenar por distancia (menor = mejor match)
    suggestions.sort((a, b) => a.distance - b.distance);

    // Retornar solo si hay al menos una sugerencia
    if (suggestions.length > 0) {
        return suggestions[0]; // Retornar el mejor match
    }

    return null;
}

/**
 * Genera mensaje de sugerencia "Did You Mean?"
 * @param {string} originalQuery - Query original del usuario
 * @param {object} suggestion - Sugerencia de corrección
 * @returns {string} - Mensaje formateado
 */
function generateDidYouMeanMessage(originalQuery, suggestion) {
    const messages = [
        `🤔 No encontré "${originalQuery}". ¿Quisiste decir <strong>${suggestion.brand} ${suggestion.name}</strong>?`,
        `❓ No tengo info de "${originalQuery}". ¿Te refieres a <strong>${suggestion.brand} ${suggestion.name}</strong>?`,
        `💭 Hmm, no encontré "${originalQuery}" en la base. ¿Será <strong>${suggestion.brand} ${suggestion.name}</strong>?`,
        `🔍 No ubico "${originalQuery}". Tal vez quisiste buscar <strong>${suggestion.brand} ${suggestion.name}</strong>?`,
        `🤔 "${originalQuery}" no está en mi catálogo. ¿Buscabas <strong>${suggestion.brand} ${suggestion.name}</strong>?`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    return `${randomMessage}\n\n<button class="quick-action-btn" data-action="Specs del ${suggestion.name}">📊 Ver ${suggestion.name}</button> <button class="quick-action-btn" data-action="${suggestion.brand}">🔍 Ver modelos ${suggestion.brand}</button>`;
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
