// ========================================
// BASE DE CONOCIMIENTOS OFICIAL - LiveSync Pro
// Extraído de HelpSystem.tsx
// ========================================

const KNOWLEDGE_BASE = {
    // ========================================
    // PARÁMETROS AMBIENTALES
    // ========================================
    environmental: {
        atmosphere: {
            basic: "El sonido viaja a través del aire. Si el aire cambia (temperatura o humedad), el sonido cambia.",
            advanced: "La velocidad del sonido depende de la temperatura: c ≈ 331.3 + 0.6T (m/s). La humedad afecta la absorción de alta frecuencia según ISO 9613-1. La altitud cambia la presión atmosférica.",
            proTip: "Mida siempre la temperatura en el FOH a la sombra. Un sensor al sol puede dar +5°C de error.",
            formula: "c = 331.3 + 0.6 * T (m/s)"
        },
        humidity: {
            basic: "La humedad afecta qué tan lejos viajan los sonidos agudos. Aire muy seco = el sonido muere rápido.",
            advanced: "El aire húmedo es menos denso que el aire seco (H2O es más ligero que N2/O2). Con humedad <30%, la atenuación a 10kHz puede superar 1dB por cada 30 metros.",
            proTip: "Si la humedad es baja (<40%), necesitarás usar filtros High Shelving agresivos."
        },
        wind: {
            basic: "El viento puede 'doblar' el sonido hacia arriba o hacia abajo. Si el viento viene hacia ti, el sonido podría pasar por encima.",
            advanced: "Los gradientes de viento crean refracción. El viento en contra refracta el sonido hacia arriba. El viento a favor refracta hacia el suelo. Los vectores de velocidad del viento afectan la coherencia.",
            proTip: "En festivales outdoor, el viento es el mayor enemigo de la coherencia de fase en frecuencias altas."
        },
        haasEffect: {
            basic: "Si el sonido de la torre de delay llega 'demasiado perfecto', el cerebro se confunde. Atrasamos la torre un poquito más (10-15ms).",
            advanced: "El efecto de precedencia localiza la fuente desde la primera onda (0-1ms). Los sonidos posteriores (30-40ms) se integran como volumen sin afectar la localización.",
            proTip: "Empieza con 10ms. Si se perciben ecos, reduce a 5-7ms. Para discursos, 5ms asegura máxima inteligibilidad."
        },
        thermalDrift: {
            basic: "El clima cambia de la tarde a la noche. Cuando hace frío, el sonido viaja más lento.",
            advanced: "Δt = d × (1/c₁ - 1/c₂). Una caída de 10°C reduce la velocidad del sonido ~6 m/s. En una torre a 100m, esto = ~1.7ms de drift causando filtrado en peine.",
            proTip: "Usa la calculadora para calcular el 'Nuevo Tiempo de Delay' antes del show principal sin disparar ruido con la audiencia presente.",
            formula: "Δt = d × (1/c₁ - 1/c₂)"
        }
    },

    // ========================================
    // CONFIGURACIÓN DEL SISTEMA
    // ========================================
    systemConfig: {
        mainPA: {
            basic: "Define qué tipo de sistema principal tienes. ¿Es un arreglo Line Array colgado? ¿Izquierda/Derecha o solo uno central?",
            advanced: "La longitud del line array determina la frecuencia de control vertical. Arrays más largos controlan frecuencias más bajas. El modelo de altavoz define el SPL máximo y la respuesta de fase nativa para la alineación."
        },
        splayAngles: {
            basic: "La curvatura de la banana. Si está muy recta (0°), dispara lejos como un láser. Si está muy curva, abre el sonido.",
            advanced: "Los ángulos determinan la cobertura vertical y la suma de componentes. Ángulos pequeños (0-1°) crean suma coherente para largo alcance. Ángulos grandes desacoplan las fuentes para corto alcance.",
            proTip: "Usa botones de preset rápidos si no tienes datos de predicción exactos."
        },
        targets: {
            basic: "Reglas de Oro: Posición FOH = 1.5x ancho del escenario. SPL: Corporativo (95dB), Concierto (100-102dB), Festival (105dB+).",
            advanced: "PA a FOH ideal 30-40m. <20m muestra demasiada altura. >50m pierde HF severamente. Primera torre de delay posicionada donde cae la inteligibilidad (~50-60m en sistemas grandes).",
            proTip: "Nunca ubiques el FOH a más de 50m sin monitores de campo cercano (Nearfields) de referencia.",
            rules: {
                fohPosition: "1.5x ancho del escenario",
                spl: {
                    corporativo: "95dB",
                    concierto: "100-102dB",
                    festival: "105dB+"
                },
                paToFoh: {
                    ideal: "30-40m",
                    min: "20m",
                    max: "50m"
                }
            }
        }
    },

    // ========================================
    // DELAY Y ALINEACIÓN
    // ========================================
    delayAlignment: {
        theory: {
            basic: "Las torres no son solo para 'sonar más fuerte'. Son para recuperar los agudos que el aire se comió y mantener el volumen constante.",
            advanced: "La línea de delay mantiene la relación señal/ruido por encima del ruido de la audiencia y extiende el campo directo. La torre toma el control cuando el PA principal cae al nivel de ruido ambiente."
        },
        gainShading: {
            basic: "No pongas la torre al 100% de volumen. Debe mezclarse suavemente con el sonido que viene del escenario.",
            advanced: "El nivel de la torre debe ser solo 2-3dB por encima del PA principal en el punto de escucha de la torre para una transición sin problemas. Nivel excesivo colapsa el efecto Haas.",
            recommendation: "2-3dB por encima del PA principal"
        }
    },

    // ========================================
    // ANÁLISIS Y RESULTADOS
    // ========================================
    analysis: {
        powerAlley: {
            basic: "Es una línea invisible en el centro del público donde los bajos suenan MUCHO más fuerte.",
            advanced: "El eje geométrico central entre L/R muestra coherencia de fase perfecta = +6dB de suma. El movimiento fuera del eje crea filtrado en peine, reduciendo el nivel de subwoofer.",
            proTip: "Considera 'Gradient Subwoofer Array' o arcos de delay para reducir este efecto.",
            boost: "+6dB en el centro"
        },
        arrayLimit: {
            basic: "Es la distancia hasta donde tu arreglo lineal funciona 'bien' como una línea.",
            advanced: "Marca la transición de campo cercano (Fresnel) a campo lejano (Fraunhofer). Dentro del límite: -3dB por duplicación de distancia. Más allá: -6dB.",
            formula: "D = (H² × f) / (2 × c)",
            attenuation: {
                nearField: "-3dB por duplicación",
                farField: "-6dB por duplicación"
            }
        },
        subAlignment: {
            basic: "Alinear los Subbajos con el PA Principal. Si no están alineados, el golpe del bombo pierde fuerza.",
            advanced: "Iguala el tiempo de llegada de la energía acústica del sub y el PA principal en la frecuencia de cruce. Un desalineamiento de media longitud de onda causa cancelación total. Sugiere inversión de fase si hay ~180° de desalineamiento."
        },
        groundBounce: {
            basic: "El suelo rebota el sonido. A veces ese rebote choca con el sonido directo y cancela ciertas frecuencias.",
            advanced: "La interferencia directa/reflejada desde el suelo crea filtro en peine. Primera nulidad: F = c / (2 × Δd). Superficies duras (concreto) reflejan más que superficies blandas (audiencia/césped).",
            formula: "F = c / (2 × Δd)"
        },
        thermalCompression: {
            basic: "Cuando los altavoces se calientan, suenan más despacio. Después de 2 horas, puedes perder hasta 3dB sin mover el fader.",
            advanced: "El calor aumenta la resistencia de la bobina móvil, reduciendo la eficiencia. El modelo exponencial simula esto basándose en la constante de tiempo térmica del driver. Calcula la corriente de arranque al inicio.",
            proTip: "No compenses la compresión térmica subiendo el volumen; genera más calor y riesgo de quemadura. Acepta la pérdida o agrega más cajas.",
            loss: "Hasta 3dB después de 2 horas"
        },
        roomModes: {
            basic: "Todas las salas cerradas tienen notas que 'retumban' más que otras. Estas son frecuencias donde la longitud de onda cabe exactamente en la sala.",
            advanced: "Calcula modos axiales, tangenciales y oblicuos a partir de dimensiones L/A/H. La frecuencia de cruce que coincide con un modo axial fuerte causa respuesta de graves desigual (picos/nulidades).",
            proTip: "Si el cruce coincide con un modo, desplaza ±5Hz para evitar la excitación de resonancia."
        },
        wst: {
            basic: "Wavefront Sculpture Technology hace que un Line Array funcione como una línea y no como muchas cajas sueltas.",
            advanced: "El acoplamiento coherente requiere espaciado <λ/2. Las violaciones crean lóbulos de rejilla (lóbulos verticales espurios). El análisis advierte de la frecuencia donde esto ocurre.",
            proTip: "Para lóbulos de rejilla debajo de 8kHz, cierra ángulos o agrega downfills dedicados en lugar de abrir el array principal.",
            spacing: "< λ/2 para coherencia"
        },
        olsonDirectivity: {
            basic: "Los Line Arrays son muy direccionales en vertical. Si tu mesa está muy arriba o abajo, escucharás menos agudos.",
            advanced: "Fórmula clásica de Olson para fuentes lineales finitas: R(α) = sin(x)/x. Calcula la penalización de atenuación fuera del eje. >6dB de pérdida HF significa FOH no representativo de la audiencia principal."
        }
    },

    // ========================================
    // SUBWOOFERS
    // ========================================
    subwoofers: {
        spl: {
            basic: "El volumen máximo que tus bajos pueden dar si los pones todos juntos.",
            advanced: "SPL_Max = SPL_Unidad + 20×log₁₀(N). Asume acoplamiento perfecto en semi-espacio (suelo). Excluye pérdidas de compresión de potencia térmica.",
            formula: "SPL_Max = SPL_Unidad + 20×log₁₀(N)"
        },
        arrayTopology: {
            basic: "La forma física en que colocas los bajos cambia cómo suenan.",
            advanced: "OMNI: Línea simple, máxima eficiencia frontal, ruido trasero. CARDIOID (CSA): 2 frontal/1 trasero invertido. Cancela trasero, pierde impacto frontal. END-FIRE: Fila única, máximo lanzamiento/rechazo, requiere profundidad.",
            proTip: "Usa Cardioid para sensibilidad a micrófonos (orquestas/pop). Usa End-Fire para impacto EDM/DJ a distancia.",
            types: {
                omni: {
                    description: "Línea simple",
                    efficiency: "Máxima frontal",
                    rearNoise: "Alto"
                },
                cardioid: {
                    description: "2 frontal / 1 trasero invertido",
                    rearRejection: "~15dB",
                    frontLoss: "Alguno"
                },
                endFire: {
                    description: "Fila única",
                    rearRejection: "12-20dB",
                    throw: "Máximo"
                }
            }
        },
        rearRejection: {
            basic: "Cuánto silencio logras en el escenario detrás de los subwoofers. Vital para que el baterista no sufra.",
            advanced: "Diferencia de SPL entre frontal/trasero. Arrays cardioides (CSA) logran ~15dB de rechazo mediante cancelación activa de fase. End-Fire: 12-20dB dependiendo de la longitud de la línea.",
            cardioid: "~15dB",
            endFire: "12-20dB"
        }
    },

    // ========================================
    // REDES Y CONTROL
    // ========================================
    networking: {
        dante: {
            basic: "¿Aguantará mi cable de red? Calcula si estás saturando la conexión digital de audio.",
            advanced: "Bandwidth = Fs × BitDepth × ChCount + overhead de protocolo (~20%). Advierte si >100Mbps (requiere switches Gigabit).",
            proTip: "Usa switches Gigabit administrados con QoS habilitado para priorizar paquetes de reloj PTP.",
            sampleRates: {
                "48kHz": "~1.15 Mbps/canal",
                "96kHz": "~2.3 Mbps/canal"
            },
            overhead: "20%",
            gigabitThreshold: "100 Mbps"
        },
        avb: {
            basic: "AVB es otro idioma digital. Ambos llevan audio por cable de red, pero Dante y AVB no se entienden entre sí.",
            advanced: "DANTE (Capa 3) usa IP estándar, flexible pero requiere configuración de switch. AVB/Milan (Capa 2) reserva ancho de banda por hardware, determinista pero necesita switches certificados.",
            proTip: "Nunca mezcles tráfico de audio con iluminación (ArtNet) o Wi-Fi público en la misma VLAN. Usa switches separados o VLANs estrictas.",
            overhead: "10%",
            layer: "Capa 2 (determinista)"
        },
        patch: {
            basic: "Lista automática que te dice qué caja conectar a qué amplificador. Organiza tu sistema por zonas.",
            advanced: "Distribuye la carga entre amplificadores estándar de 4 canales. Agrupa cajas en paralelo (máx 3/canal) optimizando impedancia (2.7Ω-4Ω) y DSP. Genera etiquetas lógicas.",
            proTip: "Copia a las notas del procesador Lake/Galaxy para referencia rápida durante fallas.",
            impedanceRange: "2.7Ω - 4Ω",
            maxPerChannel: 3
        }
    },

    // ========================================
    // POTENCIA ELÉCTRICA
    // ========================================
    power: {
        distribution: {
            basic: "Cálculo de consumo eléctrico. Te dice si necesitas un generador trifásico y cómo repartir los amplificadores.",
            advanced: "Usa Ley de Ohm (P=IV) y factor de potencia (PFC) para estimación de amperaje. Simula balance de carga trifásica. Calcula corriente de retorno neutral.",
            proTip: "Mantén el desbalance de fase por debajo del 20% para minimizar la corriente neutral y reducir el zumbido de inducción.",
            formula: "P = I × V",
            pfc: ">0.95 (amplificadores modernos)",
            maxImbalance: "20%"
        },
        infrastructure: {
            basic: "La calidad de la energía define la calidad del bajo. Cables delgados o voltajes bajos hacen que el sistema suene 'débil'.",
            advanced: "208V/240V es más eficiente que 120V (mitad de amperaje). Amplificadores modernos con PFC consumen corriente continuamente (PF>0.95). Cables largos añaden resistencia; si se acerca a la impedancia del altavoz (4Ω), cae el factor de amortiguamiento.",
            proTip: "Para subwoofers >30m, usa cable 8 AWG o 4 AWG. El 12 AWG estándar causa pérdida notable de SPL.",
            voltages: {
                efficient: "208V/240V",
                standard: "120V"
            },
            cableRecommendation: {
                standard: "12 AWG",
                subOver30m: "8 AWG o 4 AWG"
            }
        }
    },

    // ========================================
    // FOH Y MONITORES
    // ========================================
    foh: {
        driveSystem: {
            basic: "El cerebro del sistema. Define cómo llega la señal desde la mezcla hasta los amplificadores y qué seguridad tienes.",
            advanced: "DRIVE PROCESSOR: Matriz de gestión (Lake/Galaxy) para EQ/delay global. Actúa como buffer de seguridad entre consolas de invitados y PA. REDUNDANCIA: 'Main+Backup' duplica dos consolas. TRANSPORTE: Fibra estándar >100m, inmune a EMI. CAT6 limitado a 100m.",
            proTip: "Siempre usa consola 'Master' o Drive Rack para consolas de invitados. Nunca conectes consolas de invitados directamente a los amplificadores.",
            transport: {
                fiber: ">100m, inmune a EMI",
                cat6: "Limitado a 100m"
            }
        },
        processors: {
            list: [
                "Lake LM44, LM26",
                "XTA DP448, DP446",
                "BSS BLU-160, BLU-100",
                "Q-SYS Core 110f, Core 8 Flex",
                "Meyer Galaxy 816, 408",
                "L-Acoustics P1"
            ]
        }
    },

    monitors: {
        wedges: {
            basic: "Gestión de escuchas para los músicos. Wedges (pisos) para rock, IEMs para pop/corporativo, Sidefills para cobertura general.",
            advanced: "Define número de mezclas y tipos de transductores. Los Sidefills típicamente requieren delays de alineación con el PA principal para prevenir ecos en el escenario. El consumo de potencia incluye estos sistemas.",
            models: [
                "L-Acoustics X15 HiQ, X12",
                "d&b M2, M4, MAX2",
                "Meyer MJF-212A, MJF-210",
                "JBL VTX M22, VTX M20, SRX812P",
                "RCF TT 25-CXA, NX 12-SMA"
            ]
        },
        sidefills: {
            description: "Line arrays como sidefill",
            requirement: "Delays de alineación con PA principal"
        },
        iems: {
            description: "In-Ear Monitors",
            features: ["Configuración de RF", "Gestión de canales"]
        }
    },

    // ========================================
    // FÓRMULAS TÉCNICAS CLAVE
    // ========================================
    formulas: {
        soundVelocity: {
            formula: "c ≈ 331.3 + 0.6 × T (m/s)",
            description: "Velocidad del sonido en función de la temperatura"
        },
        delayDrift: {
            formula: "Δt = d × (1/c₁ - 1/c₂)",
            description: "Deriva del delay por cambio de temperatura"
        },
        arrayLimit: {
            formula: "D = (H² × f) / (2 × c)",
            description: "Límite de transición Fresnel a Fraunhofer"
        },
        combFilterNull: {
            formula: "F = c / (2 × Δd)",
            description: "Frecuencia de primera nulidad del filtro en peine"
        },
        splSum: {
            formula: "SPL_Max = SPL_Unidad + 20 × log₁₀(N)",
            description: "SPL máximo de array coherente"
        },
        power: {
            formula: "P = I × V",
            description: "Potencia eléctrica (con consideraciones de PFC)"
        },
        danteBandwidth: {
            formula: "BW = Fs × BitDepth × ChCount × 1.2",
            description: "Ancho de banda Dante con 20% overhead"
        }
    }
};

// Exportar base de conocimientos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KNOWLEDGE_BASE;
}
