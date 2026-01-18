// ========================================
// RESPONSE GENERATOR - GENERADOR DE RESPUESTAS ADAPTATIVAS
// ========================================
// Fase 2: Respuestas variables, adaptativas por nivel, formateo inteligente

// ========================================
// 1. VARIANTES DE RESPUESTAS (ANTI-REPETICIÓN v2.0)
// ========================================
// Expandido de 3-4 variantes a 10-15 variantes por tipo

const RESPONSE_VARIANTS = {
    greeting: {
        principiante: [
            "👋 ¡Hola! Soy el asistente de LiveSync Pro. Puedo ayudarte a diseñar sistemas de sonido profesionales.",
            "👋 ¡Qué tal! Estoy aquí para ayudarte con LiveSync Pro. ¿En qué te puedo ayudar?",
            "👋 ¡Bienvenido! Soy tu asistente para diseño de PA Systems con LiveSync Pro.",
            "👋 ¡Hey! ¿Cómo estás? Te ayudo con todo lo relacionado a sistemas de audio profesional.",
            "👋 ¡Hola! Soy tu chatbot de LiveSync Pro. Cuéntame, ¿qué necesitas para tu evento?",
            "😊 ¡Bienvenido! Estoy para ayudarte a encontrar el equipo perfecto para tu proyecto.",
            "👋 ¡Qué gusto verte por aquí! ¿En qué puedo asistirte hoy?",
            "👋 ¡Hola! Puedo ayudarte a elegir speakers, calcular delays, diseñar setups... ¿Por dónde empezamos?",
            "😊 ¡Hey! Bienvenido al soporte de LiveSync Pro. ¿Qué sistema necesitas armar?",
            "👋 ¡Hola! Soy tu guía para diseño de PA Systems. Pregúntame lo que necesites."
        ],
        intermedio: [
            "👋 ¡Hola! Soy el asistente de LiveSync Pro. Puedo ayudarte con line arrays, delays, rigging y más.",
            "👋 ¡Qué tal! ¿Qué sistema necesitas diseñar hoy?",
            "👋 ¡Bienvenido! ¿En qué proyecto de audio estás trabajando?",
            "👋 ¡Hey! ¿Buscas specs de modelos, configuraciones de setup o cálculos técnicos?",
            "👋 ¡Hola! LiveSync Pro support. ¿PA design, coverage analysis o network planning?",
            "👋 ¿Qué tal? ¿Necesitas ayuda con dimensionamiento, comparativas o configuraciones?",
            "👋 ¡Hola! ¿En qué evento o instalación estás trabajando?",
            "👋 ¡Bienvenido! Cuéntame sobre tu proyecto y te ayudo a optimizarlo.",
            "👋 ¡Hey! ¿Festival, teatro o corporativo? Te ayudo con el diseño.",
            "👋 ¡Qué tal! ¿Qué line array, subs o delays necesitas calcular?"
        ],
        profesional: [
            "👋 ¡Hola! LiveSync Pro assistant. PA design, coverage calc, rigging analysis.",
            "👋 Hey! ¿Specs, cálculos o configuración?",
            "👋 ¡Qué tal! Sistema disponible para consultas técnicas.",
            "👋 LiveSync Pro support. SPL analysis, delay calc, network design available.",
            "👋 Ready. Specs query, system config, or technical calculations?",
            "👋 Pro support active. Line array sizing, throw distance, rigging load?",
            "👋 Hey! Array design, delay alignment, power distribution, Dante/AVB?",
            "👋 Technical assistant online. Coverage optimization, splay angles, or budget analysis?",
            "👋 LiveSync Pro ready. Touring setup, install design, or performance venue?",
            "👋 System engineer assistant. What do you need: modeling, specs, or calculations?"
        ]
    },

    thanks: {
        all: [
            "😊 ¡De nada! ¿Algo más en lo que pueda ayudarte?",
            "😊 ¡Un placer! Si necesitas más info, pregunta nomás.",
            "😊 ¡Para eso estoy! ¿Alguna otra duda?",
            "😊 ¡Encantado de ayudar! ¿Necesitas algo más?",
            "😊 ¡Con gusto! Si surge algo más, aquí estoy.",
            "😊 ¡No hay problema! ¿Te ayudo con algo más?",
            "🙂 ¡Feliz de asistir! Cualquier otra cosa, solo pregunta.",
            "😊 ¡Siempre a la orden! ¿Algo más que necesites saber?",
            "😊 ¡Es un gusto ayudarte! Si tienes más dudas, adelante.",
            "😊 ¡Para eso estamos! ¿Hay algo más que quieras consultar?",
            "🙂 ¡Sin problema! Si necesitas más ayuda, aquí sigo.",
            "😊 ¡Genial! ¿Hay algo más en lo que pueda echarte una mano?"
        ]
    },

    unknown: {
        principiante: [
            "🤔 No estoy seguro de entender tu pregunta. ¿Podrías reformularla?",
            "🤔 Hmm, no logro entender qué necesitas. ¿Puedes darme más detalles?",
            "🤔 Creo que no entendí bien. ¿Me lo explicas de otra forma?",
            "💭 No entendí completamente. ¿Me ayudas con un poco más de información?",
            "🤔 Esa pregunta me dejó pensando... ¿Podrías ser más específico?",
            "❓ No logré captar qué necesitas. ¿Estás buscando info sobre modelos, configuraciones o precios?",
            "🤔 Mmm, no estoy seguro. ¿Buscas specs de equipos, setups de eventos, o cálculos técnicos?",
            "💭 No entendí del todo. Intenta preguntarme sobre line arrays (K1, K2, Panther) o configuraciones (festival, teatro).",
            "🤔 No capté bien la pregunta. ¿Quieres saber sobre especificaciones, precios o diseño de sistemas?",
            "❓ Hmm, necesito más contexto. ¿Me cuentas un poco más sobre qué necesitas?",
            "🤔 Esa pregunta está un poco fuera de mi alcance. ¿Podrías reformularla?",
            "💭 No logré entender. ¿Buscas ayuda con equipos específicos o configuraciones generales?"
        ],
        intermedio: [
            "🤔 No identifiqué tu consulta. ¿Podrías ser más específico?",
            "🤔 No entendí completamente. ¿Buscas specs, setup o cálculos?",
            "🤔 No reconocí el patrón. Prueba con algo como 'specs del K2' o 'setup festival'.",
            "💭 Query no clara. ¿Necesitas: specs de modelos, configuración de eventos, o cálculos (delay/Dante)?",
            "🤔 No detecté el intent. Intenta: 'recomienda PA para 3000 personas' o 'compara K2 vs Panther'.",
            "❓ Consulta ambigua. ¿Buscas dimensionamiento de sistema, comparativas de modelos, o info de precios?",
            "🤔 No entendí. Ejemplos válidos: 'K2 specs', 'setup teatro 500 personas', 'delay 60m'.",
            "💭 Pattern no reconocido. ¿Estás buscando recomendaciones, specs técnicas o configuraciones?",
            "🤔 No capté la intención. ¿Necesitas ayuda con line arrays, subs, monitores o delays?",
            "❓ Consulta poco clara. Reformula especificando modelo, evento o tipo de cálculo.",
            "🤔 No logré identificar qué necesitas. ¿Podrías ser más específico con el modelo o tipo de evento?",
            "💭 Query fuera de scope. Intenta preguntas sobre PA systems, configuraciones o análisis técnico."
        ],
        profesional: [
            "🤔 Query no reconocido. Intents disponibles: specs, recommendation, comparison, calculation, setup.",
            "🤔 Pattern no detectado. Reformula con términos técnicos específicos.",
            "🤔 Sin match. Ej: 'K2 specs', 'delay calc 50m 20°C', 'festival setup 3k people'.",
            "❓ Intent unclear. Valid queries: model specs, system config, SPL calc, rigging analysis.",
            "🤔 NER failed. Specify: speaker model (K1/K2/Panther), venue type, distance, or calculation type.",
            "💭 No pattern match. Examples: 'K2 vs GSL8 weight', '80m throw line array recommendation', 'Dante 96ch bandwidth'.",
            "🤔 Query out of scope. Supported: PA design, coverage analysis, delay calc, power/rigging, network planning.",
            "❓ Ambiguous request. Clarify: event type (festival/theater/corporate), distance, audience size, or technical spec.",
            "🤔 No entity extraction. Try structured queries: '[Model] specs', '[Distance]m delay @ [Temp]°C', '[Channels]ch Dante'.",
            "💭 Intent classification failed. Use domain terms: line array, SPL, throw distance, splay angle, etc.",
            "🤔 Pattern recognition error. Reformulate with specific model names or technical parameters.",
            "❓ Query syntax invalid. Format: '[Action] [Subject] [Details]'. E.g., 'calculate delay 75m 22°C'."
        ]
    },

    confirmation: {
        all: [
            "✅ ¡Perfecto! Déjame ayudarte con eso.",
            "👍 ¡Entendido! Aquí está la información que necesitas.",
            "✓ ¡Listo! Esto es lo que encontré.",
            "✅ ¡Claro! Te muestro los detalles.",
            "👍 ¡Entendido! Aquí va la info.",
            "✅ ¡Excelente pregunta! Te explico.",
            "👍 ¡Ok! Déjame darte los datos.",
            "✅ ¡Muy bien! Esto te puede servir.",
            "👍 ¡Entendido! Mira esta información.",
            "✅ ¡Perfecto! Aquí tienes lo que buscas."
        ]
    },

    clarification: {
        all: [
            "🎯 Para darte la mejor recomendación, necesito saber:",
            "💭 Antes de responder, ayúdame con unos detalles:",
            "🤔 Para ser más preciso, ¿me puedes decir:",
            "🎯 Déjame hacerte un par de preguntas rápidas:",
            "💭 Para optimizar la respuesta, necesito saber:",
            "🤔 Unos datos más y te doy la recomendación perfecta:",
            "🎯 Para dimensionar correctamente, dime:",
            "💭 Vamos a afinar la búsqueda. ¿Podrías confirmar:",
            "🤔 Para calcular con precisión, necesito:",
            "🎯 Ayúdame con estos datos para darte la mejor opción:"
        ]
    }
};

/**
 * Selecciona una variante aleatoria
 */
function getRandomVariant(variants) {
    return variants[Math.floor(Math.random() * variants.length)];
}

/**
 * Obtiene una respuesta adaptada al nivel del usuario
 */
function getAdaptiveResponse(responseType, expertise = 'intermedio') {
    const variants = RESPONSE_VARIANTS[responseType];
    if (!variants) return null;

    // Si hay variantes por expertise
    if (variants[expertise]) {
        return getRandomVariant(variants[expertise]);
    }

    // Si hay variantes generales
    if (variants.all) {
        return getRandomVariant(variants.all);
    }

    return null;
}

// ========================================
// 2. COMPARADOR DE MODELOS CONTEXTUAL
// ========================================

/**
 * Compara modelos mencionados en el contexto
 * IMPORTANTE 6 CORREGIDO: Validar inputs
 */
function compareModelsInContext(models, property = null, expertise = 'intermedio') {
    // IMPORTANTE 6: Validación estricta de modelos
    if (!models || !Array.isArray(models) || models.length < 2) {
        return "❓ Necesito al menos 2 modelos para comparar. Menciona los modelos primero (ej: 'K2 y Panther').";
    }

    // Validar estructura de modelos
    if (!models[0]?.model || !models[1]?.model) {
        console.error('Modelos inválidos en comparación:', models);
        return "❌ Error: modelos en contexto no válidos. Intenta preguntar de nuevo sobre modelos específicos.";
    }

    // Validar expertise
    const validExpertise = ['principiante', 'intermedio', 'profesional'];
    const safeExpertise = validExpertise.includes(expertise) ? expertise : 'intermedio';

    const model1 = models[0].model;
    const model2 = models[1].model;

    // Si no especifican propiedad, comparación general
    if (!property) {
        return generateGeneralComparison(model1, model2, safeExpertise);
    }

    // Comparación por propiedad específica
    if (/(ligero|liviano|peso)/i.test(property)) {
        const lighter = model1.weight < model2.weight ? model1 : model2;
        const heavier = model1.weight < model2.weight ? model2 : model1;

        if (safeExpertise === 'principiante') {
            return `⚖️ <strong>${lighter.brand} ${lighter.name}</strong> es más ligero (${lighter.weight}kg) que <strong>${heavier.brand} ${heavier.name}</strong> (${heavier.weight}kg).\n\n💡 Un speaker más ligero es más fácil de transportar y colgar.`;
        } else {
            return `⚖️ <strong>Peso:</strong>\n• ${lighter.brand} ${lighter.name}: ${lighter.weight}kg (${Math.round((heavier.weight - lighter.weight) / lighter.weight * 100)}% más ligero)\n• ${heavier.brand} ${heavier.name}: ${heavier.weight}kg`;
        }
    }

    if (/(potente|fuerte|spl|volumen)/i.test(property)) {
        const louder = model1.spl > model2.spl ? model1 : model2;
        const quieter = model1.spl > model2.spl ? model2 : model1;

        if (safeExpertise === 'principiante') {
            return `🔊 <strong>${louder.brand} ${louder.name}</strong> es más potente (${louder.spl}dB) que <strong>${quieter.brand} ${quieter.name}</strong> (${quieter.spl}dB).\n\n💡 Más SPL significa que puede llegar más lejos o sonar más fuerte.`;
        } else {
            return `🔊 <strong>SPL Máximo:</strong>\n• ${louder.brand} ${louder.name}: ${louder.spl}dB (+${louder.spl - quieter.spl}dB)\n• ${quieter.brand} ${quieter.name}: ${quieter.spl}dB\n\n📏 Diferencia: ~${Math.round((louder.spl - quieter.spl) * 3.3)}m de alcance extra aproximadamente.`;
        }
    }

    // Default: comparación general
    return generateGeneralComparison(model1, model2, safeExpertise);
}

/**
 * Genera comparación general entre dos modelos
 */
function generateGeneralComparison(model1, model2, expertise) {
    if (expertise === 'principiante') {
        return `⚖️ <strong>Comparación Simple</strong>\n\n<strong>${model1.brand} ${model1.name}:</strong>\n• Potencia: ${model1.spl}dB\n• Peso: ${model1.weight}kg\n• Tipo: ${model1.category}\n\n<strong>${model2.brand} ${model2.name}:</strong>\n• Potencia: ${model2.spl}dB\n• Peso: ${model2.weight}kg\n• Tipo: ${model2.category}\n\n💡 El ${model1.spl > model2.spl ? model1.name : model2.name} es más potente, y el ${model1.weight < model2.weight ? model1.name : model2.name} es más ligero.`;
    } else if (expertise === 'profesional') {
        const splDiff = Math.abs(model1.spl - model2.spl);
        const weightDiff = Math.abs(model1.weight - model2.weight);
        const powerToWeight1 = (model1.spl / model1.weight).toFixed(2);
        const powerToWeight2 = (model2.spl / model2.weight).toFixed(2);

        return `⚖️ <strong>Comparative Analysis</strong>\n\n| Spec | ${model1.name} | ${model2.name} | Δ |\n|------|---------|---------|-----|\n| SPL | ${model1.spl}dB | ${model2.spl}dB | ${splDiff}dB |\n| Weight | ${model1.weight}kg | ${model2.weight}kg | ${weightDiff}kg |\n| Dispersion | ${model1.dispersion}° | ${model2.dispersion}° | ${Math.abs(model1.dispersion - model2.dispersion)}° |\n| Power/Weight | ${powerToWeight1} | ${powerToWeight2} | - |\n| Category | ${model1.category} | ${model2.category} | - |\n\n📊 Ratio SPL/Weight: ${powerToWeight1 > powerToWeight2 ? model1.name : model2.name} es más eficiente.`;
    } else {
        // Intermedio
        return `⚖️ <strong>Comparación ${model1.name} vs ${model2.name}</strong>\n\n<strong>SPL:</strong> ${model1.spl}dB vs ${model2.spl}dB (${model1.spl > model2.spl ? model1.name + ' +' + (model1.spl - model2.spl) : model2.name + ' +' + (model2.spl - model1.spl)}dB)\n<strong>Peso:</strong> ${model1.weight}kg vs ${model2.weight}kg (${model1.weight < model2.weight ? model1.name + ' más ligero' : model2.name + ' más ligero'})\n<strong>Dispersión:</strong> ${model1.dispersion}° vs ${model2.dispersion}°\n<strong>Categoría:</strong> ${model1.category} vs ${model2.category}\n\n💡 ${model1.spl > model2.spl ? model1.name + ' es mejor para largo alcance' : model2.name + ' es mejor para largo alcance'}, ${model1.weight < model2.weight ? model1.name + ' es más fácil de rigging' : model2.name + ' es más fácil de rigging'}.`;
    }
}

// ========================================
// 3. EXPLICACIONES TÉCNICAS ADAPTATIVAS
// ========================================

const TECHNICAL_EXPLANATIONS = {
    'grating-lobes': {
        principiante: `🌊 <strong>Grating Lobes (Lóbulos de Rejilla)</strong>

Son como "fantasmas" de sonido que aparecen cuando las cajas de un line array están muy separadas.

<strong>¿Por qué es malo?</strong>
El sonido principal va hacia adelante, pero estos "fantasmas" se escapan hacia arriba o a los lados. Pierdes energía y el sonido no es parejo.

<strong>¿Cómo evitarlo?</strong>
• Mantén los ángulos entre cajas pequeños (cerrados)
• No abras mucho el array en la parte superior
• LiveSync te avisa automáticamente si puede pasar esto

💡 <strong>Analogía:</strong> Es como un tubo con agujeros: el agua se escapa por los huecos en lugar de llegar al final.`,

        intermedio: `🌊 <strong>Grating Lobes</strong>

Los grating lobes son lóbulos secundarios de radiación que aparecen cuando el espaciado entre elementos de un line array es demasiado grande respecto a la longitud de onda.

<strong>¿Cuándo aparecen?</strong>
Cuando la distancia entre drivers (d) es mayor a λ/2 para la frecuencia más alta del sistema.

<strong>Consecuencias:</strong>
• Pérdida de energía en el eje principal
• Cobertura irregular
• Cancelaciones en ciertas zonas

<strong>Solución:</strong>
• Splay angles <10° en la parte superior del array
• Mantener coherencia de fase entre cajas
• LiveSync calcula automáticamente los ángulos óptimos

💡 En frecuencias altas (>4kHz), el spacing crítico es ~4-5cm, por eso los line arrays tienen drivers muy juntos.`,

        profesional: `🌊 <strong>Grating Lobes - Análisis Técnico</strong>

Condición de aparición: d × sin(θ) ≥ λ/2

Donde:
• d = distancia entre centros acústicos
• θ = ángulo de splay
• λ = longitud de onda (λ = c/f)

<strong>Frecuencia crítica:</strong>
f_grating = c / (2 × d × sin(θ))

<strong>Ejemplo práctico:</strong>
Line array con d = 0.2m, splay θ = 5°:
f_grating = 343 / (2 × 0.2 × 0.087) = 9.85 kHz

<strong>Mitigación:</strong>
1. Waveguide spacing: WST (d < λ/2 @ f_max)
2. Progressive splay: ángulos menores arriba
3. Driver density: múltiples fuentes HF

<strong>Trade-off:</strong>
• Splay pequeño = sin grating lobes, pero peor cobertura vertical
• Splay grande = mejor cobertura, pero riesgo de lobing

📊 LiveSync implementa algoritmo de optimización multi-objetivo para balancear cobertura vs coherencia.`
    },

    'haas-effect': {
        principiante: `🎯 <strong>Efecto Haas (Precedencia)</strong>

Tu cerebro siempre cree que el sonido viene del altavoz que escuchaste PRIMERO, aunque el segundo suene más fuerte.

<strong>¿Cómo funciona?</strong>
Si dos altavoces tocan lo mismo, el que llegue primero (aunque sea solo 5 milisegundos antes) es el que tu cerebro identifica como la fuente.

<strong>¿Para qué sirve?</strong>
• Delay towers: Agregar delay para que parezca que viene del PA principal
• Fills: El público siente que el sonido viene del escenario, no de los altavoces cerca

💡 <strong>Ejemplo:</strong> En un concierto, aunque haya torres de delay más cerca de ti, si tienen el delay correcto, sentirás que el sonido viene del escenario.`,

        intermedio: `🎯 <strong>Efecto Haas (Precedencia Temporal)</strong>

El efecto de precedencia establece que cuando dos sonidos idénticos llegan con <40ms de diferencia, el cerebro localiza la fuente en el primero, incluso si el segundo es hasta 10dB más fuerte.

<strong>Ventana temporal:</strong>
• 0-1ms: Fusión (percibido como una sola fuente)
• 1-30ms: Precedencia (localización al primero, timbre del segundo)
• 30-40ms: Zona de transición
• >40ms: Eco (percibidos como eventos separados)

<strong>Aplicaciones prácticas:</strong>
• Delay towers: delay = (distancia_PA_torre / velocidad_sonido) × 1000
• Front fills: delay para que localicen al escenario
• Cálculo crítico con temperatura del venue

💡 LiveSync calcula automáticamente el delay óptimo considerando temperatura y geometría.`,

        profesional: `🎯 <strong>Haas Effect - Precedence Localization</strong>

<strong>Ley de Haas-Helmholtz:</strong>
Δt < 40ms → Localización a primera arrival (hasta +10dB en segunda fuente)

<strong>Zonas temporales:</strong>
| Δt | Percepción | Application |
|----|-----------|-------------|
| 0-1ms | Suma coherente | Array coupling |
| 1-5ms | Suma energética | Fill delay |
| 5-30ms | Precedencia total | Delay towers |
| 30-40ms | Zona de transición | Evitar |
| >40ms | Eco discreto | FX delays |

<strong>Cálculo óptimo delay tower:</strong>
t_delay = (d_PA-FOH + d_FOH-tower) / v_sound - t_flight_PA
Donde v_sound = 331.3 + 0.606×T_celsius

<strong>Consideraciones críticas:</strong>
• Temperatura: 10°C → 30°C = 3.5% Δv (crítico en outdoor)
• SPL shading: Torre más cercana al PA = -3 a -6dB
• Wind gradient: Corrige Δt si viento >15 km/h
• Arrival time variance: ±2ms aceptable, ±5ms problemático

<strong>Gain shading recomendado:</strong>
L_tower = L_PA - 20×log10(d_PA-tower / d_PA-FOH) - 3dB

📊 LiveSync Pro incluye compensación automática por gradiente de temperatura (outdoor multi-hour shows).`
    }
};

/**
 * Obtiene explicación técnica adaptada
 */
function getTechnicalExplanation(concept, expertise = 'intermedio') {
    const explanations = TECHNICAL_EXPLANATIONS[concept];
    if (!explanations) return null;

    return explanations[expertise] || explanations.intermedio;
}

// ========================================
// 4. FORMATEADOR INTELIGENTE
// ========================================

/**
 * Formatea respuesta con longitud adaptativa
 */
function formatResponse(content, expertise = 'intermedio', includeQuickActions = true) {
    let formatted = content;

    // Principiantes: agregar más emojis y explicaciones
    if (expertise === 'principiante') {
        // Ya está formateado en el contenido
    }

    // Profesionales: más compacto, menos emojis
    if (expertise === 'profesional') {
        // Reducir emojis decorativos (mantener iconos técnicos)
        formatted = formatted.replace(/💡/g, '→');
        formatted = formatted.replace(/✅/g, '•');
    }

    return formatted;
}

/**
 * Genera botones de acción rápida contextuales
 */
function generateQuickActions(intent, entities) {
    const actions = [];

    // Después de specs, ofrecer comparación
    if (intent === 'specs_query' && entities.speakerModels?.length > 0) {
        actions.push({ text: '⚖️ Comparar modelos', action: 'compara con otros' });
        actions.push({ text: '📊 Ver setup', action: 'setup con este modelo' });
    }

    // Después de setup, ofrecer cálculos
    if (intent === 'setup_design') {
        if (entities.distance) {
            actions.push({ text: '🧮 Calcular delays', action: `delay ${entities.distance}m 20°C` });
        }
        actions.push({ text: '💰 Ver precios', action: '¿Cuánto cuesta?' });
    }

    // Después de precio, ofrecer features
    if (intent === 'pricing') {
        actions.push({ text: '📤 ¿Cómo exporto?', action: '¿Cómo exportar?' });
        actions.push({ text: '💻 ¿Funciona offline?', action: '¿Funciona sin internet?' });
    }

    return actions;
}

// ========================================
// EXPORTS
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getRandomVariant,
        getAdaptiveResponse,
        compareModelsInContext,
        getTechnicalExplanation,
        formatResponse,
        generateQuickActions,
        RESPONSE_VARIANTS,
        TECHNICAL_EXPLANATIONS
    };
}
