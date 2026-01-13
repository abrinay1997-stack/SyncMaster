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
        // TODO: Reescribir con información REAL sobre LiveSync Pro (PA Systems)
        // Contenido temporal mientras se actualiza

        return '🔄 Información en actualización\n\nEstamos actualizando la base de conocimientos para brindarte información precisa sobre LiveSync Pro.\n\nPor favor:\n📧 Contacta: abrinay@livesyncpro.com\n🎫 Crea un ticket en la sección Tickets\n\nDisculpa las molestias temporales.';
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
