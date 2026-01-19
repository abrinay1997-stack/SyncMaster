// ========================================
// RESPONSE GENERATOR ENHANCED - MOTOR DE RESPUESTAS INTEGRADO
// ========================================
// Fase 3: Integración completa con NLP, Context Manager, Knowledge Base y Glosario

/**
 * ENHANCED RESPONSE GENERATOR v3.0
 * 
 * This engine connects:
 * ✅ NLP Engine (analyzeMessage) → Intent + Entities
 * ✅ Context Manager (conversationContext) → User profile + conversation history
 * ✅ Knowledge Base (KNOWLEDGE_BASE) → Technical specs + recommendations
 * ✅ Glossary Knowledge (GLOSSARY) → Terminology + definitions
 * ✅ Response Generator (adaptative formatting) → Expertise-based output
 * 
 * FLOW: Input → NLP Analysis → Context Retrieval → Knowledge Assembly → 
 *       Entity Resolution → Response Generation → Adaptive Formatting
 */

// ========================================
// 1. ENTITY ENRICHMENT SYSTEM
// ========================================

/**
 * Enrich entities extracted by NLP with contextual information
 * Connects: NLP entities + Context history + Knowledge base
 */
function enrichEntitiesWithContext(nlpEntities, conversationContext) {
    const enriched = { ...nlpEntities };

    // 1a. Resolve speaker models with full specs from Knowledge Base
    if (enriched.speakerModels && enriched.speakerModels.length > 0) {
        enriched.speakerModels = enriched.speakerModels.map(sm => {
            const found = findSpeakerModel(sm.key || sm.name);
            if (found) {
                return {
                    ...sm,
                    specs: found, // Full specs from KB
                    recentlyMentioned: true
                };
            }
            return sm;
        });
    }

    // 1b. Resolve pronouns using context (el primero, ese, ambos, etc)
    if (enriched.pronounReference) {
        const resolved = conversationContext.resolveReference(enriched.pronounReference);
        enriched.pronounReference = {
            ...enriched.pronounReference,
            resolved: resolved
        };
    }

    // 1c. Enhance distance with calculated values (delay, SPL loss)
    if (enriched.distance) {
        const distance = parseInt(enriched.distance);
        const temperature = enriched.temperature || 20;
        const delayCalc = calculateDelay(distance, temperature);
        const splLoss = calculateSPLLoss(distance);
        
        enriched.distance = {
            value: distance,
            delayMs: delayCalc,
            splLoss: splLoss,
            requiresTowers: distance > 50
        };
    }

    // 1d. Enhance event type with recommended setups from KB
    if (enriched.eventType) {
        const setupRec = KNOWLEDGE_BASE.setupRecommendations?.[enriched.eventType];
        enriched.eventType = {
            value: enriched.eventType,
            recommendation: setupRec
        };
    }

    // 1e. Add active context entities (recent models, preferences)
    enriched.contextualInfo = {
        recentModels: conversationContext.getRecentModels(3),
        userExpertise: conversationContext.userProfile.expertise,
        userPreferences: conversationContext.userProfile.preferences,
        lastIntent: conversationContext.turns.length > 0 ? 
            conversationContext.turns[conversationContext.turns.length - 1].analysis.intent : null
    };

    return enriched;
}

// ========================================
// 2. KNOWLEDGE GRAPH TRAVERSAL
// ========================================

/**
 * Build and traverse knowledge graph to find relationships
 * Example: K2 → Comparable to → Panther, GSL8
 *          K2 → Best for → Festivals >100m
 *          K2 → Specs → Weight, SPL, Throw Distance
 */
function traverseKnowledgeGraph(primaryEntity, enrichedEntities) {
    const graph = {};

    if (enrichedEntities.speakerModels && enrichedEntities.speakerModels.length > 0) {
        const model = enrichedEntities.speakerModels[0];
        const modelSpecs = model.specs;

        // Node 1: Direct specs
        graph.directSpecs = {
            weight: modelSpecs.weight,
            spl: modelSpecs.spl,
            frequency: modelSpecs.frequency,
            throwDistance: modelSpecs.throwDistance,
            category: modelSpecs.category
        };

        // Node 2: Comparable models (similar specs)
        graph.comparableModels = findComparableModels(modelSpecs);

        // Node 3: Best use cases
        graph.useCases = findUseCases(modelSpecs);

        // Node 4: Recommended complements (subs, processing, etc)
        graph.complements = findComplement(modelSpecs);

        // Node 5: Related technical concepts (WST, grating lobes, etc)
        graph.technicalConcepts = findRelatedConcepts(modelSpecs);
    }

    // Similar for other entities (distance, eventType, etc)
    if (enrichedEntities.distance) {
        graph.distanceImplications = {
            requiresDelayTowers: enrichedEntities.distance.requiresTowers,
            delayCalculation: enrichedEntities.distance.delayMs,
            splCompensation: enrichedEntities.distance.splLoss,
            recommendedArrayType: enrichedEntities.distance.value > 80 ? 'line-array' : 'left-right'
        };
    }

    return graph;
}

// ========================================
// 3. CONTEXT-AWARE RESPONSE BUILDING
// ========================================

/**
 * Build response by combining knowledge graph + user context + expertise level
 * Uses: enriched entities + knowledge graph + user profile
 */
function buildContextAwareResponse(intent, enrichedEntities, knowledgeGraph, userExpertise) {
    let response = '';
    const expertise = userExpertise || 'intermedio';

    // Route 1: Specs Query
    if (intent.intent === 'specs_query' && enrichedEntities.speakerModels) {
        const model = enrichedEntities.speakerModels[0];
        response = formatSpecsResponse(model, expertise, enrichedEntities.contextualInfo);
    }

    // Route 2: Comparison Query
    else if (intent.intent === 'comparison' && enrichedEntities.speakerModels?.length >= 2) {
        response = formatComparisonResponse(
            enrichedEntities.speakerModels,
            expertise,
            knowledgeGraph.comparableModels
        );
    }

    // Route 3: Recommendation Query
    else if (intent.intent === 'recommendation') {
        response = formatRecommendationResponse(
            enrichedEntities,
            knowledgeGraph,
            expertise
        );
    }

    // Route 4: Calculation Query (delay, SPL, etc)
    else if (intent.intent === 'calculation') {
        response = formatCalculationResponse(
            enrichedEntities,
            knowledgeGraph.distanceImplications,
            expertise
        );
    }

    // Route 5: Setup Design
    else if (intent.intent === 'setup_design') {
        response = formatSetupResponse(
            enrichedEntities,
            knowledgeGraph,
            expertise
        );
    }

    // Route 6: Glossary/Technical Term
    else if (intent.intent === 'glossary_query') {
        response = formatGlossaryResponse(
            enrichedEntities,
            expertise
        );
    }

    // Route 7: Follow-up (contextual)
    else if (conversationContext.isFollowUpQuestion(enrichedEntities.originalMessage)) {
        response = formatFollowUpResponse(
            enrichedEntities,
            enrichedEntities.contextualInfo.lastIntent,
            expertise
        );
    }

    // Fallback
    else {
        response = formatFallbackResponse(intent, expertise);
    }

    return response;
}

// ========================================
// 4. ADAPTIVE FORMATTING BY EXPERTISE
// ========================================

/**
 * Format specs response based on user expertise level
 */
function formatSpecsResponse(model, expertise, context) {
    const specs = model.specs;
    let response = '';

    if (expertise === 'principiante') {
        response = `
📦 <strong>${model.name}</strong>

<strong>¿Qué es?</strong> ${GLOSSARY[model.category]?.simple}

<strong>Especificaciones Principales:</strong>
• <strong>Peso:</strong> ${specs.weight}kg
• <strong>Volumen (SPL):</strong> ${specs.spl}dB
• <strong>Rango:</strong> Hasta ${specs.throwDistance}m
• <strong>Uso ideal:</strong> ${specs.idealFor}

💡 ${specs.proTip}
        `;
    } else if (expertise === 'intermedio') {
        response = `
📦 <strong>${model.name}</strong> | <em>${model.category}</em>

<strong>Specs Técnicas:</strong>
• SPL: ${specs.spl}dB (@ 1m)
• Frequency: ${specs.frequency}Hz
• Throw distance: ${specs.throwDistance}m
• Weight: ${specs.weight}kg
• Connectors: ${specs.connectors}

<strong>Características:</strong>
${specs.features?.map(f => '• ' + f).join('\n')}

💡 <strong>Recomendación:</strong> ${specs.proTip}
        `;
    } else if (expertise === 'profesional') {
        response = `
<strong>${model.name}</strong> | ${model.category}

**Electroacoustic Specs:**
- SPL: ${specs.spl}dB @ 1m (2.83V)
- Freq Response: ${specs.frequency}Hz ±3dB
- Throw Distance: ${specs.throwDistance}m (Fraunhofer)
- Coverage: ${specs.coverage}° (H×V)
- Impedance: ${specs.impedance}Ω
- Weight: ${specs.weight}kg

**Physical:**
- Dimensions: ${specs.dimensions}
- Connectors: ${specs.connectors}
- Rigging Points: ${specs.rigPoints}

**Design Notes:** ${specs.technicalNotes}
        `;
    }

    return response;
}

/**
 * Format comparison response using knowledge graph
 */
function formatComparisonResponse(models, expertise, comparables) {
    let response = '<strong>⚖️ Comparación de Modelos</strong>\n\n';

    // Build comparison table
    response += '| Característica | ' + models.map(m => m.name).join(' | ') + ' |\n';
    response += '|---|' + models.map(() => '---|').join('') + '\n';

    // Weight
    response += '| Peso | ' + models.map(m => m.specs.weight + 'kg').join(' | ') + ' |\n';

    // SPL
    response += '| SPL | ' + models.map(m => m.specs.spl + 'dB').join(' | ') + ' |\n';

    // Throw
    response += '| Rango | ' + models.map(m => m.specs.throwDistance + 'm').join(' | ') + ' |\n';

    response += '\n💡 Recomendación: ';
    
    if (expertise === 'principiante') {
        response += 'El más ligero es ' + models.sort((a, b) => a.specs.weight - b.specs.weight)[0].name;
    } else if (expertise === 'profesional') {
        response += 'Basado en cobertura y rigging, recomendamos ' + models[0].name;
    }

    return response;
}

/**
 * Format calculation response (delay, SPL, etc)
 */
function formatCalculationResponse(enrichedEntities, distanceImplications, expertise) {
    if (!enrichedEntities.distance) return '';

    const distance = enrichedEntities.distance.value;
    const delayMs = enrichedEntities.distance.delayMs;
    const splLoss = enrichedEntities.distance.splLoss;
    const temperature = enrichedEntities.temperature || 20;

    let response = '🧮 <strong>Cálculos Técnicos</strong>\n\n';

    if (expertise === 'principiante') {
        response += `
<strong>Delay (Sincronización):</strong>
Para que el sonido de la torre llegue al mismo tiempo que el PA...
→ <strong>${delayMs.toFixed(1)}ms</strong> (a ${temperature}°C)

<strong>Pérdida de Volumen:</strong>
A ${distance}m, el volumen disminuye ${splLoss}dB
→ Necesitas subir el volumen de la torre
        `;
    } else if (expertise === 'profesional') {
        response += `
**Delay Calculation (Speed of Sound):**
Distance: ${distance}m | Temp: ${temperature}°C
v = 331.45 + (0.606 × T) m/s
delay = (distance / v) × 1000 = **${delayMs.toFixed(2)}ms**

**SPL Attenuation:**
ΔL = 20×log₁₀(r₁/r₂) = **${splLoss.toFixed(1)}dB**

**Delay Tower Strategy:**
${distanceImplications.requiresDelayTowers ? 'Required: Delay tower compensation' : 'No delay towers needed'}
        `;
    }

    return response;
}

// ========================================
// 5. MULTI-TURN CONTEXT INTEGRATION
// ========================================

/**
 * Format follow-up response using conversation context
 */
function formatFollowUpResponse(enrichedEntities, lastIntent, expertise) {
    let response = '';

    // "y el panther?" → Resuelve pronounce, busca en contexto
    if (enrichedEntities.pronounReference?.resolved) {
        const resolvedModel = enrichedEntities.pronounReference.resolved;
        response = `Perfecto, sobre ${resolvedModel.name}...\n`;
    }

    // "para 50m?" → Usa contexto previo (modelo) + nueva entidad (distancia)
    if (enrichedEntities.distance && lastIntent === 'specs_query') {
        response += `Con ${enrichedEntities.distance.value}m de distancia...\n`;
    }

    // "cuál es mejor?" → Compara modelos en contexto
    if (enrichedEntities.comparison && lastIntent === 'specs_query') {
        response += 'Comparando en tu contexto...\n';
    }

    return response;
}

// ========================================
// 6. UNIFIED RESPONSE GENERATION
// ========================================

/**
 * MAIN FUNCTION: Generate unified response from all components
 * 
 * This is the orchestrator that brings everything together:
 * Input → NLP → Enrichment → Knowledge Graph → Response Building → Formatting → Output
 */
function generateUnifiedResponse(userMessage, analysisResult, conversationContext) {
    try {
        // Step 1: Get NLP analysis
        const intent = analysisResult.intent;
        const nlpEntities = analysisResult.entities;

        // Step 2: Enrich entities with context and KB
        const enrichedEntities = enrichEntitiesWithContext(nlpEntities, conversationContext);

        // Step 3: Traverse knowledge graph
        const knowledgeGraph = traverseKnowledgeGraph(nlpEntities, enrichedEntities);

        // Step 4: Get user expertise level
        const userExpertise = conversationContext.userProfile.expertise;

        // Step 5: Build context-aware response
        let response = buildContextAwareResponse(
            intent,
            enrichedEntities,
            knowledgeGraph,
            userExpertise
        );

        // Step 6: Add quick actions based on context
        const quickActions = generateQuickActions(intent, enrichedEntities);
        if (quickActions.length > 0) {
            response += '\n\n<strong>Siguientes pasos:</strong>\n';
            quickActions.forEach(action => {
                response += `• ${action.emoji} ${action.text}\n`;
            });
        }

        // Step 7: Update conversation context
        conversationContext.addTurn(userMessage, response, analysisResult);

        return response;

    } catch (error) {
        console.error('Error in generateUnifiedResponse:', error);
        return getRandomVariant(RESPONSE_VARIANTS.unknown[conversationContext.userProfile.expertise]);
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

function calculateDelay(distanceM, tempC) {
    const speedOfSound = 331.45 + (0.606 * tempC);
    return (distanceM / speedOfSound) * 1000;
}

function calculateSPLLoss(distanceM) {
    return 20 * Math.log10(1 / distanceM);
}

function findSpeakerModel(modelKey) {
    if (typeof SPEAKER_DATABASE !== 'undefined' && SPEAKER_DATABASE) {
        return Object.values(SPEAKER_DATABASE).find(s => 
            s.name.toLowerCase() === modelKey.toLowerCase() ||
            s.aliases?.includes(modelKey.toLowerCase())
        );
    }
    return null;
}

function findComparableModels(specs) {
    // Logic to find similar models from KB
    return [];
}

function findUseCases(specs) {
    // Logic to extract best use cases from KB
    return [];
}

function findComplement(specs) {
    // Logic to find complementary equipment
    return [];
}

function findRelatedConcepts(specs) {
    // Logic to find related technical terms from glossary
    return [];
}

function generateQuickActions(intent, enrichedEntities) {
    const actions = [];
    
    if (intent.intent === 'specs_query' && enrichedEntities.speakerModels?.length > 0) {
        actions.push({ emoji: '⚖️', text: 'Comparar con otro modelo' });
        actions.push({ emoji: '📊', text: 'Ver setup recomendado' });
    }

    if (enrichedEntities.distance) {
        actions.push({ emoji: '🧮', text: 'Calcular delays exactos' });
    }

    return actions;
}

function getRandomVariant(variants) {
    if (!Array.isArray(variants)) return '';
    return variants[Math.floor(Math.random() * variants.length)];
}

// ========================================
// EXPORTS
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateUnifiedResponse,
        enrichEntitiesWithContext,
        traverseKnowledgeGraph,
        buildContextAwareResponse,
        formatSpecsResponse,
        formatComparisonResponse,
        formatCalculationResponse
    };
}