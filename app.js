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

        // Respuestas sobre instalación
        if (message.includes('instala') || message.includes('instalar')) {
            return 'Para instalar LiveSync Pro:\n\n1. Descarga el instalador desde nuestro sitio oficial\n2. Ejecuta el archivo descargado\n3. Sigue el asistente de instalación\n4. Inicia sesión con tu cuenta\n5. Selecciona las carpetas a sincronizar\n\n¿Necesitas ayuda con algún paso específico?';
        }

        // Respuestas sobre configuración
        if (message.includes('configur') || message.includes('setup')) {
            return 'La configuración de LiveSync Pro es sencilla:\n\n1. Abre la aplicación\n2. Ve a Configuración > Sincronización\n3. Selecciona las carpetas que deseas sincronizar\n4. Configura las opciones de sincronización (automática/manual)\n5. Ajusta las preferencias de conflictos\n\n¿Qué aspecto específico quieres configurar?';
        }

        // Respuestas sobre problemas de conexión
        if (message.includes('conexi') || message.includes('conecta') || message.includes('internet')) {
            return 'Para solucionar problemas de conexión:\n\n1. Verifica tu conexión a internet\n2. Comprueba el estado del firewall\n3. Asegúrate de que los puertos necesarios estén abiertos\n4. Revisa la configuración del proxy si aplica\n5. Intenta reiniciar la aplicación\n\nSi el problema persiste, puedo crear un ticket para que nuestro equipo técnico te ayude. ¿Quieres que lo haga?';
        }

        // Respuestas sobre sincronización
        if (message.includes('sincroniza') || message.includes('sync')) {
            return 'LiveSync Pro ofrece sincronización en tiempo real. Algunos consejos:\n\n- La sincronización automática se activa al detectar cambios\n- Puedes forzar una sincronización manual desde el menú\n- Los conflictos se resuelven según tus preferencias\n- Revisa los logs si hay archivos sin sincronizar\n\n¿Tienes algún problema específico con la sincronización?';
        }

        // Respuestas sobre actualización
        if (message.includes('actualiza') || message.includes('update') || message.includes('versión')) {
            return 'Para actualizar LiveSync Pro:\n\n1. Ve a Ayuda > Buscar actualizaciones\n2. Si hay una actualización disponible, haz clic en "Actualizar"\n3. La aplicación descargará e instalará la actualización\n4. Reinicia cuando se te solicite\n\nLa versión actual es la 3.5.2. ¿Tienes problemas para actualizar?';
        }

        // Respuestas sobre seguridad
        if (message.includes('segur') || message.includes('encript') || message.includes('privacidad')) {
            return 'LiveSync Pro toma la seguridad muy en serio:\n\n- Encriptación AES-256 de extremo a extremo\n- Autenticación de dos factores disponible\n- Certificaciones ISO 27001 y cumplimiento GDPR\n- Auditorías de seguridad regulares\n- Tus datos nunca se almacenan sin encriptar\n\n¿Tienes alguna pregunta específica sobre seguridad?';
        }

        // Respuestas sobre precios/planes
        if (message.includes('precio') || message.includes('plan') || message.includes('costo') || message.includes('factura')) {
            return 'LiveSync Pro ofrece varios planes:\n\n- Plan Básico: $9.99/mes (3 dispositivos, 50GB)\n- Plan Pro: $19.99/mes (10 dispositivos, 500GB)\n- Plan Enterprise: Precio personalizado (ilimitado)\n\nTodos los planes incluyen:\n- Sincronización en tiempo real\n- Encriptación E2E\n- Soporte 24/7\n- Historial de versiones\n\n¿Quieres más detalles sobre algún plan?';
        }

        // Respuestas sobre dispositivos
        if (message.includes('dispositivo') || message.includes('móvil') || message.includes('app')) {
            return 'LiveSync Pro está disponible para:\n\n- Windows 10/11\n- macOS 10.15+\n- Linux (Ubuntu, Debian, Fedora)\n- iOS 14+\n- Android 8+\n- Interfaz web\n\nPuedes sincronizar entre todos tus dispositivos automáticamente. ¿Necesitas ayuda con alguna plataforma específica?';
        }

        // Respuestas sobre problemas/errores
        if (message.includes('error') || message.includes('problema') || message.includes('no funciona') || message.includes('falla')) {
            return 'Lamento que estés experimentando problemas. Para ayudarte mejor:\n\n1. ¿Qué mensaje de error ves exactamente?\n2. ¿Cuándo comenzó el problema?\n3. ¿Qué estabas haciendo cuando ocurrió?\n\nMientras tanto, prueba:\n- Reiniciar la aplicación\n- Verificar los logs en Ayuda > Logs\n- Comprobar tu conexión a internet\n\n¿Quieres que cree un ticket de soporte para ti?';
        }

        // Respuestas sobre archivos/carpetas
        if (message.includes('archivo') || message.includes('carpeta') || message.includes('elimina') || message.includes('recuperar')) {
            return 'Para gestionar archivos en LiveSync Pro:\n\n- Archivos eliminados van a la papelera (30 días)\n- Puedes restaurar desde Historial de versiones\n- Los conflictos crean copias con timestamps\n- Backups automáticos según configuración\n\n¿Necesitas recuperar algún archivo específico?';
        }

        // Respuestas sobre soporte
        if (message.includes('soporte') || message.includes('ayuda') || message.includes('contacto')) {
            return 'Puedes contactarnos por:\n\n- Chat en vivo: Disponible ahora mismo\n- Tickets: Crea uno en la sección Tickets\n- Email: support@livesyncpro.com\n- Teléfono: +1-800-LIVESYNC (Pro/Enterprise)\n- Comunidad: community.livesyncpro.com\n\nTiempo de respuesta promedio: <15 minutos. ¿Cómo prefieres continuar?';
        }

        // Respuesta por defecto
        return 'Entiendo tu consulta. Para ayudarte mejor, puedo:\n\n1. Buscar en nuestra base de conocimientos\n2. Crear un ticket de soporte\n3. Conectarte con un agente humano\n4. Mostrarte tutoriales relacionados\n\n¿Qué prefieres? También puedes ser más específico sobre tu pregunta o problema.';
    }
}

// Sistema de Tickets
function initTicketSystem() {
    const ticketForm = document.getElementById('ticketForm');
    const ticketsList = document.getElementById('ticketsList');
    let tickets = JSON.parse(localStorage.getItem('tickets')) || [];

    // Mostrar tickets existentes
    displayTickets();

    ticketForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const ticket = {
            id: 'TKT-' + Date.now(),
            name: document.getElementById('ticketName').value,
            email: document.getElementById('ticketEmail').value,
            category: document.getElementById('ticketCategory').value,
            priority: document.getElementById('ticketPriority').value,
            subject: document.getElementById('ticketSubject').value,
            description: document.getElementById('ticketDescription').value,
            status: 'abierto',
            date: new Date().toLocaleString('es-ES')
        };

        tickets.push(ticket);
        localStorage.setItem('tickets', JSON.stringify(tickets));

        // Mostrar mensaje de éxito
        alert('✅ Ticket creado exitosamente!\n\nID: ' + ticket.id + '\n\nRecibirás una respuesta en tu email dentro de las próximas 2 horas.');

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
            articleContent.innerHTML = article.content;
            modal.classList.add('active');
        }
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
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
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
