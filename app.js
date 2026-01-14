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
    lastModel: null,  // NUEVO: Último modelo consultado (para contexto)
    showCTA: false    // Alternar CTAs (cada 3 mensajes)
};

// NUEVO: Sistema de feedback con localStorage
let feedbackData = JSON.parse(localStorage.getItem('syncmaster-feedback') || '{"helpful": [], "notHelpful": [], "responses": {}}');

// NUEVO: Historial persistente
let chatHistory = JSON.parse(localStorage.getItem('syncmaster-history') || '[]');

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
    // CARGAR HISTORIAL (NUEVO)
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
    }

    // ========================================
    // LIMPIAR HISTORIAL (NUEVO)
    // ========================================
    function clearChatHistory() {
        if (confirm('¿Estás seguro de que quieres borrar todo el historial de la conversación?')) {
            chatHistory = [];
            localStorage.removeItem('syncmaster-history');

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

        // Guardar en localStorage
        localStorage.setItem('syncmaster-history', JSON.stringify(chatHistory));

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
            localStorage.setItem('syncmaster-history', JSON.stringify(chatHistory));
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
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Event listeners para botones de acción rápida
        const quickButtons = content.querySelectorAll('.quick-action-btn');
        quickButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                chatInput.value = action;
                sendChatMessage();
            });
        });

        // NUEVO: Event listeners para feedback
        if (sender === 'bot') {
            const feedbackButtons = content.querySelectorAll('.feedback-btn');
            feedbackButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const feedbackType = this.getAttribute('data-feedback');
                    handleFeedback(messageId, text, feedbackType, this);
                });
            });
        }
    }

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

        // Guardar en localStorage
        localStorage.setItem('syncmaster-feedback', JSON.stringify(feedbackData));

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
    // GENERAR RESPUESTA DEL BOT (REFACTORIZADO)
    // ========================================
    function generateBotResponse(userMessage) {
        const msg = userMessage.toLowerCase().trim();

        // NUEVO: Extraer entidades con NLP básico
        const entities = extractEntities(userMessage);

        // NUEVO: Verificar errores de validación
        if (entities.validationErrors.length > 0) {
            const errors = entities.validationErrors.map(err => `• ${err}`).join('\n');
            return `⚠️ <strong>Valores fuera de rango</strong>\n\n${errors}\n\n💡 Verifica los valores e intenta de nuevo.`;
        }

        // NUEVO: Detectar preguntas de seguimiento
        const contextInfo = detectContextualQuestion(userMessage, chatState);

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
                        return `📊 <strong>Para ${dist}m aproximadamente:</strong>\n\n• ${qty}-${qty+4} ${lastModel.name} por lado (Main PA)\n• Configuración típica para esa distancia\n\n💡 LiveSync Pro calcula la cantidad exacta según cobertura y SPL objetivo.${cta}\n\n<button class="quick-action-btn" data-action="Setup festival">🎪 Ver setup completo</button>`;
                    }
                    return `❓ ¿Para qué distancia? Ej: "cuántos ${lastModel.name} para 50m"`;
                }

                // "sirve para outdoor?" después de specs
                if (/(sirve|funciona|va bien|recomendado).*para/i.test(msg)) {
                    const uso = entities.eventType === 'festival' ? 'festivales grandes' :
                                entities.eventType === 'teatro' ? 'teatros indoor' : 'ese tipo de evento';

                    if (lastModel.category === 'Line Array Large' && entities.eventType === 'festival') {
                        return `✅ <strong>Sí, ${lastModel.name} es ideal para ${uso}</strong>\n\n• SPL: ${lastModel.spl}dB (suficiente para grandes distancias)\n• Categoría: ${lastModel.category}\n• Alcance: >80m\n\n💡 Perfecto para outdoor masivo.${cta}`;
                    } else if (lastModel.category === 'Line Array Medium' && entities.eventType === 'teatro') {
                        return `✅ <strong>Sí, ${lastModel.name} funciona bien para ${uso}</strong>\n\n• Dispersión: ${lastModel.dispersion}° (ideal indoor)\n• SPL: ${lastModel.spl}dB\n• Alcance: 30-50m\n\n💡 Excelente para salas y teatros.${cta}`;
                    }
                }

                // "y para 50m?" después de specs
                if (/(y )?para (\d+)m/i.test(msg) && entities.distance) {
                    if (entities.distance > 80 && lastModel.category !== 'Line Array Large') {
                        return `⚠️ <strong>${lastModel.name} puede quedarse corto para ${entities.distance}m</strong>\n\n<strong>Mejor opción:</strong>\n• K1, Panther, GSL8 (>80m)\n• Line Arrays Large con alto SPL\n\n<button class="quick-action-btn" data-action="K2 vs Panther">⚖️ Comparar modelos</button>`;
                    } else {
                        return `✅ <strong>${lastModel.name} funciona para ${entities.distance}m</strong>\n\n• SPL @ ${entities.distance}m: ~${lastModel.spl - Math.ceil(entities.distance/10)}dB\n• Configuración recomendada: ${Math.ceil(entities.distance/8)}-${Math.ceil(entities.distance/6)} cajas por lado\n\n💡 LiveSync calcula SPL exacto.${cta}`;
                    }
                }
            }
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

                return response;
            }
        }

        // "calcula delay para 50 metros" (formato natural)
        if (/(calcul|necesito|dame).*delay/i.test(msg) && entities.distance) {
            const temp = entities.temperature || 20;
            const calc = calculateDelayByTemp(entities.distance, temp);
            chatState.lastTopic = 'delay-calc';
            return `🗼 <strong>Calculadora de Delay</strong>\n\n• Distancia: ${calc.distance}m @ ${calc.temperature}°C\n• Velocidad sonido: ${calc.speedOfSound} m/s\n• <strong>Delay: ${calc.delayMs} ms</strong>${cta}`;
        }

        // "cuántos canales dante para 64 canales" (formato natural)
        if (/(calcul|necesito|cu[aá]nto).*dante/i.test(msg) && entities.channels) {
            const calc = calculateDanteBandwidth(entities.channels, entities.sampleRate || 48);
            chatState.lastTopic = 'dante-calc';
            return `🌐 <strong>Dante Bandwidth</strong>\n\n• Canales: ${calc.channels}\n• Sample rate: ${calc.sampleRate}kHz/24bit\n• <strong>Total: ${calc.totalMbps} Mbps</strong>\n• ${calc.recommendation}${cta}`;
        }

        // "configuración para 5000 personas festival"
        if (/(config|setup|sistema|necesito).*festival|festival.*(config|setup)/i.test(msg) && entities.people) {
            const isLarge = entities.people > 3000;
            if (isLarge) {
                chatState.lastTopic = 'festival';
                return `🎪 <strong>Setup Festival Grande (${entities.people} personas)</strong>\n\n<strong>Main PA:</strong> 14-18 K1/Panther por lado\n→ <em>Cobertura >100m, SPL 105-110dB @ FOH</em>\n\n<strong>Subs:</strong> 10-16 KS28 (cardioid)\n<strong>Delay Towers:</strong> 3 torres @ 40m, 70m, 100m\n<strong>Potencia:</strong> 100-150 kW\n\n💡 LiveSync dimensiona automáticamente según tu audiencia.${cta}`;
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

                return `🔊 <strong>${found.brand} ${found.name}</strong>\n\n📊 <strong>Especificaciones:</strong>\n• SPL máximo: ${found.spl} dB\n• Peso: ${found.weight} kg\n• Impedancia: ${found.impedance}Ω\n• Dispersión: ${found.dispersion}°\n• Categoría: ${found.category}${uso}\n\n💡 En LiveSync Pro puedes simular este modelo con cálculo de cobertura, delays y rigging.${cta}`;
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
        // COMPARACIÓN (VERSIÓN MEJORADA CON CONTEXTO)
        // ===================================
        if (/(compar|diferencia|versus|vs).*(k[123]|panther|gsl8|leo|vtx)/i.test(msg)) {
            chatState.lastTopic = 'comparison';
            return `⚖️ <strong>Comparación Line Arrays</strong>\n\n<strong>ULTRA LARGO ALCANCE (Festivales grandes):</strong>\n🥇 Meyer Panther: 150dB, 68kg - Más ligero\n🥈 d&b GSL8: 150dB, 80kg - Muy potente\n🥉 K1: 149dB, 106kg - Dispersión 5° (tight)\n\n<strong>MEDIO-LARGO (Conciertos, corporativos):</strong>\n🏅 K2: 147dB, 56kg - Muy versátil, peso ideal\n🏅 VTX V25: 147dB, 88kg - Potente\n\n<strong>Criterio de selección:</strong>\n• <strong>Distancia >50m:</strong> Panther, GSL8, K1\n• <strong>30-50m:</strong> K2, V25\n• <strong>Peso crítico:</strong> K2 (56kg) o Panther (68kg)\n\n💡 LiveSync Pro calcula automáticamente qué modelo necesitas según distancia y SPL objetivo.${cta}`;
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
        // CASOS DE USO (VERSIÓN MEJORADA CON LÓGICA)
        // ===================================
        if (/(festival|concierto|outdoor).*(config|setup|sistema)/i.test(msg)) {
            chatState.lastTopic = 'festival';
            return `🎪 <strong>Setup Festival Outdoor</strong>\n\n<strong>Main PA:</strong> 12-16 K2/Panther por lado\n→ <em>Cobertura 80-100m con SPL >105dB @ FOH</em>\n\n<strong>Subs:</strong> 8-12 KS28/1100-LFC (cardioid)\n→ <em>Rechazo trasero -20dB, protege FOH y backstage</em>\n\n<strong>Delay Towers:</strong> @ 40m, 70m\n→ <em>Mantener SPL uniforme, calcular con temperatura del evento</em>\n\n<strong>FOH:</strong> DiGiCo SD7/Avid S6L\n<strong>Potencia:</strong> 80-120 kW (distribución trifásica)\n\n💡 LiveSync calcula automáticamente cantidades exactas según distancia y audiencia.${cta}\n\n<button class="quick-action-btn" data-action="delay 80m 25°C">🧮 Calcular delays</button> <button class="quick-action-btn" data-action="¿Cuánto cuesta LiveSync Pro?">💰 Ver precios</button>`;
        }

        if (/(teatro|corporativo|indoor).*(config|setup)/i.test(msg)) {
            chatState.lastTopic = 'teatro';
            return `🎭 <strong>Setup Teatro Indoor</strong>\n\n<strong>Main PA:</strong> 6-10 K3/Kara II por lado\n→ <em>Dispersión 10°, ideal para <30m en indoor</em>\n\n<strong>Subs:</strong> 4-6 SB28 (end-fire)\n→ <em>Direccional, evita reflexiones en paredes traseras</em>\n\n<strong>FOH:</strong> Yamaha CL5/dLive\n<strong>Potencia:</strong> 15-30 kW\n<strong>Sin delay towers</strong> (distancia <30m)\n\n💡 En salas con acústica controlada, priorizar direccionalidad sobre potencia bruta.${cta}`;
        }

        // ===================================
        // SALUDOS (CON BOTONES DE ACCIÓN RÁPIDA)
        // ===================================
        if (/^(hola|hey|hi|buenas|buenos dias|hello)/.test(msg)) {
            chatState.lastTopic = 'greeting';
            return isEnglish
                ? `👋 Hi! I'm the LiveSync Pro assistant.\n\nI can help with PA Systems, line arrays, delays, and more.\n\n🚀 https://livesyncpro.com\n\n<button class="quick-action-btn" data-action="Specs del K2">📊 K2 Specs</button> <button class="quick-action-btn" data-action="48 canales dante">🌐 Dante Calc</button> <button class="quick-action-btn" data-action="¿Cuánto cuesta?">💰 Pricing</button>`
                : `👋 ¡Hola! Soy el asistente de LiveSync Pro.\n\nPuedo ayudarte con PA Systems, line arrays, delays, y más.\n\n🚀 https://livesyncpro.com\n\n<button class="quick-action-btn" data-action="Specs del K2">📊 Specs K2</button> <button class="quick-action-btn" data-action="48 canales dante">🌐 Calcular Dante</button> <button class="quick-action-btn" data-action="¿Cuánto cuesta?">💰 Precios</button>`;
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
            return `🎯 <strong>LiveSync Pro</strong> es un sistema profesional de diseño de <strong>PA Systems</strong>.\n\nCalcula line arrays, delay towers, rigging, potencia, redes Dante/AVB y exporta a CAD.\n\n💰 <strong>$97 USD/año</strong>\n\n🚀 https://livesyncpro.com\n\n<button class="quick-action-btn" data-action="¿Funciona offline?">💻 ¿Offline?</button> <button class="quick-action-btn" data-action="¿Cómo exporto?">📤 Exportar</button>`;
        }

        // ===================================
        // PRECIO (VERSIÓN ULTRA CORTA)
        // ===================================
        if (/(precio|cuanto cuesta|cost|suscripci[oó]n|pago)/.test(msg)) {
            chatState.lastTopic = 'pricing';
            return `💰 <strong>LiveSync Pro</strong>\n\n<strong>$97 USD/año</strong>\n\n✅ 100+ modelos de speakers\n✅ Exportación DXF/PDF ilimitada\n✅ Sincronización multi-dispositivo\n✅ Todas las actualizaciones\n\n🔒 Garantía 7 días\n\n🚀 https://livesyncpro.com`;
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
        // DELAY TOWERS (MEJORADA CON EJEMPLOS PRÁCTICOS)
        // ===================================
        if (/(delay tower|torre de delay|torres)/.test(msg) && !/(festival|config)/i.test(msg)) {
            chatState.lastTopic = 'delay-towers';
            return `🗼 <strong>Delay Towers</strong>\n\nLiveSync calcula:\n• <strong>Posición óptima:</strong> Cada 30-40m en outdoor, 20-25m indoor\n• <strong>Delay time exacto:</strong> Ej: 50m @ 20°C = 145.7 ms\n• <strong>Gain shading:</strong> Torre más cerca del PA = -3dB típico\n• <strong>SPL uniforme:</strong> Mantener 95-105dB en toda la audiencia\n\n<strong>Criterio:</strong>\n• <strong>Distancia PA >50m:</strong> Necesaria 1 torre\n• <strong>>80m:</strong> 2 torres (@ 40m, 70m)\n• <strong>>120m:</strong> 3+ torres\n\n💡 Temperatura afecta el delay: mídela siempre antes del show.${cta}`;
        }

        // ===================================
        // FOH (COMPACTA)
        // ===================================
        if (/(foh|front of house|consola|mixer)/.test(msg)) {
            chatState.lastTopic = 'foh';
            return `🎛️ <strong>FOH Configuration</strong>\n\nProcesadores soportados:\n• Lake LM44, LM26\n• XTA DP448\n• BSS BLU-160\n• Q-SYS Core\n• Meyer Galaxy\n• L-Acoustics P1\n\nGenera IO lists automáticas y patcheo Dante/AVB.${cta}`;
        }

        // ===================================
        // MONITORES (MEJORADA CON RECOMENDACIONES POR TIPO)
        // ===================================
        if (/(monitor|monitoreo|wedge|sidefill|iem)/.test(msg)) {
            chatState.lastTopic = 'monitors';
            return `🔈 <strong>Sistemas de Monitores</strong>\n\n<strong>WEDGES (Piso):</strong>\n• Rock/Metal: X15, M2 (>138dB, alta potencia)\n• Acústico/Jazz: X12, M4 (136-138dB, controlado)\n• Corporativo: Cualquier modelo (90-100dB suficiente)\n\n<strong>SIDEFILLS:</strong>\n• Line arrays pequeños (Kiva II, Y8, LINA)\n• Objetivo: 105-110dB en escenario\n\n<strong>IEMs:</strong> Shure PSM1000, Sennheiser EW IEM G4\n→ <em>Elimina wedges, mejor control de gain before feedback</em>\n\n💡 LiveSync calcula patcheo mono/estéreo y potencia por mix.${cta}`;
        }

        // ===================================
        // RIGGING (MEJORADA CON CONTEXTO DE SEGURIDAD)
        // ===================================
        if (/(rigging|colgado|suspens|truss|bridle|carga)/.test(msg)) {
            chatState.lastTopic = 'rigging';
            return `⚙️ <strong>Análisis de Rigging</strong>\n\nLiveSync calcula:\n• <strong>Peso total:</strong> Array + accesorios (bumpers, frames)\n• <strong>Distribución en bridles:</strong> Front/rear según ángulo\n• <strong>Factor de seguridad 5:1 mínimo</strong> (normativa internacional)\n\n<strong>Ejemplos configuración grande:</strong>\n• 12x K2 = 672kg → Requiere truss 520kg WLL (factor 5:1 = 3360kg total)\n• 10x Panther = 680kg → Truss similar pero array más ligero/caja\n\n⚠️ <strong>CRÍTICO:</strong> Nunca exceder WLL (Working Load Limit) del truss.\n\n💡 LiveSync alerta automáticamente si superas límites de seguridad.${cta}`;
        }

        // ===================================
        // POTENCIA (MEJORADA CON EJEMPLOS DE CÁLCULO)
        // ===================================
        if (/(potencia|el[ée]ctric|power|ampli|watts?|voltage)/.test(msg)) {
            chatState.lastTopic = 'power';
            return `⚡ <strong>Análisis de Potencia</strong>\n\nAmplificadores soportados:\n• Lab.gruppen PLM 20000Q (20kW)\n• Powersoft X8 (8kW), Quattrocanali (10kW)\n• L-Acoustics LA12X (8.4kW), LA8 (3.3kW)\n• d&b D80 (4kW), D20 (2kW)\n\n<strong>Ejemplo setup festival:</strong>\n• 32x K2 + subs = 12x LA12X\n• Consumo: ~60kW continuo, 80kW peak\n• Trifásica 400V/32A por fase\n\n<strong>Criterio:</strong> Factor 0.6-0.7 (eficiencia amplificador clase D)\n\n💡 LiveSync calcula distribución por rack y voltage drop en cables.${cta}`;
        }

        // ===================================
        // DANTE/AVB (MEJORADA CON EJEMPLOS CONCRETOS)
        // ===================================
        if (/(dante|avb|red|network|bandwidth)/.test(msg) && !/\d+.*canal/i.test(msg)) {
            chatState.lastTopic = 'network';
            return `🌐 <strong>Redes Dante/AVB</strong>\n\n<strong>Dante:</strong>\n• 48kHz/24bit: ~1.15 Mbps/canal\n• 96kHz/24bit: ~2.3 Mbps/canal\n• Overhead: 20%\n\n<strong>Ejemplos:</strong>\n• 64 ch @ 48kHz = 88 Mbps → Switch Gigabit OK\n• 128 ch @ 48kHz = 176 Mbps → Gigabit con margen\n• 64 ch @ 96kHz = 176 Mbps → Requiere switch de calidad\n• >400 ch → Múltiples switches o 10Gb\n\n<strong>Regla:</strong> Mantener <70% uso del switch (headroom para QoS)\n\n💡 Usa switches con QoS/DSCP para audio (Cisco SG, Netgear M4300).${cta}`;
        }

        // ===================================
        // EXPORTACIÓN (COMPACTA)
        // ===================================
        if (/(export|exporta|dxf|pdf|cad|autocad|plano)/.test(msg)) {
            chatState.lastTopic = 'export';
            return `📤 <strong>Exportación</strong>\n\n<strong>DXF (CAD):</strong>\nPlano 2D con posiciones, compatible AutoCAD, Vectorworks, SketchUp\n\n<strong>PDF Técnico:</strong>\nReporte completo: specs, delays, SPL, rigging, potencia, IO lists${cta}`;
        }

        // ===================================
        // TEMPERATURA (MEJORADA CON RECOMENDACIÓN PRÁCTICA)
        // ===================================
        if (/(temperatura|thermal|drift|calor)/.test(msg) && !/\d+\s*m.*\d+\s*°?c/i.test(msg)) {
            chatState.lastTopic = 'thermal';
            return `🌡️ <strong>Thermal Drift</strong>\n\nLa velocidad del sonido cambia con temperatura:\n• 10°C = 337.5 m/s (invierno)\n• 20°C = 343.2 m/s (estándar)\n• 30°C = 349.0 m/s (verano/calor)\n\n<strong>Impacto real en 50m:</strong>\n20°C → 30°C = 2.4 ms diferencia\n→ <em>Delay towers se "desalinean" si no ajustas</em>\n\n<strong>RECOMENDACIÓN CRÍTICA:</strong>\n✅ Medir temperatura @ FOH antes del soundcheck\n✅ Re-medir antes del show (puede cambiar 5-10°C tarde vs día)\n✅ Usar LiveSync para recalcular delays si cambió >3°C\n\n💡 En outdoor, temperatura baja al atardecer = delays más largos.${cta}`;
        }

        // ===================================
        // SOPORTE (COMPACTA)
        // ===================================
        if (/(soporte|contacto|support|problema|error)/.test(msg) && !/(quiero|necesito)/i.test(msg)) {
            chatState.lastTopic = 'support';
            return `📞 <strong>Soporte Técnico</strong>\n\n📧 <strong>Email:</strong> abrinay@livesyncpro.com\n\nPara bugs, problemas técnicos o consultas de licencia.\n\n🚀 https://livesyncpro.com`;
        }

        // ===================================
        // CONCEPTOS TÉCNICOS AVANZADOS (KNOWLEDGE_BASE)
        // ===================================

        // EFECTO HAAS / PRECEDENCIA
        if (/(haas|precedencia|precedence|efecto.*temporal)/.test(msg)) {
            chatState.lastTopic = 'haas';
            return `🎯 <strong>Efecto Haas (Precedencia)</strong>\n\n${KNOWLEDGE_BASE.environmental.haasEffect.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.environmental.haasEffect.advanced}\n\n💡 ${KNOWLEDGE_BASE.environmental.haasEffect.proTip}${cta}`;
        }

        // POWER ALLEY
        if (/(power alley|callej[oó]n.*potencia|centro.*bajo|bass center)/.test(msg)) {
            chatState.lastTopic = 'power-alley';
            return `⚡ <strong>Power Alley</strong>\n\n${KNOWLEDGE_BASE.analysis.powerAlley.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.powerAlley.advanced}\n\n<strong>Boost:</strong> ${KNOWLEDGE_BASE.analysis.powerAlley.boost}\n\n💡 ${KNOWLEDGE_BASE.analysis.powerAlley.proTip}${cta}`;
        }

        // ARRAY LIMIT / TRANSICIÓN FRESNEL
        if (/(array limit|l[íi]mite.*array|fresnel|fraunhofer|transici[oó]n)/.test(msg)) {
            chatState.lastTopic = 'array-limit';
            return `📐 <strong>Array Limit (Transición)</strong>\n\n${KNOWLEDGE_BASE.analysis.arrayLimit.basic}\n\n<strong>Fórmula:</strong> ${KNOWLEDGE_BASE.analysis.arrayLimit.formula}\n\n<strong>Atenuación:</strong>\n• Campo cercano: ${KNOWLEDGE_BASE.analysis.arrayLimit.attenuation.nearField}\n• Campo lejano: ${KNOWLEDGE_BASE.analysis.arrayLimit.attenuation.farField}${cta}`;
        }

        // ROOM MODES / MODOS PROPIOS
        if (/(room mode|modo.*propio|resonancia.*sala|standing wave)/.test(msg)) {
            chatState.lastTopic = 'room-modes';
            return `🏛️ <strong>Modos Propios (Room Modes)</strong>\n\n${KNOWLEDGE_BASE.analysis.roomModes.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.roomModes.advanced}\n\n💡 ${KNOWLEDGE_BASE.analysis.roomModes.proTip}${cta}`;
        }

        // WST / GRATING LOBES
        if (/(wst|wavefront|grating lobe|l[oó]bulo.*rejilla|coherencia.*line array)/.test(msg)) {
            chatState.lastTopic = 'wst';
            return `🌊 <strong>WST & Grating Lobes</strong>\n\n${KNOWLEDGE_BASE.analysis.wst.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.wst.advanced}\n\n<strong>Espaciado:</strong> ${KNOWLEDGE_BASE.analysis.wst.spacing}\n\n💡 ${KNOWLEDGE_BASE.analysis.wst.proTip}${cta}`;
        }

        // SPLAY ANGLES / ÁNGULOS
        if (/(splay|[aá]ngulo.*inter.*caja|curvatura|banana)/.test(msg)) {
            chatState.lastTopic = 'splay';
            return `📐 <strong>Ángulos Splay (Curvatura)</strong>\n\n${KNOWLEDGE_BASE.systemConfig.splayAngles.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.systemConfig.splayAngles.advanced}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.splayAngles.proTip}${cta}`;
        }

        // GAIN SHADING
        if (/(gain shading|nivel.*torre|volumen.*delay.*tower)/.test(msg)) {
            chatState.lastTopic = 'gain-shading';
            return `🎚️ <strong>Gain Shading</strong>\n\n${KNOWLEDGE_BASE.delayAlignment.gainShading.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.delayAlignment.gainShading.advanced}\n\n<strong>Recomendación:</strong> ${KNOWLEDGE_BASE.delayAlignment.gainShading.recommendation}${cta}`;
        }

        // GROUND BOUNCE / EFECTO SUELO
        if (/(ground bounce|efecto suelo|rebote.*piso|comb filter.*ground)/.test(msg)) {
            chatState.lastTopic = 'ground-bounce';
            return `🌊 <strong>Ground Bounce (Rebote de Suelo)</strong>\n\n${KNOWLEDGE_BASE.analysis.groundBounce.basic}\n\n<strong>Fórmula:</strong> ${KNOWLEDGE_BASE.analysis.groundBounce.formula}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.groundBounce.advanced}${cta}`;
        }

        // COMPRESIÓN TÉRMICA
        if (/(compresi[oó]n.*t[ée]rmica|thermal compression|altavoz.*caliente|power.*loss.*heat)/.test(msg)) {
            chatState.lastTopic = 'thermal-comp';
            return `🔥 <strong>Compresión Térmica</strong>\n\n${KNOWLEDGE_BASE.analysis.thermalCompression.basic}\n\n<strong>Pérdida:</strong> ${KNOWLEDGE_BASE.analysis.thermalCompression.loss}\n\n💡 ${KNOWLEDGE_BASE.analysis.thermalCompression.proTip}${cta}`;
        }

        // HUMEDAD
        if (/(humedad|humidity|aire.*seco|high.*frequency.*loss)/.test(msg)) {
            chatState.lastTopic = 'humidity';
            return `💧 <strong>Humedad Relativa</strong>\n\n${KNOWLEDGE_BASE.environmental.humidity.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.environmental.humidity.advanced}\n\n💡 ${KNOWLEDGE_BASE.environmental.humidity.proTip}${cta}`;
        }

        // VIENTO
        if (/(viento|wind|refracci[oó]n.*sonido)/.test(msg) && !/(festival|config)/i.test(msg)) {
            chatState.lastTopic = 'wind';
            return `🌬️ <strong>Viento y Refracción</strong>\n\n${KNOWLEDGE_BASE.environmental.wind.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.environmental.wind.advanced}\n\n💡 ${KNOWLEDGE_BASE.environmental.wind.proTip}${cta}`;
        }

        // ARREGLOS DE SUBWOOFERS
        if (/(arreglo.*sub|sub.*array|cardioid|end.*fire|omni.*sub)/.test(msg)) {
            chatState.lastTopic = 'sub-array';
            const types = KNOWLEDGE_BASE.subwoofers.arrayTopology.types;
            return `🔊 <strong>Topología de Subgraves</strong>\n\n${KNOWLEDGE_BASE.subwoofers.arrayTopology.basic}\n\n<strong>OMNI:</strong> ${types.omni.description} - ${types.omni.efficiency}\n<strong>CARDIOID:</strong> ${types.cardioid.description} - Rechazo: ${types.cardioid.rearRejection}\n<strong>END-FIRE:</strong> ${types.endFire.description} - Rechazo: ${types.endFire.rearRejection}\n\n💡 ${KNOWLEDGE_BASE.subwoofers.arrayTopology.proTip}${cta}`;
        }

        // SPL TARGETS / OBJETIVOS
        if (/(spl.*target|objetivo.*spl|cu[aá]nto.*spl|volumen.*ideal)/.test(msg)) {
            chatState.lastTopic = 'spl-targets';
            const targets = KNOWLEDGE_BASE.systemConfig.targets.rules.spl;
            return `🎯 <strong>Objetivos SPL</strong>\n\n<strong>Corporativo:</strong> ${targets.corporativo}\n<strong>Concierto:</strong> ${targets.concierto}\n<strong>Festival:</strong> ${targets.festival}\n\n<strong>FOH:</strong> ${KNOWLEDGE_BASE.systemConfig.targets.rules.fohPosition}\n<strong>Distancia PA-FOH:</strong> ${KNOWLEDGE_BASE.systemConfig.targets.rules.paToFoh.ideal}\n\n💡 ${KNOWLEDGE_BASE.systemConfig.targets.proTip}${cta}`;
        }

        // DIRECTIVIDAD OLSON
        if (/(olson|directividad.*linear|off.*axis.*loss|foh.*elevation)/.test(msg)) {
            chatState.lastTopic = 'olson';
            return `📊 <strong>Directividad Lineal (Olson)</strong>\n\n${KNOWLEDGE_BASE.analysis.olsonDirectivity.basic}\n\n<strong>Técnico:</strong> ${KNOWLEDGE_BASE.analysis.olsonDirectivity.advanced}${cta}`;
        }

        // ===================================
        // RESPUESTA GENÉRICA CON SUGERENCIAS INTELIGENTES (NUEVO)
        // ===================================
        const smartSuggestions = generateSmartSuggestions(userMessage);
        let suggestionButtons = '';

        smartSuggestions.forEach(suggestion => {
            suggestionButtons += `<button class="quick-action-btn" data-action="${suggestion}">${suggestion}</button> `;
        });

        return `🤔 No entendí completamente tu pregunta.\n\n<strong>¿Te refieres a alguno de estos temas?</strong>\n\n${suggestionButtons}\n\n💡 O prueba con:\n• "Specs del K2"\n• "mejor line array para 50m"\n• "delay 80m 25°C"\n• "cuánto cuesta"\n\n🚀 https://livesyncpro.com`;
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
