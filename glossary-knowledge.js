// ========================================
// GLOSARIO COMPLETO DE LIVESYNC PRO
// ========================================
// Base de conocimiento técnico para consultas del chatbot

const LIVESYNC_GLOSSARY = {
    // ========================================
    // ENTORNO Y ATMÓSFERA
    // ========================================
    'temperatura': {
        category: 'Entorno y Atmósfera',
        short: 'Temperatura del aire ambiente en °C',
        full: 'Temperatura del aire ambiente. Afecta la velocidad del sonido (343 m/s a 20°C). Cada 1°C de aumento acelera el sonido ~0.6 m/s. Crítico para cálculos de delay y refracción.',
        formula: 'v = 331.4 + 0.6 × T (m/s)',
        relatedTerms: ['velocidad del sonido', 'refracción', 'temperatura showtime'],
        icon: '🌡️'
    },

    'temperatura showtime': {
        category: 'Entorno y Atmósfera',
        short: 'Temperatura esperada durante el evento',
        full: 'Temperatura esperada durante el evento. Si difiere de la temperatura de setup, LiveSync calcula refracción térmica (curvatura del sonido). El aire caliente encima del frío curva el sonido HACIA ARRIBA. El aire frío encima del caliente curva el sonido HACIA ABAJO.',
        relatedTerms: ['refracción', 'temperatura', 'gradiente térmico'],
        icon: '🌡️'
    },

    'humedad relativa': {
        category: 'Entorno y Atmósfera',
        short: 'Porcentaje de humedad del aire (0-100%)',
        full: 'Porcentaje de humedad del aire (0-100%). La humedad ABSORBE alta frecuencia. A 50% HR y 20m de distancia, 8kHz pierde ~1dB más que a 10% HR. En espacios secos (< 30%), los agudos "viajan más lejos". En espacios húmedos (> 70%), se atenúan rápidamente.',
        ranges: {
            'Seco (< 30%)': 'Agudos viajan más lejos',
            'Normal (30-70%)': 'Absorción moderada',
            'Húmedo (> 70%)': 'Agudos se atenúan rápidamente'
        },
        relatedTerms: ['absorción atmosférica', 'pérdida de HF'],
        icon: '💧'
    },

    'altitud': {
        category: 'Entorno y Atmósfera',
        short: 'Metros sobre el nivel del mar',
        full: 'Metros sobre el nivel del mar. Reduce la presión atmosférica. LiveSync ajusta automáticamente la velocidad del sonido y absorción. A 2000m de altitud, se pierde ~15% más de HF que al nivel del mar.',
        impact: 'A 2000m: +15% pérdida de HF',
        relatedTerms: ['presión atmosférica', 'absorción atmosférica'],
        icon: '🏔️'
    },

    'velocidad del viento': {
        category: 'Entorno y Atmósfera',
        short: 'Velocidad del viento en m/s',
        full: 'Velocidad del viento en metros por segundo. Afecta CRÍTICAMENTE la propagación del sonido.',
        ranges: {
            '0-3 m/s': 'Sin impacto',
            '3-5.5 m/s': 'Refracción leve',
            '5.5-10 m/s': 'Refracción significativa, coherencia degradada',
            '> 10 m/s': 'PELIGRO ESTRUCTURAL (vientos > 36 km/h)',
            '> 15 m/s': 'CRÍTICO - Bajar PA inmediatamente (54 km/h)'
        },
        relatedTerms: ['refracción', 'coherencia', 'dirección del viento'],
        icon: '💨'
    },

    'dirección del viento': {
        category: 'Entorno y Atmósfera',
        short: 'Ángulo del viento en grados (0-360°)',
        full: 'Ángulo en grados (0-360°). Determina el tipo de refracción.',
        directions: {
            '0° (Norte)': 'Viento de frente (desde escenario hacia público)',
            '180° (Sur)': 'Viento de cola (desde público hacia escenario) - PELIGROSO',
            '90°/270°': 'Viento cruzado - Afecta coherencia stereo',
            'Headwind (135-225°)': 'Curva sonido HACIA ARRIBA (peor caso)',
            'Tailwind (315-45°)': 'Curva sonido HACIA ABAJO',
            'Crosswind (45-135° o 225-315°)': 'Desalinea fase en HF'
        },
        relatedTerms: ['refracción', 'velocidad del viento'],
        icon: '🧭'
    },

    'ground effect': {
        category: 'Entorno y Atmósfera',
        short: 'Comb filtering por reflexión del suelo',
        full: 'Comb filtering causado por la interferencia entre el sonido directo y el reflejado en el suelo. Crea notches (caídas) en frecuencias específicas.',
        formula: 'Frecuencia del primer notch = c / (2 × diferencia de camino)',
        example: 'PA a 5m, público a 1.7m, distancia 20m → Primer notch ~150Hz',
        types: {
            'grass': 'Césped (R=0.5) - Absorbe graves, reflexión moderada',
            'concrete': 'Concreto (R=0.9) - Altamente reflectivo, comb filtering fuerte',
            'sand': 'Arena (R=0.2) - Muy absorbente',
            'asphalt': 'Asfalto (R=0.85) - Similar a concreto',
            'crowd': 'Multitud de pie (R=0.3) - Absorbe más que césped'
        },
        relatedTerms: ['comb filtering', 'tipo de suelo', 'reflexión'],
        icon: '🌱'
    },

    // ========================================
    // CONTROL DE OCUPACIÓN Y PÚBLICO
    // ========================================
    'expected attendees': {
        category: 'Control de Ocupación',
        short: 'Número estimado de personas en el evento',
        full: 'Número estimado de personas en el evento. LiveSync calcula capacidad acústica basada en cobertura SPL efectiva y capacidad por salidas de emergencia (~250 personas/salida).',
        densities: {
            'Outdoor standing': '2.2 personas/m²',
            'Indoor standing': '2.0 personas/m²',
            'Theater seating': '1.2 personas/m²',
            'Corporate tables': '0.9 personas/m²'
        },
        relatedTerms: ['venue occupancy', 'densidad', 'capacidad'],
        icon: '👥'
    },

    'venue occupancy': {
        category: 'Control de Ocupación',
        short: 'Porcentaje de llenura del venue (0-100%)',
        full: 'Porcentaje de llenura del venue (0-100%). Afecta temperatura (+0.05°C por cada 1%), humedad (+0.1% por cada 1%), y absorción de multitud. Las personas absorben sonido, especialmente HF. Absorción @ 4kHz: ~0.5 dB/100m adicional con multitud densa.',
        impact: {
            'Temperatura': '+0.05°C por cada 1% ocupación (calor corporal)',
            'Humedad': '+0.1% por cada 1% ocupación (respiración, sudor)',
            'Absorción HF': '~0.5 dB/100m @ 4kHz con multitud densa'
        },
        relatedTerms: ['expected attendees', 'absorción', 'temperatura'],
        icon: '📊'
    },

    // ========================================
    // ACÚSTICA DE SALA (RT60)
    // ========================================
    'rt60': {
        category: 'Acústica de Sala',
        short: 'Tiempo de reverberación en segundos',
        full: 'Tiempo en SEGUNDOS que tarda el sonido en decaer 60 dB después de que la fuente se detiene. Es la métrica MÁS IMPORTANTE de acústica de salas.',
        classification: {
            '< 0.2s': 'Sala "Muerta" (Anecoica) - Sin vida, grabación',
            '0.3-0.5s': 'IDEAL - Control acústico óptimo',
            '0.6-0.8s': 'Aceptable (Viva) - Sala con energía',
            '0.9-1.4s': 'Problemática - Inteligibilidad degradada',
            '1.5-2.5s': 'Muy Problemática - Requiere EQ extrema',
            '> 3.0s': 'Catedral / Ininteligible - Tratamiento urgente'
        },
        measureMethods: [
            'SMAART/REW: Impulse Response → Leer RT60 @ 1kHz',
            'Globo ISO 3382: Explotar globo de 30cm a 2-3m altura → Medir decaimiento -60dB',
            'Clap/Pistola: Aplauso fuerte → Analizar tiempo de caída',
            'Posición: Medir desde FOH para mejores resultados'
        ],
        relatedTerms: ['sabine formula', 'eyring formula', 'reverberación'],
        icon: '🔊'
    },

    'sabine formula': {
        category: 'Acústica de Sala',
        short: 'Cálculo teórico de RT60 (baja absorción)',
        full: 'Cálculo teórico de RT60 para salas con baja absorción (α < 0.3).',
        formula: 'RT60 = 0.161 × V / (S × α)',
        params: {
            'V': 'Volumen (m³)',
            'S': 'Superficie total (m²)',
            'α': 'Coeficiente de absorción promedio'
        },
        relatedTerms: ['rt60', 'eyring formula', 'absorción'],
        icon: '📐'
    },

    'eyring formula': {
        category: 'Acústica de Sala',
        short: 'Cálculo teórico de RT60 (alta absorción)',
        full: 'Cálculo teórico de RT60 para salas con alta absorción (α > 0.3). Más precisa que Sabine para salas tratadas acústicamente.',
        formula: 'RT60 = 0.161 × V / (-S × ln(1 - α))',
        relatedTerms: ['rt60', 'sabine formula', 'absorción'],
        icon: '📐'
    },

    'room modes': {
        category: 'Acústica de Sala',
        short: 'Frecuencias de resonancia natural de una sala',
        full: 'Frecuencias de resonancia natural de una sala, determinadas SOLO por geometría (L, W, H). Causan picos/caídas en respuesta de frecuencia.',
        formula: 'f = (c/2) × √((nx/L)² + (ny/W)² + (nz/H)²)',
        types: {
            'Axial (1,0,0)': 'Entre 2 paredes paralelas - MÁS FUERTES',
            'Tangential (1,1,0)': 'Entre 4 superficies - Moderados',
            'Oblique (1,1,1)': 'Entre 6 superficies - Más débiles'
        },
        dangerLevel: 'LiveSync asigna nivel de peligro (1-10) basado en frecuencia (20-200Hz más problemáticos), tipo de modo y Q del modo',
        relatedTerms: ['rt60', 'room eq correction', 'resonancia'],
        icon: '📊'
    },

    'critical distance': {
        category: 'Acústica de Sala',
        short: 'Distancia donde sonido directo = reverberante',
        full: 'Distancia desde la fuente donde el sonido directo = sonido reverberante.',
        formula: 'Dc = 0.057 × √(Q × V / RT60)',
        params: {
            'Q': 'Directividad del PA',
            'V': 'Volumen de sala (m³)',
            'RT60': 'Tiempo de reverberación'
        },
        interpretation: {
            'Antes de Dc': 'Campo directo - Buena inteligibilidad',
            'Después de Dc': 'Campo reverberante - Inteligibilidad pobre',
            'Público > Dc': '→ NECESITAS DELAY TOWERS'
        },
        relatedTerms: ['rt60', 'direct field', 'reverberant field', 'delay towers'],
        icon: '📏'
    },

    'sti': {
        category: 'Acústica de Sala',
        short: 'Speech Transmission Index (0 a 1)',
        full: 'Métrica de inteligibilidad del habla (0 a 1). LiveSync calcula STI basado en RT60 y SNR (Signal-to-Noise Ratio).',
        scale: {
            '0.00-0.30': 'Mala - Ininteligible',
            '0.30-0.45': 'Pobre - Solo palabras ocasionales',
            '0.45-0.60': 'Aceptable - Comprensible con esfuerzo',
            '0.60-0.75': 'Buena - Fácilmente comprensible',
            '0.75-1.00': 'Excelente - Perfecta claridad'
        },
        relatedTerms: ['rt60', 'inteligibilidad', 'snr'],
        icon: '🎤'
    },

    // ========================================
    // ROOM EQ CORRECTION
    // ========================================
    'room eq correction': {
        category: 'Room EQ',
        short: 'Curva de EQ correctiva automática',
        full: 'Curva de ecualización correctiva generada automáticamente por LiveSync para compensar problemas acústicos de salas indoor. Usa SOLO CUTS (nunca boosts) para atenuar modos de sala, controlar reverberación excesiva, compensar reflexiones y prevenir boom en salas pequeñas.',
        principles: [
            '✅ SOLO CUTS (preserva headroom)',
            '✅ Basada en física acústica inversa',
            '✅ Se aplica en la CONSOLA (master bus)',
            '✅ Afecta TODO el sistema por igual'
        ],
        relatedTerms: ['rt60', 'room modes', 'eq filter types'],
        icon: '🎚️'
    },

    'hpf': {
        category: 'Room EQ',
        short: 'High-Pass Filter (filtro pasa-altos)',
        full: 'Filtro pasa-altos. Atenúa graves debajo de frecuencia de corte. Ejemplo: HPF @ 50Hz, 18dB/oct para salas < 200m³.',
        relatedTerms: ['room eq correction', 'eq filter types'],
        icon: '📈'
    },

    'q factor': {
        category: 'Room EQ',
        short: 'Ancho del filtro EQ',
        full: 'Ancho del filtro. Valores más altos = más estrecho.',
        ranges: {
            'Q = 0.5-1.0': 'Ancho (shelf)',
            'Q = 1.0-2.0': 'Moderado (bell general)',
            'Q = 2.0-5.0': 'Estrecho (notch de modo)',
            'Q = 5.0-10': 'Muy estrecho (quirúrgico)'
        },
        relatedTerms: ['room eq correction', 'notch', 'bell'],
        icon: '🎛️'
    },

    // ========================================
    // SISTEMA PRINCIPAL (PA)
    // ========================================
    'lf coupling gain': {
        category: 'Sistema PA',
        short: 'Ganancia por acoplamiento de múltiples fuentes',
        full: 'Cuando múltiples fuentes reproducen la MISMA frecuencia, se suman en potencia. Solo aplica en baja frecuencia donde las cajas están acopladas acústicamente.',
        formula: 'Ganancia = 20 × log10(N)',
        examples: {
            '2 cajas': '+6 dB',
            '4 cajas': '+12 dB',
            '8 cajas': '+18 dB',
            '16 cajas': '+24 dB'
        },
        relatedTerms: ['pa box count', 'coupling', 'sumación'],
        icon: '🔊'
    },

    'power alley': {
        category: 'Sistema PA',
        short: 'Zona de sumación constructiva en sistema stereo',
        full: 'Zona de sumación constructiva en el eje central de un sistema stereo. SPL aumenta +6dB por sumación coherente. En 360°/Circular layouts, puede ser +12dB en el centro ("Power Flower").',
        impact: {
            'Stereo L+R': '+6dB en eje central',
            '360° Circular': '+12dB en centro ("Power Flower")'
        },
        relatedTerms: ['main pa setup', 'coherencia', 'sumación'],
        icon: '⚡'
    },

    'array length': {
        category: 'Sistema PA',
        short: 'Longitud física total del array',
        full: 'Longitud física total del array.',
        formula: 'Length = Box Count × Element Height',
        example: '12 cajas × 0.35m = 4.2m',
        determines: [
            'Directividad vertical en HF',
            'Near Field / Far Field transition',
            'WST criteria'
        ],
        relatedTerms: ['pa box count', 'element height', 'wst criteria'],
        icon: '📏'
    },

    // ========================================
    // SPLAY ANGLES Y WST
    // ========================================
    'splay angles': {
        category: 'Editor Visual de Splay',
        short: 'Ángulos entre cajas consecutivas en line array',
        full: 'Ángulos entre cajas consecutivas en un line array, separados por comas. Ejemplo: 2, 3, 4, 5, 6, 7, 8, 9',
        types: {
            'J-Curve': 'Progresión gradual creciente (típica en line arrays)',
            'Straight': 'Ángulos iguales',
            'Arc': 'Seguir curvatura de audiencia'
        },
        relatedTerms: ['array coupling analysis', 'wst criteria', 'broken line source'],
        icon: '📐'
    },

    'broken line source': {
        category: 'Editor Visual de Splay',
        short: 'Splay angle excede dispersión nominal',
        full: 'Ocurre cuando un splay angle EXCEDE la dispersión vertical nominal del modelo. Ejemplo: K2 tiene 10° de dispersión → Splay de 12° rompe el acoplamiento.',
        consequences: [
            'Pérdida de coherencia en HF',
            'Lóbulos de interferencia',
            'Cobertura desigual'
        ],
        relatedTerms: ['splay angles', 'wst criteria', 'coherencia'],
        icon: '⚠️'
    },

    'wst criteria': {
        category: 'Editor Visual de Splay',
        short: 'Wavefront Sculpture Technology',
        full: 'Wavefront Sculpture Technology. Para mantener line source en HF.',
        formula: 'd × sin(θ) < λ/2',
        params: {
            'd': 'Espaciado entre fuentes',
            'θ': 'Ángulo de splay',
            'λ': 'Longitud de onda'
        },
        verification: 'LiveSync verifica esto para 8kHz',
        relatedTerms: ['splay angles', 'broken line source', 'line array'],
        icon: '🌊'
    },

    // ========================================
    // SUBWOOFER ARRAY
    // ========================================
    'cardioid': {
        category: 'Subwoofer Array',
        short: 'CSA - Cardioid Subwoofer Array',
        full: 'Configuración 1-2-1: Por cada 2 subs frontales, 1 inverso (180° fase) detrás, espaciado λ/4. Rechaza ~15dB hacia atrás.',
        formula: 'Spacing = c / (4 × f)',
        example: 'Para 63Hz: λ/4 ≈ 1.36m',
        rejection: '~15dB hacia atrás',
        relatedTerms: ['sub array mode', 'end-fire', 'directividad'],
        icon: '❤️'
    },

    'end-fire': {
        category: 'Subwoofer Array',
        short: 'Subs en línea con delay progresivo',
        full: 'Subs en línea con delay progresivo. Crea directividad hacia el frente.',
        rejection: '~12dB trasero',
        relatedTerms: ['sub array mode', 'cardioid', 'delay'],
        icon: '🎯'
    },

    // ========================================
    // OBJETIVOS DE CALIBRACIÓN
    // ========================================
    'target spl': {
        category: 'Objetivos de Calibración',
        short: 'Nivel de presión sonora deseado (dB SPL)',
        full: 'Nivel de presión sonora deseado en la posición del oyente objetivo (dB SPL).',
        ranges: {
            '85-95 dB': 'Corporativo, speech',
            '95-102 dB': 'Teatro, musical',
            '102-108 dB': 'Concierto moderado',
            '108-115 dB': 'Rock/EDM',
            '> 115 dB': 'PELIGROSO - Daño auditivo'
        },
        types: {
            'LEQ': 'Promedio temporal',
            'Peak': 'Picos transitorios (crest factor +18dB típico)'
        },
        relatedTerms: ['headroom', 'crest factor', 'spl @ 1m'],
        icon: '🎯'
    },

    'foh distance': {
        category: 'Objetivos de Calibración',
        short: 'Distancia desde escenario hasta consola FOH',
        full: 'Distancia desde escenario hasta posición de Front-of-House (consola).',
        recommendations: {
            'Mínimo': 'PA Height × 1.2',
            'Óptimo clubs': '15-25m',
            'Óptimo arenas': '25-40m',
            'Máximo recomendado': '50m (más allá, HF loss crítico)'
        },
        issues: {
            'FOH MUY CERCA': 'Estás debajo del PA, no escuchas lo que escucha la audiencia',
            'FOH MUY LEJOS': 'Exceso de HF loss, SNR degradado'
        },
        relatedTerms: ['pa height', 'target distance', 'atmospheric loss'],
        icon: '🎛️'
    },

    // ========================================
    // LAYOUT DE ESCENARIO
    // ========================================
    'proscenium': {
        category: 'Layout de Escenario',
        short: 'Escenario tradicional (arco de proscenio)',
        full: 'Escenario tradicional (arco de proscenio). Audiencia EN FRENTE. Sistema típico: PA L+R, Subs central, Frontfill.',
        multiplier: '×1',
        relatedTerms: ['thrust', 'arena 360', 'layout multiplier'],
        icon: '🎭'
    },

    'thrust': {
        category: 'Layout de Escenario',
        short: 'Escenario que se "mete" en la audiencia',
        full: 'Escenario que se "mete" en la audiencia. Audiencia en FRENTE Y LATERALES (3 lados). Requiere outfills laterales, delay en lados, factor de layout 0.9.',
        multiplier: '×1 (pero requiere fills laterales)',
        requirements: ['Outfills laterales', 'Delay en lados', 'Factor de layout 0.9'],
        relatedTerms: ['proscenium', 'outfill', 'layout multiplier'],
        icon: '🏛️'
    },

    'arena 360': {
        category: 'Layout de Escenario',
        short: 'Escenario central, audiencia en TODAS direcciones',
        full: 'Escenario central, audiencia EN TODAS DIRECCIONES. Requiere PA en 4 zonas (N, S, E, W), subs cardioides (si no, boom central masivo), control de "Power Flower" (+12dB en centro).',
        multiplier: '×4',
        requirements: ['PA en 4 zonas (N, S, E, W)', 'Subs cardioides', 'Control de Power Flower (+12dB en centro)'],
        relatedTerms: ['circular', 'power flower', 'cardioid'],
        icon: '🔄'
    },

    // ========================================
    // AMPLIFICACIÓN
    // ========================================
    'amp topology': {
        category: 'Amplificación',
        short: 'Topología del amplificador',
        full: 'Tipo de tecnología del amplificador.',
        types: {
            'Legacy AB (Clase AB antigua)': {
                'Power Factor': '0.7',
                'Inrush': '×10 (peligroso)',
                'Eficiencia': '~60%',
                'Peso': 'Muy pesado',
                'Calor': 'Mucho'
            },
            'Modern D (Clase D moderna)': {
                'Power Factor': '0.90',
                'Inrush': '×4',
                'Eficiencia': '~85%',
                'Peso': 'Ligero',
                'Calor': 'Poco'
            },
            'Modern PFC (Clase D con Power Factor Correction)': {
                'Power Factor': '0.95',
                'Inrush': '×1.2 (EXCELENTE)',
                'Eficiencia': '~90%',
                'Peso': 'Ligero',
                'Calor': 'Mínimo'
            }
        },
        relatedTerms: ['power factor', 'inrush current', 'damping factor'],
        icon: '⚡'
    },

    'damping factor': {
        category: 'Amplificación',
        short: 'Relación de impedancia speaker / impedancia amp',
        full: 'Relación de impedancia speaker / impedancia amp. Valores altos (> 100) = mejor control de graves.',
        formula: 'DF = Z_speaker / (Z_amp_output + R_cable)',
        ranges: {
            'DF < 50': 'Graves "flojos", sin control',
            'DF > 100': 'Control óptimo'
        },
        relatedTerms: ['amp topology', 'cable gauge', 'impedancia'],
        icon: '🎚️'
    },

    // ========================================
    // ELECTRICIDAD
    // ========================================
    'power phase': {
        category: 'Electricidad',
        short: 'Fase eléctrica (monofásico/trifásico)',
        full: 'Tipo de sistema eléctrico.',
        types: {
            'Single (Monofásico)': '1 fase + neutral (120V o 230V)',
            'Three (Trifásico)': '3 fases + neutral (230V o 400V entre fases). MÁS EFICIENTE para sistemas grandes'
        },
        relatedTerms: ['power voltage', 'phase load distribution', 'neutral current'],
        icon: '⚡'
    },

    'voltage drop': {
        category: 'Electricidad',
        short: 'Pérdida de voltaje en cables',
        full: 'Pérdida de voltaje en cables speaker.',
        formula: 'V_drop% = (R_cable / (R_cable + Z_speaker)) × 100',
        impact: 'Si > 5%: Pérdida de potencia, graves débiles',
        relatedTerms: ['cable gauge', 'damping factor'],
        icon: '📉'
    },

    'breaker': {
        category: 'Electricidad',
        short: 'Interruptor termomagnético',
        full: 'Protección de circuito. LiveSync genera specs de Rating (16A, 32A, 63A, 100A, 125A), Curve (B resistivo, C inductivo, D motores), Type (1-pole, 2-pole, 3-pole).',
        sizing: 'Breaker = Continuous Current × 1.25',
        relatedTerms: ['power phase', 'inrush current'],
        icon: '🔌'
    },

    'cable gauge': {
        category: 'Electricidad',
        short: 'Calibre de cable (AWG o mm²)',
        full: 'AWG (American Wire Gauge) o mm². Determina resistencia.',
        gauges: {
            '12 AWG': '5.21 Ω/km',
            '10 AWG': '3.28 Ω/km',
            '8 AWG': '2.06 Ω/km (recomendado > 25m)',
            '6 AWG': '1.30 Ω/km',
            '4 AWG': '0.82 Ω/km (largo alcance)'
        },
        relatedTerms: ['voltage drop', 'damping factor'],
        icon: '🔌'
    },

    // ========================================
    // RED Y AUDIO DIGITAL
    // ========================================
    'dante': {
        category: 'Red y Audio Digital',
        short: 'Audinate, estándar de facto de audio en red',
        full: 'Protocolo de audio en red de Audinate, el estándar de facto.',
        overhead: '~1.15×',
        relatedTerms: ['avb', 'aes67', 'sample rate', 'bandwidth'],
        icon: '🌐'
    },

    'sample rate': {
        category: 'Red y Audio Digital',
        short: 'Frecuencia de muestreo',
        full: 'Frecuencia de muestreo de audio digital.',
        rates: {
            '48 kHz': 'Estándar (rango 20Hz-20kHz cubierto)',
            '96 kHz': 'Hi-Res (overhead ×2 en red)'
        },
        relatedTerms: ['bit depth', 'dante', 'bandwidth'],
        icon: '📊'
    },

    'bit depth': {
        category: 'Red y Audio Digital',
        short: 'Profundidad de bits',
        full: 'Profundidad de bits del audio digital.',
        depths: {
            '16 bit': '96 dB dynamic range',
            '24 bit': '144 dB dynamic range (estándar profesional)',
            '32 bit float': 'Headroom infinito (grabación)'
        },
        relatedTerms: ['sample rate', 'dynamic range'],
        icon: '🎚️'
    },

    // ========================================
    // RIGGING
    // ========================================
    'safety margin': {
        category: 'Rigging',
        short: 'Porcentaje de uso de capacidad',
        full: 'Porcentaje de uso de capacidad del rigging.',
        formula: 'Margin% = (Load / Capacity) × 100',
        ranges: {
            '< 75%': 'Safe (verde)',
            '75-90%': 'Warning (amarillo)',
            '> 90%': 'Critical (rojo) - NO VOLAR'
        },
        relatedTerms: ['load per point', 'rigging capacity'],
        icon: '⚠️'
    },

    'bridle configuration': {
        category: 'Rigging',
        short: 'Sistema de triángulo para distribuir peso',
        full: 'Sistema de triángulo para distribuir peso.',
        parameters: {
            'Beam Span': 'Distancia entre puntos estructurales',
            'Leg Length': 'Longitud de piernas del bridle',
            'Pickup Point': 'Altura donde se engancha el motor'
        },
        calculation: 'LiveSync calcula vectores de tensión en cada pierna',
        relatedTerms: ['motor', 'load per point'],
        icon: '🔺'
    },

    // ========================================
    // CROSSOVER Y FILTROS
    // ========================================
    'crossover frequency': {
        category: 'Crossover y Filtros',
        short: 'Frecuencia donde PA y Subs se dividen',
        full: 'Frecuencia donde Main PA y Subs se dividen.',
        typical: {
            '80-90 Hz': 'Estándar (la mayoría de sistemas)',
            '100 Hz': 'Subs grandes, salas pequeñas',
            '70 Hz': 'Throw largo, outdoor'
        },
        relatedTerms: ['crossover filter type', 'phase shift'],
        icon: '⚡'
    },

    'linkwitz-riley': {
        category: 'Crossover y Filtros',
        short: 'Tipo de filtro LR (sumación coherente)',
        full: 'Tipo de filtro crossover Linkwitz-Riley. Es MÁS COMÚN (sumación coherente).',
        types: {
            'LR24': '24 dB/oct, 360° phase shift, sumación plana',
            'LR48': '48 dB/oct, 720° phase shift'
        },
        relatedTerms: ['crossover frequency', 'butterworth', 'phase shift'],
        icon: '📊'
    },

    'butterworth': {
        category: 'Crossover y Filtros',
        short: 'Tipo de filtro BW',
        full: 'Tipo de filtro crossover Butterworth.',
        types: {
            'BW12': '12 dB/oct, 90° phase shift',
            'BW18': '18 dB/oct, 135° phase shift',
            'BW24': '24 dB/oct, 180° phase shift'
        },
        relatedTerms: ['crossover frequency', 'linkwitz-riley', 'phase shift'],
        icon: '📊'
    },

    // ========================================
    // DELAY TOWERS
    // ========================================
    'delay tower': {
        category: 'Delay Towers',
        short: 'Sistema auxiliar de refuerzo',
        full: 'Sistema de speakers auxiliar colocado MÁS CERCA de audiencia lejana para reforzar SPL y mantener coherencia temporal (delayed para alinearse con main PA).',
        purposes: ['Reforzar SPL', 'Mantener coherencia temporal'],
        relatedTerms: ['required delay', 'tower distance', 'slant distance'],
        icon: '🗼'
    },

    'required delay': {
        category: 'Delay Towers',
        short: 'Delay necesario para alinear delay tower con main PA',
        full: 'LiveSync calcula delay necesario para alinear temporalmente la delay tower con el main PA.',
        formula: 'Delay = (Slant_main - Slant_tower) / c × 1000',
        note: 'Slant = distancia 3D real (pitágoras con altura)',
        relatedTerms: ['delay tower', 'haas effect', 'velocidad del sonido'],
        icon: '⏱️'
    },

    // ========================================
    // ACOUSTIC ANALYSIS
    // ========================================
    'spl @ 1m': {
        category: 'Acoustic Analysis',
        short: 'SPL que genera un speaker a 1 metro',
        full: 'Nivel de presión sonora que genera UN speaker a 1 metro de distancia. Especificación del fabricante.',
        typical: {
            'Small format': '130-135 dB',
            'Mid format': '135-140 dB',
            'Large format': '140-145 dB',
            'Subs': '135-142 dB'
        },
        relatedTerms: ['distance loss', 'atmospheric loss', 'total spl'],
        icon: '🔊'
    },

    'distance loss': {
        category: 'Acoustic Analysis',
        short: 'Pérdida por distancia (ley inverso cuadrado)',
        full: 'Ley del inverso cuadrado para pérdida de SPL con distancia.',
        formula: 'Loss = 20 × log10(distance)',
        examples: {
            '1m': '0 dB',
            '10m': '-20 dB',
            '20m': '-26 dB',
            '100m': '-40 dB'
        },
        relatedTerms: ['spl @ 1m', 'atmospheric loss', 'total spl'],
        icon: '📉'
    },

    'atmospheric loss': {
        category: 'Acoustic Analysis',
        short: 'Absorción del aire (depende de frecuencia/humedad/temp)',
        full: 'Absorción del aire. Depende de frecuencia, humedad, temperatura, presión. MÁS CRÍTICO en alta frecuencia.',
        examples: {
            '@ 8kHz, 20°C, 50% HR, 100m': 'Loss ≈ -8 dB',
            '@ 1kHz': 'Loss ≈ -0.5 dB'
        },
        relatedTerms: ['humedad relativa', 'temperatura', 'distance loss'],
        icon: '🌫️'
    },

    'headroom': {
        category: 'Acoustic Analysis',
        short: 'Diferencia entre lo que el sistema PUEDE dar vs NECESITAS',
        full: 'Diferencia entre lo que el sistema PUEDE dar vs lo que NECESITAS.',
        formula: 'Headroom = SPL_max - SPL_required',
        ranges: {
            '< 0 dB': 'Sistema INSUFICIENTE',
            '0-6 dB': 'Justo (peligroso)',
            '6-12 dB': 'Aceptable',
            '> 12 dB': 'Óptimo (permite crest factor)'
        },
        relatedTerms: ['crest factor', 'target spl', 'spl @ 1m'],
        icon: '📊'
    },

    'crest factor': {
        category: 'Acoustic Analysis',
        short: 'Diferencia entre peak y RMS',
        full: 'Diferencia entre peak y RMS. Audio tiene típicamente 18 dB de crest factor. Por eso necesitas headroom.',
        typical: '18 dB',
        relatedTerms: ['headroom', 'target spl'],
        icon: '📊'
    },

    // ========================================
    // ACOUSTIC FINGERPRINTS
    // ========================================
    'line array transition distance': {
        category: 'Acoustic Fingerprints',
        short: 'Distancia de transición near field → far field',
        full: 'Distancia donde el array transiciona de near field (cilíndrico) a far field (esférico).',
        formula: 'Transition = L² × f / (2 × c)',
        params: {
            'L': 'Longitud física del array',
            'f': 'Frecuencia'
        },
        behavior: {
            'Antes': '-3dB por doubling',
            'Después': '-6dB por doubling'
        },
        relatedTerms: ['array length', 'near field', 'far field'],
        icon: '📏'
    },

    'refraction': {
        category: 'Acoustic Fingerprints',
        short: 'Curvatura del sonido por gradientes de temperatura',
        full: 'Curvatura del sonido por gradientes de temperatura. LiveSync calcula curvatura entre setup temp y showtime temp.',
        types: {
            'Gradient negativo (caliente arriba)': 'Sonido curva HACIA ARRIBA',
            'Gradient positivo (frío arriba)': 'Sonido curva HACIA ABAJO'
        },
        relatedTerms: ['temperatura showtime', 'velocidad del viento'],
        icon: '🌡️'
    },

    // ========================================
    // TÉRMINOS ADICIONALES CRÍTICOS
    // ========================================
    'coherence': {
        category: 'Términos Críticos',
        short: 'Medida de alineación en fase de múltiples fuentes',
        full: 'Medida de qué tan "alineadas en fase" están múltiples fuentes. Valores 0-1. Viento > 5.5 m/s DESTRUYE coherencia en HF.',
        scale: {
            '0.8-1.0': 'Excelente (suma coherente)',
            '0.5-0.8': 'Aceptable',
            '< 0.5': 'Pobre (cancelaciones, lobing)'
        },
        warning: 'Viento > 5.5 m/s DESTRUYE coherencia en HF',
        relatedTerms: ['velocidad del viento', 'sumación', 'fase'],
        icon: '🌊'
    },

    'haas effect': {
        category: 'Términos Críticos',
        short: 'Efecto psicoacústico de precedencia',
        full: 'Fenómeno psicoacústico: Si dos sonidos idénticos llegan con < 30ms de diferencia, el cerebro los "fusiona" y localiza hacia el que llegó PRIMERO (aunque el segundo sea más fuerte hasta +10dB). Por eso los delay towers se delayed - para que la imagen sonic siga en el main PA.',
        threshold: '< 30ms',
        application: 'Por eso los delay towers se delayed - para que la imagen sonic siga en el main PA',
        relatedTerms: ['delay tower', 'required delay', 'localización'],
        icon: '🧠'
    },

    'comb filtering': {
        category: 'Términos Críticos',
        short: 'Interferencia destructiva/constructiva (patrón de peine)',
        full: 'Interferencia destructiva/constructiva entre dos señales correlacionadas con diferencia de tiempo. Crea patrón de "peine" en respuesta de frecuencia (peaks y notches).',
        relatedTerms: ['ground effect', 'reflexión', 'fase'],
        icon: '🔊'
    },

    'direct field': {
        category: 'Términos Críticos',
        short: 'Zona donde sonido directo domina',
        full: 'Zona donde el sonido directo domina sobre reverberación. Antes de Dc (Critical Distance).',
        relatedTerms: ['critical distance', 'reverberant field', 'rt60'],
        icon: '🔊'
    },

    'reverberant field': {
        category: 'Términos Críticos',
        short: 'Zona donde reverberación domina',
        full: 'Zona donde la reverberación domina. Después de Dc. SPL casi constante con distancia.',
        relatedTerms: ['critical distance', 'direct field', 'rt60'],
        icon: '🔊'
    },

    'iso 3382': {
        category: 'Términos Críticos',
        short: 'Estándar internacional de acústica de salas',
        full: 'Estándar internacional para mediciones de acústica de salas. Define métodos para medir RT60, C50, D50, etc.',
        relatedTerms: ['rt60', 'field measured rt60'],
        icon: '📋'
    }
};

// Exportar el glosario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LIVESYNC_GLOSSARY };
}
