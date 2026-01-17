// ========================================
// CONTEXT MANAGER - GESTOR DE CONTEXTO CONVERSACIONAL
// ========================================
// Fase 2: Memoria Multi-Turn, Referencias, Perfil de Usuario

class ConversationContext {
    constructor() {
        // Historial de turnos (últimos 10)
        this.turns = [];
        this.maxTurns = 10;

        // Entidades activas con decay temporal
        this.activeEntities = new Map();
        this.entityDecayTurns = 3; // Entidades expiran después de 3 turnos sin mencionar

        // Perfil del usuario (aprendizaje progresivo)
        this.userProfile = {
            expertise: 'intermedio', // principiante | intermedio | profesional
            preferences: {
                brands: [],           // Marcas preferidas
                eventTypes: [],       // Tipos de evento frecuentes
                responseLength: 'medium' // short | medium | long
            },
            commonQueries: [],        // Patrones de queries frecuentes
            satisfactionScore: 0      // Basado en feedback
        };

        // Estado de flujo multi-paso
        this.multiStepTask = null;

        // Métricas de conversación
        this.metrics = {
            totalQuestions: 0,
            successfulResponses: 0,
            failedResponses: 0,
            averageConfidence: 0
        };
    }

    /**
     * Agrega un nuevo turno a la conversación
     */
    addTurn(userMessage, botResponse, analysisResult, feedback = null) {
        const turn = {
            id: `turn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            user: userMessage,
            bot: botResponse,
            analysis: analysisResult, // {intent, entities, expandedMessage}
            feedback: feedback
        };

        this.turns.push(turn);

        // Mantener solo últimos N turnos
        if (this.turns.length > this.maxTurns) {
            this.turns.shift();
        }

        // Actualizar entidades activas
        this.updateActiveEntities(analysisResult.entities);

        // Actualizar perfil de usuario
        this.updateUserProfile(analysisResult);

        // Actualizar métricas
        this.metrics.totalQuestions++;
        this.metrics.averageConfidence =
            (this.metrics.averageConfidence * (this.metrics.totalQuestions - 1) +
             analysisResult.intent.confidence) / this.metrics.totalQuestions;

        return turn;
    }

    /**
     * Actualiza entidades activas con decay temporal
     */
    updateActiveEntities(newEntities) {
        // Incrementar turnsSinceUpdate en todas las entidades existentes
        for (const [key, data] of this.activeEntities.entries()) {
            data.turnsSinceUpdate++;

            // Eliminar si excede decay limit
            if (data.turnsSinceUpdate > this.entityDecayTurns) {
                this.activeEntities.delete(key);
            }
        }

        // Agregar/actualizar nuevas entidades
        for (const [key, value] of Object.entries(newEntities)) {
            if (value !== null && value !== undefined) {
                // Arrays (speakerModels, brands, etc.)
                if (Array.isArray(value) && value.length > 0) {
                    this.activeEntities.set(key, {
                        value: value,
                        lastMentioned: Date.now(),
                        turnsSinceUpdate: 0,
                        type: 'array'
                    });
                }
                // Objetos (budget)
                else if (typeof value === 'object' && !Array.isArray(value)) {
                    this.activeEntities.set(key, {
                        value: value,
                        lastMentioned: Date.now(),
                        turnsSinceUpdate: 0,
                        type: 'object'
                    });
                }
                // Primitivos (distance, temperature, etc.)
                else {
                    this.activeEntities.set(key, {
                        value: value,
                        lastMentioned: Date.now(),
                        turnsSinceUpdate: 0,
                        type: 'primitive'
                    });
                }
            }
        }
    }

    /**
     * Obtiene una entidad activa del contexto
     */
    getActiveEntity(key) {
        const entity = this.activeEntities.get(key);
        return entity ? entity.value : null;
    }

    /**
     * Obtiene todos los modelos mencionados recientemente
     */
    getRecentModels(limit = 5) {
        const models = [];

        // Buscar en turnos recientes (más reciente primero)
        for (let i = this.turns.length - 1; i >= 0 && models.length < limit; i--) {
            const turn = this.turns[i];
            if (turn.analysis?.entities?.speakerModels) {
                turn.analysis.entities.speakerModels.forEach(sm => {
                    if (!models.find(m => m.key === sm.key)) {
                        models.push(sm);
                    }
                });
            }
        }

        return models.slice(0, limit);
    }

    /**
     * Resuelve referencias pronominales y deícticos
     */
    resolveReference(message) {
        const msg = message.toLowerCase();
        const result = {
            type: null,
            resolved: null,
            confidence: 0
        };

        // "el primero", "el primer modelo"
        if (/(el|la)?\s*primer[oa]?/i.test(msg)) {
            const models = this.getRecentModels();
            if (models.length > 0) {
                result.type = 'ordinal';
                result.resolved = models[0];
                result.confidence = 0.9;
                return result;
            }
        }

        // "el segundo", "la segunda"
        if (/(el|la)?\s*segund[oa]/i.test(msg)) {
            const models = this.getRecentModels();
            if (models.length > 1) {
                result.type = 'ordinal';
                result.resolved = models[1];
                result.confidence = 0.9;
                return result;
            }
        }

        // "ese", "esa", "eso", "el que dijiste"
        if (/(ese|esa|eso|el que dijiste|el anterior|la anterior)/i.test(msg)) {
            const models = this.getRecentModels(1);
            if (models.length > 0) {
                result.type = 'demonstrative';
                result.resolved = models[0];
                result.confidence = 0.85;
                return result;
            }
        }

        // "ambos", "los dos", "esos dos"
        if (/(ambos|los dos|esos dos|las dos)/i.test(msg)) {
            const models = this.getRecentModels(2);
            if (models.length >= 2) {
                result.type = 'plural';
                result.resolved = models.slice(0, 2);
                result.confidence = 0.9;
                return result;
            }
        }

        // "el más ligero", "el más potente" (requiere modelos en contexto)
        if (/(el|la)\s+m[aá]s\s+(\w+)/i.test(msg)) {
            const match = msg.match(/(el|la)\s+m[aá]s\s+(\w+)/i);
            const property = match[2];
            const models = this.getRecentModels();

            if (models.length >= 2) {
                result.type = 'superlative';
                result.property = property;
                result.resolved = models; // Retorna todos para que el generador compare
                result.confidence = 0.8;
                return result;
            }
        }

        return result;
    }

    /**
     * Actualiza el perfil del usuario basado en análisis
     */
    updateUserProfile(analysisResult) {
        const entities = analysisResult.entities;

        // Detectar expertise
        if (entities.expertise) {
            this.userProfile.expertise = entities.expertise;
        }

        // Aprender preferencias de marcas
        if (entities.brands && entities.brands.length > 0) {
            entities.brands.forEach(brand => {
                const existing = this.userProfile.preferences.brands.find(b => b.name === brand);
                if (existing) {
                    existing.count++;
                } else {
                    this.userProfile.preferences.brands.push({ name: brand, count: 1 });
                }
            });
        }

        // Aprender tipos de evento frecuentes
        if (entities.eventType) {
            const existing = this.userProfile.preferences.eventTypes.find(e => e.type === entities.eventType);
            if (existing) {
                existing.count++;
            } else {
                this.userProfile.preferences.eventTypes.push({ type: entities.eventType, count: 1 });
            }
        }

        // Aprender longitud de respuesta preferida
        // (basado en feedback - se actualizará cuando haya sistema de feedback)
    }

    /**
     * Actualiza feedback de un turno específico
     */
    updateFeedback(turnId, feedbackType) {
        const turn = this.turns.find(t => t.id === turnId);
        if (turn) {
            turn.feedback = feedbackType;

            // Actualizar métricas
            if (feedbackType === 'helpful') {
                this.metrics.successfulResponses++;
                this.userProfile.satisfactionScore += 1;
            } else if (feedbackType === 'notHelpful') {
                this.metrics.failedResponses++;
                this.userProfile.satisfactionScore -= 1;
            }
        }
    }

    /**
     * Detecta si es una pregunta de seguimiento contextual
     */
    isFollowUpQuestion(message) {
        const msg = message.toLowerCase();

        const followUpPatterns = [
            /^(y |¿?y )/,                           // "y el panther?"
            /^(cuántos?|cuantos?)/,                 // "cuántos necesito?"
            /^(qué|que|cual|cuál)\s+(es\s+)?mejor/, // "cuál es mejor?"
            /^(sirve|funciona|va bien)/,            // "sirve para outdoor?"
            /^(recomiendas?|sugieres?)/,            // "recomiendas otro?"
            /^(y )?para\s+(\d+)/,                   // "para 50m?"
            /^(cuánto|cuanto)\s+(cuesta|vale)/,     // "cuánto cuesta?" (después de specs)
            /^(ese|esa|eso)/,                       // "ese es mejor?"
            /^(el|la)\s+(primero|segundo)/,         // "el primero es mejor?"
            /^(ambos|los dos)/                      // "ambos sirven?"
        ];

        return followUpPatterns.some(pattern => pattern.test(msg));
    }

    /**
     * Obtiene contexto para generar respuesta
     */
    getContextForResponse() {
        return {
            recentModels: this.getRecentModels(),
            activeEntities: Object.fromEntries(this.activeEntities),
            lastIntent: this.turns.length > 0 ? this.turns[this.turns.length - 1].analysis.intent : null,
            userProfile: this.userProfile,
            conversationLength: this.turns.length
        };
    }

    /**
     * Inicia un flujo multi-paso (wizard)
     */
    startMultiStepTask(taskType) {
        this.multiStepTask = {
            type: taskType,
            currentStep: 0,
            collectedData: {},
            startedAt: Date.now()
        };
    }

    /**
     * Actualiza el flujo multi-paso
     */
    updateMultiStepTask(stepData) {
        if (this.multiStepTask) {
            this.multiStepTask.currentStep++;
            Object.assign(this.multiStepTask.collectedData, stepData);
        }
    }

    /**
     * Completa y retorna datos del flujo multi-paso
     */
    completeMultiStepTask() {
        const taskData = this.multiStepTask ? { ...this.multiStepTask.collectedData } : null;
        this.multiStepTask = null;
        return taskData;
    }

    /**
     * Limpia el contexto (reset)
     */
    reset() {
        this.turns = [];
        this.activeEntities.clear();
        this.multiStepTask = null;
        // Mantener userProfile para sesiones futuras
    }

    /**
     * Exporta el estado completo (para debugging)
     */
    exportState() {
        return {
            turns: this.turns,
            activeEntities: Object.fromEntries(this.activeEntities),
            userProfile: this.userProfile,
            metrics: this.metrics,
            multiStepTask: this.multiStepTask
        };
    }

    /**
     * Obtiene resumen de la conversación
     */
    getSummary() {
        const modelsDiscussed = this.getRecentModels(10);
        const topIntent = this.getTopIntent();

        return {
            totalTurns: this.turns.length,
            modelsDiscussed: modelsDiscussed.map(m => m.model.name),
            topIntent: topIntent,
            expertise: this.userProfile.expertise,
            satisfactionScore: this.userProfile.satisfactionScore,
            averageConfidence: Math.round(this.metrics.averageConfidence * 100) / 100
        };
    }

    /**
     * Obtiene el intent más frecuente
     */
    getTopIntent() {
        const intentCounts = {};
        this.turns.forEach(turn => {
            const intent = turn.analysis?.intent?.intent;
            if (intent) {
                intentCounts[intent] = (intentCounts[intent] || 0) + 1;
            }
        });

        let topIntent = null;
        let maxCount = 0;
        for (const [intent, count] of Object.entries(intentCounts)) {
            if (count > maxCount) {
                maxCount = count;
                topIntent = intent;
            }
        }

        return topIntent;
    }
}

// ========================================
// EXPORTS
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConversationContext;
}
