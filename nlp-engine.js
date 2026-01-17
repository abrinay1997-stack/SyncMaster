// ========================================
// NLP ENGINE - MOTOR DE LENGUAJE NATURAL
// ========================================
// Fase 1 + 2: Sinónimos, Intents, NER, Negaciones

// ========================================
// 1. SISTEMA DE SINÓNIMOS
// ========================================
const SYNONYMS = {
    // Acciones principales
    'specs': ['especificaciones', 'características', 'info', 'información', 'datos', 'ficha', 'detalles'],
    'recomienda': ['sugiere', 'mejor', 'conviene', 'ideal', 'aconsejas', 'propones', 'qué me sirve'],
    'compara': ['diferencia', 'versus', 'vs', 'contra', 'cuál es mejor entre'],
    'calcula': ['cuánto', 'dame el cálculo', 'necesito saber', 'quiero calcular'],
    'setup': ['configuración', 'config', 'diseño', 'sistema para', 'montaje', 'armar'],

    // Sustantivos técnicos
    'personas': ['gente', 'audiencia', 'público', 'asistentes', 'espectadores', 'concurrentes'],
    'distancia': ['metros', 'alcance', 'cobertura', 'lejos', 'rango'],
    'potente': ['fuerte', 'alto spl', 'mucho volumen', 'potencia', 'poderoso'],
    'ligero': ['liviano', 'poco peso', 'lightweight', 'light'],

    // Tipos de eventos
    'festival': ['outdoor', 'aire libre', 'abierto', 'concierto masivo', 'show grande'],
    'teatro': ['indoor', 'sala', 'cerrado', 'auditorio', 'interior', 'techado'],
    'corporativo': ['empresa', 'conferencia', 'presentación', 'evento empresarial'],

    // Equipamiento
    'delay': ['delay tower', 'torre', 'torres de delay', 'torre de retraso'],
    'sub': ['subwoofer', 'subgraves', 'bajos', 'low end'],
    'monitor': ['wedge', 'monitoreo', 'cuña', 'retorno'],
    'line array': ['línea', 'arreglo lineal', 'array'],

    // Otros términos
    'precio': ['costo', 'cuánto cuesta', 'cuánto vale', 'valor', 'tarifa', 'plan'],
    'problema': ['error', 'bug', 'fallo', 'no funciona', 'issue'],
    'ayuda': ['help', 'soporte', 'asistencia', 'apoyo'],

    // Inglés
    'what': ['qué', 'que'],
    'how': ['cómo', 'como'],
    'price': ['precio', 'costo']
};

// Palabras de relleno (stopwords específicas del dominio)
const DOMAIN_STOPWORDS = ['por favor', 'gracias', 'hola', 'hey', 'bueno', 'bien', 'ok', 'vale'];

/**
 * Escapa caracteres especiales de regex para construcción segura
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Expande queries con sinónimos para mejor matching
 */
function expandQuery(query) {
    let expanded = query.toLowerCase();

    // Remover stopwords
    DOMAIN_STOPWORDS.forEach(stopword => {
        const regex = new RegExp(`\\b${escapeRegex(stopword)}\\b`, 'gi');
        expanded = expanded.replace(regex, '');
    });

    // Normalizar espacios
    expanded = expanded.trim().replace(/\s+/g, ' ');

    // Expandir con sinónimos (reemplazar sinónimos por palabra clave)
    for (const [keyword, synonyms] of Object.entries(SYNONYMS)) {
        synonyms.forEach(synonym => {
            const regex = new RegExp(`\\b${escapeRegex(synonym)}\\b`, 'gi');
            if (regex.test(expanded)) {
                expanded = expanded.replace(regex, keyword);
            }
        });
    }

    return expanded;
}

// ========================================
// 2. INTENT CLASSIFICATION
// ========================================
const INTENTS = {
    'specs_query': {
        patterns: ['specs', 'especificaciones', 'características', 'info', 'datos'],
        requiredEntities: ['speakerModel'],
        confidence: 0.8,
        priority: 10
    },
    'recommendation': {
        patterns: ['recomienda', 'sugiere', 'mejor', 'ideal', 'qué me conviene', 'cuál elegir', 'necesito'],
        optionalEntities: ['eventType', 'distance', 'people', 'budget'],
        confidence: 0.75,
        priority: 9
    },
    'comparison': {
        patterns: ['compara', 'diferencia', 'versus', 'vs', 'cuál es mejor entre', 'contra'],
        requiredEntities: ['speakerModels'], // Plural
        confidence: 0.9,
        priority: 10
    },
    'calculation': {
        patterns: ['calcula', 'cuánto', 'necesito saber', 'dame el cálculo'],
        subIntents: {
            'delay_calc': ['delay', 'retraso', 'tiempo'],
            'dante_calc': ['dante', 'bandwidth', 'ancho de banda', 'red'],
            'power_calc': ['potencia', 'watts', 'electricidad', 'consumo'],
            'rigging_calc': ['rigging', 'peso', 'carga', 'truss']
        },
        confidence: 0.85,
        priority: 8
    },
    'setup_design': {
        patterns: ['setup', 'configuración', 'diseño', 'sistema para', 'montaje', 'armar'],
        requiredEntities: ['eventType'],
        confidence: 0.8,
        priority: 9
    },
    'pricing': {
        patterns: ['precio', 'costo', 'cuánto cuesta', 'plan', 'suscripción', 'membresía'],
        confidence: 0.95,
        priority: 10
    },
    'help': {
        patterns: ['ayuda', 'help', 'soporte', '?', 'cómo', 'no entiendo'],
        confidence: 0.7,
        priority: 5
    },
    'greeting': {
        patterns: ['hola', 'hey', 'hi', 'buenos días', 'buenas', 'saludos'],
        confidence: 0.95,
        priority: 3
    },
    'thanks': {
        patterns: ['gracias', 'thanks', 'thank you', 'genial', 'perfecto', 'excelente'],
        confidence: 0.9,
        priority: 2
    },
    'about': {
        patterns: ['qué es', 'what is', 'para qué sirve', 'funciona', 'offline'],
        confidence: 0.85,
        priority: 7
    },
    'technical_concept': {
        patterns: ['haas', 'power alley', 'array limit', 'grating lobe', 'wst', 'splay', 'ground bounce'],
        confidence: 0.9,
        priority: 8
    }
};

/**
 * Clasifica la intención del mensaje del usuario
 */
function classifyIntent(message, entities) {
    const expandedMsg = expandQuery(message);
    const results = [];

    for (const [intentName, config] of Object.entries(INTENTS)) {
        let score = 0;
        let matchedPatterns = [];

        // Score por patterns matched
        const patternMatches = config.patterns.filter(pattern => {
            // Validar que pattern no esté vacío
            if (!pattern || pattern.trim().length === 0) return false;

            // Escapar caracteres especiales de regex
            const escapedPattern = escapeRegex(pattern);
            const regex = new RegExp(`\\b${escapedPattern}\\b`, 'i');

            if (regex.test(expandedMsg)) {
                matchedPatterns.push(pattern);
                return true;
            }
            return false;
        });

        if (patternMatches.length === 0) continue;

        // Score base: % de patterns matched
        score = (patternMatches.length / config.patterns.length) * config.confidence;

        // Bonus: si tiene las entidades requeridas
        if (config.requiredEntities) {
            const hasRequired = config.requiredEntities.every(entity => {
                return entities[entity] && entities[entity].length > 0;
            });
            if (hasRequired) {
                score += 0.2;
            } else {
                score -= 0.3; // Penalización si falta entidad requerida
            }
        }

        // Bonus: prioridad del intent
        score += (config.priority / 100);

        // Sub-intents (para cálculos específicos)
        let subIntent = null;
        if (config.subIntents) {
            for (const [subName, subPatterns] of Object.entries(config.subIntents)) {
                if (subPatterns.some(p => {
                    if (!p || p.trim().length === 0) return false;
                    return new RegExp(`\\b${escapeRegex(p)}\\b`, 'i').test(expandedMsg);
                })) {
                    subIntent = subName;
                    score += 0.15;
                    break;
                }
            }
        }

        results.push({
            intent: intentName,
            subIntent: subIntent,
            confidence: Math.min(score, 1.0),
            matchedPatterns: matchedPatterns
        });
    }

    // Ordenar por confidence
    results.sort((a, b) => b.confidence - a.confidence);

    return results[0] || { intent: 'unknown', confidence: 0, matchedPatterns: [] };
}

// ========================================
// 3. EXTRACCIÓN DE ENTIDADES AVANZADA (NER)
// ========================================

/**
 * Extrae entidades del mensaje (números + conceptos)
 */
function extractAdvancedEntities(message, speakerDatabase) {
    const msg = message.toLowerCase();
    const entities = {
        // Numéricas (ya existentes - mejoradas)
        distance: null,
        temperature: null,
        people: null,
        channels: null,
        sampleRate: null,

        // NUEVAS: Textuales
        speakerModels: [],          // [{model, confidence}]
        brands: [],                 // ["L-Acoustics", "Meyer"]
        venueType: null,            // "indoor" | "outdoor" | "hybrid"
        eventType: null,            // "festival" | "teatro" | "corporativo"
        weatherConditions: [],      // ["lluvia", "viento"]
        budget: null,               // {amount: 5000, currency: "USD", range: "low|mid|high"}
        urgency: null,              // "inmediato" | "normal" | "flexible"
        expertise: null,            // "principiante" | "intermedio" | "profesional"
        existingEquipment: [],      // ["tengo K2", "consola DiGiCo"]
        constraints: [],            // ["sin rigging", "peso < 60kg"]
        characteristics: [],        // ["high-spl", "light", "cardioid"]
        comparisons: [],            // [{model1, model2}]

        // Validación
        validationErrors: []
    };

    // ===== ENTIDADES NUMÉRICAS (MEJORADAS CON VALIDACIÓN) =====

    // Distancia
    const distMatch = msg.match(/(\d+)\s*m(?:etros?)?(?!\s*hz)/i);
    if (distMatch) {
        const dist = parseInt(distMatch[1]);
        if (dist < 1 || dist > 500) {
            entities.validationErrors.push(`Distancia ${dist}m fuera de rango válido (1-500m)`);
        } else {
            entities.distance = dist;
        }
    }

    // Temperatura
    const tempMatch = msg.match(/(\d+)\s*[°º]?c/i);
    if (tempMatch) {
        const temp = parseInt(tempMatch[1]);
        if (temp < -20 || temp > 50) {
            entities.validationErrors.push(`Temperatura ${temp}°C fuera de rango válido (-20 a 50°C)`);
        } else {
            entities.temperature = temp;
        }
    }

    // Personas
    const peopleMatch = msg.match(/(\d+)\s*(personas?|gente|audiencia|público|asistentes|espectadores|concurrentes)/i);
    if (peopleMatch) {
        const people = parseInt(peopleMatch[1]);
        if (people < 10 || people > 100000) {
            entities.validationErrors.push(`Cantidad ${people} personas fuera de rango válido (10-100,000)`);
        } else {
            entities.people = people;
        }
    }

    // Canales
    const channelsMatch = msg.match(/(\d+)\s*(canales?|ch)/i);
    if (channelsMatch) {
        const ch = parseInt(channelsMatch[1]);
        if (ch < 1 || ch > 512) {
            entities.validationErrors.push(`${ch} canales fuera de rango válido (1-512 ch)`);
        } else {
            entities.channels = ch;
        }
    }

    // Sample rate
    if (/96\s*k|96000/i.test(msg)) entities.sampleRate = 96;
    else if (/48\s*k|48000/i.test(msg)) entities.sampleRate = 48;

    // ===== ENTIDADES TEXTUALES (NUEVAS) =====

    // Speaker Models (de la base de datos)
    for (const [key, model] of Object.entries(speakerDatabase)) {
        const escapedModelName = escapeRegex(model.name).replace(/\s+/g, '\\s*');
        const modelNameRegex = new RegExp(`\\b${escapedModelName}\\b`, 'i');
        const keyRegex = new RegExp(`\\b${escapeRegex(key)}\\b`, 'i');

        if (modelNameRegex.test(message) || keyRegex.test(message)) {
            entities.speakerModels.push({
                model: model,
                key: key,
                confidence: 0.9
            });
        }
    }

    // Brands
    const brandPatterns = {
        'L-Acoustics': /l-?acoustics?|lacoustic/i,
        'Meyer Sound': /meyer(?:\s+sound)?/i,
        'd&b audiotechnik': /d\s*&\s*b|db\s+audio/i,
        'JBL': /\bjbl\b/i,
        'Adamson': /adamson/i,
        'RCF': /\brcf\b/i
    };

    for (const [brand, pattern] of Object.entries(brandPatterns)) {
        if (pattern.test(message)) {
            entities.brands.push(brand);
        }
    }

    // Venue Type (con sinónimos expandidos)
    const venuePatterns = {
        indoor: /indoor|sala|teatro|auditorio|cerrado|interior|techado|techo|bajo techo/i,
        outdoor: /outdoor|aire libre|abierto|exterior|al aire libre|sin techo|descubierto/i,
        hybrid: /semi-?cubierto|carpa|toldo|parcialmente/i
    };

    for (const [type, pattern] of Object.entries(venuePatterns)) {
        if (pattern.test(msg)) {
            entities.venueType = type;
            break;
        }
    }

    // Event Type
    if (/(festival|masivo|outdoor|gran concierto)/i.test(msg)) entities.eventType = 'festival';
    else if (/(teatro|sala|indoor|auditorio)/i.test(msg)) entities.eventType = 'teatro';
    else if (/(corporativo|conferencia|empresa|presentación)/i.test(msg)) entities.eventType = 'corporativo';

    // Weather Conditions
    if (/lluvia|rain|wet/i.test(msg)) entities.weatherConditions.push('lluvia');
    if (/viento|wind/i.test(msg)) entities.weatherConditions.push('viento');
    if (/calor|heat|hot/i.test(msg)) entities.weatherConditions.push('calor');
    if (/frío|cold/i.test(msg)) entities.weatherConditions.push('frío');

    // Budget
    const budgetMatch = msg.match(/\$?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(usd|d[oó]lares?|pesos?|euros?)?/i);
    if (budgetMatch) {
        const amount = parseInt(budgetMatch[1].replace(/,/g, ''));
        entities.budget = {
            amount: amount,
            currency: budgetMatch[2] ? budgetMatch[2].toUpperCase() : 'USD',
            range: amount < 5000 ? 'low' : amount < 20000 ? 'mid' : 'high'
        };
    } else if (/(barato|econ[oó]mico|low budget)/i.test(msg)) {
        entities.budget = { range: 'low', amount: null, currency: 'USD' };
    } else if (/(caro|premium|high end|gama alta)/i.test(msg)) {
        entities.budget = { range: 'high', amount: null, currency: 'USD' };
    }

    // Urgency
    if (/(urgente|ya|ahora|inmediato|ma[ñn]ana|hoy)/i.test(msg)) {
        entities.urgency = 'inmediato';
    } else if (/(tengo tiempo|sin prisa|flexible|cuando sea)/i.test(msg)) {
        entities.urgency = 'flexible';
    } else {
        entities.urgency = 'normal';
    }

    // Expertise Level
    if (/(no s[eé]|novato|principiante|empezando|aprendiendo|nuevo en esto)/i.test(msg)) {
        entities.expertise = 'principiante';
    } else if (/(profesional|experto|t[eé]cnico|ingeniero|años de experiencia)/i.test(msg)) {
        entities.expertise = 'profesional';
    } else {
        entities.expertise = 'intermedio'; // Default
    }

    // Existing Equipment
    if (/(tengo|ya tengo|cuento con|dispongo de)/i.test(msg)) {
        const equipmentMatch = msg.match(/(?:tengo|ya tengo|cuento con|dispongo de)\s+([^.,]+)/i);
        if (equipmentMatch) {
            entities.existingEquipment.push(equipmentMatch[1].trim());
        }
    }

    // Constraints
    if (/(sin rigging|no puedo colgar)/i.test(msg)) {
        entities.constraints.push('no_rigging');
    }
    if (/peso.*(?:m[aá]ximo|menor|menos de)\s*(\d+)/i.test(msg)) {
        const weightLimit = msg.match(/peso.*(?:m[aá]ximo|menor|menos de)\s*(\d+)/i)[1];
        entities.constraints.push(`max_weight_${weightLimit}kg`);
    }
    if (/(presupuesto.*limitado|poco dinero|ajustado)/i.test(msg)) {
        entities.constraints.push('limited_budget');
    }

    // Characteristics (ya existía, mejorado)
    if (/(potente|fuerte|alto spl|mucho volumen|poderoso)/i.test(msg)) entities.characteristics.push('high-spl');
    if (/(ligero|liviano|poco peso|lightweight)/i.test(msg)) entities.characteristics.push('light');
    if (/(cardio|direccional|rechazo)/i.test(msg)) entities.characteristics.push('cardioid');
    if (/(largo alcance|distancia|lejos|long throw)/i.test(msg)) entities.characteristics.push('long-throw');
    if (/(compacto|peque[ñn]o|mediano)/i.test(msg)) entities.characteristics.push('compact');

    // Comparisons (detectar "A vs B" o "entre A y B")
    const vsMatch = msg.match(/(\w+)\s+(?:vs|versus|contra)\s+(\w+)/i);
    if (vsMatch) {
        entities.comparisons.push({
            model1: vsMatch[1],
            model2: vsMatch[2]
        });
    }

    const betweenMatch = msg.match(/entre\s+(\w+)\s+y\s+(\w+)/i);
    if (betweenMatch) {
        entities.comparisons.push({
            model1: betweenMatch[1],
            model2: betweenMatch[2]
        });
    }

    return entities;
}

// ========================================
// 4. DETECCIÓN DE NEGACIONES
// ========================================

/**
 * Detecta si un término está negado en el mensaje
 */
function hasNegation(message, term) {
    const negations = ['no', 'nunca', 'sin', 'excepto', 'menos', 'tampoco', 'ni'];
    const words = message.toLowerCase().split(/\s+/);
    const termWords = term.toLowerCase().split(/\s+/);

    // Buscar el término en el mensaje
    let termIndex = -1;
    for (let i = 0; i < words.length; i++) {
        if (termWords.some(tw => words[i].includes(tw))) {
            termIndex = i;
            break;
        }
    }

    if (termIndex === -1) return false;

    // Buscar negación en las 3 palabras anteriores
    for (let i = Math.max(0, termIndex - 3); i < termIndex; i++) {
        if (negations.includes(words[i])) {
            return true;
        }
    }

    return false;
}

/**
 * Filtra entidades negadas
 */
function filterNegatedEntities(message, entities) {
    // Filtrar modelos negados
    if (entities.speakerModels && entities.speakerModels.length > 0) {
        entities.speakerModels = entities.speakerModels.filter(sm => {
            const isNegated = hasNegation(message, sm.model.name);
            if (isNegated) {
                // Agregar a constraints en lugar de eliminar
                entities.constraints.push(`not_${sm.key}`);
            }
            return !isNegated;
        });
    }

    // Filtrar características negadas
    if (entities.characteristics && entities.characteristics.length > 0) {
        entities.characteristics = entities.characteristics.filter(char => {
            return !hasNegation(message, char);
        });
    }

    return entities;
}

// ========================================
// 5. ANÁLISIS COMPLETO (API PRINCIPAL)
// ========================================

/**
 * Analiza el mensaje del usuario y retorna intent + entidades
 */
function analyzeMessage(message, speakerDatabase) {
    // 1. Expandir con sinónimos
    const expandedMessage = expandQuery(message);

    // 2. Extraer entidades
    let entities = extractAdvancedEntities(message, speakerDatabase);

    // 3. Filtrar negaciones
    entities = filterNegatedEntities(message, entities);

    // 4. Clasificar intent
    const intentResult = classifyIntent(expandedMessage, entities);

    return {
        originalMessage: message,
        expandedMessage: expandedMessage,
        intent: intentResult,
        entities: entities,
        timestamp: Date.now()
    };
}

// ========================================
// EXPORTS
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        expandQuery,
        classifyIntent,
        extractAdvancedEntities,
        hasNegation,
        filterNegatedEntities,
        analyzeMessage,
        SYNONYMS,
        INTENTS
    };
}
