// Base de datos de modelos de speakers (extraída de constants.ts)
const SPEAKER_DATABASE = {
    // L-Acoustics
    "k1": { brand: "L-Acoustics", name: "K1", spl: 149, weight: 106, impedance: 8, dispersion: 5, category: "Line Array Large" },
    "k2": { brand: "L-Acoustics", name: "K2", spl: 147, weight: 56, impedance: 8, dispersion: 10, category: "Line Array Large" },
    "k3": { brand: "L-Acoustics", name: "K3", spl: 143, weight: 43, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "kara": { brand: "L-Acoustics", name: "Kara II", spl: 142, weight: 26, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "kiva": { brand: "L-Acoustics", name: "Kiva II", spl: 138, weight: 14, impedance: 16, dispersion: 15, category: "Line Array Medium" },
    "ks28": { brand: "L-Acoustics", name: "KS28", spl: 145, weight: 79, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "sb28": { brand: "L-Acoustics", name: "SB28", spl: 142, weight: 93, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "x15": { brand: "L-Acoustics", name: "X15 HiQ", spl: 138, weight: 21, impedance: 8, dispersion: 40, category: "Monitor" },
    "x12": { brand: "L-Acoustics", name: "X12", spl: 136, weight: 20, impedance: 8, dispersion: 60, category: "Monitor" },

    // Meyer Sound
    "panther": { brand: "Meyer Sound", name: "Panther", spl: 150, weight: 68, impedance: 8, dispersion: 7, category: "Line Array Large" },
    "leo": { brand: "Meyer Sound", name: "LEO-M", spl: 146, weight: 120, impedance: 8, dispersion: 5, category: "Line Array Large" },
    "lyon": { brand: "Meyer Sound", name: "Lyon-M", spl: 144, weight: 90, impedance: 8, dispersion: 9, category: "Line Array Large" },
    "leopard": { brand: "Meyer Sound", name: "Leopard", spl: 139, weight: 34, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "lina": { brand: "Meyer Sound", name: "LINA", spl: 138, weight: 19, impedance: 8, dispersion: 15, category: "Line Array Medium" },
    "1100-lfc": { brand: "Meyer Sound", name: "1100-LFC", spl: 140, weight: 113, impedance: 4, dispersion: 0, category: "Subwoofer" },

    // d&b audiotechnik
    "gsl8": { brand: "d&b audiotechnik", name: "GSL8", spl: 150, weight: 80, impedance: 8, dispersion: 7, category: "Line Array Large" },
    "ksl8": { brand: "d&b audiotechnik", name: "KSL8", spl: 145, weight: 58, impedance: 8, dispersion: 7, category: "Line Array Large" },
    "j8": { brand: "d&b audiotechnik", name: "J8", spl: 145, weight: 60, impedance: 8, dispersion: 7, category: "Line Array Large" },
    "v8": { brand: "d&b audiotechnik", name: "V8", spl: 142, weight: 34, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "y8": { brand: "d&b audiotechnik", name: "Y8", spl: 139, weight: 20, impedance: 8, dispersion: 14, category: "Line Array Medium" },
    "sl-sub": { brand: "d&b audiotechnik", name: "SL-SUB", spl: 144, weight: 138, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "j-sub": { brand: "d&b audiotechnik", name: "J-SUB", spl: 139, weight: 64, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "m2": { brand: "d&b audiotechnik", name: "M2", spl: 143, weight: 38, impedance: 8, dispersion: 45, category: "Monitor" },
    "m4": { brand: "d&b audiotechnik", name: "M4", spl: 138, weight: 20, impedance: 8, dispersion: 50, category: "Monitor" },

    // JBL Professional
    "vtx-a12": { brand: "JBL Professional", name: "VTX A12", spl: 146, weight: 61, impedance: 8, dispersion: 10, category: "Line Array Large" },
    "vtx-v25": { brand: "JBL Professional", name: "VTX V25", spl: 147, weight: 88, impedance: 8, dispersion: 10, category: "Line Array Large" },
    "vtx-a8": { brand: "JBL Professional", name: "VTX A8", spl: 139, weight: 29, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "vtx-b28": { brand: "JBL Professional", name: "VTX B28", spl: 141, weight: 87, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "vtx-g28": { brand: "JBL Professional", name: "VTX G28", spl: 142, weight: 93, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "vtx-m22": { brand: "JBL Professional", name: "VTX M22", spl: 138, weight: 27, impedance: 8, dispersion: 60, category: "Monitor" },

    // Adamson
    "e15": { brand: "Adamson", name: "E15", spl: 147, weight: 80, impedance: 8, dispersion: 6, category: "Line Array Large" },
    "e12": { brand: "Adamson", name: "E12", spl: 145, weight: 60, impedance: 8, dispersion: 8, category: "Line Array Large" },
    "s10": { brand: "Adamson", name: "S10", spl: 141, weight: 27, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "cs10": { brand: "Adamson", name: "CS10", spl: 141, weight: 31, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "e219": { brand: "Adamson", name: "E219", spl: 144, weight: 106, impedance: 4, dispersion: 0, category: "Subwoofer" },

    // RCF
    "hdl-50": { brand: "RCF", name: "HDL 50-A 4K", spl: 143, weight: 58, impedance: 8, dispersion: 10, category: "Line Array Large" },
    "hdl-30": { brand: "RCF", name: "HDL 30-A", spl: 137, weight: 25, impedance: 8, dispersion: 15, category: "Line Array Medium" },
    "hdl-20": { brand: "RCF", name: "HDL 20-A", spl: 135, weight: 30, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "sub-9006": { brand: "RCF", name: "SUB 9006-AS", spl: 142, weight: 86, impedance: 8, dispersion: 0, category: "Subwoofer" }
};

// Función de búsqueda de modelos
function findSpeakerModel(query) {
    const normalized = query.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // Búsqueda exacta
    if (SPEAKER_DATABASE[normalized]) {
        return SPEAKER_DATABASE[normalized];
    }

    // Búsqueda parcial
    for (const [key, model] of Object.entries(SPEAKER_DATABASE)) {
        if (key.includes(normalized) || normalized.includes(key)) {
            return model;
        }
        if (model.name.toLowerCase().includes(query.toLowerCase())) {
            return model;
        }
    }

    return null;
}

// Calculadora de bandwidth Dante
function calculateDanteBandwidth(channels, sampleRate = 48) {
    const mbpsPerChannel = sampleRate === 96 ? 2.3 : 1.15;
    const overhead = 1.2; // 20%
    const totalMbps = channels * mbpsPerChannel * overhead;

    return {
        channels: channels,
        sampleRate: sampleRate,
        mbpsPerChannel: mbpsPerChannel,
        overhead: 20,
        totalMbps: Math.round(totalMbps * 100) / 100,
        recommendation: totalMbps < 100 ? "Switch Gigabit (1000 Mbps) suficiente" : "Necesitas múltiples switches o 10Gb"
    };
}

// Calculadora de delay por temperatura
function calculateDelayByTemp(distanceMeters, tempCelsius) {
    const speedOfSound = 331.3 + (0.606 * tempCelsius);
    const delayMs = (distanceMeters / speedOfSound) * 1000;

    return {
        distance: distanceMeters,
        temperature: tempCelsius,
        speedOfSound: Math.round(speedOfSound * 10) / 10,
        delayMs: Math.round(delayMs * 10) / 10
    };
}
