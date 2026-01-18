// ========================================
// NLP ENGINE - MOTOR DE LENGUAJE NATURAL
// ========================================
// Fase 1 + 2: Sinónimos, Intents, NER, Negaciones

// ========================================
// 1. SISTEMA DE SINÓNIMOS (EXPANDIDO v2.0)
// ========================================
// 150+ términos organizados por categorías
const SYNONYMS = {
    // ===== ACCIONES PRINCIPALES =====
    'specs': ['especificaciones', 'características', 'info', 'información', 'datos', 'ficha', 'detalles', 'datasheet', 'technical specs', 'tech specs'],
    'recomienda': ['sugiere', 'mejor', 'conviene', 'ideal', 'aconsejas', 'propones', 'qué me sirve', 'qué modelo', 'cuál elegir', 'cuál comprar'],
    'compara': ['diferencia', 'versus', 'vs', 'contra', 'cuál es mejor entre', 'qué diferencia hay', 'cual es mejor'],
    'calcula': ['cuánto', 'dame el cálculo', 'necesito saber', 'quiero calcular', 'cómo calculo', 'calculadora'],
    'setup': ['configuración', 'config', 'diseño', 'sistema para', 'montaje', 'armar', 'instalar', 'montar'],
    'necesito': ['requiero', 'busco', 'quiero', 'me hace falta', 'ocupo', 'estoy buscando', 'ando buscando'],

    // ===== TIPOS DE EVENTOS =====
    'festival': ['outdoor', 'aire libre', 'abierto', 'concierto masivo', 'show grande', 'gig', 'tocada', 'festival outdoor', 'concierto grande', 'evento masivo'],
    'teatro': ['indoor', 'sala', 'cerrado', 'auditorio', 'interior', 'techado', 'recinto cerrado', 'venue', 'sala de eventos'],
    'corporativo': ['empresa', 'conferencia', 'presentación', 'evento empresarial', 'corporativo', 'negocio', 'convención', 'congreso', 'seminario'],
    'concierto': ['show', 'gig', 'presentación', 'tocada', 'recital', 'live', 'en vivo'],

    // ===== EQUIPAMIENTO PA =====
    'line array': ['línea', 'arreglo lineal', 'array', 'linea', 'line', 'sistema lineal', 'arreglo'],
    'speaker': ['altavoz', 'bocina', 'parlante', 'caja', 'bafle', 'cajon'],
    'sub': ['subwoofer', 'subgraves', 'bajos', 'low end', 'graves', 'bombo', 'woofer'],
    'monitor': ['wedge', 'monitoreo', 'cuña', 'retorno', 'piso', 'monitor de piso', 'personal monitor'],
    'delay': ['delay tower', 'torre', 'torres de delay', 'torre de retraso', 'torres', 'tower'],
    'pa': ['sistema', 'pa system', 'sistema de sonido', 'refuerzo', 'refuerzo sonoro', 'sound system'],
    'mixer': ['consola', 'mezcladora', 'mesa', 'mesa de mezcla', 'mixing console', 'board'],
    'amp': ['amplificador', 'potencia', 'power amp', 'ampli', 'rack'],

    // ===== JERGA TÉCNICA =====
    'foh': ['front of house', 'mezcla', 'consola foh', 'mixing', 'mesa foh'],
    'rigging': ['colgado', 'suspensión', 'fly', 'amarres', 'flying', 'hang', 'colgar'],
    'spl': ['presión sonora', 'nivel', 'volumen máximo', 'db', 'decibeles'],
    'cobertura': ['coverage', 'alcance', 'rango', 'área', 'dispersión'],
    'dispersión': ['dispersion', 'ángulo', 'coverage angle', 'apertura'],
    'dante': ['red dante', 'audio over ip', 'network', 'digital audio', 'aes67'],
    'avb': ['audio video bridging', 'milan', 'network audio'],

    // ===== SUSTANTIVOS TÉCNICOS =====
    'personas': ['gente', 'audiencia', 'público', 'asistentes', 'espectadores', 'concurrentes', 'capacity', 'aforo'],
    'distancia': ['metros', 'alcance', 'cobertura', 'lejos', 'rango', 'throw', 'largo'],
    'potente': ['fuerte', 'alto spl', 'mucho volumen', 'potencia', 'poderoso', 'potente', 'high output'],
    'ligero': ['liviano', 'poco peso', 'lightweight', 'light', 'peso bajo'],
    'peso': ['pesado', 'kg', 'kilogramos', 'weight', 'masa'],
    'impedancia': ['ohms', 'ohmios', 'impedance', 'z'],

    // ===== ESPECIFICACIONES =====
    'potencia': ['watts', 'vatios', 'power', 'wattage', 'consumo'],
    'frecuencia': ['hz', 'hertz', 'frequency', 'freq', 'rango de frecuencias'],
    'sensibilidad': ['sensitivity', 'eficiencia', 'efficiency'],
    'directividad': ['directivity', 'patrón', 'pattern', 'polar'],

    // ===== ACCIONES BÚSQUEDA =====
    'busco': ['necesito', 'quiero', 'estoy buscando', 'ando buscando', 'requiero', 'me hace falta'],
    'sirve': ['funciona', 'va bien', 'es bueno', 'se puede usar', 'aplica'],
    'mejor': ['óptimo', 'top', 'recomendado', 'ideal', 'perfecto', 'excelente'],

    // ===== PRECIOS Y MEMBRESÍAS =====
    'precio': ['costo', 'cuánto cuesta', 'cuánto vale', 'valor', 'tarifa', 'plan', 'cuánto sale', 'cuánto es'],
    'membresía': ['suscripción', 'plan', 'membership', 'licencia', 'subscription'],
    'pago': ['pagar', 'comprar', 'adquirir', 'payment', 'purchase'],
    'barato': ['económico', 'accesible', 'bajo costo', 'cheap', 'affordable'],
    'caro': ['costoso', 'expensive', 'alto precio'],

    // ===== CALIDAD Y COMPARACIONES =====
    'bueno': ['bien', 'good', 'quality', 'calidad', 'decent'],
    'malo': ['mal', 'bad', 'poor', 'deficiente'],
    'profesional': ['pro', 'professional', 'high end', 'touring', 'tour grade'],
    'básico': ['entry level', 'principiante', 'starter', 'inicial'],

    // ===== PROBLEMAS Y SOPORTE =====
    'problema': ['error', 'bug', 'fallo', 'no funciona', 'issue', 'trouble', 'problema'],
    'ayuda': ['help', 'soporte', 'asistencia', 'apoyo', 'support', 'ayúdame'],
    'duda': ['pregunta', 'consulta', 'question', 'inquiry'],

    // ===== MARCAS (GENERALES) =====
    'lacoustics': ['l-acoustics', 'la', 'ele acoustics'],
    'db': ['d&b', 'd and b', 'deb'],
    'meyer': ['meyer sound'],
    'jbl': ['jbl professional'],

    // ===== INGLÉS COMÚN =====
    'what': ['qué', 'que'],
    'how': ['cómo', 'como'],
    'price': ['precio', 'costo'],
    'where': ['dónde', 'donde'],
    'when': ['cuándo', 'cuando'],
    'which': ['cuál', 'cual'],
    'why': ['por qué', 'porque'],

    // ===== GLOSARIO TÉCNICO LIVESYNC PRO =====
    // Entorno y Atmósfera
    'temperatura': ['temp', 'temperatura ambiente', 'temperatura del aire', 'temperatura showtime', 'grados'],
    'humedad': ['humedad relativa', 'hr', 'humidity', 'humedad del aire'],
    'altitud': ['altura', 'metros sobre nivel del mar', 'elevation', 'altitude'],
    'viento': ['velocidad del viento', 'dirección del viento', 'wind', 'headwind', 'tailwind', 'crosswind'],
    'ground effect': ['efecto suelo', 'reflexión del suelo', 'comb filtering por suelo', 'ground reflection'],

    // Acústica de Sala
    'rt60': ['tiempo de reverberación', 'reverb time', 'decay time', 'reverberación'],
    'sabine': ['fórmula sabine', 'sabine formula', 'ecuación sabine'],
    'eyring': ['fórmula eyring', 'eyring formula', 'ecuación eyring'],
    'room modes': ['modos de sala', 'modos axiales', 'standing waves', 'ondas estacionarias'],
    'critical distance': ['distancia crítica', 'dc', 'radio crítico', 'reverb radius'],
    'sti': ['speech transmission index', 'inteligibilidad', 'intelligibility'],

    // Room EQ y DSP
    'room eq': ['room eq correction', 'corrección de sala', 'room correction', 'eq de sala'],
    'hpf': ['high pass filter', 'filtro paso alto', 'paso alto', 'highpass'],
    'q factor': ['ancho de banda', 'bandwidth', 'q', 'factor q'],

    // Sistema PA Avanzado
    'power alley': ['acoplamiento', 'coupling', 'suma de potencia'],
    'array length': ['longitud del array', 'largo del arreglo', 'número de cajas'],
    'splay': ['splay angles', 'ángulos de apertura', 'ángulo splay', 'inter-cabinet angle'],
    'wst': ['wst criteria', 'wavefront sculpture', 'criterio wst'],
    'broken line source': ['fuente lineal rota', 'broken line', 'line source'],

    // Subwoofer Arrays
    'cardioid': ['cardioide', 'sub cardioide', 'pattern cardioide', 'arreglo cardioide'],
    'end-fire': ['endfire', 'end fire', 'arreglo endfire'],

    // Calibración y Targets
    'target spl': ['spl objetivo', 'nivel objetivo', 'spl target', 'presión objetivo'],
    'foh distance': ['distancia foh', 'distancia a la consola', 'foh mix position'],
    'headroom': ['margen de pico', 'peak headroom', 'margen dinámico'],
    'crest factor': ['factor de cresta', 'peak to average', 'ratio pico-rms'],

    // Layout de Escenario
    'proscenium': ['proscenio', 'teatro proscenio', 'escenario italiano'],
    'thrust': ['thrust stage', 'escenario thrust', 'teatro thrust'],
    'arena': ['arena 360', '360 grados', 'round stage', 'escenario circular'],

    // Amplificación
    'amp topology': ['topología', 'clase del amplificador', 'clase ab', 'clase d'],
    'damping factor': ['factor de amortiguamiento', 'damping', 'control de driver'],

    // Electricidad
    'power phase': ['fase eléctrica', 'monofásico', 'trifásico', 'single phase', 'three phase'],
    'voltage drop': ['caída de tensión', 'caída de voltaje', 'drop de voltaje'],
    'breaker': ['breakers', 'interruptor', 'protección eléctrica', 'circuit breaker'],
    'cable gauge': ['calibre', 'sección de cable', 'awg', 'wire gauge'],

    // Audio Digital
    'sample rate': ['frecuencia de muestreo', 'sample frequency', '48khz', '96khz'],
    'bit depth': ['resolución', 'profundidad de bits', '24 bit', '16 bit'],

    // Rigging
    'safety margin': ['margen de seguridad', 'factor de seguridad', 'safety factor'],
    'bridle': ['bridle configuration', 'configuración bridle', 'rigging bridle'],

    // Crossover y Filtros
    'crossover': ['crossover frequency', 'frecuencia de cruce', 'punto de cruce'],
    'linkwitz-riley': ['linkwitz riley', 'lr', 'lr4', 'lr2'],
    'butterworth': ['butterworth filter', 'filtro butterworth'],

    // Delay y Propagación
    'required delay': ['delay requerido', 'tiempo de delay', 'retardo requerido'],
    'slant distance': ['distancia inclinada', 'slant range', 'distancia real'],

    // Acústica Avanzada
    'distance loss': ['pérdida por distancia', 'inverse square law', 'ley cuadrado inverso'],
    'atmospheric loss': ['pérdida atmosférica', 'absorción del aire', 'air absorption'],
    'refraction': ['refracción', 'curvatura del sonido', 'refracción acústica'],
    'coherence': ['coherencia', 'phase coherence', 'coherencia de fase'],
    'haas effect': ['efecto haas', 'precedence effect', 'efecto de precedencia'],
    'comb filtering': ['filtrado de peine', 'cancelación de fase', 'phase cancellation'],
    'direct field': ['campo directo', 'sonido directo', 'direct sound'],
    'reverberant field': ['campo reverberante', 'sonido reverberante', 'reverb field'],

    // Normas y Estándares
    'iso 3382': ['iso3382', 'norma iso', 'estándar acústico'],

    // Transiciones y Efectos
    'line array transition': ['distancia de transición', 'transition distance', 'near field to far field']
};

// Palabras de relleno (stopwords específicas del dominio)
const DOMAIN_STOPWORDS = ['por favor', 'gracias', 'hola', 'hey', 'bueno', 'bien', 'ok', 'vale'];

// ========================================
// MEJORAS NLP v2.0 - UTILIDADES
// ========================================

/**
 * Escapa caracteres especiales de regex para construcción segura
 */
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * NLP #2: SPELL CORRECTION - Diccionario de keywords técnicas
 */
const TECHNICAL_KEYWORDS = [
    // Equipamiento
    'line array', 'speaker', 'subwoofer', 'monitor', 'delay', 'amplificador', 'consola',
    // Acciones
    'especificaciones', 'recomendacion', 'comparar', 'calcular', 'configuracion', 'diseño',
    // Eventos
    'festival', 'teatro', 'corporativo', 'concierto', 'outdoor', 'indoor',
    // Técnico
    'rigging', 'dante', 'spl', 'cobertura', 'dispersion', 'potencia', 'frecuencia',
    // Marcas
    'lacoustics', 'panther', 'kara', 'meyer', 'leopard',
    // Glosario Técnico
    'temperatura', 'humedad', 'altitud', 'viento', 'ground effect', 'rt60', 'sabine', 'eyring',
    'room modes', 'critical distance', 'sti', 'room eq', 'hpf', 'q factor', 'power alley',
    'array length', 'splay', 'wst', 'cardioid', 'endfire', 'target spl', 'foh distance',
    'headroom', 'crest factor', 'proscenium', 'thrust', 'arena', 'damping factor',
    'power phase', 'voltage drop', 'breaker', 'cable gauge', 'sample rate', 'bit depth',
    'safety margin', 'bridle', 'crossover', 'linkwitz-riley', 'butterworth', 'required delay',
    'slant distance', 'distance loss', 'atmospheric loss', 'refraction', 'coherence',
    'haas effect', 'comb filtering', 'direct field', 'reverberant field', 'iso 3382'
];

/**
 * Algoritmo de Levenshtein Distance para spell correction
 */
function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[len1][len2];
}

/**
 * NLP #2: Corregir typos en keywords técnicas
 */
function correctSpelling(word) {
    const wordLower = word.toLowerCase();

    // Si existe exactamente, retornar
    if (TECHNICAL_KEYWORDS.some(kw => kw.toLowerCase() === wordLower)) {
        return word;
    }

    // Buscar keyword más cercana (distancia <= 2)
    let bestMatch = null;
    let minDistance = Infinity;

    for (const keyword of TECHNICAL_KEYWORDS) {
        const distance = levenshteinDistance(wordLower, keyword.toLowerCase());
        if (distance <= 2 && distance < minDistance) {
            minDistance = distance;
            bestMatch = keyword;
        }
    }

    return bestMatch || word;
}

/**
 * NLP #3: STEMMING/LEMMATIZATION - Diccionarios de normalización
 */
const VERB_STEMS = {
    // Verbos AR
    'calculando': 'calcular', 'calculé': 'calcular', 'calcularé': 'calcular', 'calculaba': 'calcular',
    'recomendando': 'recomendar', 'recomendé': 'recomendar', 'recomendaré': 'recomendar',
    'comparando': 'comparar', 'comparé': 'comparar', 'compararé': 'comparar',
    'necesitando': 'necesitar', 'necesité': 'necesitar', 'necesitaré': 'necesitar',
    'buscando': 'buscar', 'busqué': 'buscar', 'buscaré': 'buscar',
    'configurando': 'configurar', 'configuré': 'configurar', 'configuraré': 'configurar',
    // Verbos ER
    'teniendo': 'tener', 'tuve': 'tener', 'tendré': 'tener', 'tenía': 'tener',
    'haciendo': 'hacer', 'hice': 'hacer', 'haré': 'hacer', 'hacía': 'hacer',
    // Verbos IR
    'sirviendo': 'servir', 'serví': 'servir', 'serviré': 'servir', 'servía': 'servir',
    'midiendo': 'medir', 'medí': 'medir', 'mediré': 'medir', 'medía': 'medir'
};

const PLURAL_STEMS = {
    'arrays': 'array', 'speakers': 'speaker', 'subwoofers': 'subwoofer', 'monitores': 'monitor',
    'amplificadores': 'amplificador', 'consolas': 'consola', 'torres': 'torre',
    'metros': 'metro', 'personas': 'persona', 'eventos': 'evento', 'festivales': 'festival',
    'teatros': 'teatro', 'conciertos': 'concierto', 'sistemas': 'sistema',
    'cajas': 'caja', 'líneas': 'línea', 'delays': 'delay'
};

/**
 * NLP #3: Normalizar palabra (stemming)
 */
function stemWord(word) {
    const wordLower = word.toLowerCase();

    // Verificar verbos conjugados
    if (VERB_STEMS[wordLower]) return VERB_STEMS[wordLower];

    // Verificar plurales
    if (PLURAL_STEMS[wordLower]) return PLURAL_STEMS[wordLower];

    // Reglas genéricas de plurales en español
    if (wordLower.endsWith('es') && wordLower.length > 3) {
        return wordLower.slice(0, -2); // cables → cable
    }
    if (wordLower.endsWith('s') && wordLower.length > 2 && !wordLower.endsWith('is')) {
        return wordLower.slice(0, -1); // cajas → caja
    }

    // Conjugaciones -ando/-iendo
    if (wordLower.endsWith('ando')) {
        return wordLower.slice(0, -4) + 'ar'; // calculando → calcular
    }
    if (wordLower.endsWith('iendo')) {
        return wordLower.slice(0, -5) + 'ir'; // sirviendo → servir
    }

    return word;
}

/**
 * NLP #4: N-GRAM MATCHING - Detectar frases completas (bigrams/trigrams)
 * Diccionario de frases importantes que deben matchearse como unidad
 */
const IMPORTANT_PHRASES = {
    // Bigrams (2 palabras)
    'line array': 'line_array_unit',
    'mejor para': 'optimization_for',
    'cómo calcular': 'how_to_calculate',
    'cuánto cuesta': 'pricing_query',
    'qué diferencia': 'comparison_query',
    'para festival': 'event_festival',
    'para teatro': 'event_teatro',
    'para corporativo': 'event_corporativo',

    // Trigrams (3 palabras)
    'line array para': 'line_array_recommendation',
    'mejor line array': 'best_line_array',
    'cómo calculo delay': 'delay_calculation',
    'cuál es mejor': 'recommendation_query',
    'qué me recomiendas': 'recommendation_query',
    'a cuántos metros': 'distance_query'
};

/**
 * NLP #4: Detectar y marcar n-grams importantes
 */
function detectNGrams(query) {
    let processed = query.toLowerCase();
    const detectedPhrases = [];

    // Detectar trigrams primero (más específicos)
    for (const [phrase, token] of Object.entries(IMPORTANT_PHRASES)) {
        if (phrase.split(' ').length === 3) {
            const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
            if (regex.test(processed)) {
                processed = processed.replace(regex, token);
                detectedPhrases.push({ phrase, token, type: 'trigram' });
            }
        }
    }

    // Luego detectar bigrams
    for (const [phrase, token] of Object.entries(IMPORTANT_PHRASES)) {
        if (phrase.split(' ').length === 2) {
            const regex = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'gi');
            if (regex.test(processed)) {
                processed = processed.replace(regex, token);
                detectedPhrases.push({ phrase, token, type: 'bigram' });
            }
        }
    }

    return { processed, detectedPhrases };
}

/**
 * Expande queries con sinónimos para mejor matching
 * MEJORADO v2.0: Integra spell correction + stemming + n-grams
 */
function expandQuery(query) {
    let expanded = query.toLowerCase();

    // NUEVO: NLP #4 - N-gram detection (PRIMERO, antes de modificar palabras)
    const ngramResult = detectNGrams(expanded);
    expanded = ngramResult.processed;

    // NUEVO: NLP #2 - Spell Correction en palabras clave
    const words = expanded.split(/\s+/);
    const correctedWords = words.map(word => correctSpelling(word));
    expanded = correctedWords.join(' ');

    // NUEVO: NLP #3 - Stemming/Lemmatization
    const stemmedWords = expanded.split(/\s+/).map(word => stemWord(word));
    expanded = stemmedWords.join(' ');

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
        patterns: [
            // Preguntas sobre conceptos
            'qué es', 'que es', 'explica', 'explicame', 'define', 'definición', 'concepto', 'término',
            // Términos técnicos originales
            'haas', 'power alley', 'array limit', 'grating lobe', 'wst', 'splay', 'ground bounce',
            // Glosario: Entorno y Atmósfera
            'temperatura', 'humedad', 'altitud', 'viento', 'ground effect', 'refracción',
            // Glosario: Acústica de Sala
            'rt60', 'sabine', 'eyring', 'room modes', 'critical distance', 'sti',
            // Glosario: Room EQ
            'room eq', 'hpf', 'q factor',
            // Glosario: PA Avanzado
            'array length', 'broken line source', 'coupling gain',
            // Glosario: Subwoofers
            'cardioid', 'endfire', 'end-fire',
            // Glosario: Calibración
            'target spl', 'foh distance', 'headroom', 'crest factor',
            // Glosario: Layout
            'proscenium', 'thrust', 'arena',
            // Glosario: Amplificación
            'amp topology', 'damping factor',
            // Glosario: Electricidad
            'power phase', 'voltage drop', 'breaker', 'cable gauge',
            // Glosario: Audio Digital
            'sample rate', 'bit depth',
            // Glosario: Rigging
            'safety margin', 'bridle',
            // Glosario: Crossover
            'crossover', 'linkwitz-riley', 'butterworth',
            // Glosario: Delay
            'required delay', 'slant distance',
            // Glosario: Acústica Avanzada
            'distance loss', 'atmospheric loss', 'coherence', 'haas effect', 'comb filtering',
            'direct field', 'reverberant field', 'line array transition'
        ],
        confidence: 0.9,
        priority: 8
    }
};

/**
 * Clasifica la intención del mensaje del usuario
 * MEJORADO v2.0: Fuzzy matching con umbral dinámico y scoring multi-señal
 */
function classifyIntent(message, entities) {
    const expandedMsg = expandQuery(message);
    const results = [];
    const MIN_CONFIDENCE_THRESHOLD = 0.5; // Umbral mínimo para considerar intent válido
    const LOW_CONFIDENCE_THRESHOLD = 0.7; // Umbral para marcar como "baja confianza"

    for (const [intentName, config] of Object.entries(INTENTS)) {
        let score = 0;
        let matchedPatterns = [];
        let signals = { patterns: 0, entities: 0, priority: 0, subIntent: 0 }; // Multi-señal

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

        // Score base: % de patterns matched (SEÑAL #1)
        const patternScore = (patternMatches.length / config.patterns.length) * config.confidence;
        score += patternScore;
        signals.patterns = patternScore;

        // Bonus: si tiene las entidades requeridas (SEÑAL #2)
        if (config.requiredEntities) {
            const hasRequired = config.requiredEntities.every(entity => {
                return entities[entity] && entities[entity].length > 0;
            });
            if (hasRequired) {
                score += 0.2;
                signals.entities = 0.2;
            } else {
                // Penalización REDUCIDA (antes -0.3, ahora -0.15) para ser más tolerante
                score -= 0.15;
                signals.entities = -0.15;
            }
        }

        // Bonus: prioridad del intent (SEÑAL #3)
        const priorityBonus = (config.priority / 100);
        score += priorityBonus;
        signals.priority = priorityBonus;

        // Sub-intents (para cálculos específicos) (SEÑAL #4)
        let subIntent = null;
        if (config.subIntents) {
            for (const [subName, subPatterns] of Object.entries(config.subIntents)) {
                if (subPatterns.some(p => {
                    if (!p || p.trim().length === 0) return false;
                    return new RegExp(`\\b${escapeRegex(p)}\\b`, 'i').test(expandedMsg);
                })) {
                    subIntent = subName;
                    score += 0.15;
                    signals.subIntent = 0.15;
                    break;
                }
            }
        }

        results.push({
            intent: intentName,
            subIntent: subIntent,
            confidence: Math.min(score, 1.0),
            matchedPatterns: matchedPatterns,
            signals: signals // Debug info
        });
    }

    // Ordenar por confidence
    results.sort((a, b) => b.confidence - a.confidence);

    const bestMatch = results[0] || { intent: 'unknown', confidence: 0, matchedPatterns: [] };

    // NUEVO: Verificar umbral mínimo
    if (bestMatch.confidence < MIN_CONFIDENCE_THRESHOLD) {
        return {
            intent: 'unknown',
            confidence: bestMatch.confidence,
            matchedPatterns: [],
            reason: 'below_threshold',
            alternatives: results.slice(0, 3) // Retornar top 3 para debugging
        };
    }

    // NUEVO: Marcar como baja confianza si está entre 0.5-0.7
    if (bestMatch.confidence >= MIN_CONFIDENCE_THRESHOLD && bestMatch.confidence < LOW_CONFIDENCE_THRESHOLD) {
        bestMatch.lowConfidence = true;
        bestMatch.alternatives = results.slice(1, 3); // Retornar alternativas
    }

    return bestMatch;
}

// ========================================
// 3. EXTRACCIÓN DE ENTIDADES AVANZADA (NER)
// ========================================

/**
 * Extrae entidades del mensaje (números + conceptos)
 * MEJORADO v2.0 NLP #5: Context-aware entity extraction
 * @param {string} message - Mensaje del usuario
 * @param {object} speakerDatabase - Base de datos de modelos
 * @param {object} previousContext - Contexto conversacional previo (opcional)
 */
function extractAdvancedEntities(message, speakerDatabase, previousContext = null) {
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
        validationErrors: [],

        // NUEVO: Metadata de contexto
        inferredFromContext: []     // Lista de entidades inferidas del contexto previo
    };

    // ===== NLP #5: INFERIR ENTIDADES DEL CONTEXTO PREVIO =====
    if (previousContext) {
        // Obtener entidades previas (soporta dos formatos)
        let prevEntities = null;

        // Formato 1: previousContext.entities (objeto directo)
        if (previousContext.entities) {
            prevEntities = previousContext.entities;
        }
        // Formato 2: previousContext.turns[] (ConversationContext)
        else if (previousContext.turns && previousContext.turns.length > 0) {
            const lastTurn = previousContext.turns[previousContext.turns.length - 1];
            if (lastTurn.analysis && lastTurn.analysis.entities) {
                prevEntities = lastTurn.analysis.entities;
            }
        }

        // Si hay entidades previas, inferir las que faltan
        if (prevEntities) {
            // Si el mensaje actual no menciona eventType pero el contexto previo sí
            if (!/(festival|teatro|corporativo|outdoor|indoor)/.test(msg) && prevEntities.eventType) {
                entities.eventType = prevEntities.eventType;
                entities.inferredFromContext.push('eventType');
            }

            // Si el mensaje actual no menciona distance pero el contexto previo sí
            if (!/\d+\s*(m|metro|meter)/.test(msg) && prevEntities.distance) {
                entities.distance = prevEntities.distance;
                entities.inferredFromContext.push('distance');
            }

            // Si el mensaje actual no menciona people pero el contexto previo sí
            if (!/\d+\s*(persona|gente|audiencia|public)/.test(msg) && prevEntities.people) {
                entities.people = prevEntities.people;
                entities.inferredFromContext.push('people');
            }

            // Inferir budget del contexto
            if (prevEntities.budget && !/(budget|presupuesto|costo|precio)/.test(msg)) {
                entities.budget = prevEntities.budget;
                entities.inferredFromContext.push('budget');
            }

            // Inferir venueType del contexto
            if (prevEntities.venueType && entities.eventType === null) {
                entities.venueType = prevEntities.venueType;
                entities.inferredFromContext.push('venueType');
            }
        }
    }

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
 * @param {string} message - Mensaje del usuario
 * @param {object} speakerDatabase - Base de datos de modelos
 * @param {object} previousContext - Contexto conversacional previo (OPCIONAL - para NLP #5)
 */
function analyzeMessage(message, speakerDatabase, previousContext = null) {
    // 1. Expandir con sinónimos
    const expandedMessage = expandQuery(message);

    // 2. Extraer entidades (FIX NLP #5: Pasar previousContext)
    let entities = extractAdvancedEntities(message, speakerDatabase, previousContext);

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
