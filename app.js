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
        // TODO: Reescribir con información REAL sobre LiveSync Pro (PA Systems)
        // Contenido temporal mientras se actualiza

        return '🔄 Información en actualización\n\nEstamos actualizando la base de conocimientos para brindarte información precisa sobre LiveSync Pro.\n\nPor favor contacta:\n📧 Email: abrinay@livesyncpro.com\n\nDisculpa las molestias temporales.';
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
