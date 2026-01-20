// Soporte LiveSync Pro - Sistema de Asistencia Técnica (v2.0 - Optimizado)
// Gestión de navegación
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initChat();
    initQuickActions();
    initManual();
});

// Navegación entre secciones
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const footer = document.querySelector('.footer');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetSection = link.getAttribute('data-section');

            // Si el enlace no tiene data-section (enlaces externos), dejar que funcione normalmente
            if (!targetSection) {
                return;
            }

            // Solo prevenir comportamiento por defecto en enlaces internos
            e.preventDefault();

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

            // Ocultar footer cuando estamos en chat, mostrarlo en otras secciones
            if (footer) {
                if (targetSection === 'chat') {
                    footer.style.display = 'none';
                } else {
                    footer.style.display = 'block';
                }
            }

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
        // NUEVOS HANDLERS - TÉRMINOS ADICIONALES
        // ===================================

        // ALTITUD GEOGRÁFICA
        if (/(altitud|altura.*geogr[aá]fica|elevaci[oó]n|sobre.*nivel.*mar|presi[oó]n.*atmosf[eé]rica)/.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'altitude';
            return formatBotResponse(`⛰️ <strong>Altitud Geográfica</strong>\n\n${KNOWLEDGE_BASE.environmental.altitude.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.environmental.altitude.advanced}\n\n<strong>Efecto:</strong> ${KNOWLEDGE_BASE.environmental.altitude.effect}\n\n💡 ${KNOWLEDGE_BASE.environmental.altitude.proTip}${cta}`, analysisResult);
        }

        // OFFSET PSICOACÚSTICO
        if (/(offset.*psicoac[uú]stico|psychoacoustic.*offset|delay.*adicional|empuje.*temporal)/.test(msg)) {
            chatState.lastTopic = 'psychoacoustic-offset';
            return formatBotResponse(`🧠 <strong>Offset Psicoacústico</strong>\n\n${KNOWLEDGE_BASE.delayAlignment.psychoacousticOffset.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.delayAlignment.psychoacousticOffset.advanced}\n\n<strong>Valores típicos:</strong>\n• Delay towers: ${KNOWLEDGE_BASE.delayAlignment.psychoacousticOffset.typical.delayTowers}\n• Frontfills: ${KNOWLEDGE_BASE.delayAlignment.psychoacousticOffset.typical.frontfills}\n• Outfills: ${KNOWLEDGE_BASE.delayAlignment.psychoacousticOffset.typical.outfills}\n\n💡 ${KNOWLEDGE_BASE.delayAlignment.psychoacousticOffset.proTip}${cta}`, analysisResult);
        }

        // TIPO DE RECINTOS
        if (/(tipo.*recinto|venue.*type|indoor.*cerrado|outdoor.*open.*air|carpa.*cubierto|espacios.*abiertos|salas.*cerradas)/.test(msg) && msg.length < 80) {
            chatState.lastTopic = 'venue-types';
            const types = KNOWLEDGE_BASE.systemConfig.venueTypes.types;
            return formatBotResponse(`🏛️ <strong>Tipos de Recintos</strong>\n\n${KNOWLEDGE_BASE.systemConfig.venueTypes.basic}\n\n<strong>INDOOR CERRADO:</strong>\n${types.indoorCerrado.description}\n• Desafíos: ${types.indoorCerrado.challenges}\n• Consideraciones: ${types.indoorCerrado.considerations}\n\n<strong>OUTDOOR OPEN AIR:</strong>\n${types.outdoorOpenAir.description}\n• Desafíos: ${types.outdoorOpenAir.challenges}\n• Consideraciones: ${types.outdoorOpenAir.considerations}\n\n<strong>CARPA/CUBIERTO:</strong>\n${types.carpaCubierto.description}\n• Desafíos: ${types.carpaCubierto.challenges}\n• Consideraciones: ${types.carpaCubierto.considerations}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.venueTypes.proTip}${cta}`, analysisResult);
        }

        // CONTROL DE OCUPACIÓN Y PÚBLICO
        if (/(control.*ocupaci[oó]n|control.*p[uú]blico|aforo|densidad.*audiencia|distribuci[oó]n.*p[uú]blico)/.test(msg) && msg.length < 70) {
            chatState.lastTopic = 'audience-control';
            return formatBotResponse(`👥 <strong>Control de Ocupación y Público</strong>\n\n${KNOWLEDGE_BASE.systemConfig.audienceControl.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.systemConfig.audienceControl.advanced}\n\n<strong>Efectos clave:</strong>\n• Absorción: ${KNOWLEDGE_BASE.systemConfig.audienceControl.effects.absorption}\n• Pérdida HF: ${KNOWLEDGE_BASE.systemConfig.audienceControl.effects.hfLoss}\n• Distribución: ${KNOWLEDGE_BASE.systemConfig.audienceControl.effects.distribution}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.audienceControl.proTip}${cta}`, analysisResult);
        }

        // LAYOUT DEL ESCENARIO
        if (/(layout.*escenario|configuraci[oó]n.*escenario|stage.*layout|proscenio|thrust.*stage|in.*the.*round)/.test(msg) && msg.length < 70) {
            chatState.lastTopic = 'stage-layout';
            const types = KNOWLEDGE_BASE.systemConfig.stageLayout.types;
            return formatBotResponse(`🎭 <strong>Layout del Escenario</strong>\n\n${KNOWLEDGE_BASE.systemConfig.stageLayout.basic}\n\n<strong>Tipos:</strong>\n• <strong>Proscenio:</strong> ${types.proscenio}\n• <strong>Thrust:</strong> ${types.thrust}\n• <strong>In-the-Round:</strong> ${types.inTheRound}\n• <strong>Festival:</strong> ${types.festival}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.systemConfig.stageLayout.advanced}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.stageLayout.proTip}${cta}`, analysisResult);
        }

        // ALTURA ARRAY / TRIM HEIGHT
        if (/(altura.*array|trim.*height|altura.*colgar|cu[aá]nto.*alto.*array|hang.*height)/.test(msg) && msg.length < 70) {
            chatState.lastTopic = 'trim-height';
            const ranges = KNOWLEDGE_BASE.systemConfig.trimHeight.ranges;
            return formatBotResponse(`📏 <strong>Altura Array (Trim Height)</strong>\n\n${KNOWLEDGE_BASE.systemConfig.trimHeight.basic}\n\n<strong>Rangos típicos:</strong>\n• Festival: ${ranges.festival}\n• Teatro: ${ranges.teatro}\n• Corporativo: ${ranges.corporativo}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.systemConfig.trimHeight.advanced}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.trimHeight.proTip}${cta}`, analysisResult);
        }

        // SUBWOOFER (individual, no array)
        if (/(^|\s)subwoofer($|\s)/i.test(msg) && !/(array|arreglo|cardioid|end.*fire|omni)/i.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'subwoofer-individual';
            return formatBotResponse(`🔊 <strong>Subwoofer Individual</strong>\n\n${KNOWLEDGE_BASE.systemConfig.fills.subwooferIndividual.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.systemConfig.fills.subwooferIndividual.advanced}\n\n<strong>Aplicaciones:</strong> ${KNOWLEDGE_BASE.systemConfig.fills.subwooferIndividual.applications}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.fills.subwooferIndividual.proTip}${cta}`, analysisResult);
        }

        // FRONTFILLS
        if (/(frontfill|front.*fill|fill.*frontal|cobertura.*frontal|primeras.*filas)/.test(msg) && msg.length < 70) {
            chatState.lastTopic = 'frontfills';
            return formatBotResponse(`🎯 <strong>Frontfills</strong>\n\n${KNOWLEDGE_BASE.systemConfig.fills.frontfills.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.systemConfig.fills.frontfills.advanced}\n\n<strong>Modelos típicos:</strong> ${KNOWLEDGE_BASE.systemConfig.fills.frontfills.models}\n\n<strong>Ubicación:</strong> ${KNOWLEDGE_BASE.systemConfig.fills.frontfills.placement}\n\n<strong>Delay:</strong> ${KNOWLEDGE_BASE.systemConfig.fills.frontfills.delayTip}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.fills.frontfills.proTip}${cta}`, analysisResult);
        }

        // OUTFILLS
        if (/(outfill|out.*fill|fill.*lateral|cobertura.*lateral|zonas.*laterales)/.test(msg) && msg.length < 70) {
            chatState.lastTopic = 'outfills';
            return formatBotResponse(`↔️ <strong>Outfills</strong>\n\n${KNOWLEDGE_BASE.systemConfig.fills.outfills.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.systemConfig.fills.outfills.advanced}\n\n<strong>Modelos típicos:</strong> ${KNOWLEDGE_BASE.systemConfig.fills.outfills.models}\n\n<strong>Cuándo usar:</strong> ${KNOWLEDGE_BASE.systemConfig.fills.outfills.when}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.fills.outfills.proTip}${cta}`, analysisResult);
        }

        // ÁNGULOS DE SEPARACIÓN (alias de Splay ya existente, pero con patrón adicional)
        if (/([aá]ngulo.*separaci[oó]n|separaci[oó]n.*cajas|inter.*cabinet.*angle)/.test(msg) && msg.length < 70) {
            chatState.lastTopic = 'splay';
            return formatBotResponse(`📐 <strong>Ángulos de Separación (Splay)</strong>\n\n${KNOWLEDGE_BASE.systemConfig.splayAngles.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.systemConfig.splayAngles.advanced}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.splayAngles.proTip}${cta}`, analysisResult);
        }

        // DRIVE PROCESSOR
        if (/(drive.*processor|procesador.*sistema|system.*processor|matriz.*gesti[oó]n|lake|galaxy|xta)/.test(msg) && msg.length < 70 && !/(dante|avb|bandwidth)/i.test(msg)) {
            chatState.lastTopic = 'drive-processor';
            return formatBotResponse(`🎛️ <strong>Drive Processor</strong>\n\n${KNOWLEDGE_BASE.foh.driveProcessor.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.foh.driveProcessor.advanced}\n\n<strong>Funciones principales:</strong>\n• ${KNOWLEDGE_BASE.foh.driveProcessor.features.join('\n• ')}\n\n<strong>Topología:</strong> ${KNOWLEDGE_BASE.foh.driveProcessor.topology}\n\n💡 ${KNOWLEDGE_BASE.foh.driveProcessor.proTip}${cta}`, analysisResult);
        }

        // MODO DE OPERACIÓN ELÉCTRICA
        if (/(modo.*operaci[oó]n|trif[aá]sica|monof[aá]sica|tres.*fases|fase.*el[eé]ctrica|power.*distribution.*mode)/.test(msg) && msg.length < 70) {
            chatState.lastTopic = 'operating-mode';
            const types = KNOWLEDGE_BASE.power.operatingMode.types;
            return formatBotResponse(`⚡ <strong>Modo de Operación Eléctrica</strong>\n\n${KNOWLEDGE_BASE.power.operatingMode.basic}\n\n<strong>MONOFÁSICA:</strong>\n• ${types.monofasica.description}\n• Ideal: ${types.monofasica.ideal}\n• Limitación: ${types.monofasica.limitation}\n\n<strong>TRIFÁSICA:</strong>\n• ${types.trifasica.description}\n• Ideal: ${types.trifasica.ideal}\n• Ventaja: ${types.trifasica.advantage}\n• Balance: ${types.trifasica.balanceRule}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.power.operatingMode.advanced}\n\n💡 ${KNOWLEDGE_BASE.power.operatingMode.proTip}${cta}`, analysisResult);
        }

        // CALIBRE CABLE ALTAVOZ
        if (/(calibre.*cable|cable.*altavoz|awg|speaker.*cable|grosor.*cable)/.test(msg) && msg.length < 70) {
            chatState.lastTopic = 'speaker-cable';
            const rec = KNOWLEDGE_BASE.power.speakerCableGauge.recommendations;
            return formatBotResponse(`🔌 <strong>Calibre Cable Altavoz</strong>\n\n${KNOWLEDGE_BASE.power.speakerCableGauge.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.power.speakerCableGauge.advanced}\n\n<strong>Recomendaciones:</strong>\n• Hasta 15m: ${rec.upTo15m}\n• Hasta 30m: ${rec.upTo30m}\n• Hasta 50m: ${rec.upTo50m}\n• Más de 50m: ${rec.over50m}\n\n⚠️ <strong>Advertencia:</strong> ${KNOWLEDGE_BASE.power.speakerCableGauge.warning}\n\n💡 ${KNOWLEDGE_BASE.power.speakerCableGauge.proTip}${cta}`, analysisResult);
        }

        // TIERRA FÍSICA VERIFICADA
        if (/(tierra.*f[ií]sica|ground.*verified|puesta.*tierra|verificar.*tierra|ground.*loop|zumbido.*tierra)/.test(msg) && msg.length < 70) {
            chatState.lastTopic = 'physical-ground';
            const ver = KNOWLEDGE_BASE.power.physicalGround.verification;
            const trouble = KNOWLEDGE_BASE.power.physicalGround.troubleshooting;
            return formatBotResponse(`⚡ <strong>Tierra Física Verificada</strong>\n\n${KNOWLEDGE_BASE.power.physicalGround.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.power.physicalGround.advanced}\n\n<strong>Verificación:</strong>\n• Resistencia: ${ver.resistance}\n• Tierra-Neutral: ${ver.groundToNeutral}\n• Sin loops: ${ver.noLoops}\n\n<strong>Solución de problemas:</strong>\n• Zumbido 60Hz: ${trouble.hum60Hz}\n• Tierra flotante: ${trouble.floatingGround}\n• Alta resistencia: ${trouble.highResistance}\n\n💡 ${KNOWLEDGE_BASE.power.physicalGround.proTip}${cta}`, analysisResult);
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
        // HANDLERS INTELIGENTES PARA ENTIDADES SIN INTENT CLARO (NUEVO)
        // ===================================
        // Si detectamos entidades importantes pero el intent es unclear, responder inteligentemente

        // CASO 1: Usuario solo menciona tipo de evento (festival, teatro, corporativo)
        if (entities && entities.eventType && !entities.distance && !entities.people && msg.length < 60) {
            chatState.lastTopic = 'event-type-' + entities.eventType;

            const eventInfo = {
                'festival': {
                    icon: '🎪',
                    title: 'Setup Festival Outdoor',
                    description: 'Eventos masivos al aire libre con grandes distancias y alta audiencia.',
                    typical: '• Audiencia: 2000-10000+ personas\n• Distancia: 60-120m\n• SPL objetivo: 105-110dB @ FOH',
                    equipment: '• Main PA: K2, Panther, GSL8 (line arrays large)\n• Subs: KS28, 1100-LFC (cardioid)\n• Delay towers cada 30-40m',
                    buttons: '<button class="quick-action-btn" data-action="setup festival">📋 Ver setup completo</button> <button class="quick-action-btn" data-action="mejor line array para festival">🔍 Mejores line arrays</button> <button class="quick-action-btn" data-action="calcular delay 80m">🧮 Calcular delays</button>'
                },
                'teatro': {
                    icon: '🎭',
                    title: 'Setup Teatro Indoor',
                    description: 'Espacios cerrados con acústica controlada y distancias cortas.',
                    typical: '• Audiencia: 200-1000 personas\n• Distancia: 15-30m\n• SPL objetivo: 95-100dB @ FOH',
                    equipment: '• Main PA: K3, Kara II, J8 (line arrays medium)\n• Subs: SB28, V-SUB (end-fire)\n• Sin delay towers (distancia corta)',
                    buttons: '<button class="quick-action-btn" data-action="setup teatro">📋 Ver setup completo</button> <button class="quick-action-btn" data-action="mejor line array para teatro">🔍 Mejores line arrays</button> <button class="quick-action-btn" data-action="qué es RT60">📚 Acústica de sala</button>'
                },
                'corporativo': {
                    icon: '🏢',
                    title: 'Setup Corporativo',
                    description: 'Conferencias, presentaciones y eventos empresariales.',
                    typical: '• Audiencia: 50-500 personas\n• Distancia: 10-20m\n• SPL objetivo: 90-95dB (inteligibilidad)',
                    equipment: '• Main PA: Line arrays small o point source\n• Sin subs (o 2-4 pequeños para fullness)\n• Prioridad: inteligibilidad sobre potencia',
                    buttons: '<button class="quick-action-btn" data-action="setup corporativo">📋 Ver setup completo</button> <button class="quick-action-btn" data-action="qué es STI">📚 Inteligibilidad</button> <button class="quick-action-btn" data-action="mejor para corporativo">🔍 Equipos recomendados</button>'
                }
            };

            const info = eventInfo[entities.eventType];
            if (info) {
                return formatBotResponse(`${info.icon} <strong>${info.title}</strong>\n\n${info.description}\n\n<strong>Típicamente:</strong>\n${info.typical}\n\n<strong>Equipamiento:</strong>\n${info.equipment}\n\n💡 LiveSync Pro calcula automáticamente la configuración exacta según tus parámetros.\n\n${info.buttons}${cta}`, analysisResult);
            }
        }

        // CASO 2: Usuario solo menciona distancia (50m, 80 metros, etc.)
        if (entities && entities.distance && !entities.eventType && !entities.people && msg.length < 60) {
            chatState.lastTopic = 'distance-only';

            let recommendations = '';
            if (entities.distance < 30) {
                recommendations = '• Line arrays Medium: K3, Kara II, J8, LINA\n• Ideal para: teatro, corporativo, indoor';
            } else if (entities.distance < 60) {
                recommendations = '• Line arrays Medium-Large: K2, Leopard, KSL8\n• Ideal para: conciertos, festivales medianos';
            } else {
                recommendations = '• Line arrays Large: K1, Panther, GSL8, VTX A12\n• Ideal para: festivales grandes, outdoor masivo';
            }

            return formatBotResponse(`📏 <strong>Para cubrir ${entities.distance}m necesitas:</strong>\n\n${recommendations}\n\n<strong>Ayúdame con más info para una mejor recomendación:</strong>\n\n<button class="quick-action-btn" data-action="festival ${entities.distance}m">🎪 Festival outdoor</button> <button class="quick-action-btn" data-action="teatro ${entities.distance}m">🎭 Teatro indoor</button> <button class="quick-action-btn" data-action="corporativo ${entities.distance}m">🏢 Corporativo</button>\n\nO dime: "mejor line array para ${entities.distance}m"${cta}`, analysisResult);
        }

        // CASO 3: Usuario solo menciona cantidad de personas
        if (entities && entities.people && !entities.eventType && !entities.distance && msg.length < 60) {
            chatState.lastTopic = 'people-only';

            let recommendations = '';
            let estimatedDistance = 0;

            if (entities.people < 500) {
                recommendations = '• Evento pequeño: 200-500 personas\n• Distancia estimada: 20-30m\n• Line arrays Medium o point source';
                estimatedDistance = 25;
            } else if (entities.people < 2000) {
                recommendations = '• Evento mediano: 500-2000 personas\n• Distancia estimada: 30-50m\n• Line arrays Medium-Large';
                estimatedDistance = 40;
            } else {
                recommendations = '• Evento grande: 2000+ personas\n• Distancia estimada: 60-100m\n• Line arrays Large + delay towers';
                estimatedDistance = 80;
            }

            return formatBotResponse(`👥 <strong>Para ${entities.people} personas:</strong>\n\n${recommendations}\n\n<strong>¿Qué tipo de evento es?</strong>\n\n<button class="quick-action-btn" data-action="festival ${entities.people} personas">🎪 Festival</button> <button class="quick-action-btn" data-action="teatro ${entities.people} personas">🎭 Teatro</button> <button class="quick-action-btn" data-action="corporativo ${entities.people} personas">🏢 Corporativo</button>\n\nO dime: "necesito sistema para ${estimatedDistance}m"${cta}`, analysisResult);
        }

        // CASO 4: Usuario menciona características técnicas (cardioid, high spl, etc.)
        if (entities && entities.characteristics && entities.characteristics.length > 0 && msg.length < 80) {
            chatState.lastTopic = 'characteristics-only';

            const charDescriptions = {
                'high-spl': '🔊 Alto SPL (>135dB)',
                'light': '🪶 Ligero (<30kg/caja)',
                'cardioid': '📡 Patrón cardioide',
                'long-throw': '🎯 Largo alcance',
                'compact': '📦 Compacto'
            };

            const detectedChars = entities.characteristics.map(c => charDescriptions[c] || c).join(', ');

            return formatBotResponse(`🔍 <strong>Buscas equipos con:</strong> ${detectedChars}\n\n<strong>Ayúdame a refinar la búsqueda:</strong>\n\n<button class="quick-action-btn" data-action="mejor line array ${entities.characteristics.join(' ')}">🔍 Line arrays</button> <button class="quick-action-btn" data-action="mejor subwoofer ${entities.characteristics.join(' ')}">🔊 Subwoofers</button> <button class="quick-action-btn" data-action="mejor monitor ${entities.characteristics.join(' ')}">🔈 Monitores</button>\n\nO especifica: "mejor ${entities.characteristics.join(' ')} para festival 50m"${cta}`, analysisResult);
        }

        // ===================================
        // HANDLERS PARA TÉRMINOS ESPECÍFICOS SIN CONTEXTO (NUEVO)
        // ===================================

        // EQUIPAMIENTO: Speaker/Altavoz/Bocina
        if (/(^|\s)(speaker|altavoz|bocina|parlante|caja|bafle)s?($|\s)/i.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'speakers';
            return formatBotResponse(`🔊 <strong>Speakers / Altavoces</strong>\n\nLiveSync Pro soporta catálogos completos de:\n\n<strong>LINE ARRAYS:</strong>\n• L-Acoustics (K1, K2, K3, Kara II)\n• d&b audiotechnik (GSL, KSL, J-Series)\n• Meyer Sound (Panther, LEO-M, Leopard)\n• JBL Professional (VTX A-Series)\n\n<strong>SUBWOOFERS:</strong>\n• KS28, SB28, 1100-LFC, V-SUB\n\n<strong>MONITORES:</strong>\n• Wedges de piso (X15, M2, dV-DOSC)\n• Sidefills (Kiva II, Y-Series)\n\n<strong>¿Qué tipo de speaker buscas?</strong>\n\n<button class="quick-action-btn" data-action="line arrays">📡 Line Arrays</button> <button class="quick-action-btn" data-action="mejor subwoofer">🔊 Subwoofers</button> <button class="quick-action-btn" data-action="monitores">🔈 Monitores</button>${cta}`, analysisResult);
        }

        // EQUIPAMIENTO: Mixer/Consola
        if (/(^|\s)(mixer|consola|mezcladora|mesa|mixing|board)s?($|\s)/i.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'mixer';
            return formatBotResponse(`🎛️ <strong>Consolas / Mixers</strong>\n\nLiveSync Pro calcula IO lists y configuraciones para:\n\n<strong>FOH (Front of House):</strong>\n• DiGiCo (SD7, SD5, Quantum)\n• Avid (S6L, Venue)\n• Yamaha (RIVAGE PM, CL/QL Series)\n• Allen & Heath (dLive, SQ Series)\n\n<strong>MONITORES:</strong>\n• DiGiCo SD12\n• Yamaha CL5, QL5\n• Midas M32\n\n<strong>Funcionalidades:</strong>\n• Patcheo automático Dante/AVB\n• IO lists por mixer\n• Channel counts\n• Cálculo de cables necesarios\n\n<button class="quick-action-btn" data-action="foh">🎚️ Ver procesadores FOH</button> <button class="quick-action-btn" data-action="dante">🌐 Configuración Dante</button>${cta}`, analysisResult);
        }

        // EQUIPAMIENTO: Amplificador/Potencia
        if (/(^|\s)(amp|amplificador|potencia|power amp|ampli)s?($|\s)/i.test(msg) && msg.length < 60 && !/(topology|clase)/i.test(msg)) {
            chatState.lastTopic = 'amplifiers';
            return formatBotResponse(`⚡ <strong>Amplificadores / Power Amps</strong>\n\nLiveSync Pro soporta amplificadores de todas las marcas:\n\n<strong>L-ACOUSTICS:</strong>\n• LA12X (8.4kW) - Clase D con DSP integrado\n• LA8 (3.3kW) - Para sistemas pequeños\n• LA-RAK II - Racks completos\n\n<strong>POWERSOFT:</strong>\n• X8 (8kW), Quattrocanali (10kW)\n• Mezzo Series (2-4kW)\n• Topología Clase D moderna con PFC\n\n<strong>LAB.GRUPPEN:</strong>\n• PLM 20000Q (20kW)\n• IPD Series (touring grade)\n\n<strong>d&b:</strong>\n• D80 (4kW), D20 (2kW), D6 (1kW)\n\n💡 LiveSync calcula:\n• Cantidad de amps necesarios\n• Consumo eléctrico total\n• Distribución por rack\n\n<button class="quick-action-btn" data-action="potencia eléctrica">⚡ Cálculo de potencia</button> <button class="quick-action-btn" data-action="qué es amp topology">📚 Topologías de amp</button>${cta}`, analysisResult);
        }

        // MARCAS: L-Acoustics
        if (/(^|\s)(l-acoustics|lacoustics|l acoustics|la|ele acoustics)($|\s)/i.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'lacoustics';
            return formatBotResponse(`🔷 <strong>L-Acoustics</strong>\n\nCatálogo completo en LiveSync Pro:\n\n<strong>LINE ARRAYS LARGE:</strong>\n• K1 (138dB) - Flagship, >100m\n• K2 (137dB) - Touring standard, 80-100m\n\n<strong>LINE ARRAYS MEDIUM:</strong>\n• K3 (136dB) - Teatro, 30-50m\n• Kara II (135dB) - Versátil, indoor/outdoor\n\n<strong>SUBWOOFERS:</strong>\n• KS28 (146dB) - Reference standard\n• SB28 (141dB) - Compacto, end-fire\n\n<strong>AMPLIFICACIÓN:</strong>\n• LA12X (8.4kW), LA8 (3.3kW)\n\n<strong>SOFTWARE NATIVO:</strong>\n• Soundvision (L-Acoustics)\n• LiveSync Pro (compatible, más rápido)\n\n<button class="quick-action-btn" data-action="specs K2">📊 Specs K2</button> <button class="quick-action-btn" data-action="K2 vs K3">⚖️ K2 vs K3</button> <button class="quick-action-btn" data-action="KS28">🔊 KS28 Specs</button>${cta}`, analysisResult);
        }

        // MARCAS: d&b audiotechnik
        if (/(^|\s)(d&b|d and b|deb|db audiotechnik)($|\s)/i.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'db';
            return formatBotResponse(`🔷 <strong>d&b audiotechnik</strong>\n\nCatálogo completo en LiveSync Pro:\n\n<strong>GSL-SERIES (Large):</strong>\n• GSL8 (138dB) - Flagship, >100m\n• GSL12 (137dB) - Similar a K2\n\n<strong>KSL-SERIES (Medium):</strong>\n• KSL8 (136dB) - Teatro grande, 40-60m\n• KSL12 (135dB) - Compacto\n\n<strong>J-SERIES (Medium):</strong>\n• J8, J12 - Versátiles, indoor/outdoor\n\n<strong>V-SERIES (Medium):</strong>\n• V8, V12 - Instalación, corporate\n\n<strong>SUBWOOFERS:</strong>\n• SL-SUB, V-SUB, J-SUB\n\n<strong>AMPLIFICACIÓN:</strong>\n• D80 (4kW), D20 (2kW)\n\n<button class="quick-action-btn" data-action="specs GSL8">📊 Specs GSL8</button> <button class="quick-action-btn" data-action="KSL8 vs J8">⚖️ KSL8 vs J8</button>${cta}`, analysisResult);
        }

        // MARCAS: Meyer Sound
        if (/(^|\s)(meyer|meyer sound)($|\s)/i.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'meyer';
            return formatBotResponse(`🔷 <strong>Meyer Sound</strong>\n\nCatálogo completo en LiveSync Pro:\n\n<strong>LINE ARRAYS LARGE:</strong>\n• Panther (139dB) - Máximo SPL, >100m\n• LEO-M (136dB) - Compacto pero potente\n\n<strong>LINE ARRAYS MEDIUM:</strong>\n• Leopard (135dB) - Versatile touring, 40-60m\n• LINA (134dB) - Compacto, instalación\n\n<strong>SUBWOOFERS:</strong>\n• 1100-LFC (147dB) - Reference, potencia brutal\n• 900-LFC (144dB)\n\n<strong>AMPLIFICACIÓN:</strong>\n• MPS-488 (integrado en cajas)\n• Sistema propio Meyer\n\n<strong>SOFTWARE:</strong>\n• Compass (Meyer)\n• LiveSync Pro (compatible)\n\n<button class="quick-action-btn" data-action="specs Panther">📊 Specs Panther</button> <button class="quick-action-btn" data-action="Panther vs K2">⚖️ Panther vs K2</button> <button class="quick-action-btn" data-action="Leopard">🔍 Leopard</button>${cta}`, analysisResult);
        }

        // MARCAS: JBL
        if (/(^|\s)(jbl|jbl professional)($|\s)/i.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'jbl';
            return formatBotResponse(`🔷 <strong>JBL Professional</strong>\n\nCatálogo en LiveSync Pro:\n\n<strong>VTX A-SERIES (Large):</strong>\n• VTX A12 (138dB) - Flagship, touring\n• VTX A8 (136dB) - Medium-large\n\n<strong>VTX V-SERIES (Medium):</strong>\n• VTX V25 (135dB) - Compacto, versátil\n• VTX V20 (134dB)\n\n<strong>SUBWOOFERS:</strong>\n• VTX B28 (144dB)\n• VTX G28 (142dB)\n\n<strong>AMPLIFICACIÓN:</strong>\n• Crown (serie IT, DCi)\n• Compatible con Crown/JBL\n\n<button class="quick-action-btn" data-action="specs VTX A12">📊 Specs VTX A12</button> <button class="quick-action-btn" data-action="VTX A12 vs K2">⚖️ A12 vs K2</button>${cta}`, analysisResult);
        }

        // CARACTERÍSTICAS: SPL
        if (/(^|\s)(spl|presión sonora|sound pressure level|decibeles|db)($|\s)/i.test(msg) && msg.length < 80 && !/(target|objetivo|cuánto)/i.test(msg)) {
            chatState.lastTopic = 'spl-concept';
            return formatBotResponse(`📊 <strong>SPL (Sound Pressure Level)</strong>\n\n<strong>Concepto:</strong>\nPresión sonora en decibeles (dB). Mide qué tan "fuerte" es el sonido.\n\n<strong>Rangos típicos:</strong>\n• 90-95 dB → Corporativo (speech, inteligibilidad)\n• 95-100 dB → Teatro, conciertos acústicos\n• 100-105 dB → Conciertos rock, festivales medianos\n• 105-110 dB → Festivales grandes, EDM\n• >110 dB → Eventos masivos (necesita permisos)\n\n<strong>SPL de equipos:</strong>\n• K2: 137dB @ 1m\n• Panther: 139dB @ 1m\n• KS28 (sub): 146dB @ 1m\n\n<strong>Pérdida por distancia:</strong>\n• -6dB cada vez que duplicas distancia\n• Ejemplo: K2 @ 50m ≈ 107dB\n\n💡 LiveSync calcula SPL exacto en cada punto del venue.\n\n<button class="quick-action-btn" data-action="qué es target spl">🎯 SPL objetivo</button> <button class="quick-action-btn" data-action="qué es distance loss">📐 Pérdida por distancia</button> <button class="quick-action-btn" data-action="mejor line array high spl">🔊 Equipos alto SPL</button>${cta}`, analysisResult);
        }

        // CARACTERÍSTICAS: Cobertura/Coverage
        if (/(^|\s)(cobertura|coverage|alcance|rango)($|\s)/i.test(msg) && msg.length < 60 && !entities.distance) {
            chatState.lastTopic = 'coverage';
            return formatBotResponse(`📡 <strong>Cobertura / Coverage</strong>\n\n<strong>Concepto:</strong>\nÁrea que puede cubrir un sistema de sonido con SPL adecuado.\n\n<strong>Tipos de cobertura:</strong>\n• <strong>Horizontal:</strong> Ancho (left-right)\n  - Line arrays: 70-110° típico\n  - Point source: 40-90°\n\n• <strong>Vertical:</strong> Alto (up-down)\n  - Line arrays: 5-15° por caja\n  - Control con splay angles\n\n• <strong>Distancia:</strong> Qué tan lejos llega\n  - Line arrays large: >80m\n  - Line arrays medium: 30-60m\n  - Point source: <30m\n\n<strong>Factores que afectan:</strong>\n• SPL del equipo\n• Cantidad de cajas (coupling gain)\n• Ground effect\n• Atmospheric loss\n\n💡 LiveSync genera mapas de cobertura automáticos.\n\n<button class="quick-action-btn" data-action="mejor para 50m">📏 Por distancia</button> <button class="quick-action-btn" data-action="qué es splay">📐 Ángulos splay</button> <button class="quick-action-btn" data-action="qué es power alley">⚡ Power alley</button>${cta}`, analysisResult);
        }

        // CARACTERÍSTICAS: Dispersión
        if (/(^|\s)(dispersión|dispersion|ángulo|apertura|pattern)($|\s)/i.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'dispersion';
            return formatBotResponse(`📐 <strong>Dispersión / Dispersion</strong>\n\n<strong>Concepto:</strong>\nÁngulo de apertura del patrón de radiación del altavoz.\n\n<strong>Dispersión horizontal típica:</strong>\n• 70° - Estrecho, gran distancia (K1, Panther)\n• 90° - Estándar, versátil (K2, Leopard)\n• 110° - Amplio, indoor (K3, Kara II)\n\n<strong>Dispersión vertical:</strong>\n• Line arrays: 5-15° por caja\n• Control con curvatura (splay)\n\n<strong>¿Cómo elegir?</strong>\n• <strong>70-80°:</strong> Venues largos y estrechos, outdoor\n• <strong>90°:</strong> Configuración estándar, versátil\n• <strong>110°:</strong> Salas anchas, indoor, wrap-around\n\n<strong>Dispersión de subwoofers:</strong>\n• Omni: 360° (suma en todas direcciones)\n• Cardioid: Direccional, rechazo trasero\n• End-fire: Muy direccional\n\n💡 LiveSync simula patrones de dispersión 3D.\n\n<button class="quick-action-btn" data-action="qué es directividad">📊 Directividad</button> <button class="quick-action-btn" data-action="qué es cardioid">🎯 Patrón cardioide</button>${cta}`, analysisResult);
        }

        // CARACTERÍSTICAS: Impedancia
        if (/(^|\s)(impedancia|impedance|ohms|ohmios|z)($|\s)/i.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'impedance';
            return formatBotResponse(`⚡ <strong>Impedancia / Impedance</strong>\n\n<strong>Concepto:</strong>\nResistencia eléctrica del altavoz (en Ohms Ω).\n\n<strong>Impedancias estándar:</strong>\n• 4Ω - Más corriente, más potencia\n• 8Ω - Estándar profesional\n• 16Ω - Menos corriente, alta eficiencia\n\n<strong>Importante:</strong>\n• Amplificador debe soportar la impedancia\n• Ej: Amp 8Ω @ 1000W → 4Ω @ 1600W (más potencia)\n• Conectar 8Ω a amp de 4Ω = subpotencia\n• Conectar 4Ω a amp de 8Ω = puede dañar amp\n\n<strong>En sistemas profesionales:</strong>\n• Line arrays modernos: 8Ω típico\n• Amps modernos: soportan 2-4-8Ω switchable\n• Clase D: Más tolerantes a impedancia variable\n\n💡 LiveSync calcula matching amp-speaker automáticamente.\n\n<button class="quick-action-btn" data-action="amplificadores">⚡ Ver amplificadores</button> <button class="quick-action-btn" data-action="qué es damping factor">🔧 Damping factor</button>${cta}`, analysisResult);
        }

        // CARACTERÍSTICAS: Sensibilidad
        if (/(^|\s)(sensibilidad|sensitivity|eficiencia|efficiency)($|\s)/i.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'sensitivity';
            return formatBotResponse(`📊 <strong>Sensibilidad / Sensitivity</strong>\n\n<strong>Concepto:</strong>\nEficiencia del altavoz. Cuánto SPL produce por cada watt de potencia.\n\n<strong>Medida:</strong>\n• dB SPL @ 1W/1m\n• Ejemplo: 100 dB @ 1W/1m\n\n<strong>Rangos típicos:</strong>\n• 95-100 dB → Baja sensibilidad (necesita más watts)\n• 100-105 dB → Sensibilidad media\n• 105-110 dB → Alta sensibilidad (eficiente)\n• >110 dB → Muy eficiente (horn-loaded)\n\n<strong>Ejemplo práctico:</strong>\n• Speaker A: 100dB @ 1W/1m con 1000W → 130dB max\n• Speaker B: 105dB @ 1W/1m con 500W → 132dB max\n→ B es más eficiente (menos watts, más SPL)\n\n<strong>Ventajas alta sensibilidad:</strong>\n• Menos potencia necesaria\n• Menos calor generado\n• Menor consumo eléctrico\n\n💡 LiveSync optimiza eficiencia amp-speaker.\n\n<button class="quick-action-btn" data-action="qué es spl">📊 SPL</button> <button class="quick-action-btn" data-action="potencia">⚡ Cálculo de potencia</button>${cta}`, analysisResult);
        }

        // CARACTERÍSTICAS: Frecuencia
        if (/(^|\s)(frecuencia|frequency|hz|hertz|rango.*frecuencias)($|\s)/i.test(msg) && msg.length < 80 && !/(crossover|cruce)/i.test(msg)) {
            chatState.lastTopic = 'frequency';
            return formatBotResponse(`🎵 <strong>Frecuencia / Frequency</strong>\n\n<strong>Concepto:</strong>\nCantidad de vibraciones por segundo (Hz = Hertz).\n\n<strong>Rango audible humano:</strong>\n• 20 Hz - 20,000 Hz (20 kHz)\n• Graves: 20-250 Hz\n• Medios: 250-4000 Hz\n• Agudos: 4000-20000 Hz\n\n<strong>Rangos de equipos:</strong>\n• <strong>Subwoofers:</strong> 25-100 Hz (graves profundos)\n• <strong>Line arrays:</strong> 50-18000 Hz (full-range)\n• <strong>Tweeters:</strong> 2000-20000 Hz (solo agudos)\n\n<strong>Frecuencias críticas:</strong>\n• 50-80 Hz: Kick drum, bajo\n• 100-250 Hz: Body de voces, calidez\n• 1000-4000 Hz: Inteligibilidad, claridad\n• 8000-16000 Hz: Air, brillantez\n\n<strong>En LiveSync Pro:</strong>\n• Response de cada modelo\n• Crossover frequencies\n• EQ sugerido por venue\n\n<button class="quick-action-btn" data-action="qué es crossover">🔀 Crossover</button> <button class="quick-action-btn" data-action="subwoofers">🔊 Subwoofers</button> <button class="quick-action-btn" data-action="qué es hpf">🔧 HPF</button>${cta}`, analysisResult);
        }

        // CARACTERÍSTICAS: Peso
        if (/(^|\s)(peso|weight|cuánto pesa|cuanto pesa|kg|kilogramos)($|\s)/i.test(msg) && msg.length < 80 && !/(total|sistema|rigging)/i.test(msg)) {
            chatState.lastTopic = 'weight';
            return formatBotResponse(`⚖️ <strong>Peso de Equipos</strong>\n\n<strong>Peso por tipo:</strong>\n\n<strong>LINE ARRAYS LARGE (por caja):</strong>\n• K2: 56kg\n• Panther: 68kg\n• GSL8: 64kg\n• VTX A12: 55kg\n\n<strong>LINE ARRAYS MEDIUM:</strong>\n• K3: 42kg\n• Kara II: 34kg\n• Leopard: 36kg\n\n<strong>SUBWOOFERS:</strong>\n• KS28: 115kg (pesado pero potente)\n• SB28: 75kg\n• 1100-LFC: 118kg\n\n<strong>Consideraciones de peso:</strong>\n• <strong>Rigging:</strong> Peso total determina truss necesario\n• <strong>Transporte:</strong> Más peso = más trucks\n• <strong>Setup time:</strong> Cajas pesadas = más crew/tiempo\n\n<strong>Factor de seguridad rigging:</strong>\n• Mínimo 5:1 (ejemplo: 500kg array = 2500kg WLL truss)\n\n💡 LiveSync calcula peso total y rigging automáticamente.\n\n<button class="quick-action-btn" data-action="rigging">⚙️ Rigging</button> <button class="quick-action-btn" data-action="mejor line array ligero">🪶 Equipos ligeros</button> <button class="quick-action-btn" data-action="qué es safety margin">🔒 Factor de seguridad</button>${cta}`, analysisResult);
        }

        // TECNOLOGÍA: AVB
        if (/(^|\s)(avb|audio video bridging|milan)($|\s)/i.test(msg) && msg.length < 60) {
            chatState.lastTopic = 'avb';
            return formatBotResponse(`🌐 <strong>AVB (Audio Video Bridging)</strong>\n\n<strong>Concepto:</strong>\nProtocolo de red para audio/video en tiempo real, alternativa a Dante.\n\n<strong>AVB vs Dante:</strong>\n\n<strong>AVB:</strong>\n• Estándar IEEE abierto\n• Requiere switches AVB certificados\n• Latencia garantizada (<2ms)\n• Meyer Sound, Biamp, QSC\n• MILAN: AVB certificado interoperable\n\n<strong>DANTE:</strong>\n• Protocolo propietario Audinate\n• Switches estándar con QoS\n• Más adoption en touring\n• L-Acoustics, d&b, Yamaha, etc.\n\n<strong>Bandwidth AVB:</strong>\n• Similar a Dante\n• 48kHz/24bit ≈ 1.5 Mbps/canal\n• 96kHz/24bit ≈ 3 Mbps/canal\n\n<strong>Ventajas AVB:</strong>\n• Latencia predecible garantizada\n• Estándar abierto (sin licencias)\n• Sincronización precisa (gPTP)\n\n<strong>Marcas con AVB:</strong>\n• Meyer Sound (MPS-488)\n• Biamp (Tesira)\n• QSC (Q-SYS)\n\n<button class="quick-action-btn" data-action="dante">🌐 Comparar con Dante</button> <button class="quick-action-btn" data-action="qué es sample rate">📊 Sample rate</button> <button class="quick-action-btn" data-action="meyer">🔷 Meyer Sound</button>${cta}`, analysisResult);
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

    // ========================================
    // SCROLL TO BOTTOM BUTTON
    // ========================================

    const scrollToBottomBtn = document.getElementById('scrollToBottom');

    // Function to check if user is at bottom of chat
    function isAtBottom() {
        const threshold = 100; // pixels from bottom
        return chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight < threshold;
    }

    // Show/hide scroll-to-bottom button based on scroll position
    if (chatMessages && scrollToBottomBtn) {
        chatMessages.addEventListener('scroll', () => {
            if (isAtBottom()) {
                scrollToBottomBtn.classList.remove('visible');
            } else {
                scrollToBottomBtn.classList.add('visible');
            }
        });

        // Click handler to scroll to bottom
        scrollToBottomBtn.addEventListener('click', () => {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // KEYBOARD HANDLING (Mobile)
    // ========================================

    // Auto-scroll when keyboard appears (focus on input)
    if (chatInput && chatMessages) {
        chatInput.addEventListener('focus', () => {
            // Small delay to wait for keyboard animation
            setTimeout(() => {
                chatMessages.scrollTo({
                    top: chatMessages.scrollHeight,
                    behavior: 'smooth'
                });
            }, 300);
        });

        // Handle viewport resize (keyboard open/close)
        let lastHeight = window.innerHeight;
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;

            // Keyboard opened (viewport shrank)
            if (currentHeight < lastHeight && document.activeElement === chatInput) {
                setTimeout(() => {
                    chatMessages.scrollTo({
                        top: chatMessages.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 100);
            }

            lastHeight = currentHeight;
        });
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

            // Convertir 'manuals' a 'manuales' para que coincida con data-section
            const sectionName = action === 'manuals' ? 'manuales' : action;

            const navLink = document.querySelector(`[data-section="${sectionName}"]`);

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

// ========================================
// MOBILE MENU & SIDEBAR CONTROLS
// ========================================

// Hamburger Menu Toggle
const hamburgerMenu = document.getElementById('hamburgerMenu');
const nav = document.querySelector('.nav');

if (hamburgerMenu && nav) {
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburgerMenu.contains(e.target) && !nav.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

// Chat Sidebar Toggle (Mobile)
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const chatSidebar = document.getElementById('chatSidebar');

if (toggleSidebarBtn && chatSidebar) {
    toggleSidebarBtn.addEventListener('click', () => {
        chatSidebar.classList.add('active');
    });
}

if (closeSidebarBtn && chatSidebar) {
    closeSidebarBtn.addEventListener('click', () => {
        chatSidebar.classList.remove('active');
    });
}

// Close sidebar when clicking outside (mobile)
if (chatSidebar) {
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            chatSidebar.classList.contains('active') &&
            !chatSidebar.contains(e.target) &&
            !toggleSidebarBtn.contains(e.target)) {
            chatSidebar.classList.remove('active');
        }
    });
}

// ========================================
// MANUAL LIVESYNC PRO
// ========================================
function initManual() {
    if (typeof MANUAL_CONTENT === 'undefined') {
        console.warn('Manual content not loaded');
        return;
    }

    const manualNav = document.getElementById('manualNav');
    const manualContent = document.getElementById('manualContent');

    if (!manualNav || !manualContent) {
        return;
    }

    // Render navigation items
    MANUAL_CONTENT.parts.forEach((part, index) => {
        const navItem = document.createElement('div');
        navItem.className = 'manual-nav-item';
        navItem.dataset.partId = part.id;
        
        navItem.innerHTML = `
            <span class="icon">${part.icon}</span>
            <span>${part.title}</span>
        `;

        navItem.addEventListener('click', () => {
            // Remove active from all items
            document.querySelectorAll('.manual-nav-item').forEach(item => {
                item.classList.remove('active');
            });

            // Add active to clicked item
            navItem.classList.add('active');

            // Load content
            loadManualPart(part);
        });

        manualNav.appendChild(navItem);

        // Load first part by default
        if (index === 0) {
            navItem.classList.add('active');
            loadManualPart(part);
        }
    });
}

function loadManualPart(part) {
    const manualContent = document.getElementById('manualContent');
    if (!manualContent) return;

    // Build content HTML
    let contentHTML = '';

    part.sections.forEach(section => {
        contentHTML += section.content;
    });

    manualContent.innerHTML = contentHTML;

    // Scroll to top
    const contentArea = manualContent.closest('.manual-content-area');
    if (contentArea) {
        contentArea.scrollTop = 0;
    }
}
