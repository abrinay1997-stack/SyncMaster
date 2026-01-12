// SyncMaster - Sistema de Soporte para LiveSync Pro
// Gestión de navegación
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initChat();
    initTicketSystem();
    initFAQ();
    initKnowledgeBase();
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
        const message = userMessage.toLowerCase();

        // Respuestas sobre acceso a LiveSync Pro
        if (message.includes('acceso') || message.includes('acceder') || message.includes('entrar') || message.includes('login')) {
            return 'Para acceder a LiveSync Pro:\n\n✓ Abre LiveSync Pro en tu navegador\n✓ Inicia sesión con tus credenciales\n✓ Si no tienes cuenta, contacta con tu administrador\n\n🔒 Tus proyectos se guardan automáticamente en la nube y puedes acceder desde cualquier dispositivo.\n\n¿Necesitas ayuda con alguna funcionalidad específica?';
        }

        // Respuestas sobre proyectos acústicos
        if (message.includes('proyecto') || message.includes('acust') || message.includes('diseñ') || message.includes('sonido')) {
            return 'Para crear un proyecto acústico en LiveSync Pro:\n\n1. En el Project Hub, clic en "Nuevo Proyecto"\n2. Ingresa datos: nombre, cliente, tipo de evento\n3. Configura dimensiones de la sala (ancho x largo x altura)\n4. Selecciona sistema de sonido principal\n5. Aplica un preset (Corporativo, Concierto, Festival)\n6. Haz clic en "Calcular Sistema"\n7. Revisa resultados de SPL, STI y RT60\n\n¿Qué tipo de evento estás diseñando?';
        }

        // Respuestas sobre cálculos acústicos
        if (message.includes('spl') || message.includes('sti') || message.includes('rt60') || message.includes('reverb') || message.includes('calculo')) {
            return 'LiveSync Pro calcula automáticamente:\n\n• SPL (Sound Pressure Level): Cobertura de presión sonora en dB\n• STI (Speech Transmission Index): Inteligibilidad 0.0-1.0 (objetivo >0.75 para voz)\n• RT60: Tiempo de reverberación en segundos\n\nObjetivos recomendados:\n- Corporativo: RT60 0.6-0.8s, STI >0.75, SPL 85dB\n- Concierto: RT60 0.8-1.2s, STI >0.60, SPL 102dB\n- Festival: RT60 ~0.8s, STI >0.65, SPL 108dB\n\n¿Necesitas ayuda interpretando resultados?';
        }

        // Respuestas sobre torres de delay
        if (message.includes('delay') || message.includes('torre') || message.includes('fill') || message.includes('refuerzo')) {
            return 'Torres de Delay en LiveSync Pro:\n\n¿Cuándo usarlas?\n- Salas >30m de profundidad\n- Zonas con baja cobertura\n- Obstáculos arquitectónicos\n- Balcones o niveles elevados\n\nCómo agregarlas:\n1. Clic en "+ Agregar Torre de Delay"\n2. Posiciona en el mapa\n3. El sistema calcula delay automático (fórmula: distancia/343 × 1000 ms)\n4. Ajusta nivel SPL (6-10dB > sistema principal)\n5. Recalcula\n\n¿Necesitas ayuda posicionando torres?';
        }

        // Respuestas sobre exportación
        if (message.includes('export') || message.includes('pdf') || message.includes('dxf') || message.includes('reporte') || message.includes('cad')) {
            return 'Exportación de proyectos:\n\n📄 PDF: Reporte completo con mapas de cobertura, specs técnicas, lista de equipos\n📐 DXF: Planos para AutoCAD con posiciones exactas de altavoces\n📋 Portapapeles: Copia specs rápidamente\n💾 JSON: Backup completo del proyecto\n\nPara exportar:\n1. Completa tu diseño\n2. Haz clic en "Generar Reporte PDF" o "Exportar DXF"\n3. El archivo se descarga automáticamente\n\n¿Qué formato necesitas?';
        }

        // Respuestas sobre visualización 3D
        if (message.includes('3d') || message.includes('visualiz') || message.includes('three') || message.includes('grafico')) {
            return 'Visualización 3D en LiveSync Pro:\n\n✓ Renderizado con Three.js\n✓ Mapas de cobertura SPL con código de colores\n✓ Trazado de rayos sonoros\n✓ Posiciones de altavoces\n✓ Arquitectura de la sala\n\nControles:\n- Click + arrastrar: Rotar\n- Scroll: Zoom\n- Click derecho + arrastrar: Pan\n\nHaz clic en "Ver en 3D" en la vista de resultados.\n\n¿Necesitas ayuda navegando la vista 3D?';
        }

        // Respuestas sobre asistente IA
        if (message.includes('ia') || message.includes('inteligencia') || message.includes('optimiz') || message.includes('asistente')) {
            return 'Asistente IA en LiveSync Pro:\n\n🤖 El asistente de IA puede ayudarte a:\n✓ Sugerir configuraciones óptimas para tu sala\n✓ Detectar problemas acústicos potenciales\n✓ Recomendar posiciones de altavoces\n✓ Explicar conceptos técnicos\n\n📍 Ubica el ícono de IA en la parte superior de la interfaz. Haz clic para activar el asistente.\n\nNota: Todos los cálculos son locales y precisos.\n\n¿Qué aspecto de tu diseño necesitas optimizar?';
        }

        // Respuestas sobre guardado y sincronización
        if (message.includes('guardar') || message.includes('sync') || message.includes('nube') || message.includes('perdida') || message.includes('recuper')) {
            return 'Guardado de Proyectos en LiveSync Pro:\n\n☁️ Guardado automático en la nube\n✓ Tus proyectos se guardan automáticamente\n✓ Accede desde cualquier dispositivo\n✓ Historial de versiones disponible\n✓ Trabajo offline soportado\n\nIndicador de estado (footer):\n🟢 Verde: Todo guardado\n🔵 Azul: Guardando...\n🟡 Amarillo: Sin conexión (guardado local)\n🔴 Rojo: Error - revisa tu conexión\n\n¿Necesitas recuperar una versión anterior?';
        }

        // Respuestas sobre presets
        if (message.includes('preset') || message.includes('corporativo') || message.includes('concierto') || message.includes('festival') || message.includes('teatro')) {
            return 'Presets de eventos en LiveSync Pro:\n\n🎤 Corporativo: Inteligibilidad máxima (voz)\n- RT60: 0.7s | STI: 0.75 | SPL: 85dB\n\n🎸 Concierto: Balance música/voz\n- RT60: 1.0s | STI: 0.60 | SPL: 102dB\n\n🎪 Festival: Largo alcance\n- RT60: 0.8s | STI: 0.65 | SPL: 108dB\n\n🎭 Teatro: Sonido natural\n- RT60: 1.2s | STI: 0.70 | SPL: 88dB\n\nAplic un preset en Configuración > Básico.\n\n¿Qué tipo de evento diseñas?';
        }

        // Respuestas sobre problemas/errores
        if (message.includes('error') || message.includes('problema') || message.includes('no funciona') || message.includes('falla')) {
            return 'Solución de Problemas en LiveSync Pro:\n\n🔍 Pasos básicos:\n1. Actualiza la página (F5 o Ctrl+R)\n2. Verifica tu conexión a internet\n3. Cierra y vuelve a abrir la aplicación\n\n⚡ Problemas comunes:\n❌ Cálculos lentos → Reduce la resolución de simulación en configuración\n❌ No se guarda → Verifica el indicador de estado en el footer\n❌ Exportación falla → Revisa que el proyecto esté completo\n\n📧 Si el problema persiste, contacta a soporte: abrinay@livesyncpro.com\n\n¿Qué error específico estás viendo?';
        }

        // Respuestas sobre materiales acústicos
        if (message.includes('material') || message.includes('absorc') || message.includes('coeficiente') || message.includes('pared')) {
            return 'Materiales acústicos en LiveSync Pro:\n\nCoeficientes de absorción promedio:\n• Concreto: 0.02 (muy reflectivo)\n• Madera: 0.09\n• Vidrio: 0.05\n• Alfombra: 0.50\n• Cortinas: 0.30\n• Panel acústico: 0.70\n• Audiencia: 0.80 (importante!)\n\nConfigura en Configuración Avanzada > Propiedades Acústicas.\n\nLa audiencia absorbe mucho sonido, ¡considérala en tu diseño!\n\n¿Necesitas ayuda con coeficientes específicos?';
        }

        // Respuestas sobre validación de diseños
        if (message.includes('valid') || message.includes('verific') || message.includes('correcto') || message.includes('revision')) {
            return 'Validación de Diseños en LiveSync Pro:\n\n✓ LiveSync Pro valida automáticamente tu diseño:\n\n🎯 Cobertura:\n- Verifica que toda la sala tenga cobertura SPL adecuada\n- Resalta zonas con baja cobertura en rojo\n\n🗣️ Inteligibilidad:\n- Revisa que STI cumpla objetivos (>0.75 para voz)\n- Sugiere mejoras si detecta problemas\n\n⏱️ Reverberación:\n- Comprueba que RT60 esté en rango óptimo\n- Alerta si el tiempo es muy alto o bajo\n\n¿Necesitas ayuda interpretando los resultados de validación?';
        }

        // Respuestas sobre soporte
        if (message.includes('soporte') || message.includes('ayuda') || message.includes('contacto')) {
            return 'Canales de soporte para LiveSync Pro:\n\n💬 Chat: Asistente automático 24/7 (aquí mismo)\n🎫 Tickets: Sección Tickets de esta plataforma\n📧 Email directo: abrinay@livesyncpro.com\n📚 Documentación: Base de Conocimientos completa\n❓ FAQ: Preguntas frecuentes\n\nTiempo de respuesta por email: <24 horas\n\n¿Prefieres crear un ticket o seguir por chat?';
        }

        // Respuesta por defecto
        return 'Entiendo tu consulta sobre LiveSync Pro (Sistema de Diseño Acústico).\n\nPuedo ayudarte con:\n✓ Crear proyectos acústicos\n✓ Cálculos SPL/STI/RT60\n✓ Torres de delay\n✓ Exportación PDF/DXF\n✓ Visualización 3D\n✓ Guardado en la nube\n✓ Asistente de IA\n✓ Materiales acústicos\n✓ Presets de eventos\n✓ Solución de problemas\n\n¿Sobre qué funcionalidad necesitas más información?';
    }
}

// Sistema de Tickets
function initTicketSystem() {
    const ticketForm = document.getElementById('ticketForm');
    const ticketsList = document.getElementById('ticketsList');

    // Cargar tickets con manejo de errores
    let tickets = [];
    try {
        const storedTickets = localStorage.getItem('tickets');
        tickets = storedTickets ? JSON.parse(storedTickets) : [];
    } catch (e) {
        console.error('Error cargando tickets desde localStorage:', e);
        showNotification('No se pudieron cargar tickets anteriores. Puede que el almacenamiento esté corrupto.', 'error');
        tickets = [];
        // Limpiar localStorage corrupto
        try {
            localStorage.removeItem('tickets');
        } catch (removeError) {
            console.error('No se pudo limpiar localStorage:', removeError);
        }
    }

    // Mostrar tickets existentes
    displayTickets();

    ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validación mejorada de email
        const emailInput = document.getElementById('ticketEmail');
        const email = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            showNotification('Por favor ingresa un email válido (ej: usuario@dominio.com)', 'error');
            emailInput.focus();
            emailInput.style.borderColor = 'var(--danger-color)';
            setTimeout(() => {
                emailInput.style.borderColor = '';
            }, 3000);
            return;
        }

        const ticket = {
            id: 'TKT-' + Date.now(),
            name: document.getElementById('ticketName').value.trim(),
            email: email,
            category: document.getElementById('ticketCategory').value,
            priority: document.getElementById('ticketPriority').value,
            subject: document.getElementById('ticketSubject').value.trim(),
            description: document.getElementById('ticketDescription').value.trim(),
            status: 'abierto',
            date: new Date().toLocaleString('es-ES')
        };

        tickets.push(ticket);

        try {
            localStorage.setItem('tickets', JSON.stringify(tickets));
        } catch (e) {
            showNotification('Error al guardar el ticket. Tu navegador puede tener el almacenamiento lleno.', 'error');
            console.error('Error guardando ticket:', e);
            return;
        }

        // Crear contenido del email
        const emailBody = `
Ticket ID: ${ticket.id}
Nombre: ${ticket.name}
Email: ${ticket.email}
Categoría: ${getCategoryName(ticket.category)}
Prioridad: ${ticket.priority.toUpperCase()}
Asunto: ${ticket.subject}

Descripción:
${ticket.description}

---
Enviado: ${ticket.date}
        `.trim();

        // Mostrar confirmación con opciones
        showTicketConfirmation(ticket.id, ticket.email, emailBody);

        // Limpiar formulario
        ticketForm.reset();

        // Actualizar lista
        displayTickets();
    });

    function displayTickets() {
        if (tickets.length === 0) {
            ticketsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No tienes tickets activos</p>
                </div>
            `;
            return;
        }

        ticketsList.innerHTML = tickets.map(ticket => `
            <div class="ticket-item">
                <div class="ticket-header">
                    <span class="ticket-id">${ticket.id}</span>
                    <span class="ticket-priority ${ticket.priority}">${ticket.priority.toUpperCase()}</span>
                </div>
                <div class="ticket-subject">${ticket.subject}</div>
                <div class="ticket-category">
                    <i class="fas fa-tag"></i> ${getCategoryName(ticket.category)}
                </div>
                <div class="ticket-category">
                    <i class="fas fa-clock"></i> ${ticket.date}
                </div>
            </div>
        `).join('');
    }

    function getCategoryName(category) {
        const categories = {
            'tecnico': 'Problema Técnico',
            'instalacion': 'Instalación',
            'configuracion': 'Configuración',
            'sincronizacion': 'Sincronización',
            'rendimiento': 'Rendimiento',
            'facturacion': 'Facturación',
            'otro': 'Otro'
        };
        return categories[category] || category;
    }
}

// Sistema FAQ con acordeón
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Cerrar todos los items
            faqItems.forEach(i => i.classList.remove('active'));

            // Abrir el clickeado si no estaba activo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Base de Conocimientos
function initKnowledgeBase() {
    const knowledgeLinks = document.querySelectorAll('[data-article]');
    const modal = document.getElementById('articleModal');
    const closeModal = document.getElementById('closeModal');
    const articleTitle = document.getElementById('articleTitle');
    const articleContent = document.getElementById('articleContent');
    const searchInput = document.getElementById('knowledgeSearch');

    // Abrir artículo
    knowledgeLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = link.getAttribute('data-article');
            showArticle(articleId);
        });
    });

    // Cerrar modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Búsqueda
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const categories = document.querySelectorAll('.knowledge-category');

        categories.forEach(category => {
            const links = category.querySelectorAll('.knowledge-list a');
            let hasMatch = false;

            links.forEach(link => {
                const text = link.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    link.parentElement.style.display = 'block';
                    hasMatch = true;
                } else {
                    link.parentElement.style.display = searchTerm === '' ? 'block' : 'none';
                }
            });

            category.style.display = hasMatch || searchTerm === '' ? 'block' : 'none';
        });
    });

    function showArticle(articleId) {
        const article = KNOWLEDGE_BASE[articleId];

        if (article) {
            articleTitle.textContent = article.title;
            // Sanitizar contenido antes de insertar
            articleContent.innerHTML = sanitizeHTML(article.content);
            modal.classList.add('active');
        }
    }

    // Función de sanitización básica de HTML
    function sanitizeHTML(html) {
        // Crear un elemento temporal
        const temp = document.createElement('div');
        temp.textContent = html;

        // Convertir back a string y luego parsear solo tags seguros
        const text = temp.innerHTML;

        // Permitir solo tags específicos seguros
        const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote', 'hr', 'a'];
        const tagRegex = /<(\/?)([\w]+)([^>]*)>/gi;

        // Si el contenido ya tiene tags HTML válidos desde knowledge-base.js
        // (que es controlado por nosotros), proceder con cuidado
        if (html.includes('<')) {
            // Remover atributos peligrosos
            let safe = html.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remover onclick, onerror, etc
                          .replace(/javascript:/gi, '') // Remover javascript: URLs
                          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remover <script>
                          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remover <iframe>
                          .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remover <object>
                          .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, ''); // Remover <embed>

            return safe;
        }

        return text;
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

// Sistema de confirmación de tickets
function showTicketConfirmation(ticketId, email, emailBody) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3>✅ Ticket Guardado Localmente</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1rem; color: var(--gray-light);">
                    <strong>ID del Ticket:</strong> ${ticketId}
                </p>
                <div style="padding: 1rem; background: var(--dark-light); border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--warning-color);">
                    <p style="margin-bottom: 0.5rem;">
                        <i class="fas fa-info-circle"></i>
                        <strong>Importante:</strong> Este ticket se ha guardado solo en tu navegador.
                    </p>
                    <p style="font-size: 0.9rem; color: var(--gray-light);">
                        Para recibir soporte real, debes enviarlo al equipo por email.
                    </p>
                </div>
                <p style="margin-bottom: 1rem; color: var(--gray-light);">
                    Elige una opción para contactar al equipo de soporte:
                </p>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <button onclick="window.location.href='mailto:abrinay@livesyncpro.com?subject=Ticket ${ticketId}&body=${encodeURIComponent(emailBody)}'"
                            style="padding: 0.75rem; background: var(--primary-light); color: var(--dark); border: none; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-envelope"></i> Enviar por Email
                    </button>
                    <button onclick="navigator.clipboard.writeText(\`${emailBody.replace(/`/g, '\\`')}\`).then(() => { showNotification('Contenido copiado al portapapeles', 'success'); })"
                            style="padding: 0.75rem; background: var(--dark-light); color: var(--white); border: 2px solid var(--primary-light); border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <i class="fas fa-copy"></i> Copiar Contenido
                    </button>
                    <button onclick="this.closest('.modal').remove()"
                            style="padding: 0.75rem; background: transparent; color: var(--gray-light); border: none; cursor: pointer;">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    `;

    // Cerrar al hacer click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Cerrar con ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    document.body.appendChild(modal);
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
