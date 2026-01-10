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
        if (message.includes('instala') || message.includes('instalar') || message.includes('install')) {
            return 'Para instalar LiveSync Pro:\n\n1. Clona el repositorio: git clone https://github.com/abrinay1997-stack/LiveSync-Pro.git\n2. Instala dependencias: npm install\n3. Configura variables de entorno en .env.local (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)\n4. Ejecuta: npm run dev\n\nO accede directamente a la versión en AI Studio sin instalación.\n\n¿Necesitas ayuda con algún paso específico?';
        }

        // Respuestas sobre configuración
        if (message.includes('configur') || message.includes('setup') || message.includes('supabase') || message.includes('.env')) {
            return 'Configuración de LiveSync Pro:\n\n1. Crea .env.local en la raíz del proyecto\n2. Agrega VITE_SUPABASE_URL (obtén de Supabase Dashboard)\n3. Agrega VITE_SUPABASE_ANON_KEY (clave pública)\n4. Opcional: GEMINI_API_KEY para asistente IA\n5. Reinicia el servidor de desarrollo\n\nRecuerda: Las variables deben tener prefijo VITE_ para ser accesibles.\n\n¿Necesitas ayuda con Supabase o Gemini?';
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

        // Respuestas sobre Gemini IA
        if (message.includes('gemini') || message.includes('ia') || message.includes('inteligencia') || message.includes('optimiz')) {
            return 'Asistente IA con Google Gemini:\n\n🤖 Funciones:\n- Sugerir configuraciones óptimas\n- Detectar problemas acústicos\n- Recomendar posiciones de equipos\n- Explicar conceptos técnicos\n\nConfiguración:\n1. Obtén API key en https://makersuite.google.com/app/apikey\n2. Agrega GEMINI_API_KEY en .env.local\n3. Reinicia la app\n4. Usa el ícono de IA en la interfaz\n\nNota: La IA es opcional, todos los cálculos son locales.\n\n¿Necesitas ayuda configurando Gemini?';
        }

        // Respuestas sobre sincronización
        if (message.includes('sincroniza') || message.includes('sync') || message.includes('nube') || message.includes('guardar')) {
            return 'Sincronización en LiveSync Pro:\n\n☁️ Sincronización automática con Supabase\n✓ Guardado automático en la nube\n✓ Colaboración en tiempo real\n✓ Historial de versiones\n✓ Trabajo offline soportado\n\nIndicadores (en footer):\n- Verde: Sincronizado\n- Azul: Sincronizando\n- Amarillo: Sin conexión\n- Rojo: Error\n\nTodos los cálculos son locales, solo se sincroniza la configuración del proyecto.\n\n¿Problemas con la sincronización?';
        }

        // Respuestas sobre presets
        if (message.includes('preset') || message.includes('corporativo') || message.includes('concierto') || message.includes('festival') || message.includes('teatro')) {
            return 'Presets de eventos en LiveSync Pro:\n\n🎤 Corporativo: Inteligibilidad máxima (voz)\n- RT60: 0.7s | STI: 0.75 | SPL: 85dB\n\n🎸 Concierto: Balance música/voz\n- RT60: 1.0s | STI: 0.60 | SPL: 102dB\n\n🎪 Festival: Largo alcance\n- RT60: 0.8s | STI: 0.65 | SPL: 108dB\n\n🎭 Teatro: Sonido natural\n- RT60: 1.2s | STI: 0.70 | SPL: 88dB\n\nAplic un preset en Configuración > Básico.\n\n¿Qué tipo de evento diseñas?';
        }

        // Respuestas sobre problemas/errores
        if (message.includes('error') || message.includes('problema') || message.includes('no funciona') || message.includes('falla')) {
            return 'Para diagnosticar problemas:\n\n1. Abre DevTools (F12) > Console\n2. Busca errores en rojo\n3. Verifica:\n   - Variables de entorno (.env.local)\n   - Conexión a Supabase\n   - Credenciales válidas\n\nProblemas comunes:\n❌ Invalid API Key → Verifica VITE_SUPABASE_ANON_KEY\n❌ CORS errors → Dominio no autorizado en Supabase\n❌ Cálculos lentos → Reduce resolución de simulación\n\n¿Qué error específico ves?';
        }

        // Respuestas sobre materiales acústicos
        if (message.includes('material') || message.includes('absorc') || message.includes('coeficiente') || message.includes('pared')) {
            return 'Materiales acústicos en LiveSync Pro:\n\nCoeficientes de absorción promedio:\n• Concreto: 0.02 (muy reflectivo)\n• Madera: 0.09\n• Vidrio: 0.05\n• Alfombra: 0.50\n• Cortinas: 0.30\n• Panel acústico: 0.70\n• Audiencia: 0.80 (importante!)\n\nConfigura en Configuración Avanzada > Propiedades Acústicas.\n\nLa audiencia absorbe mucho sonido, ¡considérala en tu diseño!\n\n¿Necesitas ayuda con coeficientes específicos?';
        }

        // Respuestas sobre testing
        if (message.includes('test') || message.includes('prueba') || message.includes('vitest') || message.includes('coverage')) {
            return 'Testing en LiveSync Pro:\n\nComandos disponibles:\n• npm test → Ejecutar pruebas\n• npm run test:ui → Interfaz gráfica\n• npm run test:coverage → Reporte de cobertura\n• npm run test:run → Una ejecución (CI/CD)\n\nUsa Vitest + React Testing Library.\n\nPara debugging:\n- F12 > Console (logs)\n- F12 > Sources (breakpoints)\n- console.log() en código\n\n¿Necesitas ayuda con pruebas o debugging?';
        }

        // Respuestas sobre soporte
        if (message.includes('soporte') || message.includes('ayuda') || message.includes('contacto')) {
            return 'Canales de soporte para LiveSync Pro:\n\n💬 Chat: Aquí mismo (24/7 automático)\n🎫 Tickets: Sección Tickets de esta plataforma\n📧 Email: abrinay@livesyncpro.com\n🐛 Bugs: GitHub Issues\n📚 Docs: Base de Conocimientos aquí\n\nTiempo de respuesta: <15 minutos (promedio)\n\n¿Prefieres crear un ticket o seguir por chat?';
        }

        // Respuesta por defecto
        return 'Entiendo tu consulta sobre LiveSync Pro (Sistema de Diseño Acústico).\n\nPuedo ayudarte con:\n• Instalación y configuración\n• Diseño de proyectos acústicos\n• Cálculos SPL/STI/RT60\n• Torres de delay\n• Exportación PDF/DXF\n• Visualización 3D\n• Sincronización Supabase\n• Asistente IA Gemini\n• Solución de problemas\n\n¿Sobre qué necesitas más información?';
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
